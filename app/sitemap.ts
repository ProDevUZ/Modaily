import type { MetadataRoute } from "next";

import { locales } from "@/lib/i18n";
import { products } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://modaily.com";
  const now = new Date();

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
    products.map((product) => ({
      url: `${baseUrl}/${locale}/catalog/${product.slug}`,
      lastModified: now
    }))
  );

  return [...pages, ...productPages];
}
