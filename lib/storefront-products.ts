import { unstable_noStore as noStore } from "next/cache";

import { normalizeDisplayText } from "@/lib/display-text";
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
  categoryIds: string | null;
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
  imageUrl: string | null;
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
  categories: { id: string; slug: string; name: string }[];
  categorySlugs: string[];
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
  searchIndex: string;
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
  imageUrl: string | null;
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
    return normalizeDisplayText(
      locale === "uz" ? product.nameUz : locale === "ru" ? product.nameRu || product.nameEn : product.nameEn
    );
  }

  if (field === "shortDescription") {
    return normalizeDisplayText(
      locale === "uz"
        ? product.shortDescriptionUz || product.shortDescriptionEn || ""
        : locale === "ru"
          ? product.shortDescriptionRu || product.shortDescriptionEn || ""
          : product.shortDescriptionEn || ""
    );
  }

  if (field === "description") {
    return normalizeDisplayText(
      locale === "uz"
        ? product.descriptionUz || product.shortDescriptionUz || product.descriptionEn || product.shortDescriptionEn || ""
        : locale === "ru"
          ? product.descriptionRu || product.shortDescriptionRu || product.descriptionEn || product.shortDescriptionEn || ""
          : product.descriptionEn || product.shortDescriptionEn || ""
    );
  }

  if (field === "feature") {
    return normalizeDisplayText(
      locale === "uz"
        ? product.featureUz || product.descriptionUz || product.featureEn || product.descriptionEn || ""
        : locale === "ru"
          ? product.featureRu || product.descriptionRu || product.featureEn || product.descriptionEn || ""
          : product.featureEn || product.descriptionEn || ""
    );
  }

  if (field === "ingredients") {
    return normalizeDisplayText(
      locale === "uz"
        ? product.ingredientsUz || product.ingredientsEn || ""
        : locale === "ru"
          ? product.ingredientsRu || product.ingredientsEn || ""
          : product.ingredientsEn || ""
    );
  }

  if (field === "storeLocation") {
    return normalizeDisplayText(
      locale === "uz"
        ? product.storeLocationUz || product.storeLocationEn || ""
        : locale === "ru"
          ? product.storeLocationRu || product.storeLocationEn || ""
          : product.storeLocationEn || ""
    );
  }

  if (field === "storeContacts") {
    return normalizeDisplayText(
      locale === "uz"
        ? product.storeContactsUz || product.storeContactsEn || ""
        : locale === "ru"
          ? product.storeContactsRu || product.storeContactsEn || ""
          : product.storeContactsEn || ""
    );
  }

  return normalizeDisplayText(
    locale === "uz"
      ? product.usageUz || product.usageEn || ""
      : locale === "ru"
        ? product.usageRu || product.usageEn || ""
        : product.usageEn || ""
  );
}

function localizedCategoryName(category: ProductCategory, locale: Locale) {
  if (!category) {
    return "";
  }

  return locale === "uz" ? category.nameUz : locale === "ru" ? category.nameRu || category.nameEn : category.nameEn;
}

function resolveCategoryIds(product: ProductWithCategory) {
  const normalized = (product.categoryIds || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (product.category?.id && !normalized.includes(product.category.id)) {
    normalized.unshift(product.category.id);
  }

  return normalized.filter((entry, index, collection) => collection.indexOf(entry) === index);
}

function buildLocalizedCategories(
  product: ProductWithCategory,
  locale: Locale,
  categoriesById: Map<string, NonNullable<ProductCategory>>
) {
  return resolveCategoryIds(product)
    .map((categoryId) => categoriesById.get(categoryId))
    .filter((category): category is NonNullable<ProductCategory> => Boolean(category))
    .map((category) => ({
      id: category.id,
      slug: category.slug,
      name: localizedCategoryName(category, locale)
    }));
}

function buildSearchIndex(
  product: ProductWithCategory,
  categoriesById: Map<string, NonNullable<ProductCategory>>
) {
  const categoryTexts = resolveCategoryIds(product)
    .map((categoryId) => categoriesById.get(categoryId))
    .filter((category): category is NonNullable<ProductCategory> => Boolean(category))
    .flatMap((category) => [category.nameUz, category.nameRu, category.nameEn, category.slug]);

  return [
    product.sku,
    product.slug,
    product.nameUz,
    product.nameRu,
    product.nameEn,
    product.shortDescriptionUz,
    product.shortDescriptionRu,
    product.shortDescriptionEn,
    product.descriptionUz,
    product.descriptionRu,
    product.descriptionEn,
    ...categoryTexts
  ]
    .filter(Boolean)
    .join(" ");
}

function mapStorefrontProduct(
  product: ProductWithCategory,
  locale: Locale,
  categoriesById: Map<string, NonNullable<ProductCategory>>
): StorefrontProduct {
  const name = localizedProductValue(product, locale, "name");
  const shortDescription = localizedProductValue(product, locale, "shortDescription");
  const description = localizedProductValue(product, locale, "description");
  const localizedCategories = buildLocalizedCategories(product, locale, categoriesById);
  const primaryCategory = localizedCategories[0];

  return {
    id: product.id,
    sku: product.sku,
    slug: product.slug,
    category: primaryCategory?.name || localizedCategoryName(product.category, locale),
    categoryId: primaryCategory?.id || product.category?.id || "",
    categorySlug: primaryCategory?.slug || product.category?.slug || "",
    categories: localizedCategories,
    categorySlugs: localizedCategories.map((category) => category.slug),
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
    imageUrl: product.imageUrl || "",
    searchIndex: buildSearchIndex(product, categoriesById)
  };
}

async function getCategoriesById() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      slug: true,
      nameUz: true,
      nameRu: true,
      nameEn: true
    }
  });

  return new Map(categories.map((category) => [category.id, category]));
}

function mapReviews(reviews: ProductReviewRecord[]): StorefrontProductReview[] {
  return reviews.map((review) => ({
    id: review.id,
    authorName: review.authorName,
    body: review.body,
    imageUrl: review.imageUrl,
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

  return images;
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
  const categoriesById = await getCategoriesById();
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

  return products.map((product) => mapStorefrontProduct(product, locale, categoriesById));
}

export async function getStorefrontProduct(locale: Locale, slug: string) {
  noStore();
  const categoriesById = await getCategoriesById();
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

  return mapStorefrontProduct(product, locale, categoriesById);
}

export async function getStorefrontProductDetail(locale: Locale, slug: string) {
  noStore();
  const categoriesById = await getCategoriesById();
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

  const baseProduct = mapStorefrontProduct(product, locale, categoriesById);
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
  const categoriesById = await getCategoriesById();
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

  return recommendationLinks.map((entry) => mapStorefrontProduct(entry.recommendedProduct, locale, categoriesById));
}

export async function getStorefrontProductSlugs() {
  noStore();
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true }
  });

  return products.map((product) => product.slug);
}
