import { NextResponse } from "next/server";

import { getGalleryVideoContentType, readGalleryVideo, sanitizeGalleryVideoFilename } from "@/lib/gallery-video-storage";

export async function GET(_: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const safeFilename = sanitizeGalleryVideoFilename(filename);

  if (!safeFilename) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const buffer = await readGalleryVideo(safeFilename);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": getGalleryVideoContentType(safeFilename),
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
