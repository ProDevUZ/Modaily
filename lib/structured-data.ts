import { normalizeDisplayText } from "@/lib/display-text";
import type { Locale } from "@/lib/i18n";
import { absoluteUrl, localizedPath, SITE_NAME, SITE_URL } from "@/lib/seo";
import type { BlogPostMediaItem, StorefrontBlogPost } from "@/lib/blog-post-types";
import type { StorefrontProductDetail, StorefrontProductGalleryItem } from "@/lib/storefront-products";

export type JsonLdPrimitive = string | number | boolean | null;
export type JsonLdInput = JsonLdPrimitive | JsonLdInput[] | { [key: string]: JsonLdInput | undefined };

type SiteSettingsForSchema = {
  brandName: string;
  footerPhone?: string;
  footerEmail?: string;
  footerTelegramLink?: string;
  footerInstagramLink?: string;
  footerYoutubeLink?: string;
};

type BreadcrumbItemInput = {
  name: string;
  path: string;
};

type VideoObjectInput = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string | null;
  contentUrl?: string | null;
  uploadDate?: string | null;
};

const organizationId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;

function isPlainObject(value: JsonLdInput): value is { [key: string]: JsonLdInput | undefined } {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function compactJsonLd(value: JsonLdInput | JsonLdInput[] | undefined): JsonLdInput | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (Array.isArray(value)) {
    const compactedArray = value
      .map((entry) => compactJsonLd(entry))
      .filter((entry): entry is JsonLdInput => entry !== null);

    return compactedArray.length > 0 ? compactedArray : null;
  }

  if (isPlainObject(value)) {
    const compactedEntries = Object.entries(value)
      .map(([key, entry]) => [key, compactJsonLd(entry)] as const)
      .filter(([, entry]) => entry !== null);

    if (compactedEntries.length === 0) {
      return null;
    }

    return Object.fromEntries(compactedEntries) as JsonLdInput;
  }

  return value;
}

export function toJsonLdScriptValue(value: JsonLdInput) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function asAbsoluteUrl(value?: string | null) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return absoluteUrl(trimmed);
  }

  return "";
}

function normalizeSchemaText(value: string) {
  return normalizeDisplayText(value).replace(/\s+/g, " ").trim();
}

function textSummary(value: string, maxLength = 1200) {
  const normalized = normalizeSchemaText(value.replace(/<[^>]*>/g, " "));

  return normalized.length > maxLength ? `${normalized.slice(0, maxLength).trim()}...` : normalized;
}

function validDate(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

export function buildGraphSchema(items: JsonLdInput[]) {
  return {
    "@context": "https://schema.org",
    "@graph": items
  };
}

export function buildOrganizationSchema(settings: SiteSettingsForSchema) {
  const sameAs = [
    asAbsoluteUrl(settings.footerInstagramLink),
    asAbsoluteUrl(settings.footerTelegramLink),
    asAbsoluteUrl(settings.footerYoutubeLink)
  ].filter(Boolean);
  const contactPoint = settings.footerPhone || settings.footerEmail
    ? {
        "@type": "ContactPoint",
        telephone: settings.footerPhone || undefined,
        email: settings.footerEmail || undefined,
        contactType: "customer support"
      }
    : undefined;

  return {
    "@type": "Organization",
    "@id": organizationId,
    name: normalizeSchemaText(settings.brandName || SITE_NAME),
    url: SITE_URL,
    sameAs,
    contactPoint
  };
}

export function buildWebSiteSchema(settings: SiteSettingsForSchema) {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    name: normalizeSchemaText(settings.brandName || SITE_NAME),
    url: SITE_URL,
    publisher: {
      "@id": organizationId
    },
    inLanguage: ["uz", "ru", "en"]
  };
}

export function buildBreadcrumbSchema(locale: Locale, items: BreadcrumbItemInput[]) {
  const itemListElement = items
    .filter((item) => item.name.trim())
    .map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: normalizeSchemaText(item.name),
      item: absoluteUrl(localizedPath(locale, item.path))
    }));

  if (itemListElement.length < 2) {
    return null;
  }

  return {
    "@type": "BreadcrumbList",
    itemListElement
  };
}

