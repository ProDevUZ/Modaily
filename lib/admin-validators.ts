import { slugifyText } from "@/lib/slugify";

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

export type ContactMessagePayload = {
  fullName: string;
  phone: string;
  message: string | null;
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

export type SkinTypeOptionPayload = {
  value: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
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
  categoryLinkIds: string[];
  size: string | null;
  packageWidth: string | null;
  packageHeight: string | null;
  price: number;
  discountAmount: number;
  hidePrice: boolean;
  stock: number;
  active: boolean;
  isBestseller: boolean;
  isHit: boolean;
  isNew: boolean;
  homeSortOrder: number;
  imageUrl: string | null;
  colorFrom: string | null;
  colorTo: string | null;
  categoryId: string;
  recommendedProductIds: string[];
  galleryImages: {
    type: "IMAGE" | "VIDEO";
    imageUrl: string | null;
    videoUrl: string | null;
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
  aboutTitleUz: string | null;
  aboutTitleRu: string | null;
  aboutTitleEn: string | null;
  aboutDescriptionUz: string | null;
  aboutDescriptionRu: string | null;
  aboutDescriptionEn: string | null;
  aboutBrandTitleUz: string | null;
  aboutBrandTitleRu: string | null;
  aboutBrandTitleEn: string | null;
  aboutPanelDescriptionUz: string | null;
  aboutPanelDescriptionRu: string | null;
  aboutPanelDescriptionEn: string | null;
  aboutPanelSecondaryDescriptionUz: string | null;
  aboutPanelSecondaryDescriptionRu: string | null;
  aboutPanelSecondaryDescriptionEn: string | null;
  aboutImageUrl: string | null;
  newsletterTitleUz: string | null;
  newsletterTitleRu: string | null;
  newsletterTitleEn: string | null;
  newsletterPlaceholderUz: string | null;
  newsletterPlaceholderRu: string | null;
  newsletterPlaceholderEn: string | null;
};

export type ShopWorkingHourPayload = {
  label: string | null;
  value: string;
  sortOrder: number;
};

export type ShopLocationPayload = {
  address: string;
  mapLink: string | null;
  active: boolean;
  sortOrder: number;
  workingHours: ShopWorkingHourPayload[];
};

export type HomeHeroPayload = {
  imageUrl: string | null;
  imageUrlUz: string | null;
  imageUrlRu: string | null;
  imageUrlEn: string | null;
  mobileImageUrl: string | null;
  mobileImageUrlUz: string | null;
  mobileImageUrlRu: string | null;
  mobileImageUrlEn: string | null;
  heroProductId: string | null;
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
  promoProductId: string | null;
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

export type GallerySectionHeadingPayload = {
  type: "IMAGE" | "VIDEO";
  textUz: string | null;
  textRu: string | null;
  textEn: string | null;
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

export type BlogPostSectionPayload = {
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  sortOrder: number;
};

export type BlogPostMediaPayload = {
  type: "IMAGE" | "VIDEO";
  imageUrl: string | null;
  videoUrl: string | null;
  sortOrder: number;
};

export type BlogPostPayload = {
  cardTitle: string;
  cardTitleUz: string;
  cardTitleRu: string;
  cardTitleEn: string;
  excerpt: string;
  excerptUz: string;
  excerptRu: string;
  excerptEn: string;
  coverImage: string;
  media: BlogPostMediaPayload[];
  publishDate: Date;
  category: string;
  categoryUz: string;
  categoryRu: string;
  categoryEn: string;
  slug: string;
  featured: boolean;
  linkedProductId: string | null;
  mainTitle: string;
  mainTitleUz: string;
  mainTitleRu: string;
  mainTitleEn: string;
  introDescription: string;
  introDescriptionUz: string;
  introDescriptionRu: string;
  introDescriptionEn: string;
  dynamicSections: BlogPostSectionPayload[];
  seoTitle: string;
  metaDescription: string;
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

function asDate(value: unknown) {
  const normalized = asString(value);

  if (!normalized) {
    return null;
  }

  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
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

function asCategoryIds(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => asString(entry))
    .filter(Boolean)
    .filter((entry, index, array) => array.indexOf(entry) === index);
}

function toSlug(value: string) {
  return slugifyText(value);
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

export function validateContactMessagePayload(body: unknown): ValidationResult<ContactMessagePayload> {
  const payload = body as Record<string, unknown>;

  const fullName = asString(payload.fullName);
  const phone = asString(payload.phone);

  if (!fullName) {
    return { success: false, error: "Full name is required." };
  }

  if (!phone) {
    return { success: false, error: "Phone is required." };
  }

  return {
    success: true,
    data: {
      fullName,
      phone,
      message: asOptionalString(payload.message)
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

export function validateSkinTypeOptionPayload(body: unknown): ValidationResult<SkinTypeOptionPayload> {
  const payload = body as Record<string, unknown>;

  const nameUz = asString(payload.nameUz);
  const nameRu = asString(payload.nameRu);
  const nameEn = asString(payload.nameEn);
  const rawValue = asString(payload.value) || nameEn || nameRu || nameUz;
  const value = toSlug(rawValue);

  if (!nameUz || !nameRu || !nameEn) {
    return { success: false, error: "All skin type names are required." };
  }

  if (!value) {
    return { success: false, error: "Skin type value is required." };
  }

  return {
    success: true,
    data: {
      value,
      nameUz,
      nameRu,
      nameEn
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
  const discountAmount = Number(payload.discountAmount ?? 0);
  const stock = Number(payload.stock);
  const requestedCategoryIds = asCategoryIds(payload.categoryLinkIds);
  const categoryId = requestedCategoryIds[0] || asString(payload.categoryId);
  const categoryLinkIds = categoryId
    ? [categoryId, ...requestedCategoryIds.filter((entry) => entry !== categoryId)]
    : requestedCategoryIds;
  const recommendedProductIds = Array.isArray(payload.recommendedProductIds)
    ? payload.recommendedProductIds
        .map((entry) => asString(entry))
        .filter(Boolean)
        .filter((entry, index, collection) => collection.indexOf(entry) === index)
    : [];

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

  if (!Number.isFinite(discountAmount) || discountAmount < 0) {
    return { success: false, error: "Discount amount must be a valid non-negative number." };
  }

  if (!categoryId) {
    return { success: false, error: "Category is required." };
  }

  const skinTypes = asSkinTypes(payload.skinTypes);

  if (!skinTypes) {
    return { success: false, error: "Skin type is required." };
  }

  const galleryImages = Array.isArray(payload.galleryImages)
    ? payload.galleryImages
        .map((entry, index) => {
          if (!entry || typeof entry !== "object") {
            return null;
          }

          const row = entry as Record<string, unknown>;
          const type = asString(row.type) === "VIDEO" ? "VIDEO" : "IMAGE";
          const imageUrl = asOptionalString(row.imageUrl);
          const videoUrl = asOptionalString(row.videoUrl);

          if (type === "IMAGE" && !imageUrl) {
            return null;
          }

          if (type === "VIDEO" && !videoUrl) {
            return null;
          }

          return {
            type,
            imageUrl,
            videoUrl,
            sortOrder: asInteger(row.sortOrder, index)
          };
        })
        .filter(
          (
            entry
          ): entry is {
            type: "IMAGE" | "VIDEO";
            imageUrl: string | null;
            videoUrl: string | null;
            sortOrder: number;
          } => entry !== null
        )
    : [];

  if (galleryImages.length > 6) {
    return { success: false, error: "Gallery can contain maximum 6 media items." };
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
      skinTypes,
      categoryLinkIds,
      size: asOptionalString(payload.size),
      packageWidth: asOptionalString(payload.packageWidth),
      packageHeight: asOptionalString(payload.packageHeight),
      price: Math.round(price),
      discountAmount: Math.round(discountAmount),
      hidePrice: asBoolean(payload.hidePrice),
      stock: Math.round(stock),
      active: asBoolean(payload.active),
      isBestseller: asBoolean(payload.isBestseller),
      isHit: asBoolean(payload.isHit),
      isNew: asBoolean(payload.isNew),
      homeSortOrder: asInteger(payload.homeSortOrder),
      imageUrl: asOptionalString(payload.imageUrl),
      colorFrom: asOptionalString(payload.colorFrom),
      colorTo: asOptionalString(payload.colorTo),
      categoryId,
      recommendedProductIds,
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
      aboutTitleUz: asOptionalString(payload.aboutTitleUz),
      aboutTitleRu: asOptionalString(payload.aboutTitleRu),
      aboutTitleEn: asOptionalString(payload.aboutTitleEn),
      aboutDescriptionUz: asOptionalString(payload.aboutDescriptionUz),
      aboutDescriptionRu: asOptionalString(payload.aboutDescriptionRu),
      aboutDescriptionEn: asOptionalString(payload.aboutDescriptionEn),
      aboutBrandTitleUz: asOptionalString(payload.aboutBrandTitleUz),
      aboutBrandTitleRu: asOptionalString(payload.aboutBrandTitleRu),
      aboutBrandTitleEn: asOptionalString(payload.aboutBrandTitleEn),
      aboutPanelDescriptionUz: asOptionalString(payload.aboutPanelDescriptionUz),
      aboutPanelDescriptionRu: asOptionalString(payload.aboutPanelDescriptionRu),
      aboutPanelDescriptionEn: asOptionalString(payload.aboutPanelDescriptionEn),
      aboutPanelSecondaryDescriptionUz: asOptionalString(payload.aboutPanelSecondaryDescriptionUz),
      aboutPanelSecondaryDescriptionRu: asOptionalString(payload.aboutPanelSecondaryDescriptionRu),
      aboutPanelSecondaryDescriptionEn: asOptionalString(payload.aboutPanelSecondaryDescriptionEn),
      aboutImageUrl: asOptionalString(payload.aboutImageUrl),
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
  const imageUrl = asOptionalString(payload.imageUrl);
  const imageUrlUz = asOptionalString(payload.imageUrlUz);
  const imageUrlRu = asOptionalString(payload.imageUrlRu);
  const imageUrlEn = asOptionalString(payload.imageUrlEn);
  const mobileImageUrl = asOptionalString(payload.mobileImageUrl);
  const mobileImageUrlUz = asOptionalString(payload.mobileImageUrlUz);
  const mobileImageUrlRu = asOptionalString(payload.mobileImageUrlRu);
  const mobileImageUrlEn = asOptionalString(payload.mobileImageUrlEn);
  const heroProductId = asOptionalString(payload.heroProductId);

  if (!(imageUrlUz || imageUrlRu || imageUrlEn || imageUrl) || !(mobileImageUrlUz || mobileImageUrlRu || mobileImageUrlEn || mobileImageUrl)) {
    return { success: false, error: "Desktop and mobile hero images are required." };
  }

  if (!heroProductId) {
    return { success: false, error: "Linked hero product is required." };
  }

  return {
    success: true,
    data: {
      imageUrl,
      imageUrlUz,
      imageUrlRu,
      imageUrlEn,
      mobileImageUrl,
      mobileImageUrlUz,
      mobileImageUrlRu,
      mobileImageUrlEn,
      heroProductId
    }
  };
}

export function validateShopLocationPayload(body: unknown): ValidationResult<ShopLocationPayload> {
  const payload = body as Record<string, unknown>;
  const address = asString(payload.address);

  if (!address) {
    return { success: false, error: "Store address is required." };
  }

  const workingHours = Array.isArray(payload.workingHours)
    ? payload.workingHours
        .map((entry, index) => {
          if (!entry || typeof entry !== "object") {
            return null;
          }

          const row = entry as Record<string, unknown>;
          const value = asString(row.value);

          if (!value) {
            return null;
          }

          return {
            label: asOptionalString(row.label),
            value,
            sortOrder: asInteger(row.sortOrder, index)
          };
        })
        .filter((entry): entry is ShopWorkingHourPayload => entry !== null)
    : [];

  if (workingHours.length === 0) {
    return { success: false, error: "At least one working hours row is required." };
  }

  return {
    success: true,
    data: {
      address,
      mapLink: asOptionalString(payload.mapLink),
      active: asBoolean(payload.active),
      sortOrder: asInteger(payload.sortOrder),
      workingHours
    }
  };
}

export function validateHomePromoCardPayload(body: unknown): ValidationResult<HomePromoCardPayload> {
  const payload = body as Record<string, unknown>;
  const titleUz = asString(payload.titleUz);
  const titleRu = asString(payload.titleRu);
  const titleEn = asString(payload.titleEn);
  const promoProductId = asOptionalString(payload.promoProductId);

  if (!titleUz || !titleRu || !titleEn) {
    return { success: false, error: "All promo card titles are required." };
  }

  if (!promoProductId) {
    return { success: false, error: "Promo product is required." };
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
      promoProductId,
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

export function validateGallerySectionHeadingPayload(body: unknown): ValidationResult<GallerySectionHeadingPayload> {
  const payload = body as Record<string, unknown>;
  const type = asString(payload.type).toUpperCase();
  const textUz = asOptionalString(payload.textUz);
  const textRu = asOptionalString(payload.textRu);
  const textEn = asOptionalString(payload.textEn);

  if (type !== "IMAGE" && type !== "VIDEO") {
    return { success: false, error: "Gallery heading type must be IMAGE or VIDEO." };
  }

  if (!textUz && !textRu && !textEn) {
    return { success: false, error: "At least one gallery heading text is required." };
  }

  return {
    success: true,
    data: {
      type,
      textUz,
      textRu,
      textEn,
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

export function validateBlogPostPayload(body: unknown): ValidationResult<BlogPostPayload> {
  const payload = body as Record<string, unknown>;

  const cardTitleUz = asString(payload.cardTitleUz);
  const cardTitleRu = asString(payload.cardTitleRu);
  const cardTitleEn = asString(payload.cardTitleEn);
  const excerptUz = asString(payload.excerptUz);
  const excerptRu = asString(payload.excerptRu);
  const excerptEn = asString(payload.excerptEn);
  const publishDate = asDate(payload.publishDate);
  const categoryUz = asString(payload.categoryUz);
  const categoryRu = asString(payload.categoryRu);
  const categoryEn = asString(payload.categoryEn);
  const mainTitleUz = asString(payload.mainTitleUz);
  const mainTitleRu = asString(payload.mainTitleRu);
  const mainTitleEn = asString(payload.mainTitleEn);
  const introDescriptionUz = asString(payload.introDescriptionUz);
  const introDescriptionRu = asString(payload.introDescriptionRu);
  const introDescriptionEn = asString(payload.introDescriptionEn);
  const cardTitle = cardTitleRu || cardTitleEn || cardTitleUz;
  const excerpt = excerptRu || excerptEn || excerptUz;
  const category = categoryRu || categoryEn || categoryUz;
  const mainTitle = mainTitleRu || mainTitleEn || mainTitleUz;
  const introDescription = introDescriptionRu || introDescriptionEn || introDescriptionUz;
  const slug = toSlug(asString(payload.slug) || cardTitle || mainTitle);
  const seoTitle = asString(payload.seoTitle) || mainTitle;
  const metaDescription = asString(payload.metaDescription) || introDescription || excerpt;

  if (!cardTitleUz || !cardTitleRu || !cardTitleEn) {
    return { success: false, error: "Card title is required for UZ, RU and EN." };
  }

  if (!publishDate) {
    return { success: false, error: "Valid publish date is required." };
  }

  if (!categoryUz || !categoryRu || !categoryEn) {
    return { success: false, error: "Category is required for UZ, RU and EN." };
  }

  if (!slug) {
    return { success: false, error: "Slug is required." };
  }

  if (!mainTitleUz || !mainTitleRu || !mainTitleEn) {
    return { success: false, error: "Main title is required for UZ, RU and EN." };
  }

  if (!introDescriptionUz || !introDescriptionRu || !introDescriptionEn) {
    return { success: false, error: "Intro description is required for UZ, RU and EN." };
  }

  if (!seoTitle) {
    return { success: false, error: "SEO title is required." };
  }

  if (!metaDescription) {
    return { success: false, error: "Meta description is required." };
  }

  if (!Array.isArray(payload.media)) {
    return { success: false, error: "Media must be an array." };
  }

  if (payload.media.length === 0) {
    return { success: false, error: "Add at least one image or video." };
  }

  if (payload.media.length > 6) {
    return { success: false, error: "No more than 6 media items are allowed." };
  }

  const media: BlogPostMediaPayload[] = [];

  for (const [index, entry] of payload.media.entries()) {
    if (!entry || typeof entry !== "object") {
      return { success: false, error: "Each media item must be an object." };
    }

    const row = entry as Record<string, unknown>;
    const type = asString(row.type).toUpperCase();

    if (type !== "IMAGE" && type !== "VIDEO") {
      return { success: false, error: "Each media item must be IMAGE or VIDEO." };
    }

    const imageUrl = asOptionalString(row.imageUrl);
    const videoUrl = asOptionalString(row.videoUrl);

    if (type === "IMAGE" && !imageUrl) {
      return { success: false, error: "Each image item must include image URL." };
    }

    if (type === "VIDEO" && !videoUrl) {
      return { success: false, error: "Each video item must include video URL." };
    }

    media.push({
      type,
      imageUrl: type === "IMAGE" ? imageUrl : null,
      videoUrl: type === "VIDEO" ? videoUrl : null,
      sortOrder: asInteger(row.sortOrder, index)
    });
  }

  const coverImage = media.find((entry) => entry.type === "IMAGE" && entry.imageUrl)?.imageUrl;

  if (!coverImage) {
    return {
      success: false,
      error: "Add at least one image. The first image is used as the blog cover."
    };
  }

  if (!Array.isArray(payload.dynamicSections)) {
    return { success: false, error: "Dynamic sections must be an array." };
  }

  const dynamicSections: BlogPostSectionPayload[] = [];

  for (const [index, entry] of payload.dynamicSections.entries()) {
    if (!entry || typeof entry !== "object") {
      return { success: false, error: "Each dynamic section must be an object." };
    }

    const row = entry as Record<string, unknown>;
    const titleUz = asString(row.titleUz);
    const titleRu = asString(row.titleRu);
    const titleEn = asString(row.titleEn);
    const descriptionUz = asString(row.descriptionUz);
    const descriptionRu = asString(row.descriptionRu);
    const descriptionEn = asString(row.descriptionEn);

    if (
      !titleUz &&
      !titleRu &&
      !titleEn &&
      !descriptionUz &&
      !descriptionRu &&
      !descriptionEn
    ) {
      continue;
    }

    if (!titleUz || !titleRu || !titleEn || !descriptionUz || !descriptionRu || !descriptionEn) {
      return {
        success: false,
        error: "Each dynamic section must include title and description for UZ, RU and EN."
      };
    }

    dynamicSections.push({
      titleUz,
      titleRu,
      titleEn,
      descriptionUz,
      descriptionRu,
      descriptionEn,
      sortOrder: asInteger(row.sortOrder, index)
    });
  }

  return {
    success: true,
    data: {
      cardTitle,
      cardTitleUz,
      cardTitleRu,
      cardTitleEn,
      excerpt,
      excerptUz,
      excerptRu,
      excerptEn,
      coverImage,
      media,
      publishDate,
      category,
      categoryUz,
      categoryRu,
      categoryEn,
      slug,
      featured: asBoolean(payload.featured),
      linkedProductId: asOptionalString(payload.linkedProductId),
      mainTitle,
      mainTitleUz,
      mainTitleRu,
      mainTitleEn,
      introDescription,
      introDescriptionUz,
      introDescriptionRu,
      introDescriptionEn,
      dynamicSections,
      seoTitle,
      metaDescription
    }
  };
}
