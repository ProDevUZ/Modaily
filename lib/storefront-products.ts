import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { buildProductBadges, type StorefrontProductBadge } from "@/lib/product-badges";

type LocalizedProductFields = {
  nameUz: string;
  nameRu: string;
  nameEn: string;
  shortDescriptionUz: string | null;
  shortDescriptionRu: string | null;
  shortDescriptionEn: string | null;
  descriptionUz: string | null;
  descriptionRu: string | null;
  descriptionEn: string | null;
  featureUz?: string | null;
  featureRu?: string | null;
  featureEn?: string | null;
  ingredientsUz?: string | null;
  ingredientsRu?: string | null;
  ingredientsEn?: string | null;
  usageUz?: string | null;
  usageRu?: string | null;
  usageEn?: string | null;
  storeLocationUz?: string | null;
  storeLocationRu?: string | null;
  storeLocationEn?: string | null;
  storeContactsUz?: string | null;
  storeContactsRu?: string | null;
  storeContactsEn?: string | null;
};

type ProductCategory = {
  id: string;
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
} | null;

type ProductWithCategory = {
  id: string;
  sku: string;
  slug: string;
  skinTypes: string | null;
  size: string | null;
  price: number;
  discountAmount: number;
  hidePrice: boolean;
  stock: number;
  isHit: boolean;
  isNew: boolean;
  colorFrom: string | null;
  colorTo: string | null;
  imageUrl: string | null;
  storeImageUrl: string | null;
  category: ProductCategory;
} & LocalizedProductFields;

type ProductReviewRecord = {
  id: string;
  authorName: string;
  body: string;
  rating: number;
  createdAt: Date;
};

type ProductGalleryRecord = {
  id: string;
  type: "IMAGE" | "VIDEO";
  imageUrl: string | null;
  videoUrl: string | null;
  sortOrder: number;
};

export type StorefrontProduct = {
  id: string;
  sku: string;
  slug: string;
  category: string;
  categoryId: string;
  categorySlug: string;
  skinTypes: string[];
  size: string;
  price: number;
  discountAmount: number;
  hidePrice: boolean;
  stock: number;
  colors: [string, string];
  badges: StorefrontProductBadge[];
  name: string;
  shortName: string;
  shortDescription: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  imageUrl: string;
};

export type StorefrontProductGalleryItem = {
  id: string;
  type: "IMAGE" | "VIDEO";
  imageUrl: string;
  videoUrl: string;
};

export type StorefrontProductReview = {
  id: string;
  authorName: string;
  body: string;
  rating: number;
  createdAt: string;
};

export type StorefrontProductStore = {
  imageUrl: string;
  location: string;
  contacts: string;
};

export type StorefrontProductDetail = StorefrontProduct & {
  feature: string;
  ingredients: string;
  usage: string;
  store: StorefrontProductStore | null;
  media: StorefrontProductGalleryItem[];
  reviews: StorefrontProductReview[];
  reviewCount: number;
  averageRating: number;
};

function localizedProductValue(
  product: LocalizedProductFields,
  locale: Locale,
  field: "name" | "shortDescription" | "description" | "feature" | "ingredients" | "usage" | "storeLocation" | "storeContacts"
) {
  if (field === "name") {
    return locale === "uz" ? product.nameUz : locale === "ru" ? product.nameRu || product.nameEn : product.nameEn;
  }

  if (field === "shortDescription") {
    return locale === "uz"
      ? product.shortDescriptionUz || product.shortDescriptionEn || ""
      : locale === "ru"
        ? product.shortDescriptionRu || product.shortDescriptionEn || ""
        : product.shortDescriptionEn || "";
  }

  if (field === "description") {
    return locale === "uz"
      ? product.descriptionUz || product.shortDescriptionUz || product.descriptionEn || product.shortDescriptionEn || ""
      : locale === "ru"
        ? product.descriptionRu || product.shortDescriptionRu || product.descriptionEn || product.shortDescriptionEn || ""
        : product.descriptionEn || product.shortDescriptionEn || "";
  }

  if (field === "feature") {
    return locale === "uz"
      ? product.featureUz || product.descriptionUz || product.featureEn || product.descriptionEn || ""
      : locale === "ru"
        ? product.featureRu || product.descriptionRu || product.featureEn || product.descriptionEn || ""
        : product.featureEn || product.descriptionEn || "";
  }

  if (field === "ingredients") {
    return locale === "uz"
      ? product.ingredientsUz || product.ingredientsEn || ""
      : locale === "ru"
        ? product.ingredientsRu || product.ingredientsEn || ""
        : product.ingredientsEn || "";
  }

  if (field === "storeLocation") {
    return locale === "uz"
      ? product.storeLocationUz || product.storeLocationEn || ""
      : locale === "ru"
        ? product.storeLocationRu || product.storeLocationEn || ""
        : product.storeLocationEn || "";
  }

  if (field === "storeContacts") {
    return locale === "uz"
      ? product.storeContactsUz || product.storeContactsEn || ""
      : locale === "ru"
        ? product.storeContactsRu || product.storeContactsEn || ""
        : product.storeContactsEn || "";
  }

  return locale === "uz"
    ? product.usageUz || product.usageEn || ""
    : locale === "ru"
      ? product.usageRu || product.usageEn || ""
      : product.usageEn || "";
}

function localizedCategoryName(category: ProductCategory, locale: Locale) {
  if (!category) {
    return "";
  }

  return locale === "uz" ? category.nameUz : locale === "ru" ? category.nameRu || category.nameEn : category.nameEn;
}

