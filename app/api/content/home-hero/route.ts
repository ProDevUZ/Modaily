import { NextResponse } from "next/server";

import { validateHomeHeroPayload } from "@/lib/admin-validators";
import { defaultHomeHero } from "@/lib/content-defaults";
import { prisma } from "@/lib/prisma";

async function getHomeHero() {
  const existing = await prisma.homeHero.findFirst({
    orderBy: { createdAt: "asc" }
  });

  if (existing) {
    return existing;
  }

  return prisma.homeHero.create({
    data: defaultHomeHero
  });
}

export async function GET() {
  const hero = await getHomeHero();
  return NextResponse.json(hero);
}

export async function PATCH(request: Request) {
  const current = await getHomeHero();
  const body = await request.json();
  const parsed = validateHomeHeroPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const updated = await prisma.homeHero.update({
    where: { id: current.id },
    data: parsed.data
  });

  return NextResponse.json(updated);
}
