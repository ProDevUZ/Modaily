import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET(_: Request, { params }: RouteProps) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: {
      slug,
      active: true
    },
    select: {
      reviews: {
        where: {
          active: true
        },
        orderBy: {
          createdAt: "desc"
        },
        select: {
          id: true,
          authorName: true,
          body: true,
          imageUrl: true,
          rating: true,
          createdAt: true
        }
      }
    }
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  return NextResponse.json(
    product.reviews.map((review) => ({
      ...review,
      createdAt: review.createdAt.toISOString()
    }))
  );
}

export async function POST(request: Request, { params }: RouteProps) {
  const { slug } = await params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  const authorName = asString(body?.authorName);
  const reviewBody = asString(body?.body);
  const imageUrl = asString(body?.imageUrl) || null;
  const rating = Number(body?.rating);

  if (!authorName || authorName.length < 2) {
    return NextResponse.json({ error: "Valid author name is required." }, { status: 400 });
  }

  if (!reviewBody || reviewBody.length < 8) {
    return NextResponse.json({ error: "Review text must be at least 8 characters." }, { status: 400 });
  }

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
  }

  const product = await prisma.product.findFirst({
    where: {
      slug,
      active: true
    },
    select: {
      id: true
    }
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const review = await prisma.productReview.create({
    data: {
      productId: product.id,
      authorName,
      body: reviewBody,
      imageUrl,
      rating,
      active: true
    },
    select: {
      id: true,
      authorName: true,
      body: true,
      imageUrl: true,
      rating: true,
      createdAt: true
    }
  });

  return NextResponse.json(
    {
      ...review,
      createdAt: review.createdAt.toISOString()
    },
    { status: 201 }
  );
}
