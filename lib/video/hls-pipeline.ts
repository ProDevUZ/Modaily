import { randomUUID } from "crypto";
import { createWriteStream } from "fs";
import { mkdir, readdir, readFile, rm, stat } from "fs/promises";
import os from "os";
import path from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { spawn } from "child_process";

import { assertSafeStorageKey } from "@/lib/storage/keys";
import { createR2Storage } from "@/lib/storage/r2";
import type { HlsGenerationInput, HlsGenerationResult, HlsInputMetadata, HlsUploadedAsset } from "@/lib/video/hls-types";

type CommandResult = {
  stdout: string;
  stderr: string;
};

type FfprobeStream = {
  codec_type?: string;
  codec_name?: string;
  width?: number;
  height?: number;
  bit_rate?: string;
};

type FfprobeOutput = {
  streams?: FfprobeStream[];
  format?: {
    duration?: string;
    bit_rate?: string;
  };
};

const defaultMaxInputBytes = 500 * 1024 * 1024;
const commandTimeoutMs = 20 * 60 * 1000;

function getFfmpegPath() {
  return process.env.FFMPEG_PATH?.trim() || "ffmpeg";
}

function getFfprobePath() {
  return process.env.FFPROBE_PATH?.trim() || "ffprobe";
}

function getHlsWorkRoot() {
  return process.env.HLS_WORK_DIR?.trim() || path.join(os.tmpdir(), "modaily-hls");
}

function getMaxInputBytes() {
  const value = Number(process.env.HLS_MAX_INPUT_BYTES);
  return Number.isFinite(value) && value > 0 ? value : defaultMaxInputBytes;
}

function sanitizeVideoId(videoId?: string) {
  const raw = videoId?.trim() || randomUUID();
  const safe = raw.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80);

  if (!safe) {
    throw new Error("Invalid videoId.");
  }

  return safe;
}

function assertAllowedInputUrl(videoUrl: string) {
  const url = new URL(videoUrl);

  if (url.protocol !== "https:") {
    throw new Error("Only HTTPS MP4 input URLs are allowed for experimental HLS generation.");
  }

  if (!url.pathname.toLowerCase().endsWith(".mp4")) {
    throw new Error("Experimental HLS generation currently accepts MP4 input URLs only.");
  }

  return url;
}

function formatCommand(command: string, args: string[]) {
  return [command, ...args];
}

async function runCommand(command: string, args: string[], logPrefix: string): Promise<CommandResult> {
  console.info(`${logPrefix} running`, { command: formatCommand(command, args) });

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      windowsHide: true
    });
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`${command} timed out after ${commandTimeoutMs}ms.`));
    }, commandTimeoutMs);

    child.stdout.on("data", (chunk) => stdout.push(Buffer.from(chunk)));
    child.stderr.on("data", (chunk) => stderr.push(Buffer.from(chunk)));
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      const result = {
        stdout: Buffer.concat(stdout).toString("utf8"),
        stderr: Buffer.concat(stderr).toString("utf8")
      };

      if (code === 0) {
        console.info(`${logPrefix} completed`, { command, code });
        resolve(result);
        return;
      }

      reject(new Error(`${command} failed with exit code ${code}: ${result.stderr.slice(-2000)}`));
    });
  });
}

export async function verifyFfmpegAvailability(logPrefix = "[hls]") {
  const ffmpeg = await runCommand(getFfmpegPath(), ["-version"], logPrefix);
  const ffprobe = await runCommand(getFfprobePath(), ["-version"], logPrefix);

  return {
    ffmpeg: ffmpeg.stdout.split("\n")[0] || "ffmpeg available",
    ffprobe: ffprobe.stdout.split("\n")[0] || "ffprobe available"
  };
}

async function downloadInputVideo(videoUrl: URL, destinationPath: string, logPrefix: string) {
  const maxInputBytes = getMaxInputBytes();

  console.info(`${logPrefix} downloading input`, {
    host: videoUrl.hostname,
    pathname: videoUrl.pathname,
    maxInputBytes
  });

  const response = await fetch(videoUrl);

  if (!response.ok || !response.body) {
    throw new Error(`Input video download failed with HTTP ${response.status}.`);
  }

  const contentLength = Number(response.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > maxInputBytes) {
    throw new Error(`Input video is larger than allowed ${maxInputBytes} bytes.`);
  }

  let downloaded = 0;

  async function* guardedChunks() {
    const reader = response.body!.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          return;
        }

        downloaded += value.byteLength;

        if (downloaded > maxInputBytes) {
          throw new Error(`Input video exceeded ${maxInputBytes} bytes while downloading.`);
        }

        yield Buffer.from(value);
      }
    } finally {
      reader.releaseLock();
    }
  }

  await pipeline(Readable.from(guardedChunks()), createWriteStream(destinationPath));
  console.info(`${logPrefix} input downloaded`, { bytes: downloaded });
}

