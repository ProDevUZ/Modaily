import { NextResponse } from "next/server";

import { validateHomeAboutPayload } from "@/lib/admin-validators";
import { defaultHomeAbout } from "@/lib/content-defaults";
import { prisma } from "@/lib/prisma";

async function getHomeAbout() {
  const existing = await prisma.homeAboutSection.findFirst({
    orderBy: { createdAt: "asc" }
  });

  if (existing) {
    return existing;
  }

  return prisma.homeAboutSection.create({
    data: defaultHomeAbout
  });
}

export async function GET() {
  const about = await getHomeAbout();
  return NextResponse.json(about);
}

export async function PATCH(request: Request) {
  const current = await getHomeAbout();
  const body = await request.json();
  const parsed = validateHomeAboutPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const updated = await prisma.homeAboutSection.update({
    where: { id: current.id },
    data: parsed.data
  });

  return NextResponse.json(updated);
}
