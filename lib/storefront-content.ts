import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { defaultHomeAbout, defaultHomeHero, defaultSiteSettings } from "@/lib/content-defaults";

const promoButtonLabels = {
  uz: "Batafsil",
  ru: "Узнать подробнее",
  en: "Learn more"
} as const;

function localizedValue(entry: Record<string, unknown>, base: string, locale: Locale) {
  const localizedKey = `${base}${locale.slice(0, 1).toUpperCase()}${locale.slice(1)}`;
  const fallbackKey = `${base}En`;
  const localized = entry[localizedKey];
  const fallback = entry[fallbackKey];

  return typeof localized === "string" && localized.length > 0
    ? localized
    : typeof fallback === "string"
      ? fallback
      : "";
}

export async function getLocalizedSiteSettings(locale: Locale) {
  noStore();
  const settings = (await prisma.siteSettings.findFirst({
    orderBy: { createdAt: "asc" }
  })) ?? defaultSiteSettings;

  return {
    brandName: settings.brandName,
    hideCommerce: Boolean(settings.hideCommerce),
    announcementText: localizedValue(settings, "announcementText", locale),
    announcementLinkLabel: localizedValue(settings, "announcementLinkLabel", locale),
    announcementLink: settings.announcementLink || `/${locale}/catalog`,
    footerPhone: settings.footerPhone || "",
    footerTelegram: settings.footerTelegram || "",
    footerTelegramLink: settings.footerTelegramLink || "",
    footerInstagram: settings.footerInstagram || "",
    footerInstagramLink: settings.footerInstagramLink || "",
    storeAddress: settings.storeAddress || "",
    storeMapLink: settings.storeMapLink || "",
    footerAddress: localizedValue(settings, "footerAddress", locale)
  };
}

export async function getHomePageContent(locale: Locale) {
  noStore();
  const [heroRow, aboutRow, promoRows, galleryRows, testimonialRows, bestsellers] = await Promise.all([
    prisma.homeHero.findFirst({ orderBy: { createdAt: "asc" } }),
    prisma.homeAboutSection.findFirst({ orderBy: { createdAt: "asc" } }),
    prisma.homePromoCard.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.galleryItem.findMany({ where: { active: true }, orderBy: [{ type: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.testimonial.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.product.findMany({
      where: { active: true, isBestseller: true },
      orderBy: [{ homeSortOrder: "asc" }, { createdAt: "asc" }],
      take: 4
    })
  ]);

  const hero = heroRow ?? defaultHomeHero;
  const about = aboutRow ?? defaultHomeAbout;

  return {
    hero: {
      badge: localizedValue(hero, "badge", locale),
      title: localizedValue(hero, "title", locale),
      description: localizedValue(hero, "description", locale),
      primaryCta: localizedValue(hero, "primaryCta", locale),
      primaryCtaLink: hero.primaryCtaLink || `/${locale}/catalog`,
      secondaryCta: localizedValue(hero, "secondaryCta", locale),
      secondaryCtaLink: hero.secondaryCtaLink || `/${locale}/catalog`,
      imageUrl: hero.imageUrl || ""
    },
    bestsellers: bestsellers.map((product) => ({
      id: product.id,
      slug: product.slug,
      name:
        locale === "uz"
          ? product.nameUz
          : locale === "ru"
            ? product.nameRu || product.nameEn
            : product.nameEn,
      shortDescription:
        locale === "uz"
          ? product.shortDescriptionUz || product.shortDescriptionEn || ""
          : locale === "ru"
            ? product.shortDescriptionRu || product.shortDescriptionEn || ""
            : product.shortDescriptionEn || "",
      price: product.price,
      imageUrl: product.imageUrl || ""
    })),
    promoCards: promoRows.map((row) => ({
      id: row.id,
      title: localizedValue(row, "title", locale),
      description: localizedValue(row, "description", locale),
      buttonLabel: promoButtonLabels[locale],
      buttonLink: `/${locale}/catalog`,
      imageUrl: row.imageUrl || ""
    })),
    galleryImages: galleryRows
      .filter((row) => row.type === "IMAGE")
      .map((row) => ({
        id: row.id,
        title: localizedValue(row, "title", locale),
        imageUrl: row.imageUrl
      })),
    galleryVideos: galleryRows
      .filter((row) => row.type === "VIDEO")
      .map((row) => ({
        id: row.id,
        title: localizedValue(row, "title", locale),
        imageUrl: row.imageUrl,
        videoUrl: row.videoUrl || ""
      })),
    testimonials: testimonialRows.map((row) => ({
      id: row.id,
      authorName: row.authorName,
      authorRole: localizedValue(row, "authorRole", locale),
      productName: localizedValue(row, "productName", locale),
      body: localizedValue(row, "body", locale),
      avatarUrl: row.avatarUrl || "",
      rating: row.rating
    })),
    about: {
      title: localizedValue(about, "title", locale),
      description: localizedValue(about, "description", locale),
      secondaryTitle: localizedValue(about, "secondaryTitle", locale),
      secondaryDescription: localizedValue(about, "secondaryDescription", locale),
      bottomDescription: localizedValue(about, "bottomDescription", locale),
      imageUrl: about.imageUrl || ""
    }
  };
}