function parseNullableNumber(value?: string | number) {
  if (value === undefined || value === null) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function readMetadata(inputPath: string, logPrefix: string) {
  const command = getFfprobePath();
  const args = ["-v", "error", "-print_format", "json", "-show_format", "-show_streams", inputPath];
  const result = await runCommand(command, args, logPrefix);
  const parsed = JSON.parse(result.stdout) as FfprobeOutput;
  const videoStream = parsed.streams?.find((stream) => stream.codec_type === "video");
  const audioStream = parsed.streams?.find((stream) => stream.codec_type === "audio");
  const metadata: HlsInputMetadata = {
    durationSeconds: parseNullableNumber(parsed.format?.duration),
    width: videoStream?.width ?? null,
    height: videoStream?.height ?? null,
    bitrate: parseNullableNumber(videoStream?.bit_rate) ?? parseNullableNumber(parsed.format?.bit_rate),
    videoCodec: videoStream?.codec_name ?? null,
    audioCodec: audioStream?.codec_name ?? null,
    hasAudio: Boolean(audioStream)
  };

  if (!metadata.width || !metadata.height) {
    throw new Error("Input video metadata does not include a readable video stream.");
  }

  return {
    metadata,
    command: formatCommand(command, args)
  };
}

function buildHlsArgs(inputPath: string, outputDir: string, hasAudio: boolean) {
  const segmentPattern = path.join(outputDir, "%v", "segment_%05d.ts");
  const playlistPattern = path.join(outputDir, "%v", "index.m3u8");
  const args = [
    "-y",
    "-i",
    inputPath,
    "-filter_complex",
    "[0:v]split=3[v360][v720][v1080];[v360]scale=w=640:h=360:force_original_aspect_ratio=decrease:force_divisible_by=2[v360out];[v720]scale=w=1280:h=720:force_original_aspect_ratio=decrease:force_divisible_by=2[v720out];[v1080]scale=w=1920:h=1080:force_original_aspect_ratio=decrease:force_divisible_by=2[v1080out]",
    "-map",
    "[v360out]"
  ];

  if (hasAudio) {
    args.push("-map", "0:a:0");
  }

  args.push(
    "-map",
    "[v720out]"
  );

  if (hasAudio) {
    args.push("-map", "0:a:0");
  }

  args.push(
    "-map",
    "[v1080out]"
  );

  if (hasAudio) {
    args.push("-map", "0:a:0");
  }

  args.push(
    "-c:v:0",
    "libx264",
    "-preset:v:0",
    "veryfast",
    "-profile:v:0",
    "main",
    "-crf:v:0",
    "24",
    "-maxrate:v:0",
    "800k",
    "-bufsize:v:0",
    "1600k",
    "-c:v:1",
    "libx264",
    "-preset:v:1",
    "veryfast",
    "-profile:v:1",
    "main",
    "-crf:v:1",
    "23",
    "-maxrate:v:1",
    "2200k",
    "-bufsize:v:1",
    "4400k",
    "-c:v:2",
    "libx264",
    "-preset:v:2",
    "veryfast",
    "-profile:v:2",
    "main",
    "-crf:v:2",
    "22",
    "-maxrate:v:2",
    "4500k",
    "-bufsize:v:2",
    "9000k",
    "-g",
    "96",
    "-keyint_min",
    "96",
    "-sc_threshold",
    "0",
    "-pix_fmt",
    "yuv420p"
  );

  if (hasAudio) {
    args.push("-c:a", "aac", "-ac", "2", "-b:a:0", "96k", "-b:a:1", "128k", "-b:a:2", "160k");
  }

  args.push(
    "-f",
    "hls",
    "-hls_time",
    "4",
    "-hls_playlist_type",
    "vod",
    "-hls_flags",
    "independent_segments",
    "-hls_segment_filename",
    segmentPattern,
    "-master_pl_name",
    "master.m3u8",
    "-var_stream_map",
    hasAudio ? "v:0,a:0,name:360p v:1,a:1,name:720p v:2,a:2,name:1080p" : "v:0,name:360p v:1,name:720p v:2,name:1080p",
    playlistPattern
  );

  return args;
}

async function generateHls(inputPath: string, outputDir: string, hasAudio: boolean, logPrefix: string) {
  await mkdir(path.join(outputDir, "360p"), { recursive: true });
  await mkdir(path.join(outputDir, "720p"), { recursive: true });
  await mkdir(path.join(outputDir, "1080p"), { recursive: true });

  const command = getFfmpegPath();
  const args = buildHlsArgs(inputPath, outputDir, hasAudio);
  await runCommand(command, args, logPrefix);

  return formatCommand(command, args);
}

async function generatePoster(inputPath: string, posterPath: string, logPrefix: string) {
  const command = getFfmpegPath();
  const args = ["-y", "-ss", "00:00:01", "-i", inputPath, "-frames:v", "1", "-vf", "scale=1280:-2", "-q:v", "3", posterPath];

  try {
    await runCommand(command, args, logPrefix);
    return;
  } catch (error) {
    console.warn(`${logPrefix} poster at 1s failed, retrying first frame`, error instanceof Error ? error.message : error);
  }

  await runCommand(command, ["-y", "-i", inputPath, "-frames:v", "1", "-vf", "scale=1280:-2", "-q:v", "3", posterPath], logPrefix);
}

function contentTypeForAsset(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();

  switch (extension) {
    case ".m3u8":
      return "application/vnd.apple.mpegurl";
    case ".ts":
      return "video/mp2t";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    default:
      return "application/octet-stream";
  }
}

async function listFiles(rootDir: string) {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function toR2HlsKey(videoId: string, outputDir: string, filePath: string) {
  const relativePath = path.relative(outputDir, filePath).replace(/\\/g, "/");
  return assertSafeStorageKey(`hls/${videoId}/${relativePath}`);
}

async function uploadHlsAssets(videoId: string, outputDir: string, logPrefix: string) {
  const storage = createR2Storage();
  const files = await listFiles(outputDir);
  const assets: HlsUploadedAsset[] = [];

  for (const filePath of files) {
    const contentType = contentTypeForAsset(filePath);
    const key = toR2HlsKey(videoId, outputDir, filePath);
    const fileStat = await stat(filePath);
    const uploaded = await storage.uploadObject({
      key,
      body: await readFile(filePath),
      contentType,
      cacheControl: "public, max-age=31536000, immutable",
      metadata: {
        source: "modaily-experimental-hls",
        videoId
      }
    });

    assets.push({
      key,
      url: uploaded.url,
      contentType,
      sizeBytes: fileStat.size
    });
  }

  console.info(`${logPrefix} uploaded HLS assets`, { count: assets.length });
  return assets;
}

export async function generateExperimentalHls(input: HlsGenerationInput): Promise<HlsGenerationResult> {
  const startedAt = Date.now();
  const videoUrl = assertAllowedInputUrl(input.videoUrl);
  const videoId = sanitizeVideoId(input.videoId);
  const localWorkDir = path.join(getHlsWorkRoot(), videoId);
  const inputPath = path.join(localWorkDir, "input.mp4");
  const outputDir = path.join(localWorkDir, "hls");
  const posterPath = path.join(outputDir, "poster.jpg");
  const logPrefix = `[hls:${videoId}]`;

  console.info(`${logPrefix} started experimental HLS generation`);

  try {
    await mkdir(outputDir, { recursive: true });
    await verifyFfmpegAvailability(logPrefix);
    await downloadInputVideo(videoUrl, inputPath, logPrefix);

    const metadataResult = await readMetadata(inputPath, logPrefix);
    const ffmpegCommand = await generateHls(inputPath, outputDir, metadataResult.metadata.hasAudio, logPrefix);

    await generatePoster(inputPath, posterPath, logPrefix);

    const assets = await uploadHlsAssets(videoId, outputDir, logPrefix);
    const master = assets.find((asset) => asset.key === `hls/${videoId}/master.m3u8`);
    const poster = assets.find((asset) => asset.key === `hls/${videoId}/poster.jpg`);

    if (!master) {
      throw new Error("HLS generation completed but master.m3u8 was not found.");
    }

    if (!poster) {
      throw new Error("Poster generation completed but poster.jpg was not found.");
    }

    console.info(`${logPrefix} completed experimental HLS generation`, {
      durationMs: Date.now() - startedAt,
      assetCount: assets.length
    });

    return {
      videoId,
      masterPlaylistKey: master.key,
      masterPlaylistUrl: master.url,
      posterKey: poster.key,
      posterUrl: poster.url,
      metadata: metadataResult.metadata,
      assets,
      localWorkDir,
      ffmpegCommand,
      ffprobeCommand: metadataResult.command
    };
  } catch (error) {
    console.error(`${logPrefix} failed experimental HLS generation`, error);
    throw error;
  } finally {
    await rm(localWorkDir, { recursive: true, force: true });
    console.info(`${logPrefix} cleaned local temp files`, { localWorkDir });
  }
}
