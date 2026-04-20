export type BlogPostDynamicSection = {
  id: string;
  title: string;
  description: string;
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
  excerpt: string;
  coverImage: string;
  publishDate: string;
  category: string;
  slug: string;
  featured: boolean;
  linkedProductId: string | null;
  linkedProduct: BlogPostLinkedProduct | null;
  mainTitle: string;
  introDescription: string;
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
