import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/prisma";
import type {
  BlogPostDynamicSection,
  BlogPostLinkedProduct,
  BlogPostRecord,
  StorefrontBlogPost,
  StorefrontBlogPostCard
} from "@/lib/blog-post-types";

type BlogPostSectionRow = {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

type BlogPostRow = {
  id: string;
  cardTitle: string;
  excerpt: string;
  coverImage: string;
  publishDate: Date;
  category: string;
  slug: string;
  featured: boolean;
  linkedProductId: string | null;
  mainTitle: string;
  introDescription: string;
  seoTitle: string;
  metaDescription: string;
  createdAt: Date;
  updatedAt: Date;
  dynamicSections: BlogPostSectionRow[];
  linkedProduct: {
    id: string;
    sku: string;
    slug: string;
    nameUz: string;
    nameRu: string;
    nameEn: string;
    imageUrl: string | null;
    price: number;
    active: boolean;
  } | null;
};

export const blogPostLinkedProductSelect = {
  id: true,
  sku: true,
  slug: true,
  nameUz: true,
  nameRu: true,
  nameEn: true,
  imageUrl: true,
  price: true,
  active: true
} as const;

function serializeDynamicSection(section: BlogPostSectionRow): BlogPostDynamicSection {
  return {
    id: section.id,
    title: section.title,
    description: section.description,
    sortOrder: section.sortOrder,
    createdAt: section.createdAt.toISOString(),
    updatedAt: section.updatedAt.toISOString()
  };
}

function serializeLinkedProduct(
  product: BlogPostRow["linkedProduct"]
): BlogPostLinkedProduct | null {
  if (!product) {
    return null;
  }

  return {
    id: product.id,
    sku: product.sku,
    slug: product.slug,
    nameUz: product.nameUz,
    nameRu: product.nameRu,
    nameEn: product.nameEn,
    imageUrl: product.imageUrl,
    price: product.price,
    active: product.active
  };
}

export function serializeBlogPost(post: BlogPostRow): BlogPostRecord {
  return {
    id: post.id,
    cardTitle: post.cardTitle,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    publishDate: post.publishDate.toISOString(),
    category: post.category,
    slug: post.slug,
    featured: post.featured,
    linkedProductId: post.linkedProductId,
    linkedProduct: serializeLinkedProduct(post.linkedProduct),
    mainTitle: post.mainTitle,
    introDescription: post.introDescription,
    dynamicSections: post.dynamicSections.map(serializeDynamicSection),
    seoTitle: post.seoTitle,
    metaDescription: post.metaDescription,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString()
  };
}

function mapBlogPostCard(post: BlogPostRecord): StorefrontBlogPostCard {
  return {
    id: post.id,
    cardTitle: post.cardTitle,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    publishDate: post.publishDate,
    category: post.category,
    slug: post.slug,
    featured: post.featured,
    linkedProductId: post.linkedProductId,
    linkedProduct: post.linkedProduct
  };
}

function publishedAtOrBeforeNow() {
  return {
    lte: new Date()
  };
}

export async function getStorefrontBlogPosts(options?: {
  category?: string;
  featured?: boolean;
  limit?: number;
}) {
  noStore();

  const rows = await prisma.blogPost.findMany({
    where: {
      publishDate: publishedAtOrBeforeNow(),
      ...(options?.category ? { category: options.category } : {}),
      ...(options?.featured ? { featured: true } : {})
    },
    orderBy: [{ publishDate: "desc" }, { createdAt: "desc" }],
    take: options?.limit,
    include: {
      linkedProduct: {
        select: blogPostLinkedProductSelect
      },
      dynamicSections: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
      }
    }
  });

  return rows.map((row) => mapBlogPostCard(serializeBlogPost(row)));
}

export async function getStorefrontFeaturedBlogPosts(limit = 3) {
  return getStorefrontBlogPosts({ featured: true, limit });
}

export async function getStorefrontBlogPost(slug: string): Promise<StorefrontBlogPost | null> {
  noStore();

  const row = await prisma.blogPost.findFirst({
    where: {
      slug,
      publishDate: publishedAtOrBeforeNow()
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

  return row ? serializeBlogPost(row) : null;
}

export async function getStorefrontBlogPostSlugs() {
  noStore();

  const rows = await prisma.blogPost.findMany({
    where: {
      publishDate: publishedAtOrBeforeNow()
    },
    select: {
      slug: true
    },
    orderBy: [{ publishDate: "desc" }, { createdAt: "desc" }]
  });

  return rows.map((row) => row.slug);
}
