import type { Metadata } from "next";

import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { getStorefrontProducts } from "@/lib/storefront-products";
import { getLocalizedSiteSettings } from "@/lib/storefront-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ locale: string }>;
};

const catalogDisplayHeading = {
  uz: "Mahsulot katalogi",
  ru: "Каталог продукции",
  en: "Product catalog"
} as const;

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

  const products = await getStorefrontProducts(locale);
  const siteSettings = await getLocalizedSiteSettings(locale);

  return (
    <section className="bg-white pt-7 pb-9 md:pt-8 md:pb-10">
      <div className="mx-auto mb-8 w-full max-w-[1720px] px-5 text-center md:px-8 xl:pl-7 xl:pr-10">
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

      <div className="mx-auto w-full max-w-[1720px] px-5 md:px-8 xl:pl-7 xl:pr-10">
        <div className="w-full xl:mr-auto xl:max-w-[1450px]">
          <CatalogBrowser locale={locale} products={products} hideCommerce={siteSettings.hideCommerce} />
        </div>
      </div>
    </section>
  );
}
