import { config } from "dotenv";
import { createHash } from "crypto";

import { prisma } from "../lib/prisma";

config({ path: ".env", quiet: true });
config({ path: ".env.local", override: true, quiet: true });

type VideoSource = {
  source: "product" | "gallery" | "blog";
  recordId: string;
  videoUrl: string;
};

function hashOriginalUrl(videoUrl: string) {
  return createHash("sha256").update(videoUrl).digest("hex");
}

function getPublicSiteBaseUrl() {
  return (
    process.env.HLS_REPROCESS_PUBLIC_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    "https://modaily.uk"
  ).replace(/\/+$/, "");
}

function normalizeVideoUrl(videoUrl: string) {
  const trimmed = videoUrl.trim();

  if (trimmed.startsWith("/")) {
    return new URL(trimmed, getPublicSiteBaseUrl()).toString();
  }

  return new URL(trimmed).toString();
}

function parseAssets(value: string | null) {
  if (!value) {
    return [];
  }

  try {
    return JSON.parse(value) as Array<{ key?: string }>;
  } catch {
    return [];
  }
}

async function collectVideoSources(): Promise<VideoSource[]> {
  const [productVideos, galleryVideos, blogVideos] = await Promise.all([
    prisma.productGalleryImage.findMany({
      where: { type: "VIDEO", videoUrl: { not: null } },
      select: { id: true, videoUrl: true }
    }),
    prisma.galleryItem.findMany({
      where: { type: "VIDEO", videoUrl: { not: null } },
      select: { id: true, videoUrl: true }
    }),
    prisma.blogPostMedia.findMany({
      where: { type: "VIDEO", videoUrl: { not: null } },
      select: { id: true, videoUrl: true }
    })
  ]);

  return [
    ...productVideos.map((item) => ({ source: "product" as const, recordId: item.id, videoUrl: item.videoUrl || "" })),
    ...galleryVideos.map((item) => ({ source: "gallery" as const, recordId: item.id, videoUrl: item.videoUrl || "" })),
    ...blogVideos.map((item) => ({ source: "blog" as const, recordId: item.id, videoUrl: item.videoUrl || "" }))
  ].filter((item) => item.videoUrl);
}

async function main() {
  const sources = await collectVideoSources();
  const uniqueUrls = [...new Set(sources.map((source) => normalizeVideoUrl(source.videoUrl)))];
  const failures: Array<Record<string, unknown>> = [];
  let checkedMasterPlaylists = 0;

  for (const videoUrl of uniqueUrls) {
    const job = await prisma.experimentalHlsJob.findUnique({
      where: {
        originalUrlHash: hashOriginalUrl(videoUrl)
      }
    });

    if (!job) {
      failures.push({ videoUrl, reason: "missing_hls_job" });
      continue;
    }

    const assets = parseAssets(job.assetsJson);
    const has360pAsset = assets.some((asset) => asset.key?.includes("/360p/"));
    const has720pAsset = assets.some((asset) => asset.key?.includes("/720p/"));
    const has1080pAsset = assets.some((asset) => asset.key?.includes("/1080p/"));

    if (job.status !== "ready" || !job.masterPlaylistUrl || !has360pAsset || !has720pAsset || !has1080pAsset) {
      failures.push({
        videoUrl,
        videoId: job.videoId,
        status: job.status,
        hasMasterUrl: Boolean(job.masterPlaylistUrl),
        has360pAsset,
        has720pAsset,
        has1080pAsset
      });
      continue;
    }

    const response = await fetch(job.masterPlaylistUrl, { cache: "no-store" });
    const body = response.ok ? await response.text() : "";
    checkedMasterPlaylists += 1;

    if (!response.ok || !body.includes("360p/index.m3u8") || !body.includes("720p/index.m3u8") || !body.includes("1080p/index.m3u8")) {
      failures.push({
        videoUrl,
        videoId: job.videoId,
        masterStatus: response.status,
        masterHas360p: body.includes("360p/index.m3u8"),
        masterHas720p: body.includes("720p/index.m3u8"),
        masterHas1080p: body.includes("1080p/index.m3u8")
      });
    }
  }

  console.info(
    JSON.stringify(
      {
        sourceRecords: sources.length,
        uniqueUrls: uniqueUrls.length,
        checkedMasterPlaylists,
        failures
      },
      null,
      2
    )
  );

  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error("[hls-verify] failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
