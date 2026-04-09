export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  city: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminCategory = {
  id: string;
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  descriptionUz: string | null;
  descriptionRu: string | null;
  descriptionEn: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
};

export type AdminProduct = {
  id: string;
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
  createdAt: string;
  updatedAt: string;
  category?: AdminCategory;
  galleryImages?: AdminProductGalleryImage[];
  _count?: {
    reviews: number;
  };
};

export type AdminProductGalleryImage = {
  id: string;
  imageUrl: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminSiteSettings = {
  id: string;
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
  createdAt: string;
  updatedAt: string;
};

export type AdminHomeHero = {
  id: string;
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
  createdAt: string;
  updatedAt: string;
};

export type AdminHomePromoCard = {
  id: string;
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
  createdAt: string;
  updatedAt: string;
};

export type AdminHomeAbout = {
  id: string;
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
  createdAt: string;
  updatedAt: string;
};

export type AdminGalleryItem = {
  id: string;
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
  createdAt: string;
  updatedAt: string;
};

export type AdminTestimonial = {
  id: string;
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
  createdAt: string;
  updatedAt: string;
};

export async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error || "Request failed");
  }

  return (await response.json()) as T;
}
