import { NextResponse } from "next/server";

import { validateHomePromoCardPayload } from "@/lib/admin-validators";
import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteProps) {
  const { id } = await params;
  const body = await request.json();
  const parsed = validateHomePromoCardPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const card = await prisma.homePromoCard.update({
      where: { id },
      data: parsed.data
    });

    return NextResponse.json(card);
  } catch {
    return NextResponse.json({ error: "Promo card could not be updated." }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: RouteProps) {
  const { id } = await params;

  try {
    await prisma.homePromoCard.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Promo card could not be deleted." }, { status: 400 });
  }
}
