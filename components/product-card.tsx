import Link from "next/link";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductBadgeStack } from "@/components/product-badge-stack";
import { FallbackImage } from "@/components/ui/fallback-image";
import { normalizeDisplayText, splitDisplayTextForGlyphFallback } from "@/lib/display-text";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { StorefrontProduct } from "@/lib/storefront-products";

type ProductCardProps = {
  locale: Locale;
  product: StorefrontProduct;
  variant?: "default" | "catalog";
  hideCommerce?: boolean;
  compactMobile?: boolean;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU").format(price);
}

function renderDisplayText(value: string) {
  return splitDisplayTextForGlyphFallback(value).map((part, index) =>
    part === "+" || part === "&" ? (
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
  compactMobile = false
}: ProductCardProps) {
  const dictionary = getDictionary(locale);
  const isCatalog = variant === "catalog";
  const productHref = `/${locale}/catalog/${product.slug}`;
  const displayName = normalizeDisplayText(product.name);
  const displaySize = normalizeDisplayText(product.size);
  const displayShortDescription = normalizeDisplayText(product.shortDescription);

  return (
    <article
      className={`group relative ${isCatalog ? "flex h-full flex-col [container-type:inline-size]" : ""}`}
    >
      <div
        className={`pointer-events-none relative overflow-hidden bg-[#f5f5f2] ${
          isCatalog
            ? compactMobile
              ? "flex aspect-[120/154] items-center justify-center md:aspect-[186/214]"
              : "flex aspect-[186/214] items-center justify-center"
            : ""
        }`}
      >
        <ProductBadgeStack badges={product.badges} />
        <FallbackImage
          src={product.imageUrl}
          fallbackSrc="/images/home/mainpage.jpg"
          alt={displayName}
          className={
            isCatalog
              ? compactMobile
                ? "h-[82%] w-[82%] object-contain transition duration-500 group-hover:scale-[1.03] md:h-[84%] md:w-[82%]"
                : "h-[84%] w-[82%] object-contain transition duration-500 group-hover:scale-[1.03]"
              : "h-[320px] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          }
        />
      </div>

      <div className={isCatalog ? "pointer-events-none flex flex-1 flex-col pt-[8.5cqi]" : "pointer-events-none pt-3.5"}>
        <h3
          className={`product-card-title text-black transition group-hover:text-[#ba0c2f] ${
            isCatalog
              ? "max-w-[84%] min-h-[2.45em] text-[clamp(16px,6.9cqi,22px)] font-medium md:text-[clamp(13.5px,5.9cqi,18.75px)] md:font-[300]"
              : "text-[1.1rem] font-medium leading-5 md:text-[0.92rem] md:font-[300]"
          }`}
        >
          {renderDisplayText(displayName)}
        </h3>

        {!isCatalog ? (
          <>
            <p className="mt-1 text-[12px] text-black/45">{renderDisplayText(displaySize)}</p>
            <p className="mt-2.5 line-clamp-2 text-[12px] leading-5 text-black/55">{renderDisplayText(displayShortDescription)}</p>
          </>
        ) : null}

        <div
          className={`pointer-events-auto relative z-[3] ${
            isCatalog ? "mt-auto space-y-[6.8cqi] pt-[6.8cqi]" : "mt-3.5 flex items-center justify-between gap-3"
          }`}
        >
          {!isCatalog && !hideCommerce ? (
            <p className="text-[1rem] text-black">
              {dictionary.currency.symbol === "$"
                ? `${formatPrice(product.price)} СЃСѓРј`
                : `${dictionary.currency.symbol}${product.price}`}
            </p>
          ) : null}

          {!isCatalog && !hideCommerce ? (
            <AddToCartButton
              locale={locale}
              product={product}
              label={dictionary.actions.addToCart}
              className="relative z-[2] inline-flex h-10 items-center justify-center rounded-[8px] border border-black px-4 text-[11px] font-medium uppercase tracking-[0.12em] text-black transition hover:bg-black hover:text-white"
            />
          ) : null}

          {isCatalog && !hideCommerce ? (
            <AddToCartButton
              locale={locale}
              product={product}
              label={dictionary.actions.addToCart}
              className="relative z-[2] inline-flex h-[37px] w-full items-center justify-center rounded-none border border-black/65 px-4 text-[10px] font-normal uppercase tracking-[0.03em] text-black transition hover:bg-black hover:text-white"
            />
          ) : null}

          {isCatalog ? (
            <Link
              href={productHref}
              className={
                compactMobile
                  ? "catalog-card-action relative z-[2] inline-flex h-[clamp(30px,10.5cqi,34px)] w-full items-center justify-center rounded-none border border-black/65 px-2 text-[clamp(9px,3.5cqi,10px)] text-black transition hover:bg-black hover:text-white md:h-[clamp(31px,10.5cqi,36px)] md:px-3 md:text-[clamp(9px,3.5cqi,11px)]"
                  : "catalog-card-action relative z-[2] inline-flex h-[clamp(31px,10.5cqi,36px)] w-full items-center justify-center rounded-none border border-black/65 px-3 text-[clamp(9px,3.5cqi,11px)] text-black transition hover:bg-black hover:text-white"
              }
            >
              {dictionary.actions.details}
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
