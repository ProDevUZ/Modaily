import { createHash, randomUUID } from "crypto";

import { prisma } from "@/lib/prisma";
import type { HlsGenerationResult } from "@/lib/video/hls-types";

export type HlsProcessingStatus = "pending" | "processing" | "ready" | "failed";

export type EnqueueHlsJobInput = {
  videoUrl: string;
  videoId?: string;
  retryFailed?: boolean;
};

export type PublicHlsJob = {
  id: string;
  videoId: string;
  originalUrl: string;
  status: HlsProcessingStatus;
  attempts: number;
  errorMessage: string | null;
  masterPlaylistUrl: string | null;
  posterUrl: string | null;
  metadata: unknown | null;
  assets: unknown | null;
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
};

type JobRecord = Awaited<ReturnType<typeof prisma.experimentalHlsJob.findFirstOrThrow>>;

const allowedStatuses = new Set<HlsProcessingStatus>(["pending", "processing", "ready", "failed"]);

function statusFromDb(status: string): HlsProcessingStatus {
  if (allowedStatuses.has(status as HlsProcessingStatus)) {
    return status as HlsProcessingStatus;
  }

  return "failed";
}

export function hashOriginalUrl(videoUrl: string) {
  return createHash("sha256").update(videoUrl).digest("hex");
}

function sanitizeVideoId(videoId?: string) {
  const raw = videoId?.trim() || randomUUID();
  const safe = raw.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80);

  if (!safe) {
    throw new Error("Invalid videoId.");
  }

  return safe;
}

function assertValidInputUrl(videoUrl: string) {
  const url = new URL(videoUrl);

  if (url.protocol !== "https:") {
    throw new Error("Only HTTPS MP4 input URLs are allowed.");
  }

  if (!url.pathname.toLowerCase().endsWith(".mp4")) {
    throw new Error("Only MP4 input URLs are allowed.");
  }

  return url.toString();
}

function parseJson(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function toPublicHlsJob(job: JobRecord): PublicHlsJob {
  return {
    id: job.id,
    videoId: job.videoId,
    originalUrl: job.originalUrl,
    status: statusFromDb(job.status),
    attempts: job.attempts,
    errorMessage: job.errorMessage,
    masterPlaylistUrl: job.masterPlaylistUrl,
    posterUrl: job.posterUrl,
    metadata: parseJson(job.metadataJson),
    assets: parseJson(job.assetsJson),
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    startedAt: job.startedAt?.toISOString() ?? null,
    completedAt: job.completedAt?.toISOString() ?? null,
    failedAt: job.failedAt?.toISOString() ?? null
  };
}

export async function enqueueHlsJob(input: EnqueueHlsJobInput) {
  const originalUrl = assertValidInputUrl(input.videoUrl);
  const originalUrlHash = hashOriginalUrl(originalUrl);
  const existing = await prisma.experimentalHlsJob.findUnique({
    where: { originalUrlHash }
  });

  if (existing) {
    if (existing.status === "failed" && input.retryFailed) {
      const reset = await prisma.experimentalHlsJob.update({
        where: { id: existing.id },
        data: {
          status: "pending",
          lockedAt: null,
          startedAt: null,
          completedAt: null,
          failedAt: null,
          errorMessage: null
        }
      });

      console.info("[hls-job] retry queued", {
        videoId: reset.videoId,
        jobId: reset.id,
        attempts: reset.attempts
      });

      return {
        job: reset,
        created: false,
        duplicate: true,
        retried: true
      };
    }

    console.info("[hls-job] duplicate enqueue ignored", {
      videoId: existing.videoId,
      jobId: existing.id,
      status: existing.status
    });

    return {
      job: existing,
      created: false,
      duplicate: true,
      retried: false
    };
  }

  const job = await prisma.experimentalHlsJob.create({
    data: {
      videoId: sanitizeVideoId(input.videoId),
      originalUrl,
      originalUrlHash,
      status: "pending"
    }
  });

  console.info("[hls-job] queued", {
    videoId: job.videoId,
    jobId: job.id
  });

  return {
    job,
    created: true,
    duplicate: false,
    retried: false
  };
}

export async function getHlsJobByVideoId(videoId: string) {
  return prisma.experimentalHlsJob.findUnique({
    where: { videoId }
  });
}

export async function getHlsJobByOriginalUrl(videoUrl: string) {
  return prisma.experimentalHlsJob.findUnique({
    where: {
      originalUrlHash: hashOriginalUrl(assertValidInputUrl(videoUrl))
    }
  });
}

function getWorkerStaleMs() {
  const value = Number(process.env.HLS_JOB_STALE_MS);
  return Number.isFinite(value) && value > 0 ? value : 30 * 60 * 1000;
}

function getMaxAttempts() {
  const value = Number(process.env.HLS_JOB_MAX_ATTEMPTS);
  return Number.isFinite(value) && value > 0 ? value : 3;
}

export async function claimNextHlsJob() {
  const now = new Date();
  const staleBefore = new Date(now.getTime() - getWorkerStaleMs());
  const maxAttempts = getMaxAttempts();
  const candidates = await prisma.experimentalHlsJob.findMany({
    where: {
      attempts: {
        lt: maxAttempts
      },
      OR: [
        { status: "pending" },
        {
          status: "processing",
          lockedAt: {
            lt: staleBefore
          }
        }
      ]
    },
    orderBy: [{ createdAt: "asc" }],
    take: 5
  });

  for (const candidate of candidates) {
    const claimed = await prisma.experimentalHlsJob.updateMany({
      where: {
        id: candidate.id,
        status: candidate.status,
        lockedAt: candidate.lockedAt
      },
      data: {
        status: "processing",
        attempts: {
          increment: 1
        },
        lockedAt: now,
        startedAt: now,
        failedAt: null,
        errorMessage: null
      }
    });

    if (claimed.count === 1) {
      const job = await prisma.experimentalHlsJob.findUniqueOrThrow({
        where: { id: candidate.id }
      });

      console.info("[hls-worker] job claimed", {
        videoId: job.videoId,
        jobId: job.id,
        attempts: job.attempts,
        recoveredStaleJob: candidate.status === "processing"
      });

      return job;
    }
  }

  return null;
}

export async function markHlsJobReady(jobId: string, result: HlsGenerationResult) {
  return prisma.experimentalHlsJob.update({
    where: { id: jobId },
    data: {
      status: "ready",
      lockedAt: null,
      completedAt: new Date(),
      failedAt: null,
      errorMessage: null,
      masterPlaylistKey: result.masterPlaylistKey,
      masterPlaylistUrl: result.masterPlaylistUrl,
      posterKey: result.posterKey,
      posterUrl: result.posterUrl,
      metadataJson: JSON.stringify(result.metadata),
      assetsJson: JSON.stringify(result.assets)
    }
  });
}

export async function markHlsJobFailed(jobId: string, error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown HLS processing error.";

  return prisma.experimentalHlsJob.update({
    where: { id: jobId },
    data: {
      status: "failed",
      lockedAt: null,
      failedAt: new Date(),
      errorMessage: message.slice(0, 2000)
    }
  });
}
