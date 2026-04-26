import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateCategoryPayload } from "@/lib/admin-validators";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteProps) {
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          products: true
        }
      }
    }
  });

  if (!category) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  return NextResponse.json(category);
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const { id } = await params;
  const body = await request.json();
  const parsed = validateCategoryPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: parsed.data,
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Category could not be updated." }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: RouteProps) {
  const { id } = await params;
  const products = await prisma.product.findMany({
    where: {
      OR: [{ categoryId: id }, { categoryIds: { contains: id } }]
    },
    select: {
      categoryId: true,
      categoryIds: true
    }
  });
  const productsCount = products.filter((product) => {
    if (product.categoryId === id) {
      return true;
    }

    return (product.categoryIds || "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .includes(id);
  }).length;

  if (productsCount > 0) {
    return NextResponse.json(
      { error: "Category has products. Reassign or delete products first." },
      { status: 409 }
    );
  }

  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Category could not be deleted." }, { status: 400 });
  }
}
