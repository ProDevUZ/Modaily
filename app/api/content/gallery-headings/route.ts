import { NextResponse } from "next/server";

import { validateGallerySectionHeadingPayload } from "@/lib/admin-validators";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.gallerySectionHeading.findMany({
      orderBy: [{ type: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }]
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("gallery headings fallback", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = validateGallerySectionHeadingPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const item = await prisma.gallerySectionHeading.create({
      data: parsed.data
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gallery heading could not be created." }, { status: 400 });
  }
}
