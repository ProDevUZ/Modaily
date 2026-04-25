import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/blog/blog-card";
import { BlogListingControls } from "@/components/blog/blog-listing-controls";
import { getBlogPageCopy } from "@/lib/blog-page-copy";
import { isLocale, type Locale } from "@/lib/i18n";
import { getStorefrontBlogPosts } from "@/lib/blog-posts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string | string[];
    sort?: string | string[];
    view?: string | string[];
  }>;
};

function readQueryParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

function sortPosts<T extends { publishDate: string; cardTitle: string }>(posts: T[], sort: string) {
  const nextPosts = [...posts];

  if (sort === "oldest") {
    return nextPosts.sort((left, right) => new Date(left.publishDate).getTime() - new Date(right.publishDate).getTime());
  }

  return nextPosts.sort((left, right) => new Date(right.publishDate).getTime() - new Date(left.publishDate).getTime());
}

export async function generateMetadata({ params }: Omit<PageProps, "searchParams">): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const copy = getBlogPageCopy(locale);

  return {
    title: copy.meta.listingTitle,
    description: copy.meta.listingDescription,
    alternates: {
      canonical: `/${locale}/blog`
    }
  };
}

export default async function BlogListingPage({ params, searchParams }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const selectedCategory = readQueryParam(resolvedSearchParams.category);
  const rawSelectedSort = readQueryParam(resolvedSearchParams.sort);
  const rawSelectedView = readQueryParam(resolvedSearchParams.view);
  const selectedSort = rawSelectedSort === "oldest" ? "oldest" : "newest";
  const selectedView = rawSelectedView === "2" || rawSelectedView === "1" ? rawSelectedView : "3";
  const copy = getBlogPageCopy(locale as Locale);
  const allPosts = await getStorefrontBlogPosts(locale as Locale);
  const categories = Array.from(new Set(allPosts.map((post) => post.category).filter(Boolean))).sort((left, right) =>
    left.localeCompare(right, "ru")
  );

  const filteredPosts = selectedCategory
    ? allPosts.filter((post) => post.category === selectedCategory)
    : allPosts;

  const featuredPost = filteredPosts.find((post) => post.featured) || null;
  const gridSource = featuredPost
    ? filteredPosts.filter((post) => post.id !== featuredPost.id)
    : filteredPosts;
  const gridPosts = sortPosts(gridSource, selectedSort);
  const gridClassName =
    selectedView === "2"
      ? "grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-2"
      : selectedView === "1"
        ? "grid grid-cols-1 gap-y-8"
        : "grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3";
  const gridVariant =
    selectedView === "2" ? "two-column" : selectedView === "1" ? "list" : "default";

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1240px] px-6 pb-20 pt-[11px] lg:px-10 lg:pb-24 lg:pt-[14px]">
        <header className="flex flex-col items-center pb-4 text-center">
          <h1 className="text-[1.45rem] tracking-[-0.03em] text-[#666666] lg:text-[2rem]">
            {copy.listing.title}
          </h1>

          <div className="mx-auto mt-4 flex w-full max-w-[1180px] items-center justify-center gap-0">
            <div className="h-px flex-1 bg-black/10" />
            <div className="h-[3px] w-[300px] bg-[#ba0c2f]" />
            <div className="h-px flex-1 bg-black/10" />
          </div>
        </header>

        <BlogListingControls
          categories={categories}
          selectedCategory={selectedCategory}
          selectedSort={selectedSort}
          selectedView={selectedView}
          labels={copy.listing}
        />

        {featuredPost ? (
          <div className="mt-8">
            <BlogCard
              locale={locale}
              post={featuredPost}
              variant="featured"
              featuredLabel={copy.listing.featuredLabel}
            />
          </div>
        ) : null}

        {gridPosts.length > 0 ? (
          <div className={`mt-10 ${gridClassName}`}>
            {gridPosts.map((post) => (
              <BlogCard key={post.id} locale={locale} post={post} variant={gridVariant} />
            ))}
          </div>
        ) : featuredPost ? null : (
          <div className="mt-14 flex min-h-[260px] items-center justify-center rounded-[1.6rem] border border-dashed border-[#e2ddd7] bg-[#faf9f7] px-6 text-center">
            <div className="max-w-md">
              <p className="text-[1.2rem] tracking-[-0.03em] text-slate-950">{copy.listing.emptyTitle}</p>
              <p className="mt-3 text-sm leading-7 text-slate-500">{copy.listing.emptyDescription}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
