import { NextResponse } from "next/server";

import {
  getProductImageContentType,
  readProductImage,
  sanitizeProductImageFilename
} from "@/lib/product-image-storage";

type RouteProps = {
  params: Promise<{ filename: string }>;
};

export async function GET(_: Request, { params }: RouteProps) {
  const { filename } = await params;
  const safeFilename = sanitizeProductImageFilename(filename);

  if (!safeFilename) {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }

  try {
    const buffer = await readProductImage(safeFilename);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": getProductImageContentType(safeFilename),
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }
}
