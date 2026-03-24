import type { Metadata } from "next";
import Link from "next/link";

import { ProductGrid } from "@/components/product-grid";
import { SectionHeading } from "@/components/section-heading";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { getLocalizedProducts } from "@/lib/products";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = getDictionary(locale);

  return {
    title: dictionary.meta.home.title,
    description: dictionary.meta.home.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        uz: "/uz",
        ru: "/ru",
        en: "/en"
      }
    }
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return null;
  }

  const dictionary = getDictionary(locale);
  const featuredProducts = getLocalizedProducts(locale).slice(0, 6);
  const allProducts = getLocalizedProducts(locale);

  return (
    <>
      <section className="section-gap">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <p className="eyebrow">{dictionary.hero.eyebrow}</p>
              <h1 className="display-title max-w-3xl">{dictionary.hero.title}</h1>
              <p className="body-copy max-w-2xl text-base sm:text-lg">{dictionary.hero.description}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href={`/${locale}/catalog`} className="cta-primary">
                  {dictionary.hero.primaryCta}
                </Link>
                <Link href={`/${locale}/catalog/${allProducts[0].slug}`} className="cta-secondary">
                  {dictionary.hero.secondaryCta}
                </Link>
              </div>
              <div className="grid gap-3 pt-4 sm:grid-cols-3">
                {dictionary.hero.stats.map((item) => (
                  <div key={item.label} className="glass rounded-3xl p-4">
                    <p className="text-2xl font-display text-ink">{item.value}</p>
                    <p className="mt-2 text-sm text-stone-600">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="glass product-glow overflow-hidden rounded-[2rem] p-6 shadow-glow">
                <div className="absolute inset-0 bg-grain opacity-80" />
                <div className="relative space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow">{dictionary.hero.cardLabel}</p>
                      <p className="mt-2 text-xl font-semibold text-ink">{allProducts[2].name}</p>
                    </div>
                    <div className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-moss">
                      UK
                    </div>
                  </div>
                  <div
                    className="h-[360px] rounded-[1.8rem] border border-white/50"
                    style={{
                      background: `linear-gradient(160deg, ${allProducts[2].colors[0]}, ${allProducts[2].colors[1]})`
                    }}
                  >
                    <div className="flex h-full items-end justify-center pb-10">
                      <div className="h-60 w-40 rounded-[2.5rem] border border-white/50 bg-white/25 p-4 shadow-2xl backdrop-blur">
                        <div className="flex h-full flex-col justify-between rounded-[2rem] border border-white/40 bg-white/20 p-5">
                          <div className="space-y-2">
                            <div className="h-2.5 w-16 rounded-full bg-white/60" />
                            <div className="h-2.5 w-10 rounded-full bg-white/40" />
                          </div>
                          <div className="space-y-3">
                            <div className="h-2 w-full rounded-full bg-white/40" />
                            <div className="h-2 w-4/5 rounded-full bg-white/40" />
                            <div className="h-2 w-3/5 rounded-full bg-white/40" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {allProducts[2].benefits.map((benefit) => (
                      <div key={benefit} className="rounded-2xl bg-white/65 p-3 text-sm text-stone-700">
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="shell">
          <SectionHeading
            eyebrow={dictionary.home.featured.eyebrow}
            title={dictionary.home.featured.title}
            description={dictionary.home.featured.description}
            action={
              <Link href={`/${locale}/catalog`} className="cta-secondary">
                {dictionary.home.featured.cta}
              </Link>
            }
          />
          <ProductGrid locale={locale} products={featuredProducts} />
        </div>
      </section>

      <section className="section-gap">
        <div className="shell">
          <div className="grid gap-5 lg:grid-cols-3">
            {dictionary.home.highlights.map((item) => (
              <article key={item.title} className="glass rounded-[1.8rem] p-6">
                <p className="eyebrow">{item.label}</p>
                <h2 className="mt-3 font-display text-3xl text-ink">{item.title}</h2>
                <p className="mt-3 body-copy">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
