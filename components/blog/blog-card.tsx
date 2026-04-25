import Link from "next/link";

import { FallbackImage } from "@/components/ui/fallback-image";
import type { StorefrontBlogPost, StorefrontBlogPostCard } from "@/lib/blog-post-types";
import type { Locale } from "@/lib/i18n";

const dateLocales: Record<Locale, string> = {
  uz: "uz-UZ",
  ru: "ru-RU",
  en: "en-US"
};

function formatPublishDate(value: string, locale: Locale) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const month = new Intl.DateTimeFormat(dateLocales[locale], {
    month: "long",
    timeZone: "UTC"
  }).format(date);

  const normalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  return `${normalizedMonth} ${day}, ${year}`;
}

type BlogCardProps = {
  locale: Locale;
  post: StorefrontBlogPostCard | StorefrontBlogPost;
  variant?: "default" | "two-column" | "list" | "featured";
  featuredLabel?: string;
};

export function BlogCard({
  locale,
  post,
  variant = "default",
  featuredLabel
}: BlogCardProps) {
  const href = `/${locale}/blog/${post.slug}`;
  const formattedDate = formatPublishDate(post.publishDate, locale);

  if (variant === "featured") {
    return (
      <Link
        href={href}
        className="group block overflow-hidden rounded-[1.8rem] border border-[#ebe7e1] bg-white transition hover:border-[#ddd7cf]"
      >
        <div className="grid lg:grid-cols-[1.18fr_0.82fr]">
          <div className="overflow-hidden bg-[#f6f3ef]">
            <FallbackImage
              src={post.coverImage}
              fallbackSrc="/images/home/mainpage.jpg"
              alt={post.cardTitle}
              className="aspect-[16/10] h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            />
          </div>

          <div className="flex flex-col justify-between px-6 py-6 lg:px-8 lg:py-8">
            <div>
              {post.featured && featuredLabel ? (
                <span className="inline-flex rounded-full border border-[var(--brand)] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[var(--brand)]">
                  {featuredLabel}
                </span>
              ) : null}
              <h2 className="mt-4 text-[1.9rem] leading-[1.08] tracking-[-0.03em] text-slate-950">
                {post.cardTitle}
              </h2>
            </div>

            <div className="mt-8 flex items-center gap-3 text-sm text-slate-400">
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "two-column") {
    return (
      <Link href={href} className="group block h-full">
        <article className="flex h-full flex-col overflow-hidden border border-[#ebe7e1] bg-white transition hover:border-[#d7d0c7]">
          <div className="overflow-hidden bg-[#f6f3ef]">
            <FallbackImage
              src={post.coverImage}
              fallbackSrc="/images/home/mainpage.jpg"
              alt={post.cardTitle}
              className="aspect-[7/6] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            />
          </div>

          <div className="flex min-h-[170px] flex-1 flex-col justify-between px-6 py-6 lg:px-7 lg:py-7">
            <div>
              <h2 className="max-w-[20ch] text-[1.45rem] leading-[1.08] tracking-[-0.035em] text-slate-950 transition group-hover:text-[var(--brand)]">
                {post.cardTitle}
              </h2>
            </div>

            <p className="mt-8 text-[0.8rem] text-slate-400">{formattedDate}</p>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "list") {
    return (
      <Link href={href} className="group block">
        <article className="overflow-hidden border border-[#ebe7e1] bg-white transition hover:border-[#d7d0c7]">
          <div className="grid md:grid-cols-[minmax(260px,420px)_1fr]">
            <div className="overflow-hidden bg-[#f6f3ef]">
              <FallbackImage
                src={post.coverImage}
                fallbackSrc="/images/home/mainpage.jpg"
                alt={post.cardTitle}
                className="aspect-[6/5] h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
            </div>

            <div className="flex items-center px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
              <div className="max-w-[34rem]">
                <h2 className="text-[1.5rem] leading-[1.04] tracking-[-0.04em] text-slate-950 transition group-hover:text-[var(--brand)] sm:text-[1.9rem] lg:text-[2.15rem]">
                  {post.cardTitle}
                </h2>
                <p className="mt-4 text-[0.84rem] text-slate-400">{formattedDate}</p>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block">
      <article className="space-y-4">
        <div className="overflow-hidden bg-[#f6f3ef]">
          <FallbackImage
            src={post.coverImage}
            fallbackSrc="/images/home/mainpage.jpg"
            alt={post.cardTitle}
            className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-[1rem] leading-6 text-slate-900 transition group-hover:text-[var(--brand)]">
            {post.cardTitle}
          </h2>
          <p className="text-[0.78rem] text-slate-400">{formattedDate}</p>
        </div>
      </article>
    </Link>
  );
}
