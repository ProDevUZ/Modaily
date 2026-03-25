import { NextResponse } from "next/server";

import { validateGalleryItemPayload } from "@/lib/admin-validators";
import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteProps) {
  const { id } = await params;
  const body = await request.json();
  const parsed = validateGalleryItemPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const item = await prisma.galleryItem.update({
      where: { id },
      data: parsed.data
    });

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Gallery item could not be updated." }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: RouteProps) {
  const { id } = await params;

  try {
    await prisma.galleryItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Gallery item could not be deleted." }, { status: 400 });
  }
}
