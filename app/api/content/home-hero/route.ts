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
  try {
    const hero = await getHomeHero();
    return NextResponse.json(hero);
  } catch (error) {
    console.error("home hero fallback", error);
    return NextResponse.json(defaultHomeHero);
  }
}

export async function PATCH(request: Request) {
  const current = await getHomeHero();
  const body = await request.json();
  const parsed = validateHomeHeroPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  if (parsed.data.heroProductId) {
    const linkedProduct = await prisma.product.findUnique({
      where: { id: parsed.data.heroProductId },
      select: { id: true }
    });

    if (!linkedProduct) {
      return NextResponse.json({ error: "Selected hero product was not found." }, { status: 400 });
    }
  }

  const updated = await prisma.homeHero.update({
    where: { id: current.id },
    data: parsed.data
  });

  return NextResponse.json(updated);
}
