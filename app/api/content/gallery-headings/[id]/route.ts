import { NextResponse } from "next/server";

import { validateGallerySectionHeadingPayload } from "@/lib/admin-validators";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const parsed = validateGallerySectionHeadingPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const item = await prisma.gallerySectionHeading.update({
      where: { id },
      data: parsed.data
    });

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Gallery heading could not be updated." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await prisma.gallerySectionHeading.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Gallery heading could not be deleted." }, { status: 400 });
  }
}
