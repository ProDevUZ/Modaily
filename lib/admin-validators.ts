type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type UserPayload = {
  fullName: string;
  email: string;
  phone: string | null;
  city: string | null;
  notes: string | null;
};

export type CategoryPayload = {
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  descriptionUz: string | null;
  descriptionRu: string | null;
  descriptionEn: string | null;
};

export type ProductPayload = {
  sku: string;
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  shortDescriptionUz: string | null;
  shortDescriptionRu: string | null;
  shortDescriptionEn: string | null;
  descriptionUz: string | null;
  descriptionRu: string | null;
  descriptionEn: string | null;
  size: string | null;
  price: number;
  stock: number;
  active: boolean;
  colorFrom: string | null;
  colorTo: string | null;
  categoryId: string;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asOptionalString(value: unknown) {
  const normalized = asString(value);
  return normalized.length > 0 ? normalized : null;
}

function asBoolean(value: unknown) {
  return value === true || value === "true" || value === "on";
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateUserPayload(body: unknown): ValidationResult<UserPayload> {
  const payload = body as Record<string, unknown>;

  const fullName = asString(payload.fullName);
  const email = asString(payload.email).toLowerCase();

  if (!fullName) {
    return { success: false, error: "Full name is required." };
  }

  if (!email || !email.includes("@")) {
    return { success: false, error: "Valid email is required." };
  }

  return {
    success: true,
    data: {
      fullName,
      email,
      phone: asOptionalString(payload.phone),
      city: asOptionalString(payload.city),
      notes: asOptionalString(payload.notes)
    }
  };
}

export function validateCategoryPayload(body: unknown): ValidationResult<CategoryPayload> {
  const payload = body as Record<string, unknown>;

  const nameUz = asString(payload.nameUz);
  const nameRu = asString(payload.nameRu);
  const nameEn = asString(payload.nameEn);
  const rawSlug = asString(payload.slug) || nameEn;
  const slug = toSlug(rawSlug);

  if (!nameUz || !nameRu || !nameEn) {
    return { success: false, error: "All category names are required." };
  }

  if (!slug) {
    return { success: false, error: "Category slug is required." };
  }

  return {
    success: true,
    data: {
      slug,
      nameUz,
      nameRu,
      nameEn,
      descriptionUz: asOptionalString(payload.descriptionUz),
      descriptionRu: asOptionalString(payload.descriptionRu),
      descriptionEn: asOptionalString(payload.descriptionEn)
    }
  };
}

export function validateProductPayload(body: unknown): ValidationResult<ProductPayload> {
  const payload = body as Record<string, unknown>;

  const sku = asString(payload.sku).toUpperCase();
  const slug = toSlug(asString(payload.slug) || asString(payload.nameEn));
  const nameUz = asString(payload.nameUz);
  const nameRu = asString(payload.nameRu);
  const nameEn = asString(payload.nameEn);
  const price = Number(payload.price);
  const stock = Number(payload.stock);
  const categoryId = asString(payload.categoryId);

  if (!sku || !slug) {
    return { success: false, error: "SKU and slug are required." };
  }

  if (!nameUz || !nameRu || !nameEn) {
    return { success: false, error: "All product names are required." };
  }

  if (!Number.isFinite(price) || price < 0) {
    return { success: false, error: "Price must be a valid non-negative number." };
  }

  if (!Number.isFinite(stock) || stock < 0) {
    return { success: false, error: "Stock must be a valid non-negative number." };
  }

  if (!categoryId) {
    return { success: false, error: "Category is required." };
  }

  return {
    success: true,
    data: {
      sku,
      slug,
      nameUz,
      nameRu,
      nameEn,
      shortDescriptionUz: asOptionalString(payload.shortDescriptionUz),
      shortDescriptionRu: asOptionalString(payload.shortDescriptionRu),
      shortDescriptionEn: asOptionalString(payload.shortDescriptionEn),
      descriptionUz: asOptionalString(payload.descriptionUz),
      descriptionRu: asOptionalString(payload.descriptionRu),
      descriptionEn: asOptionalString(payload.descriptionEn),
      size: asOptionalString(payload.size),
      price: Math.round(price),
      stock: Math.round(stock),
      active: asBoolean(payload.active),
      colorFrom: asOptionalString(payload.colorFrom),
      colorTo: asOptionalString(payload.colorTo),
      categoryId
    }
  };
}
