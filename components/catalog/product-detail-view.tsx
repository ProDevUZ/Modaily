"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductCard } from "@/components/product-card";
import { ProductBadgeStack } from "@/components/product-badge-stack";
import { DisplayText } from "@/components/ui/display-text";
import { FallbackImage } from "@/components/ui/fallback-image";
import {
  formatInteractiveVideoTime,
  useInteractiveVideoPlayback
} from "@/components/ui/use-interactive-video-playback";
import { VideoPlaybackIndicator } from "@/components/ui/video-playback-indicator";
import { normalizeDisplayText } from "@/lib/display-text";
import type { Locale } from "@/lib/i18n";
import type { ProductPageCopy } from "@/lib/product-page-copy";
import { renderRichText } from "@/lib/rich-text";
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
  whereToBuyLink?: string;
  hideCommerce?: boolean;
};

type AccordionSectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

type ProductLightboxProps = {
  media: StorefrontProductDetail["media"];
  productName: string;
  initialIndex: number;
  onClose: () => void;
};

const VIEWED_PRODUCTS_LIMIT = 8;

function normalizeExternalHref(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function openWhereToBuyLink(link?: string) {
  if (typeof window === "undefined") {
    return;
  }

  const href = normalizeExternalHref(link || "");

  if (!href) {
    return;
  }

  window.open(href, "_blank", "noopener,noreferrer");
}

const reviewImageCopy: Record<Locale, { add: string; uploading: string; remove: string; hint: string }> = {
  uz: {
    add: "Rasm qo'shish",
    uploading: "Yuklanmoqda...",
    remove: "Olib tashlash",
    hint: "JPG, PNG, WebP yoki AVIF, 20 MB gacha."
  },
  ru: {
    add: "Добавить изображение",
    uploading: "Загрузка...",
    remove: "Удалить",
    hint: "JPG, PNG, WebP или AVIF, до 20 МБ."
  },
  en: {
    add: "Add image",
    uploading: "Uploading...",
    remove: "Remove",
    hint: "JPG, PNG, WebP or AVIF, up to 20 MB."
  }
};

function viewedProductsStorageKey(locale: Locale) {
  return `modaily:viewed-products:${locale}`;
}

function createViewedProductSnapshot(product: StorefrontProductDetail): StorefrontProduct {
  return {
    id: product.id,
    sku: product.sku,
    slug: product.slug,
    category: normalizeDisplayText(product.category),
    categoryId: product.categoryId,
    categorySlug: product.categorySlug,
    categories: product.categories.map((category) => ({
      ...category,
      name: normalizeDisplayText(category.name)
    })),
    categorySlugs: product.categorySlugs,
    skinTypes: product.skinTypes,
    size: normalizeDisplayText(product.size),
    packageWidth: normalizeDisplayText(product.packageWidth),
    packageHeight: normalizeDisplayText(product.packageHeight),
    price: product.price,
    discountAmount: product.discountAmount,
    hidePrice: product.hidePrice,
    stock: product.stock,
    colors: product.colors,
    badges: product.badges,
    name: normalizeDisplayText(product.name),
    shortName: normalizeDisplayText(product.shortName),
    shortDescription: normalizeDisplayText(product.shortDescription),
    description: normalizeDisplayText(product.description),
    metaTitle: normalizeDisplayText(product.metaTitle),
    metaDescription: normalizeDisplayText(product.metaDescription),
    h1: normalizeDisplayText(product.h1),
    imageUrl: product.imageUrl,
    searchIndex: product.searchIndex
  };
}

function normalizeViewedProduct(product: StorefrontProduct): StorefrontProduct {
  return {
    ...product,
    category: normalizeDisplayText(product.category),
    categories: product.categories.map((category) => ({
      ...category,
      name: normalizeDisplayText(category.name)
    })),
    size: normalizeDisplayText(product.size),
    packageWidth: normalizeDisplayText(product.packageWidth),
    packageHeight: normalizeDisplayText(product.packageHeight),
    name: normalizeDisplayText(product.name),
    shortName: normalizeDisplayText(product.shortName),
    shortDescription: normalizeDisplayText(product.shortDescription),
    description: normalizeDisplayText(product.description),
    metaTitle: normalizeDisplayText(product.metaTitle),
    metaDescription: normalizeDisplayText(product.metaDescription),
    h1: normalizeDisplayText(product.h1)
  };
}

function readViewedProducts(locale: Locale) {
  if (typeof window === "undefined") {
    return [] as StorefrontProduct[];
  }

  try {
    const raw = window.localStorage.getItem(viewedProductsStorageKey(locale));

    if (!raw) {
      return [] as StorefrontProduct[];
    }

    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [] as StorefrontProduct[];
    }

    return parsed
      .filter((item): item is StorefrontProduct => {
        return Boolean(
          item &&
            typeof item === "object" &&
            "id" in item &&
            "slug" in item &&
            "name" in item &&
            "imageUrl" in item
        );
      })
      .map((item) => normalizeViewedProduct(item));
  } catch {
    return [] as StorefrontProduct[];
  }
}

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

