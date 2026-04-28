import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateSkinTypeOptionPayload } from "@/lib/admin-validators";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteProps) {
  const { id } = await params;
  const option = await prisma.skinTypeOption.findUnique({ where: { id } });

  if (!option) {
    return NextResponse.json({ error: "Skin type not found." }, { status: 404 });
  }

  return NextResponse.json(option);
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const { id } = await params;
  const existing = await prisma.skinTypeOption.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Skin type not found." }, { status: 404 });
  }

  const body = await request.json();
  const parsed = validateSkinTypeOptionPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const option = await prisma.$transaction(async (tx) => {
      const updated = await tx.skinTypeOption.update({
        where: { id },
        data: parsed.data
      });

      if (existing.value !== parsed.data.value) {
        const products = await tx.product.findMany({
          where: {
            skinTypes: {
              not: null
            }
          },
          select: {
            id: true,
            skinTypes: true
          }
        });

        const affectedProducts = products
          .map((product) => {
            const entries = (product.skinTypes || "")
              .split(",")
              .map((entry) => entry.trim())
              .filter(Boolean);

            if (!entries.includes(existing.value)) {
              return null;
            }

            return {
              id: product.id,
              skinTypes: entries.map((entry) => (entry === existing.value ? parsed.data.value : entry)).join(", ")
            };
          })
          .filter((product): product is { id: string; skinTypes: string } => product !== null);

        for (const product of affectedProducts) {
          await tx.product.update({
            where: { id: product.id },
            data: {
              skinTypes: product.skinTypes
            }
          });
        }
      }

      return updated;
    });

    return NextResponse.json(option);
  } catch {
    return NextResponse.json({ error: "Skin type could not be updated." }, { status: 400 });
  }
}

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
