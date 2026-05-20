import { NextResponse } from "next/server";

import { validateReviewSectionHeadingPayload } from "@/lib/admin-validators";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const parsed = validateReviewSectionHeadingPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const item = await prisma.reviewSectionHeading.update({
      where: { id },
      data: parsed.data
    });

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Review heading could not be updated." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await prisma.reviewSectionHeading.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Review heading could not be deleted." }, { status: 400 });
  }
}
