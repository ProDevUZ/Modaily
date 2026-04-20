import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutPageView } from "@/components/about/about-page-view";
import { defaultHomeAbout } from "@/lib/content-defaults";
import { getDictionary, isLocale } from "@/lib/i18n";
import { getLocalizedSiteSettings } from "@/lib/storefront-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const siteSettings = await getLocalizedSiteSettings(locale);
  const title = siteSettings.aboutPage?.title || defaultHomeAbout.titleRu;
  const description = siteSettings.aboutPage?.description || defaultHomeAbout.descriptionRu;

  return {
    title: `${title} | Modaily`,
    description,
    alternates: {
      canonical: `/${locale}/main/about-us`
    }
  };
}

export default async function AboutUsPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const [dictionary, siteSettings] = await Promise.all([
    getDictionary(locale),
    getLocalizedSiteSettings(locale)
  ]);

  return (
    <AboutPageView
      locale={locale}
      dictionaryHomeLabel={dictionary.nav.home}
      brandName={siteSettings.brandName}
      content={{
        title: siteSettings.aboutPage.title,
        description: siteSettings.aboutPage.description,
        secondaryTitle: siteSettings.aboutPage.brandTitle,
        secondaryDescription: siteSettings.aboutPage.panelDescription,
        bottomDescription: siteSettings.aboutPage.panelSecondaryDescription,
        imageUrl: siteSettings.aboutPage.imageUrl
      }}
      siteSettings={siteSettings}
    />
  );
}
