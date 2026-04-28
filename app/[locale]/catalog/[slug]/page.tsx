import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailView } from "@/components/catalog/product-detail-view";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { getProductPageCopy } from "@/lib/product-page-copy";
import {
  getRecommendedProducts,
  getStorefrontProductDetail,
  getStorefrontProductSlugs
} from "@/lib/storefront-products";
import { getLocalizedSiteSettings } from "@/lib/storefront-content";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getStorefrontProductSlugs();

  return locales.flatMap((locale) =>
    slugs.map((slug: string) => ({
      locale,
      slug
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const product = await getStorefrontProductDetail(locale, slug);

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

  const product = await getStorefrontProductDetail(locale, slug);

  if (!product) {
    notFound();
  }

  const recommendations = await getRecommendedProducts(locale, product.id, product.categoryId);
  const dictionary = getDictionary(locale);
  const copy = getProductPageCopy(locale);
  const siteSettings = await getLocalizedSiteSettings(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.metaDescription,
    brand: "Modaily",
    category: product.category,
    countryOfAssembly: "United Kingdom",
    aggregateRating:
      product.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.averageRating,
            reviewCount: product.reviewCount
          }
        : undefined,
    offers: siteSettings.hideCommerce
      ? undefined
      : {
          "@type": "Offer",
          priceCurrency: dictionary.currency.code,
          price: product.price,
          availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          url: `https://modaily.com/${locale}/catalog/${slug}`
        }
  };

  return (
    <section className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetailView
        locale={locale}
        copy={copy}
        product={product}
        recommendations={recommendations}
        whereToBuyLink={siteSettings.storeMapLink}
        hideCommerce={siteSettings.hideCommerce}
      />
    </section>
  );
}
