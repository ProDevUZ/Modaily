export type BlogPostDynamicSection = {
  id: string;
  title: string;
  titleUz: string | null;
  titleRu: string | null;
  titleEn: string | null;
  description: string;
  descriptionUz: string | null;
  descriptionRu: string | null;
  descriptionEn: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostMediaItem = {
  id: string;
  type: "IMAGE" | "VIDEO";
  imageUrl: string | null;
  videoUrl: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostLinkedProduct = {
  id: string;
  sku: string;
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  imageUrl: string | null;
  price: number;
  active: boolean;
};

export type BlogPostRecord = {
  id: string;
  cardTitle: string;
  cardTitleUz: string | null;
  cardTitleRu: string | null;
  cardTitleEn: string | null;
  excerpt: string;
  excerptUz: string | null;
  excerptRu: string | null;
  excerptEn: string | null;
  coverImage: string;
  publishDate: string;
  category: string;
  categoryUz: string | null;
  categoryRu: string | null;
  categoryEn: string | null;
  slug: string;
  featured: boolean;
  linkedProductId: string | null;
  linkedProduct: BlogPostLinkedProduct | null;
  mainTitle: string;
  mainTitleUz: string | null;
  mainTitleRu: string | null;
  mainTitleEn: string | null;
  introDescription: string;
  introDescriptionUz: string | null;
  introDescriptionRu: string | null;
  introDescriptionEn: string | null;
  media: BlogPostMediaItem[];
  dynamicSections: BlogPostDynamicSection[];
  seoTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
};

export type StorefrontBlogPostCard = Pick<
  BlogPostRecord,
  "id" | "cardTitle" | "excerpt" | "coverImage" | "publishDate" | "category" | "slug" | "featured" | "linkedProductId" | "linkedProduct"
>;

export type StorefrontBlogPost = BlogPostRecord;