export function buildProductSchema({
  locale,
  product,
  currencyCode,
  hideCommerce
}: {
  locale: Locale;
  product: StorefrontProductDetail;
  currencyCode: string;
  hideCommerce: boolean;
}) {
  const path = localizedPath(locale, `/catalog/${product.slug}`);
  const productUrl = absoluteUrl(path);
  const images = [
    asAbsoluteUrl(product.imageUrl),
    ...product.media.map((item) => asAbsoluteUrl(item.imageUrl || item.videoPosterUrl))
  ].filter((url, index, collection) => url && collection.indexOf(url) === index);
  const offers = hideCommerce || product.hidePrice
    ? undefined
    : {
        "@type": "Offer",
        url: productUrl,
        priceCurrency: currencyCode,
        price: product.price,
        availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition"
      };

  return {
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: normalizeSchemaText(product.name),
    description: textSummary(product.metaDescription || product.description),
    sku: product.sku,
    brand: {
      "@id": organizationId
    },
    image: images,
    category: product.category,
    aggregateRating:
      product.reviewCount > 0 && product.averageRating > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.averageRating,
            reviewCount: product.reviewCount
          }
        : undefined,
    offers
  };
}

export function buildBlogPostingSchema({
  locale,
  post
}: {
  locale: Locale;
  post: StorefrontBlogPost;
}) {
  const path = localizedPath(locale, `/blog/${post.slug}`);
  const articleBody = textSummary(
    [post.introDescription, ...post.dynamicSections.flatMap((section) => [section.title, section.description])]
      .filter(Boolean)
      .join(" "),
    1500
  );

  return {
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(path)}#blog-posting`,
    mainEntityOfPage: absoluteUrl(path),
    headline: normalizeSchemaText(post.mainTitle || post.cardTitle),
    description: textSummary(post.metaDescription || post.introDescription),
    image: asAbsoluteUrl(post.coverImage),
    author: {
      "@id": organizationId
    },
    publisher: {
      "@id": organizationId
    },
    datePublished: validDate(post.publishDate),
    dateModified: validDate(post.updatedAt),
    articleSection: post.category,
    articleBody,
    inLanguage: locale
  };
}

export function buildVideoObjectSchema(input: VideoObjectInput) {
  const thumbnailUrl = asAbsoluteUrl(input.thumbnailUrl);
  const contentUrl = asAbsoluteUrl(input.contentUrl);

  if (!thumbnailUrl || !contentUrl) {
    return null;
  }

  return {
    "@type": "VideoObject",
    "@id": input.id,
    name: normalizeSchemaText(input.title),
    description: textSummary(input.description),
    thumbnailUrl: [thumbnailUrl],
    contentUrl,
    uploadDate: validDate(input.uploadDate)
  };
}

export function buildProductVideoSchemas(locale: Locale, product: StorefrontProductDetail) {
  const productUrl = absoluteUrl(localizedPath(locale, `/catalog/${product.slug}`));

  return product.media
    .filter((item): item is StorefrontProductGalleryItem => item.type === "VIDEO" && Boolean(item.videoUrl))
    .map((item, index) =>
      buildVideoObjectSchema({
        id: `${productUrl}#video-${index + 1}`,
        title: `${product.name} video ${index + 1}`,
        description: product.metaDescription || product.description,
        thumbnailUrl: item.videoPosterUrl || item.imageUrl,
        contentUrl: item.videoUrl
      })
    )
    .filter((item): item is NonNullable<ReturnType<typeof buildVideoObjectSchema>> => Boolean(item));
}

export function buildBlogVideoSchemas(locale: Locale, post: StorefrontBlogPost) {
  const postUrl = absoluteUrl(localizedPath(locale, `/blog/${post.slug}`));

  return post.media
    .filter((item): item is BlogPostMediaItem => item.type === "VIDEO" && Boolean(item.videoUrl))
    .map((item, index) =>
      buildVideoObjectSchema({
        id: `${postUrl}#video-${index + 1}`,
        title: `${post.cardTitle} video ${index + 1}`,
        description: post.metaDescription || post.introDescription,
        thumbnailUrl: item.videoPosterUrl || item.imageUrl,
        contentUrl: item.videoUrl,
        uploadDate: item.createdAt || post.publishDate
      })
    )
    .filter((item): item is NonNullable<ReturnType<typeof buildVideoObjectSchema>> => Boolean(item));
}
