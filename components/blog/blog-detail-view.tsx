import Link from "next/link";

import { FallbackImage } from "@/components/ui/fallback-image";
import type { BlogPostLinkedProduct, StorefrontBlogPost } from "@/lib/blog-post-types";
import type { Locale } from "@/lib/i18n";
import { renderRichText } from "@/lib/rich-text";

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

  return new Intl.DateTimeFormat(dateLocales[locale], {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

function getProductName(product: BlogPostLinkedProduct, locale: Locale) {
  if (locale === "uz") {
    return product.nameUz || product.nameRu || product.nameEn;
  }

  if (locale === "en") {
    return product.nameEn || product.nameRu || product.nameUz;
  }

  return product.nameRu || product.nameEn || product.nameUz;
}

function renderBodyContent(value: string, keyPrefix: string) {
  return (
    <div key={keyPrefix}>
      {renderRichText(value, {
        containerClassName: "space-y-4 text-[0.95rem] leading-[2] text-[#4f4f4f] lg:text-[0.98rem]",
        blockClassName: "whitespace-pre-wrap",
        listClassName: "space-y-2 pl-5",
        listItemClassName: "whitespace-pre-wrap"
      })}
    </div>
  );
}

type BlogDetailViewProps = {
  locale: Locale;
  post: StorefrontBlogPost;
  labels: {
    publishedLabel: string;
    categoryLabel: string;
    featuredLabel: string;
    linkedProductLabel: string;
    openProduct: string;
    backToBlog: string;
  };
};

export function BlogDetailView({ locale, post, labels }: BlogDetailViewProps) {
  const publishedAt = formatPublishDate(post.publishDate, locale);
  const linkedProductName = post.linkedProduct ? getProductName(post.linkedProduct, locale) : "";

  return (
    <section className="bg-white">
      <article className="mx-auto max-w-[1180px] px-5 pb-20 pt-8 sm:px-6 lg:px-8 lg:pb-24 lg:pt-10">
        <div className="rounded-[1.9rem] bg-[#f6f5f2] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <h1 className="text-[1.22rem] leading-[1.35] tracking-[-0.03em] text-slate-950 lg:text-[2rem] lg:leading-[1.2]">
            {post.cardTitle}
          </h1>

          <div className="mt-4 overflow-hidden rounded-[1.25rem] lg:mt-6">
            <FallbackImage
              src={post.coverImage}
              fallbackSrc="/images/home/mainpage.jpg"
              alt={post.cardTitle}
              className="aspect-[16/9] w-full object-cover object-center"
            />
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-[920px]">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.7rem] uppercase tracking-[0.16em] text-[#909090] lg:text-[0.74rem]">
            {publishedAt ? (
              <span className="inline-flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M8 2v4M16 2v4M3 10h18" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="3" y="4" width="18" height="17" rx="3" />
                </svg>
                <span>{publishedAt}</span>
              </span>
            ) : null}

            <span className="inline-flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 10.4V4H13.6L4 13.6 10.4 20z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 8h.01" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{post.category}</span>
            </span>

            {post.featured ? (
              <span className="inline-flex items-center gap-2 text-[var(--brand)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
                <span>{labels.featuredLabel}</span>
              </span>
            ) : null}
          </div>

          <h2 className="mt-7 text-[1.45rem] leading-[1.22] tracking-[-0.03em] text-slate-950 lg:text-[2.15rem]">
            {post.mainTitle}
          </h2>

          <div className="mt-5 space-y-5">
            {renderBodyContent(post.introDescription, `${post.id}-intro`)}

            {post.dynamicSections.map((section) => (
              <section key={section.id} className="space-y-4 pt-3 lg:pt-4">
                <h3 className="text-[1.06rem] font-medium tracking-[-0.02em] text-slate-950 lg:text-[1.3rem]">
                  {section.title}
                </h3>
                <div className="space-y-5">
                  {renderBodyContent(section.description, section.id)}
                </div>
              </section>
            ))}
          </div>

          {post.linkedProduct ? (
            <div className="mt-12 rounded-[1.6rem] border border-[#e8e1d7] bg-[#faf7f2] p-5 lg:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="h-[98px] w-[98px] shrink-0 overflow-hidden rounded-[1rem] bg-white">
                  <FallbackImage
                    src={post.linkedProduct.imageUrl || ""}
                    fallbackSrc="/images/home/mainpage.jpg"
                    alt={linkedProductName}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[1.02rem] font-medium text-slate-900">
                    {linkedProductName}
                  </p>
                  <p className="mt-1 text-sm uppercase tracking-[0.16em] text-slate-400">
                    {post.linkedProduct.slug}
                  </p>
                </div>

                <Link
                  href={`/${locale}/catalog/${post.linkedProduct.slug}`}
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  {labels.openProduct}
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </article>
    </section>
  );
}
