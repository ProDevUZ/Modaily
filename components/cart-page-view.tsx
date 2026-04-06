"use client";

import Link from "next/link";

import { useCart } from "@/components/cart-provider";
import type { Dictionary, Locale } from "@/lib/i18n";

type CartPageViewProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function CartPageView({ locale, dictionary }: CartPageViewProps) {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <section className="section-gap">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="eyebrow">{dictionary.cart.eyebrow}</p>
            <h1 className="display-title mt-3 text-4xl sm:text-5xl">{dictionary.cart.h1}</h1>
            <p className="body-copy mt-4 max-w-2xl">{dictionary.cart.description}</p>

            <div className="mt-8 space-y-4">
              {items.length === 0 ? (
                <div className="glass rounded-[1.8rem] p-8">
                  <p className="text-lg font-semibold text-ink">{dictionary.cart.emptyTitle}</p>
                  <p className="mt-3 body-copy">{dictionary.cart.emptyDescription}</p>
                  <Link href={`/${locale}/catalog`} className="cta-primary mt-6">
                    {dictionary.cart.emptyCta}
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <article key={item.slug} className="glass flex flex-col gap-5 rounded-[1.8rem] p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="h-20 w-16 rounded-[1.4rem] border border-white/60"
                        style={{
                          background: `linear-gradient(160deg, ${item.color}, rgba(255,255,255,0.78))`
                        }}
                      />
                      <div>
                        <p className="text-lg font-semibold text-ink">{item.name}</p>
                        <p className="mt-1 text-sm text-stone-500">
                          {dictionary.currency.symbol}
                          {item.price}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center rounded-full border border-stone-200 bg-white/70">
                        <button
                          type="button"
                          className="px-4 py-2 text-lg"
                          onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="min-w-10 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          className="px-4 py-2 text-lg"
                          onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button type="button" className="text-sm font-semibold text-clay" onClick={() => removeItem(item.slug)}>
                        {dictionary.cart.remove}
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <aside className="glass h-fit rounded-[2rem] p-6">
            <p className="eyebrow">{dictionary.cart.summaryEyebrow}</p>
            <h2 className="mt-3 text-3xl text-ink">{dictionary.cart.summaryTitle}</h2>
            <div className="mt-6 space-y-3 border-y border-stone-200/70 py-5">
              <div className="flex items-center justify-between text-sm text-stone-600">
                <span>{dictionary.cart.itemsLabel}</span>
                <span>{items.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-stone-600">
                <span>{dictionary.cart.deliveryLabel}</span>
                <span>{dictionary.cart.deliveryValue}</span>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm uppercase tracking-[0.24em] text-stone-500">{dictionary.cart.totalLabel}</span>
              <span className="text-2xl font-semibold text-ink">
                {dictionary.currency.symbol}
                {subtotal.toFixed(2)}
              </span>
            </div>
            <button type="button" className="cta-primary mt-6 w-full">
              {dictionary.cart.checkoutCta}
            </button>
            <p className="mt-4 text-sm leading-6 text-stone-600">{dictionary.cart.checkoutHint}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
