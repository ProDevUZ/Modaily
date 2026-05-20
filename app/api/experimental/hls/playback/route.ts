import { NextResponse } from "next/server";

import { getHlsJobByOriginalUrl } from "@/lib/video/hls-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const videoUrl = url.searchParams.get("videoUrl")?.trim();

  if (!videoUrl) {
    return NextResponse.json({ error: "videoUrl is required." }, { status: 400 });
  }

  try {
    const job = await getHlsJobByOriginalUrl(videoUrl);

    if (!job) {
      return NextResponse.json({
        status: "mp4_only",
        hlsUrl: null,
        posterUrl: null
      });
    }

    return NextResponse.json({
      status: job.status,
      hlsUrl: job.status === "ready" ? job.masterPlaylistUrl : null,
      posterUrl: job.status === "ready" || job.status === "processing" ? job.posterUrl : null,
      videoId: job.videoId
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "mp4_only",
        hlsUrl: null,
        posterUrl: null,
        error: error instanceof Error ? error.message : "HLS playback lookup failed."
      },
      { status: 200 }
    );
  }
}
