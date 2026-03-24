import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { getLocalizedProduct, products } from "@/lib/products";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    products.map((product) => ({
      locale,
      slug: product.slug
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const product = getLocalizedProduct(locale, slug);

  if (!product) {
    return {};
  }

  return {
    title: product.metaTitle,
    description: product.metaDescription,
    alternates: {
      canonical: `/${locale}/catalog/${slug}`
    },
    openGraph: {
      title: product.metaTitle,
      description: product.metaDescription,
      url: `https://modaily.com/${locale}/catalog/${slug}`,
      type: "website"
    }
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const product = getLocalizedProduct(locale, slug);

  if (!product) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.metaDescription,
    brand: "Modaily",
    category: product.category,
    countryOfAssembly: "United Kingdom",
    offers: {
      "@type": "Offer",
      priceCurrency: dictionary.currency.code,
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `https://modaily.com/${locale}/catalog/${slug}`
    }
  };

  return (
    <section className="section-gap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="glass product-glow rounded-[2rem] p-5 shadow-glow">
            <div
              className="flex min-h-[420px] items-end justify-center rounded-[1.8rem] border border-white/40 p-8"
              style={{
                background: `linear-gradient(165deg, ${product.colors[0]}, ${product.colors[1]})`
              }}
            >
              <div className="h-80 w-48 rounded-[3rem] border border-white/50 bg-white/25 p-5 shadow-2xl backdrop-blur">
                <div className="flex h-full flex-col justify-between rounded-[2.5rem] border border-white/40 bg-white/20 p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">Modaily</p>
                    <p className="mt-4 font-display text-2xl text-white">{product.shortName}</p>
                  </div>
                  <div className="space-y-2 text-white/80">
                    <div className="h-2 w-full rounded-full bg-white/35" />
                    <div className="h-2 w-4/5 rounded-full bg-white/35" />
                    <div className="h-2 w-2/3 rounded-full bg-white/35" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <p className="eyebrow">{product.category}</p>
              <h1 className="display-title text-4xl sm:text-5xl">{product.h1}</h1>
              <p className="body-copy text-base sm:text-lg">{product.description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="glass rounded-3xl p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{dictionary.productPage.size}</p>
                <p className="mt-3 text-lg font-semibold text-ink">{product.size}</p>
              </div>
              <div className="glass rounded-3xl p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{dictionary.productPage.origin}</p>
                <p className="mt-3 text-lg font-semibold text-ink">{dictionary.productPage.originValue}</p>
              </div>
              <div className="glass rounded-3xl p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{dictionary.productPage.price}</p>
                <p className="mt-3 text-lg font-semibold text-ink">
                  {dictionary.currency.symbol}
                  {product.price}
                </p>
              </div>
            </div>

            <div className="glass rounded-[1.8rem] p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-stone-500">{dictionary.productPage.readyToShip}</p>
                  <p className="mt-1 text-xl font-semibold text-ink">{dictionary.productPage.checkoutHint}</p>
                </div>
                <AddToCartButton locale={locale} product={product} label={dictionary.actions.addToCart} />
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <article className="glass rounded-[1.8rem] p-6">
                <h2 className="font-display text-3xl text-ink">{dictionary.productPage.benefits}</h2>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
                  {product.benefits.map((benefit) => (
                    <li key={benefit}>• {benefit}</li>
                  ))}
                </ul>
              </article>
              <article className="glass rounded-[1.8rem] p-6">
                <h2 className="font-display text-3xl text-ink">{dictionary.productPage.howToUse}</h2>
                <p className="mt-4 body-copy">{product.howToUse}</p>
                <div className="mt-5 rounded-3xl bg-white/70 p-4 text-sm text-stone-700">{product.textureNote}</div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
