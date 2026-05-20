import { NextResponse } from "next/server";

import { validateReviewSectionHeadingPayload } from "@/lib/admin-validators";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.reviewSectionHeading.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("review headings fallback", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = validateReviewSectionHeadingPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const item = await prisma.reviewSectionHeading.create({
      data: parsed.data
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Review heading could not be created." }, { status: 400 });
  }
}
