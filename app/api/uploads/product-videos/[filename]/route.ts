import { NextResponse } from "next/server";

import {
  getProductVideoContentType,
  readProductVideo,
  sanitizeProductVideoFilename
} from "@/lib/product-video-storage";

type RouteProps = {
  params: Promise<{ filename: string }>;
};

export async function GET(_: Request, { params }: RouteProps) {
  const { filename } = await params;
  const safeFilename = sanitizeProductVideoFilename(filename);

  if (!safeFilename) {
    return NextResponse.json({ error: "Video not found." }, { status: 404 });
  }

  try {
    const buffer = await readProductVideo(safeFilename);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": getProductVideoContentType(safeFilename),
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return NextResponse.json({ error: "Video not found." }, { status: 404 });
  }
}
