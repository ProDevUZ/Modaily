import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogDetailView } from "@/components/blog/blog-detail-view";
import { getBlogPageCopy } from "@/lib/blog-page-copy";
import { isLocale, locales } from "@/lib/i18n";
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
  const slugs = await getStorefrontBlogPostSlugs();

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

  return {
    title: post.seoTitle,
    description: post.metaDescription,
    alternates: {
      canonical: `/${locale}/blog/${slug}`
    },
    openGraph: {
      title: post.seoTitle,
      description: post.metaDescription,
      url: `https://modaily.com/${locale}/blog/${slug}`,
      type: "article",
      images: post.coverImage ? [{ url: post.coverImage }] : undefined
    }
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

  return <BlogDetailView locale={locale} post={post} labels={copy.detail} />;
}
