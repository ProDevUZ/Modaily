import type { Metadata } from "next";

import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { JsonLd } from "@/components/seo/json-ld";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { localizedAlternates, localizedOpenGraph, metadataDescription, metadataTitle, noIndexRobots } from "@/lib/seo";
import { getLocalizedSkinTypeOptions } from "@/lib/skin-type-options";
import { buildBreadcrumbSchema, buildGraphSchema } from "@/lib/structured-data";
import { getStorefrontProducts } from "@/lib/storefront-products";
import { getLocalizedSiteSettings } from "@/lib/storefront-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ category?: string | string[] }>;
};

const catalogDisplayHeading = {
  uz: "Mahsulot katalogi",
  ru: "Каталог продукции",
  en: "Product catalog"
} as const;

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = getDictionary(locale);
  const title = metadataTitle(dictionary.meta.catalog.title);
  const description = metadataDescription(dictionary.meta.catalog.description, "Modaily skincare catalog.");

  const hasIndexableDuplicateQuery = Boolean(
    Array.isArray(resolvedSearchParams?.category)
      ? resolvedSearchParams.category.some(Boolean)
      : resolvedSearchParams?.category
  );

  return {
    title,
    description,
    robots: hasIndexableDuplicateQuery ? noIndexRobots : undefined,
    alternates: localizedAlternates(locale, "/catalog"),
    openGraph: localizedOpenGraph({
      locale,
      path: "/catalog",
      title,
      description
    })
  };
}

export default async function CatalogPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  if (!isLocale(locale)) {
    return null;
  }

  const initialCategorySlugs = Array.isArray(resolvedSearchParams?.category)
    ? resolvedSearchParams?.category.filter(Boolean)
    : typeof resolvedSearchParams?.category === "string" && resolvedSearchParams.category.length > 0
      ? resolvedSearchParams.category.split(",").map((entry) => entry.trim()).filter(Boolean)
      : [];

  const [products, skinTypeOptions] = await Promise.all([
    getStorefrontProducts(locale),
    getLocalizedSkinTypeOptions(locale)
  ]);
  const dictionary = getDictionary(locale);
  const siteSettings = await getLocalizedSiteSettings(locale);
  const breadcrumbSchema = buildBreadcrumbSchema(locale, [
    { name: dictionary.nav.home, path: "" },
    { name: dictionary.nav.catalog, path: "/catalog" }
  ]);

  return (
    <section className="bg-white pb-9 pt-6 md:pb-10 md:pt-7 desktop:pt-8">
      <JsonLd data={buildGraphSchema([breadcrumbSchema].filter(Boolean))} />
      <div className="layout-bleed-container mb-7 text-center desktop:mb-8">
        <div className="flex flex-col items-center">
          <h1 className="text-[19px] font-normal leading-none text-black/55 md:text-[26px]">
            {catalogDisplayHeading[locale]}
          </h1>
        </div>

        <div className="mx-auto mt-4 flex w-full max-w-[1180px] items-center justify-center gap-0">
          <div className="h-px flex-1 bg-black/10" />
          <div className="h-[3px] w-[300px] bg-[#ba0c2f]" />
          <div className="h-px flex-1 bg-black/10" />
        </div>
      </div>

      <div className="layout-bleed-container">
        <div className="w-full desktop:mr-auto desktop:max-w-[1450px]">
          <CatalogBrowser
            locale={locale}
            products={products}
            skinTypeOptions={skinTypeOptions}
            hideCommerce={siteSettings.hideCommerce}
            initialCategorySlugs={initialCategorySlugs}
          />
        </div>
      </div>
    </section>
  );
}
