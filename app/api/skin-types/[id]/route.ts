import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_: Request, { params }: RouteProps) {
  const { id } = await params;
  const option = await prisma.skinTypeOption.findUnique({ where: { id } });

  if (!option) {
    return NextResponse.json({ error: "Skin type not found." }, { status: 404 });
  }

  const products = await prisma.product.findMany({
    where: {
      skinTypes: {
        not: null
      }
    },
    select: {
      skinTypes: true
    }
  });

  const isUsed = products.some((product) =>
    (product.skinTypes || "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .includes(option.value)
  );

  if (isUsed) {
    return NextResponse.json(
      { error: "Skin type is already used in products. Remove it from products first." },
      { status: 409 }
    );
  }

  try {
    await prisma.skinTypeOption.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Skin type could not be deleted." }, { status: 400 });
  }
}
