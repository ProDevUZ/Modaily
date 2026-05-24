import type { MetadataRoute } from "next";

import { getStorefrontBlogPostSitemapEntries } from "@/lib/blog-posts";
import { locales } from "@/lib/i18n";
import { localizedPath, SITE_URL } from "@/lib/seo";
import { getStorefrontProductSitemapEntries } from "@/lib/storefront-products";

const staticPublicPaths = ["", "/catalog", "/blog", "/main/about-us"] as const;

function sitemapUrl(path: string) {
  return `${SITE_URL}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productEntries, blogEntries] = await Promise.all([
    getStorefrontProductSitemapEntries(),
    getStorefrontBlogPostSitemapEntries()
  ]);

  const staticPages = locales.flatMap((locale) =>
    staticPublicPaths.map((path) => ({
      url: sitemapUrl(localizedPath(locale, path)),
      lastModified: new Date()
    }))
  );

  const productPages = locales.flatMap((locale) =>
    productEntries.map((entry) => ({
      url: sitemapUrl(localizedPath(locale, `/catalog/${entry.slug}`)),
      lastModified: entry.lastModified
    }))
  );

  const blogPages = locales.flatMap((locale) =>
    blogEntries.map((entry) => ({
      url: sitemapUrl(localizedPath(locale, `/blog/${entry.slug}`)),
      lastModified: entry.lastModified
    }))
  );

  return [...staticPages, ...productPages, ...blogPages];
}
