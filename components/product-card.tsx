import Link from "next/link";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { LocalizedProduct } from "@/lib/products";

type ProductCardProps = {
  locale: Locale;
  product: LocalizedProduct;
};

export function ProductCard({ locale, product }: ProductCardProps) {
  const dictionary = getDictionary(locale);

  return (
    <article className="glass overflow-hidden rounded-[1.8rem]">
      <Link href={`/${locale}/catalog/${product.slug}`} className="block">
        <div
          className="flex h-64 items-end justify-start p-5"
          style={{
            background: `linear-gradient(165deg, ${product.colors[0]}, ${product.colors[1]})`
          }}
        >
          <div className="h-40 w-28 rounded-[2rem] border border-white/50 bg-white/25 p-3 shadow-lg backdrop-blur">
            <div className="flex h-full flex-col justify-between rounded-[1.6rem] border border-white/40 bg-white/25 p-4">
              <div className="h-2.5 w-12 rounded-full bg-white/55" />
              <div className="space-y-2">
                <div className="h-2 w-full rounded-full bg-white/35" />
                <div className="h-2 w-4/5 rounded-full bg-white/35" />
                <div className="h-2 w-2/3 rounded-full bg-white/35" />
              </div>
            </div>
          </div>
        </div>
      </Link>
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">{product.category}</p>
          <Link href={`/${locale}/catalog/${product.slug}`}>
            <h3 className="text-xl font-semibold text-ink transition hover:text-clay">{product.name}</h3>
          </Link>
          <p className="text-sm leading-6 text-stone-600">{product.shortDescription}</p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500">{product.size}</p>
            <p className="mt-1 text-lg font-semibold text-ink">
              {dictionary.currency.symbol}
              {product.price}
            </p>
          </div>
          <AddToCartButton locale={locale} product={product} label={dictionary.actions.addToCart} />
        </div>
      </div>
    </article>
  );
}
