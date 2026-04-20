import { NextResponse } from "next/server";

import { validateBlogPostPayload } from "@/lib/admin-validators";
import { blogPostLinkedProductSelect, serializeBlogPost } from "@/lib/blog-posts";
import { prisma } from "@/lib/prisma";

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

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      include: {
        linkedProduct: {
          select: blogPostLinkedProductSelect
        },
        dynamicSections: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
        }
      },
      orderBy: [{ publishDate: "desc" }, { createdAt: "desc" }]
    });

    return NextResponse.json(posts.map(serializeBlogPost));
  } catch (error) {
    console.error("blog posts fallback", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
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
    const post = await prisma.blogPost.create({
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

    return NextResponse.json(serializeBlogPost(post), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Blog post could not be created." }, { status: 400 });
  }
}
