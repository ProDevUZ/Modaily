import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateCategoryPayload } from "@/lib/admin-validators";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = validateCategoryPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const category = await prisma.category.create({
      data: parsed.data,
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Category could not be created." }, { status: 400 });
  }
}
