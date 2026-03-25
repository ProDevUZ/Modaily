import { NextResponse } from "next/server";

import { validateHomePromoCardPayload } from "@/lib/admin-validators";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cards = await prisma.homePromoCard.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
  });

  return NextResponse.json(cards);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = validateHomePromoCardPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const card = await prisma.homePromoCard.create({
      data: parsed.data
    });

    return NextResponse.json(card, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Promo card could not be created." }, { status: 400 });
  }
}
