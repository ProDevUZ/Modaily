import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateProductPayload } from "@/lib/admin-validators";
import {
  buildLegacyProductWriteData,
  isUnsupportedProductHomeFieldError,
  normalizeProductHomeFields
} from "@/lib/product-home-fields";

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      category: true
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
    const product = await prisma.product.create({
      data: parsed.data,
      include: {
        category: true
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
        return NextResponse.json(
          {
            error:
              process.env.NODE_ENV === "development" && legacyError instanceof Error
                ? legacyError.message
                : "Product could not be created."
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : "Product could not be created."
      },
      { status: 400 }
    );
  }
}
