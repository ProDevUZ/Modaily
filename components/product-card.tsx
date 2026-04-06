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
    <article className={`group ${isCatalog ? "flex h-full flex-col" : ""}`}>
      <Link href={productHref} className="block">
        <div
          className={`overflow-hidden bg-[#f5f5f2] ${
            isCatalog
              ? compactMobile
                ? "flex aspect-[120/154] items-center justify-center"
                : "flex aspect-[188/228] items-center justify-center"
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
                  ? "h-[82%] w-full object-contain px-3 transition duration-500 group-hover:scale-[1.03]"
                  : "h-[84%] w-full object-contain px-7 transition duration-500 group-hover:scale-[1.03]"
                : "h-[320px] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            }
          />
        </div>
      </Link>

      <div className={isCatalog ? compactMobile ? "flex flex-1 flex-col pt-2" : "flex flex-1 flex-col pt-4" : "pt-4"}>
        <Link href={productHref}>
          <h3
            className={`uppercase text-black transition group-hover:text-[#ba0c2f] ${
              isCatalog
                ? compactMobile
                  ? "min-h-[48px] text-[11px] leading-[1.2]"
                  : "min-h-[74px] text-[17px] leading-[1.4]"
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

        <div className={isCatalog ? compactMobile ? "mt-auto space-y-2 pt-2" : "mt-auto space-y-3 pt-4" : "mt-4 flex items-center justify-between gap-4"}>
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
                  ? "inline-flex h-[30px] w-full items-center justify-center rounded-none border border-black/65 px-2 text-[9px] font-normal uppercase tracking-[0.02em] text-black transition hover:bg-black hover:text-white"
                  : "inline-flex h-[43px] w-full items-center justify-center rounded-none border border-black/65 px-4 text-[12px] font-normal uppercase tracking-[0.03em] text-black transition hover:bg-black hover:text-white"
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
