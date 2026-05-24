import Link from "next/link";
import type { ReactNode } from "react";

import { ProductBadgeStack } from "@/components/product-badge-stack";
import { DisplayText } from "@/components/ui/display-text";
import { FallbackImage } from "@/components/ui/fallback-image";
import { normalizeDisplayText } from "@/lib/display-text";
import type { Locale } from "@/lib/i18n";
import type { StorefrontProduct } from "@/lib/storefront-products";

type ProductCardProps = {
  locale: Locale;
  product: StorefrontProduct;
  variant?: "default" | "catalog";
  hideCommerce?: boolean;
  compactMobile?: boolean;
  imagePriority?: boolean;
  commerceAction?: ReactNode;
  labels?: {
    details: string;
    currencySymbol: string;
  };
};

const fallbackLabels = {
  uz: {
    details: "Batafsil",
    currencySymbol: "сум"
  },
  ru: {
    details: "Подробнее",
    currencySymbol: "сум"
  },
  en: {
    details: "Learn more",
    currencySymbol: "$"
  }
} as const;

function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU").format(price);
}

function renderProductTitle(value: string) {
  return value.split(/([!@#$%^&*()+])/u).map((part, index) =>
    /^[!@#$%^&*()+]$/u.test(part) ? (
      <span key={`${part}-${index}`} className="[font-family:var(--font-body),Arial,sans-serif] font-normal tracking-normal">
        {part}
      </span>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  );
}

export function ProductCard({
  locale,
  product,
  variant = "default",
  hideCommerce = false,
  compactMobile = false,
  imagePriority = false,
  commerceAction,
  labels
}: ProductCardProps) {
  const copy = labels || fallbackLabels[locale];
  const isCatalog = variant === "catalog";
  const productHref = `/${locale}/catalog/${product.slug}`;
  const displayName = normalizeDisplayText(product.name);
  const displaySize = normalizeDisplayText(product.size);
  const displayShortDescription = normalizeDisplayText(product.shortDescription);

  return (
    <article className={`group relative ${isCatalog ? "flex h-full flex-col [container-type:inline-size]" : ""}`}>
      <div
        className={`pointer-events-none relative overflow-hidden bg-[#f5f5f2] ${
          isCatalog ? "flex aspect-[1200/1540] items-center justify-center" : "aspect-[1200/1540]"
        }`}
      >
        <ProductBadgeStack badges={product.badges} />
        <FallbackImage
          src={product.imageUrl}
          fallbackSrc="/images/home/mainpage.jpg"
          alt={displayName}
          priority={imagePriority}
          fetchPriority={imagePriority ? "high" : undefined}
          sizes={
            isCatalog
              ? "(max-width: 767px) 50vw, (max-width: 1179px) 50vw, (max-width: 1439px) 28vw, (max-width: 1679px) 23vw, 22vw"
              : "(max-width: 767px) 50vw, (max-width: 1179px) 25vw, 20vw"
          }
          quality={86}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className={isCatalog ? "pointer-events-none flex flex-1 flex-col pt-[8.5cqi]" : "pointer-events-none pt-3.5"}>
        <h3
          className={`product-card-title text-black transition group-hover:text-[#ba0c2f] ${
            isCatalog
              ? "max-w-[86%] min-h-[2.45em] text-[clamp(16px,6.9cqi,22px)] font-medium md:text-[clamp(13.25px,5.35cqi,17.5px)] md:font-[300] desktop:text-[clamp(13.5px,5.9cqi,18.75px)]"
              : "text-[1.1rem] font-medium leading-5 md:text-[0.92rem] md:font-[300]"
          }`}
        >
          {renderProductTitle(displayName)}
        </h3>

        {!isCatalog ? (
          <>
            <p className="mt-1 text-[12px] text-black/45">
              <DisplayText value={displaySize} normalize={false} />
            </p>
            <p className="mt-2.5 line-clamp-2 text-[12px] leading-5 text-black/55">
              <DisplayText value={displayShortDescription} normalize={false} />
            </p>
          </>
        ) : null}

        <div
          className={`pointer-events-auto relative z-[3] ${
            isCatalog ? "mt-auto space-y-[6cqi] pt-[6cqi] desktop:space-y-[6.8cqi] desktop:pt-[6.8cqi]" : "mt-3.5 flex items-center justify-between gap-3"
          }`}
        >
          {!isCatalog && !hideCommerce ? (
            <p className="text-[1rem] text-black">
              {copy.currencySymbol === "$" ? `$${formatPrice(product.price)}` : `${formatPrice(product.price)} ${copy.currencySymbol}`}
            </p>
          ) : null}

          {!hideCommerce ? commerceAction : null}

          {isCatalog ? (
            <Link
              href={productHref}
              className={
                compactMobile
                  ? "catalog-card-action relative z-[2] inline-flex h-[clamp(30px,10.5cqi,34px)] w-full items-center justify-center rounded-none border border-black/65 px-2 text-[clamp(9px,3.5cqi,10px)] text-black transition hover:bg-black hover:text-white md:h-[clamp(31px,10.5cqi,36px)] md:px-3 md:text-[clamp(9px,3.5cqi,11px)]"
                  : "catalog-card-action relative z-[2] inline-flex h-[clamp(31px,10.5cqi,36px)] w-full items-center justify-center rounded-none border border-black/65 px-3 text-[clamp(9px,3.5cqi,11px)] text-black transition hover:bg-black hover:text-white"
              }
            >
              {copy.details}
            </Link>
          ) : null}
        </div>
      </div>

      <Link href={productHref} aria-label={displayName} className="interactive-glass-press !absolute inset-0 z-[2] block cursor-pointer">
        <span className="sr-only">{displayName}</span>
      </Link>
    </article>
  );
}
