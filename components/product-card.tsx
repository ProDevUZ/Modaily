import Link from "next/link";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductBadgeStack } from "@/components/product-badge-stack";
import { FallbackImage } from "@/components/ui/fallback-image";
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

  return (
    <article
      className={`group relative ${isCatalog ? "flex h-full flex-col [container-type:inline-size]" : ""}`}
    >
      <div
        className={`relative overflow-hidden bg-[#f5f5f2] ${
          isCatalog
            ? compactMobile
              ? "flex aspect-[120/154] items-center justify-center"
              : "flex aspect-[186/214] items-center justify-center"
            : ""
        }`}
      >
        <ProductBadgeStack badges={product.badges} />
        <FallbackImage
          src={product.imageUrl}
          fallbackSrc="/images/home/mainpage.jpg"
          alt={product.name}
          className={
            isCatalog
              ? compactMobile
                ? "h-[82%] w-[82%] object-contain transition duration-500 group-hover:scale-[1.03]"
                : "h-[84%] w-[82%] object-contain transition duration-500 group-hover:scale-[1.03]"
              : "h-[320px] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          }
        />
      </div>

      <div className={isCatalog ? "flex flex-1 flex-col pt-[8.5cqi]" : "pt-3.5"}>
        <h3
          className={`product-card-title text-black transition group-hover:text-[#ba0c2f] ${
            isCatalog
              ? "max-w-[84%] min-h-[2.45em] text-[clamp(13.5px,5.9cqi,18.75px)]"
              : "text-[0.92rem] leading-5"
          }`}
        >
          {product.name}
        </h3>

        {!isCatalog ? (
          <>
            <p className="mt-1 text-[12px] text-black/45">{product.size}</p>
            <p className="mt-2.5 line-clamp-2 text-[12px] leading-5 text-black/55">{product.shortDescription}</p>
          </>
        ) : null}

        <div
          className={`relative z-[2] ${
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
                  ? "catalog-card-action relative z-[2] inline-flex h-[clamp(30px,10.5cqi,34px)] w-full items-center justify-center rounded-none border border-black/65 px-2 text-[clamp(9px,3.5cqi,10px)] text-black transition hover:bg-black hover:text-white"
                  : "catalog-card-action relative z-[2] inline-flex h-[clamp(31px,10.5cqi,36px)] w-full items-center justify-center rounded-none border border-black/65 px-3 text-[clamp(9px,3.5cqi,11px)] text-black transition hover:bg-black hover:text-white"
              }
            >
              {dictionary.actions.details}
            </Link>
          ) : null}
        </div>
      </div>

      <Link href={productHref} aria-label={product.name} className="absolute inset-0 z-[1]">
        <span className="sr-only">{product.name}</span>
      </Link>
    </article>
  );
}
