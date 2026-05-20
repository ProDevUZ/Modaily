import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type AdminReviewRow = {
  id: string;
  body: string;
  phoneNumber: string;
  adminSeenAt: Date | null;
  createdAt: Date;
  product: {
    slug: string;
    nameUz: string;
    nameRu: string;
    nameEn: string;
  };
};

export async function GET() {
  const reviews = await prisma.productReview.findMany({
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      body: true,
      phoneNumber: true,
      adminSeenAt: true,
      createdAt: true,
      product: {
        select: {
          slug: true,
          nameUz: true,
          nameRu: true,
          nameEn: true
        }
      }
    }
  });

  return NextResponse.json(
    (reviews as AdminReviewRow[]).map((review) => ({
      id: review.id,
      text: review.body,
      phoneNumber: review.phoneNumber,
      unread: !review.adminSeenAt,
      createdAt: review.createdAt.toISOString(),
      productName: review.product.nameUz || review.product.nameRu || review.product.nameEn,
      productSlug: review.product.slug
    }))
  );
}
