import { NextResponse } from "next/server";

import { cleanupExpiredDirectUploads } from "@/lib/direct-uploads/server";
import { verifyHlsExperimentRequest } from "@/lib/video/hls-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const authError = verifyHlsExperimentRequest(request);

  if (authError) {
    return authError;
  }

  const result = await cleanupExpiredDirectUploads();
  return NextResponse.json({
    ok: true,
    ...result
  });
}
