import type { ProductPayload } from "@/lib/admin-validators";

type ProductLike = {
  isBestseller?: boolean | null;
  homeSortOrder?: number | null;
};

export function buildLegacyProductWriteData(payload: ProductPayload) {
  const {
    isBestseller,
    homeSortOrder,
    ...baseData
  } = payload;

  return baseData;
}

export function normalizeProductHomeFields<T extends ProductLike>(product: T) {
  return {
    ...product,
    isBestseller: Boolean(product.isBestseller),
    homeSortOrder: typeof product.homeSortOrder === "number" ? product.homeSortOrder : 0
  };
}

export function isUnsupportedProductHomeFieldError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return error.message.includes("isBestseller") || error.message.includes("homeSortOrder");
}
