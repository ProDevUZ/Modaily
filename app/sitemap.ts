import type { MetadataRoute } from "next";

import { locales } from "@/lib/i18n";
import { getStorefrontProductSlugs } from "@/lib/storefront-products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://modaily.com";
  const now = new Date();
  const productSlugs = await getStorefrontProductSlugs();

  const pages = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: now
    },
    {
      url: `${baseUrl}/${locale}/catalog`,
      lastModified: now
    },
    {
      url: `${baseUrl}/${locale}/cart`,
      lastModified: now
    }
  ]);

  const productPages = locales.flatMap((locale) =>
    productSlugs.map((slug) => ({
      url: `${baseUrl}/${locale}/catalog/${slug}`,
      lastModified: now
    }))
  );

  return [...pages, ...productPages];
}
