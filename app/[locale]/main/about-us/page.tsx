import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutPageView } from "@/components/about/about-page-view";
import { defaultHomeAbout } from "@/lib/content-defaults";
import { getDictionary, isLocale } from "@/lib/i18n";
import { localizedAlternates, localizedOpenGraph, metadataDescription, metadataTitle } from "@/lib/seo";
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
  const title = metadataTitle(homeContent.about?.title || defaultHomeAbout.titleRu);
  const description = metadataDescription(
    homeContent.about?.description || defaultHomeAbout.descriptionRu,
    "About Modaily."
  );

  return {
    title,
    description,
    alternates: localizedAlternates(locale, "/main/about-us"),
    openGraph: localizedOpenGraph({
      locale,
      path: "/main/about-us",
      title,
      description
    })
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
