"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { Locale } from "@/lib/i18n";
import type { ProductPageCopy } from "@/lib/product-page-copy";
import type {
  StorefrontProduct,
  StorefrontProductDetail,
  StorefrontProductReview
} from "@/lib/storefront-products";

type ProductDetailViewProps = {
  locale: Locale;
  copy: ProductPageCopy;
  product: StorefrontProductDetail;
  recommendations: StorefrontProduct[];
  hideCommerce?: boolean;
};

type AccordionSectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

function Stars({ rating, subtle = false }: { rating: number; subtle?: boolean }) {
  return (
    <div className={`flex items-center gap-1 ${subtle ? "text-[#ba0c2f]/75" : "text-[#ba0c2f]"}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className="text-sm leading-none">
          {index < Math.round(rating) ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

function AccordionSection({ title, defaultOpen = false, children }: AccordionSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-black/18 py-4">
      <button type="button" className="flex w-full items-center justify-between gap-4 text-left" onClick={() => setOpen((current) => !current)}>
        <span className="text-[1.1rem] font-medium text-black/75">{title}</span>
        <svg viewBox="0 0 20 20" className={`h-5 w-5 text-black/65 transition ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="m5 7 5 6 5-6" />
        </svg>
      </button>
      {open ? <div className="pt-4 text-sm leading-8 text-black/75">{children}</div> : null}
    </div>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU").format(price);
}

function reviewDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function packagingDetails(locale: Locale) {
  if (locale === "ru") {
    return ['Ширина: 15 " Высота: 45 "', "Вес: 500 грам", "Упаковка(и): 1"];
  }

  if (locale === "en") {
    return ['Width: 15" Height: 45"', "Weight: 500 g", "Package(s): 1"];
  }

  return ['Eni: 15" Bo\'yi: 45"', "Vazni: 500 gramm", "Qadoq(lar): 1"];
}

export function ProductDetailView({ locale, copy, product, recommendations, hideCommerce = false }: ProductDetailViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<StorefrontProductReview[]>(product.reviews);
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showWhereToBuy, setShowWhereToBuy] = useState(false);

  const reviewSummary = useMemo(() => {
    const average = reviews.length
      ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10
      : product.averageRating;

    return {
      average,
      count: reviews.length || product.reviewCount
    };
  }, [product.averageRating, product.reviewCount, reviews]);

  useEffect(() => {
    setShowWhereToBuy(false);

    const timer = window.setTimeout(() => {
      setShowWhereToBuy(true);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [product.slug]);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/storefront/products/${product.slug}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          authorName,
          body,
          rating
        })
      });

      const payload = (await response.json()) as StorefrontProductReview | { error?: string };

      if (!response.ok) {
        throw new Error("error" in payload && payload.error ? payload.error : "Review could not be submitted.");
      }

      setReviews((current) => [payload as StorefrontProductReview, ...current]);
      setAuthorName("");
      setBody("");
      setRating(5);
      setReviewOpen(false);
      setVisibleReviews((current) => current + 1);
      setSuccess(copy.placeholders.reviewSuccess);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Review could not be submitted.");
    } finally {
      setLoading(false);
    }
  }

  const activeImage = product.images[activeImageIndex] ?? product.images[0];

  function showPreviousImage() {
    setActiveImageIndex((current) => (current === 0 ? product.images.length - 1 : current - 1));
  }

  function showNextImage() {
    setActiveImageIndex((current) => (current === product.images.length - 1 ? 0 : current + 1));
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-10 md:px-8 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(400px,0.85fr)] xl:gap-12">
        <div>
          <div className="relative overflow-hidden rounded-[4px] bg-[#f5f5f2] lg:hidden">
            <FallbackImage
              src={activeImage?.imageUrl || ""}
              fallbackSrc="/images/home/mainpage.jpg"
              alt={product.name}
              className="h-[394px] w-full object-contain p-5"
            />

            {product.images.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={showPreviousImage}
                  className="absolute left-6 top-1/2 flex h-[38px] w-[38px] -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-black/65 shadow-[0_8px_18px_rgba(0,0,0,0.08)]"
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={showNextImage}
                  className="absolute right-6 top-1/2 flex h-[38px] w-[38px] -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-black/65 shadow-[0_8px_18px_rgba(0,0,0,0.08)]"
                >
                  →
                </button>
              </>
            ) : null}
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2 lg:hidden">
            {product.images.slice(0, 4).map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                className={`overflow-hidden border ${index === activeImageIndex ? "border-black/55" : "border-transparent"}`}
              >
                <FallbackImage
                  src={image.imageUrl}
                  fallbackSrc="/images/home/mainpage.jpg"
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="h-[84px] w-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="hidden gap-4 sm:grid-cols-2 lg:grid">
            {product.images.map((image, index) => (
              <div key={image.id} className="relative overflow-hidden rounded-[4px] bg-[#f5f5f2]">
                {index === 0 ? (
                  <span className="absolute left-4 top-4 z-10 inline-flex rounded-[6px] bg-white px-4 py-2 text-lg font-semibold text-black shadow-sm">
                    {copy.badges.novelty}
                  </span>
                ) : null}
                <FallbackImage
                  src={image.imageUrl}
                  fallbackSrc="/images/home/mainpage.jpg"
                  alt={product.name}
                  className="h-[320px] w-full object-cover md:h-[360px] xl:h-[410px]"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div>
          <div className="mt-4 flex items-center gap-3 lg:mt-0">
            <Stars rating={reviewSummary.average || 5} />
            <p className="text-sm text-black/60">
              {reviewSummary.count} {copy.badges.reviews}
            </p>
          </div>

          <h1 className="mt-5 text-[2.1rem] uppercase leading-[1.02] text-black sm:text-[3.1rem]">{product.name}</h1>

          <p className="mt-5 max-w-[42rem] text-[1.02rem] leading-8 text-black/55">{product.shortDescription || product.description}</p>

          {!hideCommerce ? <div className="mt-6 text-[2.3rem] leading-none text-black">{formatPrice(product.price)} сум</div> : null}

          {product.store ? (
            <Link
              href={`/${locale}/catalog/${product.slug}/store`}
              aria-label={copy.actions.whereToBuy}
              className={`where-to-buy-pin group fixed bottom-6 right-4 z-[120] flex h-[86px] w-[86px] items-start justify-center rounded-[999px] border border-white/55 pt-3 text-[#8e1431] shadow-[0_18px_40px_rgba(104,34,49,0.18)] backdrop-blur-xl transition-all duration-700 hover:scale-[1.06] sm:bottom-10 sm:right-8 sm:h-[102px] sm:w-[102px] sm:pt-4 lg:bottom-12 ${showWhereToBuy ? "pointer-events-auto translate-y-0 rotate-[-6deg] opacity-100" : "pointer-events-none translate-y-4 rotate-[2deg] opacity-0"}`}
            >
              <span className="where-to-buy-pin-tail pointer-events-none absolute left-1/2 top-[67px] h-[26px] w-[26px] -translate-x-1/2 rotate-45 rounded-[7px] border-r border-b border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0.08))] sm:top-[79px] sm:h-[30px] sm:w-[30px]" />
              <span className="pointer-events-none absolute inset-[1px] rounded-[999px] bg-[linear-gradient(180deg,rgba(255,255,255,0.44),rgba(255,255,255,0.12))]" />
              <span className="pointer-events-none absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#d11842] shadow-[0_0_14px_rgba(209,24,66,0.65)]">
                <span className="where-to-buy-signal absolute inset-0 rounded-full bg-[#d11842]/45" />
              </span>
              <span className="relative z-10 flex flex-col items-center gap-1 text-center">
                <span className="where-to-buy-icon flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/72 shadow-[0_10px_20px_rgba(255,255,255,0.22)] sm:h-12 sm:w-12">
                  <span className="pointer-events-none absolute h-[18px] w-[18px] rounded-full border border-[#c41a43]/30 sm:h-[22px] sm:w-[22px]" />
                  <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.85" aria-hidden="true">
                    <path d="M4 9.5 12 4l8 5.5" />
                    <path d="M5.5 10.5h13v8a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1z" />
                    <path d="M9 19.5v-5h6v5" />
                    <path d="M9.5 10.5V8h5v2.5" />
                  </svg>
                </span>
                <span className="px-2 text-[9px] font-semibold uppercase leading-tight tracking-[0.18em] text-[#7a1029] sm:text-[10px]">
                  {copy.actions.whereToBuy}
                </span>
              </span>
            </Link>
          ) : null}

          </div>

          <div className={`border-t border-black/12 pt-4 ${hideCommerce ? "mt-6" : "mt-8"}`}>
            <div className="flex items-center justify-between text-[1.05rem] text-black/55">
              <span>{copy.labels.size}</span>
              <span>&gt;</span>
            </div>
            <p className="mt-3 text-[1.8rem] text-black">{product.size || "-"}</p>
          </div>

          {!hideCommerce ? (
            <>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <div className="flex h-12 items-center rounded-[8px] bg-[#f5f5f2] px-4">
                  <button type="button" className="px-2 text-xl text-black/70" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>
                    -
                  </button>
                  <span className="min-w-10 text-center text-sm text-black">{quantity}</span>
                  <button type="button" className="px-2 text-xl text-black/70" onClick={() => setQuantity((current) => current + 1)}>
                    +
                  </button>
                </div>

                <button type="button" className="inline-flex h-12 flex-1 items-center justify-center rounded-[8px] border border-black px-5 text-sm text-black transition hover:bg-black hover:text-white">
                  {copy.labels.oneClick}
                </button>
              </div>

              <AddToCartButton
                locale={locale}
                product={product}
                quantity={quantity}
                label={copy.actions.addToCart}
                className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-[8px] bg-[#ba0c2f] px-6 text-sm font-medium text-white transition hover:opacity-90"
              />
            </>
          ) : null}

          <div className="mt-7 grid grid-cols-[84px_1fr] gap-y-3 text-sm text-black/55">
            <span>{copy.labels.sku}</span>
            <span className="text-black/75">{product.sku}</span>
            <span>{copy.labels.category}</span>
            <span className="text-black/75">{product.category || "-"}</span>
          </div>

          <div className="mt-8">
            <AccordionSection title={copy.labels.description} defaultOpen>
              <div className="space-y-6">
                <div>
                  <p className="font-medium text-black/55">{copy.labels.details}</p>
                  <div className="mt-3 space-y-4">
                    <p>{product.description}</p>
                    <p>{product.shortDescription || product.description}</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-black/55">{copy.labels.packaging}</p>
                  <div className="mt-3 space-y-1 text-black/75">
                    {packagingDetails(locale).map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionSection>
            <AccordionSection title={copy.labels.features}>
              <p>{product.feature || product.description}</p>
            </AccordionSection>
            <AccordionSection title={copy.labels.usage}>
              <p>{product.usage || product.description}</p>
            </AccordionSection>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <section>
          <h2 className="text-[2rem] text-black">{copy.labels.reviews}</h2>
          <div className="mt-4 flex items-center gap-3">
            <Stars rating={reviewSummary.average || 5} subtle />
            <span className="text-sm text-black/50">
              {reviewSummary.count} {copy.badges.reviews}
            </span>
          </div>

          {!hideCommerce ? (
            <>
          <button
            type="button"
            className="mt-6 flex h-[38px] w-full items-center justify-center rounded-[12px] border border-black/10 bg-white px-5 text-sm text-black/35"
            onClick={() => setReviewOpen((current) => !current)}
          >
            {copy.placeholders.shareThoughts}
          </button>

          {reviewOpen ? (
            <form className="mt-5 space-y-4 rounded-[1.25rem] border border-black/10 bg-[#faf9f7] p-5" onSubmit={submitReview}>
              <input
                value={authorName}
                onChange={(event) => setAuthorName(event.target.value)}
                placeholder={copy.labels.yourName}
                className="h-12 w-full rounded-[10px] border border-black/12 bg-white px-4 text-sm outline-none focus:border-[#ba0c2f]"
              />

              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, index) => {
                  const nextRating = index + 1;
                  return (
                    <button
                      key={nextRating}
                      type="button"
                      className={`h-10 w-10 rounded-full border text-lg transition ${nextRating <= rating ? "border-[#ba0c2f] bg-[#ba0c2f] text-white" : "border-black/12 bg-white text-black/45"}`}
                      onClick={() => setRating(nextRating)}
                    >
                      ★
                    </button>
                  );
                })}
              </div>

              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                rows={5}
                placeholder={copy.labels.yourComment}
                className="w-full rounded-[10px] border border-black/12 bg-white px-4 py-3 text-sm outline-none focus:border-[#ba0c2f]"
              />

              {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
              {success ? <p className="text-sm font-medium text-emerald-600">{success}</p> : null}

              <button type="submit" disabled={loading} className="inline-flex h-12 w-full items-center justify-center rounded-[8px] bg-[#ba0c2f] px-6 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60">
                {loading ? "..." : copy.actions.submitReview}
              </button>
            </form>
          ) : null}
            </>
          ) : null}

          <h3 className="mt-12 text-[2rem] text-black">
            {reviewSummary.count} {copy.labels.reviewsHeading}
          </h3>

          {reviews.length > 0 ? (
            <div className="mt-6 border-t border-black/10">
              {reviews.slice(0, visibleReviews).map((review) => (
                <article key={review.id} className="border-b border-black/10 py-7">
                  <p className="text-base font-semibold text-black">{review.authorName}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <Stars rating={review.rating} />
                    <span className="text-xs text-black/35">{reviewDate(review.createdAt)}</span>
                  </div>
                  <p className="mt-4 max-w-[980px] text-sm leading-8 text-black/65">{review.body}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[1.25rem] border border-dashed border-black/12 bg-[#faf9f7] p-6 text-sm text-black/55">
              {copy.placeholders.noReviews}
            </div>
          )}

          {visibleReviews < reviews.length ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="inline-flex h-[42px] min-w-[140px] items-center justify-center border border-black/40 px-6 text-sm text-black/80 transition hover:bg-black hover:text-white"
                onClick={() => setVisibleReviews((current) => Math.min(current + 3, reviews.length))}
              >
                {copy.actions.loadMore}
              </button>
            </div>
          ) : null}
        </section>
      </div>

      {recommendations.length > 0 ? (
        <section className="mt-20">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[2.1rem] uppercase text-black">{copy.labels.recommended}</h2>
            <Link href={`/${locale}/catalog`} className="text-sm font-medium text-[#ba0c2f]">
              {copy.breadcrumbs.catalog} →
            </Link>
          </div>

          <div className="mt-6 grid gap-y-5 gap-x-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-x-3">
            {recommendations.map((item) => (
              <Link key={item.id} href={`/${locale}/catalog/${item.slug}`} className="group overflow-hidden rounded-[0.25rem] bg-white">
                <div className="overflow-hidden bg-[#f5f5f2]">
                  <FallbackImage
                    src={item.imageUrl}
                    fallbackSrc="/images/home/mainpage.jpg"
                    alt={item.name}
                    className="h-[280px] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="space-y-2 pt-4">
                  <p className="text-[0.95rem] uppercase leading-6 text-black">{item.name}</p>
                  <p className="text-sm text-black/50">{item.size}</p>
                  {!hideCommerce ? <p className="text-base text-black">{formatPrice(item.price)} сум</p> : null}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
