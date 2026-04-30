export function normalizeProductCategoryLinkIds(categoryLinkIds: string[], fallbackCategoryId?: string | null) {
  const normalized = categoryLinkIds.map((entry) => entry.trim()).filter(Boolean);
  const fallback = fallbackCategoryId?.trim();

  if (fallback && !normalized.includes(fallback)) {
    normalized.unshift(fallback);
  }

  return normalized.filter((entry, index, collection) => collection.indexOf(entry) === index);
}

export function buildProductCategoryLinkCreateData(categoryLinkIds: string[], fallbackCategoryId?: string | null) {
  return normalizeProductCategoryLinkIds(categoryLinkIds, fallbackCategoryId).map((categoryId, sortOrder) => ({
    categoryId,
    sortOrder
  }));
}
