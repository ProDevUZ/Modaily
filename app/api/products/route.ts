import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateProductPayload } from "@/lib/admin-validators";
import {
  buildLegacyProductWriteData,
  isUnsupportedProductHomeFieldError,
  normalizeProductHomeFields
} from "@/lib/product-home-fields";
import { getProductWriteErrorPayload } from "@/lib/product-write-errors";

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      galleryImages: {
        orderBy: {
          sortOrder: "asc"
        }
      },
      recommendationLinks: {
        select: {
          recommendedProductId: true,
          sortOrder: true
        },
        orderBy: {
          sortOrder: "asc"
        }
      },
      _count: {
        select: {
          reviews: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return NextResponse.json(products.map((product) => normalizeProductHomeFields(product)));
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = validateProductPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const { galleryImages, recommendedProductIds, ...productData } = parsed.data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        galleryImages: {
          create: galleryImages
        },
        recommendationLinks: {
          create: recommendedProductIds.map((recommendedProductId, index) => ({
            recommendedProductId,
            sortOrder: index
          }))
        }
      },
      include: {
        category: true,
        galleryImages: {
          orderBy: {
            sortOrder: "asc"
          }
        },
        recommendationLinks: {
          select: {
            recommendedProductId: true,
            sortOrder: true
          },
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

    return NextResponse.json(normalizeProductHomeFields(product), { status: 201 });
  } catch (error) {
    if (isUnsupportedProductHomeFieldError(error)) {
      try {
        const product = await prisma.product.create({
          data: buildLegacyProductWriteData(parsed.data),
          include: {
            category: true
          }
        });

        return NextResponse.json(normalizeProductHomeFields(product), { status: 201 });
      } catch (legacyError) {
        const payload = getProductWriteErrorPayload(legacyError, "create");
        return NextResponse.json(
          process.env.NODE_ENV === "development" && legacyError instanceof Error
            ? { error: legacyError.message, hint: payload.hint }
            : payload,
          { status: payload.status }
        );
      }
    }

    const payload = getProductWriteErrorPayload(error, "create");
    return NextResponse.json(
      process.env.NODE_ENV === "development" && error instanceof Error
        ? { error: error.message, hint: payload.hint }
        : payload,
      { status: payload.status }
    );
  }
}
