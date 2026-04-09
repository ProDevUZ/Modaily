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
  featureUz: string | null;
  featureRu: string | null;
  featureEn: string | null;
  ingredientsUz: string | null;
  ingredientsRu: string | null;
  ingredientsEn: string | null;
  usageUz: string | null;
  usageRu: string | null;
  usageEn: string | null;
  storeImageUrl: string | null;
  storeLocationUz: string | null;
  storeLocationRu: string | null;
  storeLocationEn: string | null;
  storeContactsUz: string | null;
  storeContactsRu: string | null;
  storeContactsEn: string | null;
  skinTypes: string | null;
  size: string | null;
  price: number;
  hidePrice: boolean;
  stock: number;
  active: boolean;
  isBestseller: boolean;
  homeSortOrder: number;
  imageUrl: string | null;
  colorFrom: string | null;
  colorTo: string | null;
  categoryId: string;
  galleryImages: {
    imageUrl: string;
    sortOrder: number;
  }[];
};

export type SiteSettingsPayload = {
  brandName: string;
  hideCommerce: boolean;
  announcementTextUz: string | null;
  announcementTextRu: string | null;
  announcementTextEn: string | null;
  announcementLinkLabelUz: string | null;
  announcementLinkLabelRu: string | null;
  announcementLinkLabelEn: string | null;
  announcementLink: string | null;
  footerPhone: string | null;
  footerEmail: string | null;
  footerTelegram: string | null;
  footerTelegramLink: string | null;
  footerInstagram: string | null;
  footerInstagramLink: string | null;
  storeAddress: string | null;
  storeMapLink: string | null;
  footerAddressUz: string | null;
  footerAddressRu: string | null;
  footerAddressEn: string | null;
  newsletterTitleUz: string | null;
  newsletterTitleRu: string | null;
  newsletterTitleEn: string | null;
  newsletterPlaceholderUz: string | null;
  newsletterPlaceholderRu: string | null;
  newsletterPlaceholderEn: string | null;
};

export type HomeHeroPayload = {
  badgeUz: string | null;
  badgeRu: string | null;
  badgeEn: string | null;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descriptionUz: string | null;
  descriptionRu: string | null;
  descriptionEn: string | null;
  primaryCtaUz: string | null;
  primaryCtaRu: string | null;
  primaryCtaEn: string | null;
  primaryCtaLink: string | null;
  secondaryCtaUz: string | null;
  secondaryCtaRu: string | null;
  secondaryCtaEn: string | null;
  secondaryCtaLink: string | null;
  imageUrl: string | null;
};

export type HomePromoCardPayload = {
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descriptionUz: string | null;
  descriptionRu: string | null;
  descriptionEn: string | null;
  buttonLabelUz: string | null;
  buttonLabelRu: string | null;
  buttonLabelEn: string | null;
  buttonLink: string | null;
  imageUrl: string | null;
  sortOrder: number;
  active: boolean;
};

export type HomeAboutPayload = {
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descriptionUz: string | null;
  descriptionRu: string | null;
  descriptionEn: string | null;
  secondaryTitleUz: string | null;
  secondaryTitleRu: string | null;
  secondaryTitleEn: string | null;
  secondaryDescriptionUz: string | null;
  secondaryDescriptionRu: string | null;
  secondaryDescriptionEn: string | null;
  bottomDescriptionUz: string | null;
  bottomDescriptionRu: string | null;
  bottomDescriptionEn: string | null;
  imageUrl: string | null;
};

export type GalleryItemPayload = {
  type: "IMAGE" | "VIDEO";
  titleUz: string | null;
  titleRu: string | null;
  titleEn: string | null;
  descriptionUz: string | null;
  descriptionRu: string | null;
  descriptionEn: string | null;
  imageUrl: string;
  videoUrl: string | null;
  sortOrder: number;
  active: boolean;
};

