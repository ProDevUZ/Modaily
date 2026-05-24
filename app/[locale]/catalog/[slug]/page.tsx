import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { ProductDetailView } from "@/components/catalog/product-detail-view";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { getProductPageCopy } from "@/lib/product-page-copy";
import { localizedAlternates, localizedOpenGraph, metadataDescription, metadataTitle } from "@/lib/seo";
import {
  buildBreadcrumbSchema,
  buildGraphSchema,
  buildProductSchema,
  buildProductVideoSchemas
} from "@/lib/structured-data";
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

  const path = `/catalog/${slug}`;
  const title = metadataTitle(product.metaTitle);
  const description = metadataDescription(product.metaDescription, product.description);

  return {
    title,
    description,
    alternates: localizedAlternates(locale, path),
    openGraph: localizedOpenGraph({
      locale,
      path,
      title,
      description,
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined
    })
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

  const recommendations = await getRecommendedProducts(locale, product.id);
  const dictionary = getDictionary(locale);
  const copy = getProductPageCopy(locale);
  const siteSettings = await getLocalizedSiteSettings(locale);
  const breadcrumbSchema = buildBreadcrumbSchema(locale, [
    { name: dictionary.nav.home, path: "" },
    { name: dictionary.nav.catalog, path: "/catalog" },
    { name: product.name, path: `/catalog/${slug}` }
  ]);
  const productSchema = buildProductSchema({
    locale,
    product,
    currencyCode: dictionary.currency.code,
    hideCommerce: siteSettings.hideCommerce
  });
  const videoSchemas = buildProductVideoSchemas(locale, product);

  return (
    <section className="bg-white">
      <JsonLd data={buildGraphSchema([breadcrumbSchema, productSchema, ...videoSchemas].filter(Boolean))} />
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
