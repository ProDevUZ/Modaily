import type { Metadata } from "next";

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
    title: dictionary.meta.catalog.title,
    description: dictionary.meta.catalog.description,
    alternates: {
      canonical: `/${locale}/catalog`
    }
  };
}

export default async function CatalogPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return null;
  }

  const dictionary = getDictionary(locale);
  const products = getLocalizedProducts(locale);

  return (
    <section className="section-gap">
      <div className="shell">
        <SectionHeading
          eyebrow={dictionary.catalog.eyebrow}
          title={dictionary.catalog.h1}
          description={dictionary.catalog.description}
        />
        <ProductGrid locale={locale} products={products} />
      </div>
    </section>
  );
}
