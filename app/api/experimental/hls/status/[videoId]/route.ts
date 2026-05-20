import { NextResponse } from "next/server";

import { verifyHlsExperimentRequest } from "@/lib/video/hls-auth";
import { getHlsJobByVideoId, toPublicHlsJob } from "@/lib/video/hls-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{ videoId: string }>;
};

export async function GET(request: Request, { params }: RouteProps) {
  const authError = verifyHlsExperimentRequest(request);

  if (authError) {
    return authError;
  }

  const { videoId } = await params;
  const job = await getHlsJobByVideoId(videoId);

  if (!job) {
    return NextResponse.json({ error: "HLS job not found." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    job: toPublicHlsJob(job)
  });
}
