import { config } from "dotenv";

import { claimNextHlsJob, markHlsJobFailed, markHlsJobReady } from "../lib/video/hls-jobs";
import { generateExperimentalHls } from "../lib/video/hls-pipeline";

config({ path: ".env", quiet: true });
config({ path: ".env.local", override: true, quiet: true });

let shuttingDown = false;

function log(event: string, data: Record<string, unknown> = {}) {
  console.info(JSON.stringify({ scope: "hls-worker", event, ...data }));
}

function errorLog(event: string, error: unknown, data: Record<string, unknown> = {}) {
  console.error(
    JSON.stringify({
      scope: "hls-worker",
      event,
      error: error instanceof Error ? error.message : String(error),
      ...data
    })
  );
}

function getPollIntervalMs() {
  const value = Number(process.env.HLS_WORKER_POLL_INTERVAL_MS);
  return Number.isFinite(value) && value > 0 ? value : 5000;
}

function getJobTimeoutMs() {
  const value = Number(process.env.HLS_JOB_TIMEOUT_MS);
  return Number.isFinite(value) && value > 0 ? value : 30 * 60 * 1000;
}

function shouldRunOnce() {
  return process.env.HLS_WORKER_ONCE === "true";
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  let timeout: NodeJS.Timeout | null = null;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeout = setTimeout(() => {
          reject(new Error(`HLS job exceeded ${timeoutMs}ms timeout.`));
        }, timeoutMs);
      })
    ]);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}

async function processOneJob() {
  const job = await claimNextHlsJob();

  if (!job) {
    return false;
  }

  const startedAt = Date.now();

  log("job_started", {
    videoId: job.videoId,
    jobId: job.id,
    attempts: job.attempts
  });

  try {
    const result = await withTimeout(
      generateExperimentalHls({
        videoUrl: job.originalUrl,
        videoId: job.videoId
      }),
      getJobTimeoutMs()
    );

    await markHlsJobReady(job.id, result);

    log("job_ready", {
      videoId: job.videoId,
      jobId: job.id,
      durationMs: Date.now() - startedAt,
      masterPlaylistKey: result.masterPlaylistKey,
      posterKey: result.posterKey,
      assetCount: result.assets.length
    });
  } catch (error) {
    await markHlsJobFailed(job.id, error);

    errorLog("job_failed", error, {
      videoId: job.videoId,
      jobId: job.id,
      durationMs: Date.now() - startedAt
    });
  }

  return true;
}

async function main() {
  process.on("SIGINT", () => {
    shuttingDown = true;
    log("shutdown_requested", { signal: "SIGINT" });
  });

  process.on("SIGTERM", () => {
    shuttingDown = true;
    log("shutdown_requested", { signal: "SIGTERM" });
  });

  log("started", {
    pollIntervalMs: getPollIntervalMs(),
    jobTimeoutMs: getJobTimeoutMs(),
    runOnce: shouldRunOnce()
  });

  while (!shuttingDown) {
    const processed = await processOneJob();

    if (shouldRunOnce()) {
      break;
    }

    if (!processed) {
      await sleep(getPollIntervalMs());
    }
  }

  log("stopped");
}

main().catch((error) => {
  errorLog("fatal", error);
  process.exitCode = 1;
});
