import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutPageView } from "@/components/about/about-page-view";
import { defaultHomeAbout } from "@/lib/content-defaults";
import { getDictionary, isLocale } from "@/lib/i18n";
import { getHomePageContent, getLocalizedSiteSettings } from "@/lib/storefront-content";

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

  const homeContent = await getHomePageContent(locale);
  const title = homeContent.about?.title || defaultHomeAbout.titleRu;
  const description = homeContent.about?.description || defaultHomeAbout.descriptionRu;

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

  const [dictionary, siteSettings, homeContent] = await Promise.all([
    getDictionary(locale),
    getLocalizedSiteSettings(locale),
    getHomePageContent(locale)
  ]);

  return (
    <AboutPageView
      locale={locale}
      dictionaryHomeLabel={dictionary.nav.home}
      brandName={siteSettings.brandName}
      content={{
        title: homeContent.about.title,
        description: homeContent.about.description,
        secondaryTitle: homeContent.about.secondaryTitle,
        secondaryDescription: homeContent.about.secondaryDescription,
        bottomDescription: homeContent.about.bottomDescription,
        imageUrl: homeContent.about.imageUrl
      }}
      siteSettings={siteSettings}
    />
  );
}
