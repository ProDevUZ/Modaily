import type { ProductPayload } from "@/lib/admin-validators";

type ProductLike = {
  categoryId?: string | null;
  categoryIds?: string | null;
  isBestseller?: boolean | null;
  homeSortOrder?: number | null;
  hidePrice?: boolean | null;
  discountAmount?: number | null;
  isHit?: boolean | null;
  isNew?: boolean | null;
  recommendationLinks?: { recommendedProductId: string; sortOrder?: number | null }[] | null;
};

export function buildLegacyProductWriteData(payload: ProductPayload) {
  const {
    isBestseller,
    homeSortOrder,
    hidePrice,
    discountAmount,
    isHit,
    isNew,
    galleryImages,
    skinTypes,
    storeImageUrl,
    storeLocationUz,
    storeLocationRu,
    storeLocationEn,
    storeContactsUz,
    storeContactsRu,
    storeContactsEn,
    recommendedProductIds,
    ...baseData
  } = payload;

  return baseData;
}

export function normalizeProductHomeFields<T extends ProductLike>(product: T) {
  const categoryIds = typeof product.categoryIds === "string"
    ? product.categoryIds
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
    : [];
  const recommendedProductIds = Array.isArray(product.recommendationLinks)
    ? [...product.recommendationLinks]
        .sort((first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0))
        .map((entry) => entry.recommendedProductId)
    : [];

  return {
    ...product,
    categoryIds: categoryIds.length > 0 ? categoryIds : product.categoryId ? [product.categoryId] : [],
    isBestseller: Boolean(product.isBestseller),
    homeSortOrder: typeof product.homeSortOrder === "number" ? product.homeSortOrder : 0,
    hidePrice: Boolean(product.hidePrice),
    discountAmount: typeof product.discountAmount === "number" ? product.discountAmount : 0,
    isHit: Boolean(product.isHit),
    isNew: Boolean(product.isNew),
    recommendedProductIds
  };
}

export function isUnsupportedProductHomeFieldError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes("isBestseller") ||
    error.message.includes("homeSortOrder") ||
    error.message.includes("hidePrice") ||
    error.message.includes("discountAmount") ||
    error.message.includes("isHit") ||
    error.message.includes("isNew") ||
    error.message.includes("storeImageUrl") ||
    error.message.includes("storeLocation") ||
    error.message.includes("storeContacts") ||
    error.message.includes("recommendationLinks")
  );
}
