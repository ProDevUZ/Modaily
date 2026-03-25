import { NextResponse } from "next/server";

import { validateGalleryItemPayload } from "@/lib/admin-validators";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.galleryItem.findMany({
    orderBy: [{ type: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }]
  });

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = validateGalleryItemPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const item = await prisma.galleryItem.create({
      data: parsed.data
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gallery item could not be created." }, { status: 400 });
  }
}
