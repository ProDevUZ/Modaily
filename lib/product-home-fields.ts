import type { ProductPayload } from "@/lib/admin-validators";

type ProductLike = {
  isBestseller?: boolean | null;
  homeSortOrder?: number | null;
  hidePrice?: boolean | null;
};

export function buildLegacyProductWriteData(payload: ProductPayload) {
  const {
    isBestseller,
    homeSortOrder,
    hidePrice,
    galleryImages,
    skinTypes,
    ...baseData
  } = payload;

  return baseData;
}

export function normalizeProductHomeFields<T extends ProductLike>(product: T) {
  return {
    ...product,
    isBestseller: Boolean(product.isBestseller),
    homeSortOrder: typeof product.homeSortOrder === "number" ? product.homeSortOrder : 0,
    hidePrice: Boolean(product.hidePrice)
  };
}

export function isUnsupportedProductHomeFieldError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return error.message.includes("isBestseller") || error.message.includes("homeSortOrder") || error.message.includes("hidePrice");
}
