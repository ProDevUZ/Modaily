import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogDetailView } from "@/components/blog/blog-detail-view";
import { JsonLd } from "@/components/seo/json-ld";
import { getBlogPageCopy } from "@/lib/blog-page-copy";
import { isLocale, locales } from "@/lib/i18n";
import { localizedAlternates, localizedOpenGraph, metadataDescription, metadataTitle } from "@/lib/seo";
import {
  buildBlogPostingSchema,
  buildBlogVideoSchemas,
  buildBreadcrumbSchema,
  buildGraphSchema
} from "@/lib/structured-data";
import {
  getStorefrontBlogPost,
  getStorefrontBlogPostSlugs
} from "@/lib/blog-posts";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs: string[] = await getStorefrontBlogPostSlugs();

  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const post = await getStorefrontBlogPost(locale, slug);

  if (!post) {
    return {};
  }

  const path = `/blog/${slug}`;
  const title = metadataTitle(post.seoTitle);
  const description = metadataDescription(post.metaDescription, post.introDescription);

  return {
    title,
    description,
    alternates: localizedAlternates(locale, path),
    openGraph: localizedOpenGraph({
      locale,
      path,
      title,
      description,
      type: "article",
      images: post.coverImage ? [{ url: post.coverImage }] : undefined
    })
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const post = await getStorefrontBlogPost(locale, slug);

  if (!post) {
    notFound();
  }

  const copy = getBlogPageCopy(locale);
  const breadcrumbSchema = buildBreadcrumbSchema(locale, [
    { name: "Modaily", path: "" },
    { name: copy.listing.title, path: "/blog" },
    { name: post.cardTitle, path: `/blog/${slug}` }
  ]);
  const blogPostingSchema = buildBlogPostingSchema({ locale, post });
  const videoSchemas = buildBlogVideoSchemas(locale, post);

  return (
    <>
      <JsonLd data={buildGraphSchema([breadcrumbSchema, blogPostingSchema, ...videoSchemas].filter(Boolean))} />
      <BlogDetailView locale={locale} post={post} labels={copy.detail} />
    </>
  );
}