export type TestimonialPayload = {
  authorName: string;
  authorRoleUz: string | null;
  authorRoleRu: string | null;
  authorRoleEn: string | null;
  productNameUz: string | null;
  productNameRu: string | null;
  productNameEn: string | null;
  bodyUz: string;
  bodyRu: string;
  bodyEn: string;
  avatarUrl: string | null;
  rating: number;
  sortOrder: number;
  active: boolean;
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

function asInteger(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : fallback;
}

function asSkinTypes(value: unknown) {
  if (!Array.isArray(value)) {
    return null;
  }

  const normalized = value
    .map((entry) => asString(entry))
    .filter(Boolean)
    .filter((entry, index, array) => array.indexOf(entry) === index);

  return normalized.length > 0 ? normalized.join(",") : null;
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

  const galleryImages = Array.isArray(payload.galleryImages)
    ? payload.galleryImages
        .map((entry, index) => {
          if (!entry || typeof entry !== "object") {
            return null;
          }

          const row = entry as Record<string, unknown>;
          const imageUrl = asString(row.imageUrl);

          if (!imageUrl) {
            return null;
          }

          return {
            imageUrl,
            sortOrder: asInteger(row.sortOrder, index)
          };
        })
        .filter((entry): entry is { imageUrl: string; sortOrder: number } => entry !== null)
    : [];

  if (galleryImages.length > 6) {
    return { success: false, error: "Gallery can contain maximum 6 images." };
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
      featureUz: asOptionalString(payload.featureUz),
      featureRu: asOptionalString(payload.featureRu),
      featureEn: asOptionalString(payload.featureEn),
      ingredientsUz: asOptionalString(payload.ingredientsUz),
      ingredientsRu: asOptionalString(payload.ingredientsRu),
      ingredientsEn: asOptionalString(payload.ingredientsEn),
      usageUz: asOptionalString(payload.usageUz),
      usageRu: asOptionalString(payload.usageRu),
      usageEn: asOptionalString(payload.usageEn),
      storeImageUrl: asOptionalString(payload.storeImageUrl),
      storeLocationUz: asOptionalString(payload.storeLocationUz),
      storeLocationRu: asOptionalString(payload.storeLocationRu),
      storeLocationEn: asOptionalString(payload.storeLocationEn),
      storeContactsUz: asOptionalString(payload.storeContactsUz),
      storeContactsRu: asOptionalString(payload.storeContactsRu),
      storeContactsEn: asOptionalString(payload.storeContactsEn),
      skinTypes: asSkinTypes(payload.skinTypes),
      size: asOptionalString(payload.size),
      price: Math.round(price),
      hidePrice: asBoolean(payload.hidePrice),
      stock: Math.round(stock),
      active: asBoolean(payload.active),
      isBestseller: asBoolean(payload.isBestseller),
      homeSortOrder: asInteger(payload.homeSortOrder),
      imageUrl: asOptionalString(payload.imageUrl),
      colorFrom: asOptionalString(payload.colorFrom),
      colorTo: asOptionalString(payload.colorTo),
      categoryId,
      galleryImages
    }
  };
}

export function validateSiteSettingsPayload(body: unknown): ValidationResult<SiteSettingsPayload> {
  const payload = body as Record<string, unknown>;

  return {
    success: true,
    data: {
      brandName: asString(payload.brandName) || "Modaily",
      hideCommerce: asBoolean(payload.hideCommerce),
      announcementTextUz: asOptionalString(payload.announcementTextUz),
      announcementTextRu: asOptionalString(payload.announcementTextRu),
      announcementTextEn: asOptionalString(payload.announcementTextEn),
      announcementLinkLabelUz: asOptionalString(payload.announcementLinkLabelUz),
      announcementLinkLabelRu: asOptionalString(payload.announcementLinkLabelRu),
      announcementLinkLabelEn: asOptionalString(payload.announcementLinkLabelEn),
      announcementLink: asOptionalString(payload.announcementLink),
      footerPhone: asOptionalString(payload.footerPhone),
      footerEmail: asOptionalString(payload.footerEmail),
      footerTelegram: asOptionalString(payload.footerTelegram),
      footerTelegramLink: asOptionalString(payload.footerTelegramLink),
      footerInstagram: asOptionalString(payload.footerInstagram),
      footerInstagramLink: asOptionalString(payload.footerInstagramLink),
      storeAddress: asOptionalString(payload.storeAddress),
      storeMapLink: asOptionalString(payload.storeMapLink),
      footerAddressUz: asOptionalString(payload.footerAddressUz),
      footerAddressRu: asOptionalString(payload.footerAddressRu),
      footerAddressEn: asOptionalString(payload.footerAddressEn),
      newsletterTitleUz: asOptionalString(payload.newsletterTitleUz),
      newsletterTitleRu: asOptionalString(payload.newsletterTitleRu),
      newsletterTitleEn: asOptionalString(payload.newsletterTitleEn),
      newsletterPlaceholderUz: asOptionalString(payload.newsletterPlaceholderUz),
      newsletterPlaceholderRu: asOptionalString(payload.newsletterPlaceholderRu),
      newsletterPlaceholderEn: asOptionalString(payload.newsletterPlaceholderEn)
    }
  };
}

