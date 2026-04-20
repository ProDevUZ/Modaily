import { NextResponse } from "next/server";

import { validateHomePromoCardPayload } from "@/lib/admin-validators";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cards = await prisma.homePromoCard.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error("promo cards fallback", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = validateHomePromoCardPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const promoProduct = await prisma.product.findUnique({
      where: { id: parsed.data.promoProductId ?? "" },
      select: { id: true }
    });

    if (!promoProduct) {
      return NextResponse.json({ error: "Selected promo product was not found." }, { status: 400 });
    }

    const card = await prisma.homePromoCard.create({
      data: parsed.data
    });

    return NextResponse.json(card, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Promo card could not be created." }, { status: 400 });
  }
}
