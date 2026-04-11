import Link from "next/link";

import { AddToCartButton } from "@/components/add-to-cart-button";
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
    <article className={`group ${isCatalog ? "flex h-full flex-col [container-type:inline-size]" : ""}`}>
      <Link href={productHref} className="block">
        <div
          className={`overflow-hidden bg-[#f5f5f2] ${
            isCatalog
              ? compactMobile
                ? "flex aspect-[120/154] items-center justify-center"
                : "flex aspect-[186/214] items-center justify-center"
              : ""
          }`}
        >
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
      </Link>

      <div className={isCatalog ? "flex flex-1 flex-col pt-[10cqi]" : "pt-4"}>
        <Link href={productHref}>
          <h3
            className={`product-card-title text-black transition group-hover:text-[#ba0c2f] ${
              isCatalog
                ? "max-w-[84%] min-h-[2.45em] text-[clamp(15.75px,6.93cqi,22px)]"
                : "text-[1.05rem] leading-6"
            }`}
          >
            {product.name}
          </h3>
        </Link>

        {!isCatalog ? (
          <>
            <p className="mt-1 text-sm text-black/45">{product.size}</p>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-black/55">{product.shortDescription}</p>
          </>
        ) : null}

        <div className={isCatalog ? "mt-auto space-y-[8cqi] pt-[8cqi]" : "mt-4 flex items-center justify-between gap-4"}>
          {!isCatalog && !hideCommerce ? (
            <p className="text-[1.15rem] text-black">
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
              className="inline-flex h-11 items-center justify-center rounded-[8px] border border-black px-4 text-xs font-medium uppercase tracking-[0.14em] text-black transition hover:bg-black hover:text-white"
            />
          ) : null}

          {isCatalog && !hideCommerce ? (
            <AddToCartButton
              locale={locale}
              product={product}
              label={dictionary.actions.addToCart}
              className="inline-flex h-[43px] w-full items-center justify-center rounded-none border border-black/65 px-4 text-[12px] font-normal uppercase tracking-[0.03em] text-black transition hover:bg-black hover:text-white"
            />
          ) : null}

          {isCatalog ? (
            <Link
              href={productHref}
              className={
                compactMobile
                  ? "catalog-card-action inline-flex h-[clamp(34px,12.3cqi,40px)] w-full items-center justify-center rounded-none border border-black/65 px-2 text-[clamp(10px,4cqi,12px)] text-black transition hover:bg-black hover:text-white"
                  : "catalog-card-action inline-flex h-[clamp(36px,12.3cqi,42px)] w-full items-center justify-center rounded-none border border-black/65 px-4 text-[clamp(10px,4cqi,13px)] text-black transition hover:bg-black hover:text-white"
              }
            >
              {dictionary.actions.details}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
