import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateProductPayload } from "@/lib/admin-validators";

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      category: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = validateProductPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const product = await prisma.product.create({
      data: parsed.data,
      include: {
        category: true
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Product could not be created." }, { status: 400 });
  }
}