function ProductMediaFrame({
  item,
  alt,
  className,
  videoClassName,
  controls = false,
  autoPlay = false,
  interactiveVideo = false
}: {
  item: StorefrontProductDetail["media"][number] | undefined;
  alt: string;
  className: string;
  videoClassName?: string;
  controls?: boolean;
  autoPlay?: boolean;
  interactiveVideo?: boolean;
}) {
  const [videoActivated, setVideoActivated] = useState(false);
  const {
    videoRef,
    failed,
    playing,
    currentTime,
    duration,
    centerIcon,
    startPlayback,
    togglePause,
    handleProgressChange,
    videoEvents
  } = useInteractiveVideoPlayback({
    videoUrl: item?.type === "VIDEO" ? item.videoUrl : undefined,
    isActive: videoActivated,
    onActivate: () => setVideoActivated(true)
  });

  useEffect(() => {
    setVideoActivated(false);
  }, [interactiveVideo, item?.id]);

  if (item?.type === "VIDEO" && item.videoUrl) {
    if (interactiveVideo) {
      const mediaClassNames = `${videoClassName || className} mx-auto block`;

      return (
        <div
          className="group relative flex h-full w-full items-center justify-center"
          onClick={() => {
            if (videoActivated) {
              void togglePause();
              return;
            }

            void startPlayback();
          }}
        >
          {failed ? (
            <FallbackImage
              src={item.imageUrl || ""}
              fallbackSrc="/images/home/mainpage.jpg"
              alt={alt}
              className={className}
            />
          ) : (
            <video
              ref={videoRef}
              src={item.videoUrl}
              poster={item.imageUrl || undefined}
              preload="metadata"
              playsInline
              loop
              muted
              className={`pointer-events-none ${mediaClassNames}`}
              {...videoEvents}
            />
          )}

          {!failed && videoActivated ? (
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          ) : null}

          {!failed ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();

                if (videoActivated) {
                  void togglePause();
                  return;
                }

                void startPlayback();
              }}
              aria-label={videoActivated ? (playing ? "Pause video" : "Play video") : alt}
              className={`interactive-glass-press !absolute inset-0 z-[2] flex items-center justify-center bg-transparent transition ${
                videoActivated ? "" : "bg-black/10 hover:bg-black/15"
              }`}
            >
              {!videoActivated ? <VideoPlaybackIndicator kind="play" /> : null}
              {videoActivated && centerIcon ? <VideoPlaybackIndicator kind={centerIcon} /> : null}
            </button>
          ) : null}

          {!failed && videoActivated ? (
            <>
              <div
                onClick={(event) => event.stopPropagation()}
                className="absolute inset-x-3 bottom-3 z-10 rounded-[18px] border border-white/18 bg-black/42 px-3 py-2.5 text-white shadow-[0_14px_28px_rgba(0,0,0,0.18)] backdrop-blur-sm md:inset-x-4 md:bottom-4 md:px-4"
              >
                <div className="min-w-0">
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step="0.1"
                    value={Math.min(currentTime, duration || 0)}
                    onChange={(event) => handleProgressChange(Number(event.target.value))}
                    className="h-1.5 w-full cursor-pointer accent-white"
                    aria-label="Video progress"
                  />
                  <div className="mt-1.5 flex items-center justify-between text-[11px] font-medium tracking-[0.02em] text-white/82 md:text-xs">
                    <span>{formatInteractiveVideoTime(currentTime)}</span>
                    <span>{formatInteractiveVideoTime(duration)}</span>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      );
    }

    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <video
          src={item.videoUrl}
          className={`${videoClassName || className} mx-auto block`}
          controls={controls}
          autoPlay={autoPlay}
          muted={!controls}
          loop={!controls}
          playsInline
          preload="metadata"
        />
        {!controls ? (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/45 text-white shadow-[0_10px_24px_rgba(0,0,0,0.25)]">
              <svg viewBox="0 0 24 24" className="ml-0.5 h-7 w-7" fill="currentColor">
                <path d="m8 6 10 6-10 6z" />
              </svg>
            </span>
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <FallbackImage
      src={item?.imageUrl || ""}
      fallbackSrc="/images/home/mainpage.jpg"
      alt={alt}
      className={className}
    />
  );
}

function ProductLightbox({ media, productName, initialIndex, onClose }: ProductLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (media.length <= 1) {
        return;
      }

      if (event.key === "ArrowLeft") {
        setCurrentIndex((current) => (current === 0 ? media.length - 1 : current - 1));
      }

      if (event.key === "ArrowRight") {
        setCurrentIndex((current) => (current === media.length - 1 ? 0 : current + 1));
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [media.length, onClose]);

  const activeItem = media[currentIndex] ?? media[0];
  const showMediaTitle = activeItem?.type !== "VIDEO";

  function showPreviousImage() {
    setCurrentIndex((current) => (current === 0 ? media.length - 1 : current - 1));
  }

  function showNextImage() {
    setCurrentIndex((current) => (current === media.length - 1 ? 0 : current + 1));
  }

  function handleTouchStart(clientX: number) {
    setTouchStartX(clientX);
    setTouchCurrentX(clientX);
  }

  function handleTouchMove(clientX: number) {
    if (touchStartX === null) {
      return;
    }

    setTouchCurrentX(clientX);
  }

  function handleTouchEnd() {
    if (touchStartX === null || touchCurrentX === null || media.length <= 1) {
      setTouchStartX(null);
      setTouchCurrentX(null);
      return;
    }

    const deltaX = touchCurrentX - touchStartX;

    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        showNextImage();
      } else {
        showPreviousImage();
      }
    }

    setTouchStartX(null);
    setTouchCurrentX(null);
  }

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/88 px-4 py-6 backdrop-blur-sm sm:px-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${productName} gallery`}
    >
      <div
        className="relative flex max-h-full w-full max-w-[1320px] flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="absolute right-0 top-0 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/35 text-2xl text-white transition hover:bg-black/50"
        >
          <span className="translate-y-[5%]">×</span>
        </button>

        <div className={`mb-4 flex items-center pt-14 text-white/80 ${showMediaTitle ? "justify-between gap-4" : "justify-end"}`}>
          {showMediaTitle ? (
            <p className="inline-flex max-w-[calc(100%-4.5rem)] rounded-full bg-white/18 px-4 py-2 text-sm uppercase tracking-[0.22em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)] backdrop-blur-sm">
              <span className="truncate">{productName}</span>
            </p>
          ) : null}
          <p className="shrink-0 text-sm">
            {currentIndex + 1}/{media.length}
          </p>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <div
            className="flex w-full items-center justify-center overflow-hidden rounded-[18px] bg-white/4 px-4 py-4 sm:px-10"
            onTouchStart={(event) => handleTouchStart(event.touches[0]?.clientX ?? 0)}
            onTouchMove={(event) => handleTouchMove(event.touches[0]?.clientX ?? 0)}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex max-w-full items-center justify-center gap-4 md:gap-6">
              {media.length > 1 ? (
                <button
                  type="button"
                  onClick={showPreviousImage}
                  aria-label="Previous image"
                  className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/35 text-xl text-white transition hover:bg-black/50 md:flex"
                >
                  ←
                </button>
              ) : null}

              <div className="relative inline-flex max-w-full items-center justify-center">
                <ProductMediaFrame
                  item={activeItem}
                  alt={`${productName} media ${currentIndex + 1}`}
                  className="max-h-[72vh] w-auto max-w-full object-contain"
                  videoClassName="max-h-[72vh] w-auto max-w-full rounded-[18px] bg-black object-contain"
                  interactiveVideo
                />
              </div>

              {media.length > 1 ? (
                <button
                  type="button"
                  onClick={showNextImage}
                  aria-label="Next image"
                  className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/35 text-xl text-white transition hover:bg-black/50 md:flex"
                >
                  →
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {media.length > 1 ? (
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
            {media.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`relative h-[74px] w-[74px] shrink-0 overflow-hidden rounded-[10px] border transition ${
                  index === currentIndex ? "border-white" : "border-white/18"
                }`}
              >
                <ProductMediaFrame
                  item={item}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                {index === currentIndex ? <span className="absolute inset-0 ring-1 ring-white/80" /> : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU").format(price);
}

function packagingDetails(locale: Locale, product: StorefrontProductDetail) {
  const width = normalizeDisplayText(product.packageWidth);
  const height = normalizeDisplayText(product.packageHeight);

  if (width || height) {
    if (locale === "ru") {
      return [`Ширина: ${width || "-"} Высота: ${height || "-"}`, "Вес: 500 грам", "Упаковка(и): 1"];
    }

    if (locale === "en") {
      return [`Width: ${width || "-"} Height: ${height || "-"}`, "Weight: 500 g", "Package(s): 1"];
    }

    return [`Eni: ${width || "-"} Bo'yi: ${height || "-"}`, "Vazni: 500 gramm", "Qadoq(lar): 1"];
  }

  if (locale === "ru") {
    return ['Ширина: 15 " Высота: 45 "', "Вес: 500 грам", "Упаковка(и): 1"];
  }

  if (locale === "en") {
    return ['Width: 15" Height: 45"', "Weight: 500 g", "Package(s): 1"];
  }

  return ['Eni: 15" Bo\'yi: 45"', "Vazni: 500 gramm", "Qadoq(lar): 1"];
}

