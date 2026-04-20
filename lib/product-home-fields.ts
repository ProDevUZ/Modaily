import type { ProductPayload } from "@/lib/admin-validators";

type ProductLike = {
  isBestseller?: boolean | null;
  homeSortOrder?: number | null;
  hidePrice?: boolean | null;
  discountAmount?: number | null;
  isHit?: boolean | null;
  isNew?: boolean | null;
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
    ...baseData
  } = payload;

  return baseData;
}

export function normalizeProductHomeFields<T extends ProductLike>(product: T) {
  return {
    ...product,
    isBestseller: Boolean(product.isBestseller),
    homeSortOrder: typeof product.homeSortOrder === "number" ? product.homeSortOrder : 0,
    hidePrice: Boolean(product.hidePrice),
    discountAmount: typeof product.discountAmount === "number" ? product.discountAmount : 0,
    isHit: Boolean(product.isHit),
    isNew: Boolean(product.isNew)
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
    error.message.includes("storeContacts")
  );
}