function mapStorefrontProduct(product: ProductWithCategory, locale: Locale): StorefrontProduct {
  const name = localizedProductValue(product, locale, "name");
  const shortDescription = localizedProductValue(product, locale, "shortDescription");
  const description = localizedProductValue(product, locale, "description");

  return {
    id: product.id,
    sku: product.sku,
    slug: product.slug,
    category: localizedCategoryName(product.category, locale),
    categoryId: product.category?.id || "",
    categorySlug: product.category?.slug || "",
    skinTypes: product.skinTypes ? product.skinTypes.split(",").map((entry) => entry.trim()).filter(Boolean) : [],
    size: product.size || "",
    price: product.price,
    discountAmount: product.discountAmount,
    hidePrice: product.hidePrice,
    stock: product.stock,
    colors: [product.colorFrom || "#ece6df", product.colorTo || "#f7f4ef"],
    badges: buildProductBadges(product, locale),
    name,
    shortName: name,
    shortDescription,
    description,
    metaTitle: `${name} | Modaily`,
    metaDescription: shortDescription || description,
    h1: name,
    imageUrl: product.imageUrl || ""
  };
}

function mapReviews(reviews: ProductReviewRecord[]): StorefrontProductReview[] {
  return reviews.map((review) => ({
    id: review.id,
    authorName: review.authorName,
    body: review.body,
    rating: review.rating,
    createdAt: review.createdAt.toISOString()
  }));
}

function buildGallery(primaryImage: string | null, galleryImages: ProductGalleryRecord[]) {
  const seen = new Set<string>();
  const images: StorefrontProductGalleryItem[] = [];

  if (primaryImage) {
    images.push({ id: "primary-image", type: "IMAGE", imageUrl: primaryImage, videoUrl: "" });
    seen.add(`IMAGE:${primaryImage}`);
  }

  for (const image of galleryImages) {
    const mediaType = image.type === "VIDEO" && image.videoUrl ? "VIDEO" : "IMAGE";
    const mediaKey = mediaType === "VIDEO" ? image.videoUrl : image.imageUrl;

    if (!mediaKey) {
      continue;
    }

    const seenKey = `${mediaType}:${mediaKey}`;

    if (seen.has(seenKey)) {
      continue;
    }

    images.push({
      id: image.id,
      type: mediaType,
      imageUrl: image.imageUrl || "",
      videoUrl: image.videoUrl || ""
    });
    seen.add(seenKey);
  }

  if (images.length === 0) {
    images.push({
      id: "fallback-image",
      type: "IMAGE",
      imageUrl: "",
      videoUrl: ""
    });
  }

  return images.slice(0, 6);
}

function calculateAverageRating(reviews: ProductReviewRecord[]) {
  if (reviews.length === 0) {
    return 0;
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

function buildStoreInfo(product: ProductWithCategory, locale: Locale): StorefrontProductStore | null {
  const location = localizedProductValue(product, locale, "storeLocation");
  const contacts = localizedProductValue(product, locale, "storeContacts");
  const imageUrl = product.storeImageUrl || "";

  return {
    imageUrl,
    location,
    contacts
  };
}

export async function getStorefrontProducts(locale: Locale) {
  noStore();
  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      category: {
        select: {
          id: true,
          slug: true,
          nameUz: true,
          nameRu: true,
          nameEn: true
        }
      }
    },
    orderBy: [{ homeSortOrder: "asc" }, { createdAt: "asc" }]
  });

  return products.map((product) => mapStorefrontProduct(product, locale));
}

export async function getStorefrontProduct(locale: Locale, slug: string) {
  noStore();
  const product = await prisma.product.findFirst({
    where: {
      slug,
      active: true
    },
    include: {
      category: {
        select: {
          id: true,
          slug: true,
          nameUz: true,
          nameRu: true,
          nameEn: true
        }
      }
    }
  });

  if (!product) {
    return null;
  }

  return mapStorefrontProduct(product, locale);
}

export async function getStorefrontProductDetail(locale: Locale, slug: string) {
  noStore();
  const product = await prisma.product.findFirst({
    where: {
      slug,
      active: true
    },
    include: {
      category: {
        select: {
          id: true,
          slug: true,
          nameUz: true,
          nameRu: true,
          nameEn: true
        }
      },
      galleryImages: {
        orderBy: {
          sortOrder: "asc"
        }
      },
      reviews: {
        where: {
          active: true
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!product) {
    return null;
  }

  const baseProduct = mapStorefrontProduct(product, locale);
  const media = buildGallery(product.imageUrl, product.galleryImages);
  const reviews = mapReviews(product.reviews);

  return {
    ...baseProduct,
    feature: localizedProductValue(product, locale, "feature"),
    ingredients: localizedProductValue(product, locale, "ingredients"),
    usage: localizedProductValue(product, locale, "usage"),
    store: buildStoreInfo(product, locale),
    media,
    reviews,
    reviewCount: reviews.length,
    averageRating: calculateAverageRating(product.reviews)
  } satisfies StorefrontProductDetail;
}

export async function getRecommendedProducts(locale: Locale, currentProductId: string, categoryId: string) {
  noStore();
  const recommendationLinks = await prisma.productRecommendation.findMany({
    where: {
      sourceProductId: currentProductId,
      recommendedProduct: {
        active: true
      }
    },
    include: {
      recommendedProduct: {
        include: {
          category: {
            select: {
              id: true,
              slug: true,
              nameUz: true,
              nameRu: true,
              nameEn: true
            }
          }
        }
      }
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
  });

  return recommendationLinks.map((entry) => mapStorefrontProduct(entry.recommendedProduct, locale));
}

export async function getStorefrontProductSlugs() {
  noStore();
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true }
  });

  return products.map((product) => product.slug);
}
