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
      media: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
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
        cardTitleUz: parsed.data.cardTitleUz,
        cardTitleRu: parsed.data.cardTitleRu,
        cardTitleEn: parsed.data.cardTitleEn,
        excerpt: parsed.data.excerpt,
        excerptUz: parsed.data.excerptUz,
        excerptRu: parsed.data.excerptRu,
        excerptEn: parsed.data.excerptEn,
        coverImage: parsed.data.coverImage,
        publishDate: parsed.data.publishDate,
        category: parsed.data.category,
        categoryUz: parsed.data.categoryUz,
        categoryRu: parsed.data.categoryRu,
        categoryEn: parsed.data.categoryEn,
        slug: parsed.data.slug,
        featured: parsed.data.featured,
        linkedProductId: parsed.data.linkedProductId,
        mainTitle: parsed.data.mainTitle,
        mainTitleUz: parsed.data.mainTitleUz,
        mainTitleRu: parsed.data.mainTitleRu,
        mainTitleEn: parsed.data.mainTitleEn,
        introDescription: parsed.data.introDescription,
        introDescriptionUz: parsed.data.introDescriptionUz,
        introDescriptionRu: parsed.data.introDescriptionRu,
        introDescriptionEn: parsed.data.introDescriptionEn,
        seoTitle: parsed.data.seoTitle,
        metaDescription: parsed.data.metaDescription,
        media: {
          deleteMany: {},
          create: parsed.data.media
        },
        dynamicSections: {
          deleteMany: {},
          create: parsed.data.dynamicSections.map((section) => ({
            title: section.titleRu || section.titleEn || section.titleUz,
            titleUz: section.titleUz,
            titleRu: section.titleRu,
            titleEn: section.titleEn,
            description: section.descriptionRu || section.descriptionEn || section.descriptionUz,
            descriptionUz: section.descriptionUz,
            descriptionRu: section.descriptionRu,
            descriptionEn: section.descriptionEn,
            sortOrder: section.sortOrder
          }))
        }
      },
      include: {
        linkedProduct: {
          select: blogPostLinkedProductSelect
        },
        media: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
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
