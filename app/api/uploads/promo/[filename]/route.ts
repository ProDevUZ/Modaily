import { NextResponse } from "next/server";

import {
  getPromoImageContentType,
  readPromoImage,
  sanitizePromoImageFilename
} from "@/lib/promo-image-storage";

type RouteProps = {
  params: Promise<{ filename: string }>;
};

export async function GET(_: Request, { params }: RouteProps) {
  const { filename } = await params;
  const safeFilename = sanitizePromoImageFilename(filename);

  if (!safeFilename) {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }

  try {
    const buffer = await readPromoImage(safeFilename);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": getPromoImageContentType(safeFilename),
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }
}
