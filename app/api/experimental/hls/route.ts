import { NextResponse } from "next/server";

import { verifyHlsExperimentRequest } from "@/lib/video/hls-auth";
import { enqueueHlsJob, toPublicHlsJob } from "@/lib/video/hls-jobs";
import { verifyFfmpegAvailability } from "@/lib/video/hls-pipeline";
import type { HlsGenerationInput } from "@/lib/video/hls-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type EnqueueBody = HlsGenerationInput & {
  retryFailed?: boolean;
};

function parseBody(body: unknown): EnqueueBody | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const payload = body as Record<string, unknown>;
  const videoUrl = typeof payload.videoUrl === "string" ? payload.videoUrl.trim() : "";
  const videoId = typeof payload.videoId === "string" ? payload.videoId.trim() : undefined;
  const retryFailed = payload.retryFailed === true;

  if (!videoUrl) {
    return null;
  }

  return {
    videoUrl,
    videoId,
    retryFailed
  };
}

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Experimental HLS generation failed.";
}

export async function GET(request: Request) {
  const authError = verifyHlsExperimentRequest(request);

  if (authError) {
    return authError;
  }

  try {
    const availability = await verifyFfmpegAvailability("[hls:health]");

    return NextResponse.json({
      ok: true,
      availability
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: toErrorMessage(error)
      },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  const authError = verifyHlsExperimentRequest(request);

  if (authError) {
    return authError;
  }

  let payload: EnqueueBody | null = null;

  try {
    payload = parseBody(await request.json());
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  if (!payload) {
    return NextResponse.json({ error: "videoUrl is required." }, { status: 400 });
  }

  try {
    const enqueued = await enqueueHlsJob({
      videoUrl: payload.videoUrl,
      videoId: payload.videoId,
      retryFailed: payload.retryFailed
    });

    return NextResponse.json(
      {
        ok: true,
        created: enqueued.created,
        duplicate: enqueued.duplicate,
        retried: enqueued.retried,
        job: toPublicHlsJob(enqueued.job)
      },
      { status: enqueued.created || enqueued.retried ? 202 : 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: toErrorMessage(error)
      },
      { status: 500 }
    );
  }
}
