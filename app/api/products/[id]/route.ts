import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateProductPayload } from "@/lib/admin-validators";
import {
  buildLegacyProductWriteData,
  isUnsupportedProductHomeFieldError,
  normalizeProductHomeFields
} from "@/lib/product-home-fields";
import { getProductWriteErrorPayload } from "@/lib/product-write-errors";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      galleryImages: {
        orderBy: {
          sortOrder: "asc"
        }
      },
      _count: {
        select: {
          reviews: true
        }
      }
    }
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  return NextResponse.json(normalizeProductHomeFields(product));
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const { id } = await params;
  const body = await request.json();
  const parsed = validateProductPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...parsed.data,
        galleryImages: {
          deleteMany: {},
          create: parsed.data.galleryImages
        }
      },
      include: {
        category: true,
        galleryImages: {
          orderBy: {
            sortOrder: "asc"
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    });

    return NextResponse.json(normalizeProductHomeFields(product));
  } catch (error) {
    if (isUnsupportedProductHomeFieldError(error)) {
      try {
        const product = await prisma.product.update({
          where: { id },
          data: buildLegacyProductWriteData(parsed.data),
          include: {
            category: true
          }
        });

        return NextResponse.json(normalizeProductHomeFields(product));
      } catch (legacyError) {
        const payload = getProductWriteErrorPayload(legacyError, "update");
        return NextResponse.json(
          process.env.NODE_ENV === "development" && legacyError instanceof Error
            ? { error: legacyError.message, hint: payload.hint }
            : payload,
          { status: payload.status }
        );
      }
    }

    const payload = getProductWriteErrorPayload(error, "update");
    return NextResponse.json(
      process.env.NODE_ENV === "development" && error instanceof Error
        ? { error: error.message, hint: payload.hint }
        : payload,
      { status: payload.status }
    );
  }
}

export async function DELETE(_: Request, { params }: RouteProps) {
  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Product could not be deleted." }, { status: 400 });
  }
}