export function validateHomeHeroPayload(body: unknown): ValidationResult<HomeHeroPayload> {
  const payload = body as Record<string, unknown>;
  const titleUz = asString(payload.titleUz);
  const titleRu = asString(payload.titleRu);
  const titleEn = asString(payload.titleEn);

  if (!titleUz || !titleRu || !titleEn) {
    return { success: false, error: "All hero titles are required." };
  }

  return {
    success: true,
    data: {
      badgeUz: asOptionalString(payload.badgeUz),
      badgeRu: asOptionalString(payload.badgeRu),
      badgeEn: asOptionalString(payload.badgeEn),
      titleUz,
      titleRu,
      titleEn,
      descriptionUz: asOptionalString(payload.descriptionUz),
      descriptionRu: asOptionalString(payload.descriptionRu),
      descriptionEn: asOptionalString(payload.descriptionEn),
      primaryCtaUz: asOptionalString(payload.primaryCtaUz),
      primaryCtaRu: asOptionalString(payload.primaryCtaRu),
      primaryCtaEn: asOptionalString(payload.primaryCtaEn),
      primaryCtaLink: asOptionalString(payload.primaryCtaLink),
      secondaryCtaUz: asOptionalString(payload.secondaryCtaUz),
      secondaryCtaRu: asOptionalString(payload.secondaryCtaRu),
      secondaryCtaEn: asOptionalString(payload.secondaryCtaEn),
      secondaryCtaLink: asOptionalString(payload.secondaryCtaLink),
      imageUrl: asOptionalString(payload.imageUrl)
    }
  };
}

export function validateHomePromoCardPayload(body: unknown): ValidationResult<HomePromoCardPayload> {
  const payload = body as Record<string, unknown>;
  const titleUz = asString(payload.titleUz);
  const titleRu = asString(payload.titleRu);
  const titleEn = asString(payload.titleEn);

  if (!titleUz || !titleRu || !titleEn) {
    return { success: false, error: "All promo card titles are required." };
  }

  return {
    success: true,
    data: {
      titleUz,
      titleRu,
      titleEn,
      descriptionUz: asOptionalString(payload.descriptionUz),
      descriptionRu: asOptionalString(payload.descriptionRu),
      descriptionEn: asOptionalString(payload.descriptionEn),
      buttonLabelUz: asOptionalString(payload.buttonLabelUz),
      buttonLabelRu: asOptionalString(payload.buttonLabelRu),
      buttonLabelEn: asOptionalString(payload.buttonLabelEn),
      buttonLink: asOptionalString(payload.buttonLink),
      imageUrl: asOptionalString(payload.imageUrl),
      sortOrder: asInteger(payload.sortOrder),
      active: asBoolean(payload.active)
    }
  };
}

