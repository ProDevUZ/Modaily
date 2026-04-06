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
    <section className="bg-white pt-8 pb-10 md:pt-10 md:pb-12">
      <div className="w-full px-4 md:px-8 xl:pl-[10px] xl:pr-[130px]">
        <div className="mb-10">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-[22px] font-normal leading-none text-black/55 md:text-[30px]">
              {catalogDisplayHeading[locale]}
            </h1>
          </div>

          <div className="mt-5 h-px w-full bg-black/8" />
          <div className="-mt-px flex justify-center">
            <div className="h-[3px] w-[352px] bg-[#ba0c2f]" />
          </div>
        </div>
        <CatalogBrowser locale={locale} products={products} hideCommerce={siteSettings.hideCommerce} />
      </div>
    </section>
  );
}
