import { config } from "dotenv";
import { createHash } from "crypto";

import { prisma } from "../lib/prisma";
import { enqueueHlsJob } from "../lib/video/hls-jobs";

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

function isSupportedVideoUrl(videoUrl: string) {
  try {
    const url = normalizeVideoUrl(videoUrl);
    return url.protocol === "https:" && url.pathname.toLowerCase().endsWith(".mp4");
  } catch {
    return false;
  }
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
    return new URL(trimmed, getPublicSiteBaseUrl());
  }

  return new URL(trimmed);
}

function stableVideoId(videoUrl: string) {
  return `existing-${hashOriginalUrl(videoUrl).slice(0, 24)}`;
}

async function collectVideoSources(): Promise<VideoSource[]> {
  const [productVideos, galleryVideos, blogVideos] = await Promise.all([
    prisma.productGalleryImage.findMany({
      where: {
        type: "VIDEO",
        videoUrl: {
          not: null
        }
      },
      select: {
        id: true,
        videoUrl: true
      }
    }),
    prisma.galleryItem.findMany({
      where: {
        type: "VIDEO",
        videoUrl: {
          not: null
        }
      },
      select: {
        id: true,
        videoUrl: true
      }
    }),
    prisma.blogPostMedia.findMany({
      where: {
        type: "VIDEO",
        videoUrl: {
          not: null
        }
      },
      select: {
        id: true,
        videoUrl: true
      }
    })
  ]);

  return [
    ...productVideos.map((item) => ({ source: "product" as const, recordId: item.id, videoUrl: item.videoUrl || "" })),
    ...galleryVideos.map((item) => ({ source: "gallery" as const, recordId: item.id, videoUrl: item.videoUrl || "" })),
    ...blogVideos.map((item) => ({ source: "blog" as const, recordId: item.id, videoUrl: item.videoUrl || "" }))
  ].filter((item) => item.videoUrl);
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const sources = await collectVideoSources();
  const unique = new Map<string, VideoSource[]>();
  const unsupported: VideoSource[] = [];

  for (const source of sources) {
    if (!isSupportedVideoUrl(source.videoUrl)) {
      unsupported.push(source);
      continue;
    }

    const list = unique.get(source.videoUrl) || [];
    list.push(source);
    unique.set(source.videoUrl, list);
  }

  console.info("[hls-reprocess] collected", {
    totalRecords: sources.length,
    uniqueSupportedUrls: unique.size,
    unsupported: unsupported.length,
    dryRun
  });

  if (unsupported.length > 0) {
    console.warn(
      "[hls-reprocess] unsupported URLs skipped",
      unsupported.map((item) => ({
        source: item.source,
        recordId: item.recordId,
        videoUrl: item.videoUrl
      }))
    );
  }

  if (dryRun) {
    return;
  }

  let queued = 0;

  for (const [videoUrl, records] of unique) {
    const normalizedVideoUrl = normalizeVideoUrl(videoUrl).toString();
    const originalUrlHash = hashOriginalUrl(normalizedVideoUrl);
    await prisma.experimentalHlsJob.deleteMany({
      where: {
        originalUrlHash
      }
    });

    const result = await enqueueHlsJob({
      videoUrl: normalizedVideoUrl,
      videoId: stableVideoId(normalizedVideoUrl)
    });

    queued += 1;
    console.info("[hls-reprocess] queued", {
      videoId: result.job.videoId,
      recordCount: records.length,
      sources: [...new Set(records.map((record) => record.source))]
    });
  }

  console.info("[hls-reprocess] done", {
    queued,
    unsupported: unsupported.length
  });
}

main()
  .catch((error) => {
    console.error("[hls-reprocess] failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
