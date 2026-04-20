import { NextResponse } from "next/server";

import { validateBlogPostPayload } from "@/lib/admin-validators";
import { blogPostLinkedProductSelect, serializeBlogPost } from "@/lib/blog-posts";
import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{ id: string }>;
};

async function assertLinkedProductExists(linkedProductId: string | null) {
  if (!linkedProductId) {
    return null;
  }

  const linkedProduct = await prisma.product.findUnique({
    where: { id: linkedProductId },
    select: { id: true }
  });

  return linkedProduct;
}

export async function GET(_: Request, { params }: RouteProps) {
  const { id } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      linkedProduct: {
        select: blogPostLinkedProductSelect
      },
      dynamicSections: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
      }
    }
  });

  if (!post) {
    return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
  }

  return NextResponse.json(serializeBlogPost(post));
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const { id } = await params;
  const body = await request.json();
  const parsed = validateBlogPostPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  if (parsed.data.linkedProductId) {
    const linkedProduct = await assertLinkedProductExists(parsed.data.linkedProductId);

    if (!linkedProduct) {
      return NextResponse.json({ error: "Selected linked product was not found." }, { status: 400 });
    }
  }

  try {
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        cardTitle: parsed.data.cardTitle,
        excerpt: parsed.data.excerpt,
        coverImage: parsed.data.coverImage,
        publishDate: parsed.data.publishDate,
        category: parsed.data.category,
        slug: parsed.data.slug,
        featured: parsed.data.featured,
        linkedProductId: parsed.data.linkedProductId,
        mainTitle: parsed.data.mainTitle,
        introDescription: parsed.data.introDescription,
        seoTitle: parsed.data.seoTitle,
        metaDescription: parsed.data.metaDescription,
        dynamicSections: {
          deleteMany: {},
          create: parsed.data.dynamicSections
        }
      },
      include: {
        linkedProduct: {
          select: blogPostLinkedProductSelect
        },
        dynamicSections: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
        }
      }
    });

    return NextResponse.json(serializeBlogPost(post));
  } catch {
    return NextResponse.json({ error: "Blog post could not be updated." }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: RouteProps) {
  const { id } = await params;

  try {
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Blog post could not be deleted." }, { status: 400 });
  }
}