const reviewSortLabels: Record<
  Locale,
  {
    newest: string;
    oldest: string;
    highest: string;
    lowest: string;
    sortLabel: string;
    writeReview: string;
    closeLabel: string;
  }
> = {
  uz: {
    newest: "Eng yangi",
    oldest: "Eng eski",
    highest: "Yuqori reyting",
    lowest: "Past reyting",
    sortLabel: "Saralash",
    writeReview: "Fikr yozish",
    closeLabel: "Yopish"
  },
  ru: {
    newest: "Новейший",
    oldest: "Сначала старые",
    highest: "Высокий рейтинг",
    lowest: "Низкий рейтинг",
    sortLabel: "Сортировать",
    writeReview: "Написать отзыв",
    closeLabel: "Закрыть"
  },
  en: {
    newest: "Newest",
    oldest: "Oldest first",
    highest: "Highest rated",
    lowest: "Lowest rated",
    sortLabel: "Sort",
    writeReview: "Write review",
    closeLabel: "Close"
  }
};

export function ProductDetailView({
  locale,
  copy,
  product,
  recommendations,
  whereToBuyLink,
  hideCommerce = false
}: ProductDetailViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<StorefrontProductReview[]>(product.reviews);
  const [viewedProducts, setViewedProducts] = useState<StorefrontProduct[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [body, setBody] = useState("");
  const [reviewImageUrl, setReviewImageUrl] = useState("");
  const [reviewImageUploading, setReviewImageUploading] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [reviewSort, setReviewSort] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const reviewSummary = useMemo(() => {
    const average = reviews.length
      ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10
      : product.averageRating;

    return {
      average,
      count: reviews.length || product.reviewCount
    };
  }, [product.averageRating, product.reviewCount, reviews]);

  const sortedReviews = useMemo(() => {
    const nextReviews = [...reviews];

    nextReviews.sort((left, right) => {
      if (reviewSort === "newest") {
        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      }

      if (reviewSort === "oldest") {
        return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
      }

      if (reviewSort === "highest") {
        if (right.rating !== left.rating) {
          return right.rating - left.rating;
        }

        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      }

      if (left.rating !== right.rating) {
        return left.rating - right.rating;
      }

      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    });

    return nextReviews;
  }, [reviewSort, reviews]);

  const ingredientsContent = useMemo(() => {
    const rawIngredients = product.ingredients as
      | string
      | { uz?: string | null; ru?: string | null; en?: string | null }
      | null
      | undefined;

    if (!rawIngredients) {
      return null;
    }

    if (typeof rawIngredients === "string") {
      return rawIngredients.length > 0 ? rawIngredients : null;
    }

    const localizedValue =
      locale === "uz" ? rawIngredients.uz : locale === "ru" ? rawIngredients.ru : rawIngredients.en;

    return typeof localizedValue === "string" && localizedValue.length > 0 ? localizedValue : null;
  }, [locale, product.ingredients]);

  useEffect(() => {
    const currentProduct = createViewedProductSnapshot(product);
    const existingProducts = readViewedProducts(locale);
    const nextHistory = [currentProduct, ...existingProducts.filter((item) => item.id !== currentProduct.id)].slice(
      0,
      VIEWED_PRODUCTS_LIMIT
    );

    window.localStorage.setItem(viewedProductsStorageKey(locale), JSON.stringify(nextHistory));
    setViewedProducts(nextHistory.filter((item) => item.id !== currentProduct.id));
  }, [locale, product]);

  async function handleReviewImageUpload(file: File) {
    setError(null);
    setSuccess(null);
    setReviewImageUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/uploads/promo-image", {
        method: "POST",
        body: formData
      });

      const payload = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;

      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || "Image upload failed.");
      }

      setReviewImageUrl(payload.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
    } finally {
      setReviewImageUploading(false);
    }
  }

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
          phoneNumber,
          body,
          imageUrl: reviewImageUrl,
          rating
        })
      });

      const payload = (await response.json()) as StorefrontProductReview | { error?: string };

      if (!response.ok) {
        throw new Error("error" in payload && payload.error ? payload.error : "Review could not be submitted.");
      }

      setReviews((current) => [payload as StorefrontProductReview, ...current]);
      setAuthorName("");
      setPhoneNumber("");
      setBody("");
      setReviewImageUrl("");
      setRating(5);
      setReviewOpen(false);
      setVisibleReviews((current) => current + 1);
      setReviewSort("newest");
      setSuccess(copy.placeholders.reviewSuccess);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Review could not be submitted.");
    } finally {
      setLoading(false);
    }
  }

  const activeMedia = product.media[activeImageIndex] ?? product.media[0];

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-10 md:px-8 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(400px,0.85fr)] xl:gap-12">
        <div>
          <div className="relative overflow-hidden rounded-[4px] bg-[#f5f5f2] lg:hidden">
            {activeMedia?.type === "VIDEO" ? (
              <ProductMediaFrame
                item={activeMedia}
                alt={product.name}
                className="h-[394px] w-full object-contain p-5"
                videoClassName="h-[394px] w-full bg-[#f5f5f2] object-contain p-5"
                interactiveVideo
              />
            ) : (
              <button
                type="button"
                onClick={() => setLightboxIndex(activeImageIndex)}
                aria-label={`Open ${product.name} media gallery`}
                className="interactive-glass-press block w-full cursor-zoom-in"
              >
                <ProductMediaFrame
                  item={activeMedia}
                  alt={product.name}
                  className="h-[394px] w-full object-contain p-5"
                  videoClassName="h-[394px] w-full bg-[#f5f5f2] object-contain p-5"
                />
              </button>
            )}

          </div>

          <div className="mt-4 grid grid-cols-4 gap-2 lg:hidden">
            {product.media.slice(0, 4).map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                className={`interactive-glass-press overflow-hidden border ${index === activeImageIndex ? "border-black/55" : "border-transparent"}`}
              >
                <ProductMediaFrame
                  item={item}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="h-[84px] w-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="hidden gap-4 sm:grid-cols-2 lg:grid">
            {product.media.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxIndex(index)}
                aria-label={`Open ${product.name} media ${index + 1}`}
                className="interactive-glass-press relative overflow-hidden rounded-[4px] bg-[#f5f5f2] text-left transition hover:opacity-95"
              >
                {index === 0 ? <ProductBadgeStack badges={product.badges} className="left-4 top-4" /> : null}
                <ProductMediaFrame
                  item={item}
                  alt={product.name}
                  className="h-[320px] w-full cursor-zoom-in object-cover md:h-[360px] xl:h-[410px]"
                  videoClassName="h-[320px] w-full cursor-zoom-in bg-[#f5f5f2] object-cover md:h-[360px] xl:h-[410px]"
                />
              </button>
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

          <h1 className="mt-5 text-[2.1rem] uppercase leading-[1.02] text-black sm:text-[3.1rem]">
            <DisplayText value={product.name} normalize={false} />
          </h1>

          <div className="mt-5 max-w-[42rem] text-[1.02rem] leading-8 text-black/55">
            {renderRichText(product.shortDescription || product.description, {
              containerClassName: "space-y-3",
              blockClassName: "whitespace-pre-wrap",
              listClassName: "space-y-2 pl-5",
              listItemClassName: "whitespace-pre-wrap"
            })}
          </div>

          {!hideCommerce ? <div className="mt-6 text-[2.3rem] leading-none text-black">{formatPrice(product.price)} сум</div> : null}

          </div>

          <div className={`border-t border-black/12 pt-4 ${hideCommerce ? "mt-6" : "mt-8"}`}>
            <div className="flex items-center justify-between text-[1.05rem] text-black/55">
              <span>{copy.labels.size}</span>
              <span>&gt;</span>
            </div>
            <p className="mt-3 text-[1.8rem] text-black">
              <DisplayText value={product.size || "-"} normalize={false} />
            </p>
          </div>

          <button
            type="button"
            onClick={() => openWhereToBuyLink(whereToBuyLink)}
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-[8px] bg-[#ba0c2f] px-6 text-sm font-medium text-white transition hover:opacity-90"
          >
            {copy.actions.whereToBuy}
          </button>

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
            <span className="text-black/75">
              <DisplayText value={product.category || "-"} normalize={false} />
            </span>
          </div>

          <div className="mt-8">
            <AccordionSection title={copy.labels.description} defaultOpen>
              <div className="space-y-6">
                <div>
                  <p className="font-medium text-black/55">{copy.labels.details}</p>
                  <div className="mt-3 space-y-4">
                    {renderRichText(product.description, {
                      containerClassName: "space-y-4",
                      blockClassName: "whitespace-pre-wrap",
                      listClassName: "space-y-2 pl-5",
                      listItemClassName: "whitespace-pre-wrap"
                    })}
                    {product.shortDescription && product.shortDescription !== product.description
                      ? renderRichText(product.shortDescription, {
                          containerClassName: "space-y-4",
                          blockClassName: "whitespace-pre-wrap",
                          listClassName: "space-y-2 pl-5",
                          listItemClassName: "whitespace-pre-wrap"
                        })
                      : null}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-black/55">{copy.labels.packaging}</p>
                  <div className="mt-3 space-y-1 text-black/75">
                    {packagingDetails(locale, product).map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionSection>
            {ingredientsContent ? (
              <AccordionSection title={copy.labels.ingredients}>
                {renderRichText(ingredientsContent, {
                  containerClassName: "space-y-4",
                  blockClassName: "whitespace-pre-wrap",
                  listClassName: "space-y-2 pl-5",
                  listItemClassName: "whitespace-pre-wrap"
                })}
              </AccordionSection>
            ) : null}
            <AccordionSection title={copy.labels.features}>
              {renderRichText(product.feature || product.description, {
                containerClassName: "space-y-4",
                blockClassName: "whitespace-pre-wrap",
                listClassName: "space-y-2 pl-5",
                listItemClassName: "whitespace-pre-wrap"
              })}
            </AccordionSection>
            <AccordionSection title={copy.labels.usage}>
              {renderRichText(product.usage || product.description, {
                containerClassName: "space-y-4",
                blockClassName: "whitespace-pre-wrap",
                listClassName: "space-y-2 pl-5",
                listItemClassName: "whitespace-pre-wrap"
              })}
            </AccordionSection>
          </div>
        </div>
      </div>

      {lightboxIndex !== null ? (
        <ProductLightbox
          media={product.media}
          productName={product.name}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}

      <div className="mt-20">
        <section>
          <h2 className="text-[2rem] text-black">{copy.labels.reviews}</h2>
          <div className="mt-4 flex items-center gap-3">
            <Stars rating={reviewSummary.average || 5} subtle />
            <span className="text-sm text-black/50">
              {reviewSummary.count} {copy.badges.reviews}
            </span>
          </div>

          <div className="mt-6 rounded-[1.45rem] border border-black/12 bg-white p-3 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <button
                type="button"
                className="flex h-[54px] flex-1 items-center rounded-[12px] border border-transparent bg-[#fcfcfb] px-4 text-left text-[0.97rem] text-black/35 transition hover:border-black/10"
                onClick={() => setReviewOpen(true)}
              >
                {copy.placeholders.shareThoughts}
              </button>

              <button
                type="button"
                className="inline-flex h-[54px] shrink-0 items-center justify-center rounded-[10px] bg-[#161819] px-8 text-sm font-medium text-white transition hover:opacity-90"
                onClick={() => setReviewOpen((current) => !current)}
              >
                {reviewSortLabels[locale].writeReview}
              </button>
            </div>

            {reviewOpen ? (
              <form className="mt-4 grid gap-4 rounded-[1.15rem] border border-black/8 bg-[#faf9f7] p-4 sm:p-5" onSubmit={submitReview}>
                <div className="grid gap-4 lg:grid-cols-[minmax(220px,0.34fr)_minmax(0,1fr)]">
                  <input
                    value={authorName}
                    onChange={(event) => setAuthorName(event.target.value)}
                    placeholder={copy.labels.yourName}
                    className="h-12 w-full rounded-[12px] border border-black/12 bg-white px-4 text-sm outline-none focus:border-[#ba0c2f]"
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const nextRating = index + 1;
                      return (
                        <button
                          key={nextRating}
                          type="button"
                          aria-label={`${copy.labels.rating} ${nextRating}`}
                          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-lg transition ${
                            nextRating <= rating
                              ? "border-[#ba0c2f] bg-[#ba0c2f] text-white"
                              : "border-black/12 bg-white text-black/45"
                          }`}
                          onClick={() => setRating(nextRating)}
                        >
                          ★
                        </button>
                      );
                    })}
                  </div>
                </div>

                <input
                  type="tel"
                  inputMode="tel"
                  pattern="[0-9+]*"
                  value={phoneNumber}
                  onChange={(event) =>
                    setPhoneNumber(event.target.value.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, ""))
                  }
                  placeholder={copy.labels.yourPhone}
                  className="h-12 w-full rounded-[12px] border border-black/12 bg-white px-4 text-sm outline-none focus:border-[#ba0c2f]"
                />

                <textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  rows={5}
                  placeholder={copy.labels.yourComment}
                  className="w-full rounded-[12px] border border-black/12 bg-white px-4 py-3 text-sm outline-none focus:border-[#ba0c2f]"
                />

                <div className="rounded-[12px] border border-black/10 bg-white px-4 py-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-[10px] border border-black/12 px-4 py-2 text-sm text-black/75 transition hover:bg-black/5">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];

                          if (file) {
                            void handleReviewImageUpload(file);
                          }

                          event.currentTarget.value = "";
                        }}
                        disabled={reviewImageUploading}
                      />
                      {reviewImageUploading ? reviewImageCopy[locale].uploading : reviewImageCopy[locale].add}
                    </label>
                    <span className="text-xs text-black/40">{reviewImageCopy[locale].hint}</span>
                  </div>

                  {reviewImageUrl ? (
                    <div className="mt-3 flex items-start gap-3">
                      <img src={reviewImageUrl} alt="Review upload preview" className="h-20 w-20 rounded-[10px] object-cover" />
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-[10px] border border-black/10 px-3 py-2 text-sm text-black/55 transition hover:bg-black/5"
                        onClick={() => setReviewImageUrl("")}
                      >
                        {reviewImageCopy[locale].remove}
                      </button>
                    </div>
                  ) : null}
                </div>

                {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
                {success ? <p className="text-sm font-medium text-emerald-600">{success}</p> : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    className="inline-flex h-12 items-center justify-center rounded-[10px] border border-black/12 px-6 text-sm text-black/60 transition hover:bg-black/5"
                    onClick={() => setReviewOpen(false)}
                  >
                    {reviewSortLabels[locale].closeLabel ?? "Close"}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-12 min-w-[190px] items-center justify-center rounded-[10px] bg-[#161819] px-6 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                  >
                    {loading ? "..." : copy.actions.submitReview}
                  </button>
                </div>
              </form>
            ) : null}
          </div>

          <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h3 className="text-[2rem] text-black">
            {reviewSummary.count} {copy.labels.reviewsHeading}
            </h3>

            <div className="relative w-full max-w-[220px]">
              <select
                aria-label={reviewSortLabels[locale].sortLabel}
                className="h-12 w-full appearance-none rounded-[12px] border border-black/12 bg-white px-4 pr-10 text-sm text-black/70 outline-none transition focus:border-[#ba0c2f]"
                value={reviewSort}
                onChange={(event) => setReviewSort(event.target.value as "newest" | "oldest" | "highest" | "lowest")}
              >
                <option value="newest">{reviewSortLabels[locale].newest}</option>
                <option value="oldest">{reviewSortLabels[locale].oldest}</option>
                <option value="highest">{reviewSortLabels[locale].highest}</option>
                <option value="lowest">{reviewSortLabels[locale].lowest}</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-black/35">
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </div>

          {sortedReviews.length > 0 ? (
            <div className="mt-6 border-t border-black/10">
              {sortedReviews.slice(0, visibleReviews).map((review) => (
                <article key={review.id} className="border-b border-black/10 py-8">
                  <p className="text-base font-semibold text-black">{review.authorName}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <Stars rating={review.rating} />
                  </div>
                  <p className="mt-4 max-w-[980px] text-[1rem] leading-8 text-black/65">{review.body}</p>
                  {review.imageUrl ? (
                    <img
                      src={review.imageUrl}
                      alt={`${review.authorName} review`}
                      className="mt-4 h-auto w-full max-w-[280px] rounded-[14px] object-cover"
                    />
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[1.25rem] border border-dashed border-black/12 bg-[#faf9f7] p-6 text-sm text-black/55">
              {copy.placeholders.noReviews}
            </div>
          )}

          {visibleReviews < sortedReviews.length ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="inline-flex h-[42px] min-w-[140px] items-center justify-center border border-black/40 px-6 text-sm text-black/80 transition hover:bg-black hover:text-white"
                onClick={() => setVisibleReviews((current) => Math.min(current + 3, sortedReviews.length))}
              >
                {copy.actions.loadMore}
              </button>
            </div>
          ) : null}
        </section>
      </div>

      {recommendations.length > 0 ? (
        <section className="mt-20">
          <h2 className="text-[0.95rem] uppercase text-black md:text-[2.1rem]">{copy.labels.recommended}</h2>

          <div className="mt-6 -mx-5 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-3 md:grid md:w-auto md:grid-cols-2 md:gap-x-5 md:gap-y-10 xl:grid-cols-4 xl:gap-x-3">
              {recommendations.map((item) => (
                <div key={item.id} className="w-[130px] shrink-0 md:w-auto">
                  <ProductCard
                    locale={locale}
                    product={item}
                    variant="catalog"
                    hideCommerce={hideCommerce}
                    compactMobile
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {viewedProducts.length > 0 ? (
        <section className="mt-20">
          <h2 className="text-[0.95rem] uppercase text-black md:text-[2.1rem]">{copy.labels.recentlyViewed}</h2>

          <div className="mt-6 -mx-5 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-3 md:grid md:w-auto md:grid-cols-2 md:gap-x-5 md:gap-y-10 xl:grid-cols-4 xl:gap-x-3">
              {viewedProducts.map((item) => (
                <div key={item.id} className="w-[130px] shrink-0 md:w-auto">
                  <ProductCard
                    locale={locale}
                    product={item}
                    variant="catalog"
                    hideCommerce={hideCommerce}
                    compactMobile
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
