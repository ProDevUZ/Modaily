import { NextResponse } from "next/server";

import { getGalleryImageContentType, readGalleryImage, sanitizeGalleryImageFilename } from "@/lib/gallery-image-storage";

export async function GET(_: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const safeFilename = sanitizeGalleryImageFilename(filename);

  if (!safeFilename) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const buffer = await readGalleryImage(safeFilename);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": getGalleryImageContentType(safeFilename),
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