export function validateHomeAboutPayload(body: unknown): ValidationResult<HomeAboutPayload> {
  const payload = body as Record<string, unknown>;
  const titleUz = asString(payload.titleUz);
  const titleRu = asString(payload.titleRu);
  const titleEn = asString(payload.titleEn);

  if (!titleUz || !titleRu || !titleEn) {
    return { success: false, error: "All about section titles are required." };
  }

  return {
    success: true,
    data: {
      titleUz,
      titleRu,
      titleEn,
      descriptionUz: asOptionalString(payload.descriptionUz),
      descriptionRu: asOptionalString(payload.descriptionRu),
      descriptionEn: asOptionalString(payload.descriptionEn),
      secondaryTitleUz: asOptionalString(payload.secondaryTitleUz),
      secondaryTitleRu: asOptionalString(payload.secondaryTitleRu),
      secondaryTitleEn: asOptionalString(payload.secondaryTitleEn),
      secondaryDescriptionUz: asOptionalString(payload.secondaryDescriptionUz),
      secondaryDescriptionRu: asOptionalString(payload.secondaryDescriptionRu),
      secondaryDescriptionEn: asOptionalString(payload.secondaryDescriptionEn),
      bottomDescriptionUz: asOptionalString(payload.bottomDescriptionUz),
      bottomDescriptionRu: asOptionalString(payload.bottomDescriptionRu),
      bottomDescriptionEn: asOptionalString(payload.bottomDescriptionEn),
      imageUrl: asOptionalString(payload.imageUrl)
    }
  };
}

export function validateGalleryItemPayload(body: unknown): ValidationResult<GalleryItemPayload> {
  const payload = body as Record<string, unknown>;
  const type = asString(payload.type).toUpperCase();
  const imageUrl = asString(payload.imageUrl);
  const videoUrl = asOptionalString(payload.videoUrl);

  if (type !== "IMAGE" && type !== "VIDEO") {
    return { success: false, error: "Gallery item type must be IMAGE or VIDEO." };
  }

  if (type === "IMAGE" && !imageUrl) {
    return { success: false, error: "Gallery item image URL is required." };
  }

  if (type === "VIDEO" && !videoUrl) {
    return { success: false, error: "Gallery video URL is required." };
  }

  return {
    success: true,
    data: {
      type,
      titleUz: asOptionalString(payload.titleUz),
      titleRu: asOptionalString(payload.titleRu),
      titleEn: asOptionalString(payload.titleEn),
      descriptionUz: asOptionalString(payload.descriptionUz),
      descriptionRu: asOptionalString(payload.descriptionRu),
      descriptionEn: asOptionalString(payload.descriptionEn),
      imageUrl: type === "VIDEO" ? imageUrl : imageUrl,
      videoUrl,
      sortOrder: asInteger(payload.sortOrder),
      active: asBoolean(payload.active)
    }
  };
}

export function validateTestimonialPayload(body: unknown): ValidationResult<TestimonialPayload> {
  const payload = body as Record<string, unknown>;
  const authorName = asString(payload.authorName);
  const bodyUz = asString(payload.bodyUz);
  const bodyRu = asString(payload.bodyRu);
  const bodyEn = asString(payload.bodyEn);
  const rating = asInteger(payload.rating, 5);

  if (!authorName) {
    return { success: false, error: "Author name is required." };
  }

  if (!bodyUz || !bodyRu || !bodyEn) {
    return { success: false, error: "All testimonial texts are required." };
  }

  if (rating < 1 || rating > 5) {
    return { success: false, error: "Rating must be between 1 and 5." };
  }

  return {
    success: true,
    data: {
      authorName,
      authorRoleUz: asOptionalString(payload.authorRoleUz),
      authorRoleRu: asOptionalString(payload.authorRoleRu),
      authorRoleEn: asOptionalString(payload.authorRoleEn),
      productNameUz: asOptionalString(payload.productNameUz),
      productNameRu: asOptionalString(payload.productNameRu),
      productNameEn: asOptionalString(payload.productNameEn),
      bodyUz,
      bodyRu,
      bodyEn,
      avatarUrl: asOptionalString(payload.avatarUrl),
      rating,
      sortOrder: asInteger(payload.sortOrder),
      active: asBoolean(payload.active)
    }
  };
}
