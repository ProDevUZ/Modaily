import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/prisma";
import type {
  BlogPostDynamicSection,
  BlogPostLinkedProduct,
  BlogPostMediaItem,
  BlogPostRecord,
  StorefrontBlogPost,
  StorefrontBlogPostCard
} from "@/lib/blog-post-types";
import type { Locale } from "@/lib/i18n";

type BlogPostMediaRow = {
  id: string;
  type: "IMAGE" | "VIDEO";
  imageUrl: string | null;
  videoUrl: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

type BlogPostSectionRow = {
  id: string;
  title: string;
  titleUz: string | null;
  titleRu: string | null;
  titleEn: string | null;
  description: string;
  descriptionUz: string | null;
  descriptionRu: string | null;
  descriptionEn: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

type BlogPostRow = {
  id: string;
  cardTitle: string;
  cardTitleUz: string | null;
  cardTitleRu: string | null;
  cardTitleEn: string | null;
  excerpt: string;
  excerptUz: string | null;
  excerptRu: string | null;
  excerptEn: string | null;
  coverImage: string;
  publishDate: Date;
  category: string;
  categoryUz: string | null;
  categoryRu: string | null;
  categoryEn: string | null;
  slug: string;
  featured: boolean;
  linkedProductId: string | null;
  mainTitle: string;
  mainTitleUz: string | null;
  mainTitleRu: string | null;
  mainTitleEn: string | null;
  introDescription: string;
  introDescriptionUz: string | null;
  introDescriptionRu: string | null;
  introDescriptionEn: string | null;
  seoTitle: string;
  metaDescription: string;
  createdAt: Date;
  updatedAt: Date;
  media: BlogPostMediaRow[];
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

type BlogPostCardRow = Pick<
  BlogPostRow,
  | "id"
  | "cardTitle"
  | "cardTitleUz"
  | "cardTitleRu"
  | "cardTitleEn"
  | "excerpt"
  | "excerptUz"
  | "excerptRu"
  | "excerptEn"
  | "coverImage"
  | "publishDate"
  | "category"
  | "categoryUz"
  | "categoryRu"
  | "categoryEn"
  | "slug"
  | "featured"
  | "linkedProductId"
  | "linkedProduct"
>;

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

function resolveLocalizedValue(
  locale: Locale,
  values: {
    uz: string | null;
    ru: string | null;
    en: string | null;
  },
  legacy?: string | null
) {
  const normalizedLegacy = legacy || null;

  if (locale === "uz") {
    return values.uz || normalizedLegacy || values.ru || values.en || "";
  }

  if (locale === "en") {
    return values.en || normalizedLegacy || values.ru || values.uz || "";
  }

  return values.ru || normalizedLegacy || values.en || values.uz || "";
}

function serializeMediaItem(item: BlogPostMediaRow): BlogPostMediaItem {
  return {
    id: item.id,
    type: item.type,
    imageUrl: item.imageUrl,
    videoUrl: item.videoUrl,
    sortOrder: item.sortOrder,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString()
  };
}

function serializeDynamicSection(section: BlogPostSectionRow, locale: Locale): BlogPostDynamicSection {
  return {
    id: section.id,
    title: resolveLocalizedValue(
      locale,
      {
        uz: section.titleUz,
        ru: section.titleRu,
        en: section.titleEn
      },
      section.title
    ),
    titleUz: section.titleUz,
    titleRu: section.titleRu,
    titleEn: section.titleEn,
    description: resolveLocalizedValue(
      locale,
      {
        uz: section.descriptionUz,
        ru: section.descriptionRu,
        en: section.descriptionEn
      },
      section.description
    ),
    descriptionUz: section.descriptionUz,
    descriptionRu: section.descriptionRu,
    descriptionEn: section.descriptionEn,
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

export function serializeBlogPost(post: BlogPostRow, locale: Locale = "ru"): BlogPostRecord {
  const serializedMedia =
    post.media.length > 0
      ? post.media.map(serializeMediaItem)
      : post.coverImage
        ? [
            {
              id: `${post.id}-cover`,
              type: "IMAGE" as const,
              imageUrl: post.coverImage,
              videoUrl: null,
              sortOrder: 0,
              createdAt: post.createdAt.toISOString(),
              updatedAt: post.updatedAt.toISOString()
            }
          ]
        : [];

  return {
    id: post.id,
    cardTitle: resolveLocalizedValue(
      locale,
      {
        uz: post.cardTitleUz,
        ru: post.cardTitleRu,
        en: post.cardTitleEn
      },
      post.cardTitle
    ),
    cardTitleUz: post.cardTitleUz,
    cardTitleRu: post.cardTitleRu,
    cardTitleEn: post.cardTitleEn,
    excerpt: resolveLocalizedValue(
      locale,
      {
        uz: post.excerptUz,
        ru: post.excerptRu,
        en: post.excerptEn
      },
      post.excerpt
    ),
    excerptUz: post.excerptUz,
    excerptRu: post.excerptRu,
    excerptEn: post.excerptEn,
    coverImage: post.coverImage,
    publishDate: post.publishDate.toISOString(),
    category: resolveLocalizedValue(
      locale,
      {
        uz: post.categoryUz,
        ru: post.categoryRu,
        en: post.categoryEn
      },
      post.category
    ),
    categoryUz: post.categoryUz,
    categoryRu: post.categoryRu,
    categoryEn: post.categoryEn,
    slug: post.slug,
    featured: post.featured,
    linkedProductId: post.linkedProductId,
    linkedProduct: serializeLinkedProduct(post.linkedProduct),
    mainTitle: resolveLocalizedValue(
      locale,
      {
        uz: post.mainTitleUz,
        ru: post.mainTitleRu,
        en: post.mainTitleEn
      },
      post.mainTitle
    ),
    mainTitleUz: post.mainTitleUz,
    mainTitleRu: post.mainTitleRu,
    mainTitleEn: post.mainTitleEn,
    introDescription: resolveLocalizedValue(
      locale,
      {
        uz: post.introDescriptionUz,
        ru: post.introDescriptionRu,
        en: post.introDescriptionEn
      },
      post.introDescription
    ),
    introDescriptionUz: post.introDescriptionUz,
    introDescriptionRu: post.introDescriptionRu,
    introDescriptionEn: post.introDescriptionEn,
    media: serializedMedia,
    dynamicSections: post.dynamicSections.map((section) => serializeDynamicSection(section, locale)),
    seoTitle: post.seoTitle,
    metaDescription: post.metaDescription,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString()
  };
}

function mapBlogPostCard(row: BlogPostCardRow, locale: Locale): StorefrontBlogPostCard {
  return {
    id: row.id,
    cardTitle: resolveLocalizedValue(
      locale,
      {
        uz: row.cardTitleUz,
        ru: row.cardTitleRu,
        en: row.cardTitleEn
      },
      row.cardTitle
    ),
    excerpt: resolveLocalizedValue(
      locale,
      {
        uz: row.excerptUz,
        ru: row.excerptRu,
        en: row.excerptEn
      },
      row.excerpt
    ),
    coverImage: row.coverImage,
    publishDate: row.publishDate.toISOString(),
    category: resolveLocalizedValue(
      locale,
      {
        uz: row.categoryUz,
        ru: row.categoryRu,
        en: row.categoryEn
      },
      row.category
    ),
    slug: row.slug,
    featured: row.featured,
    linkedProductId: row.linkedProductId,
    linkedProduct: serializeLinkedProduct(row.linkedProduct)
  };
}

function publishedAtOrBeforeNow() {
  return {
    lte: new Date()
  };
}

export async function getStorefrontBlogPosts(locale: Locale, options?: {
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
    select: {
      id: true,
      cardTitle: true,
      cardTitleUz: true,
      cardTitleRu: true,
      cardTitleEn: true,
      excerpt: true,
      excerptUz: true,
      excerptRu: true,
      excerptEn: true,
      coverImage: true,
      publishDate: true,
      category: true,
      categoryUz: true,
      categoryRu: true,
      categoryEn: true,
      slug: true,
      featured: true,
      linkedProductId: true,
      linkedProduct: {
        select: blogPostLinkedProductSelect
      }
    }
  });

  return rows.map((row) => mapBlogPostCard(row, locale));
}

export async function getStorefrontFeaturedBlogPosts(locale: Locale, limit = 3) {
  return getStorefrontBlogPosts(locale, { featured: true, limit });
}

export async function getStorefrontBlogPost(locale: Locale, slug: string): Promise<StorefrontBlogPost | null> {
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
      media: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
      },
      dynamicSections: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
      }
    }
  });

  return row ? serializeBlogPost(row, locale) : null;
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
