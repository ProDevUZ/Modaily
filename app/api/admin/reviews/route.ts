import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const reviews = await prisma.productReview.findMany({
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      body: true,
      phoneNumber: true,
      createdAt: true,
      product: {
        select: {
          nameUz: true,
          nameRu: true,
          nameEn: true
        }
      }
    }
  });

  return NextResponse.json(
    reviews.map((review) => ({
      id: review.id,
      text: review.body,
      phoneNumber: review.phoneNumber,
      createdAt: review.createdAt.toISOString(),
      productName: review.product.nameUz || review.product.nameRu || review.product.nameEn
    }))
  );
}
