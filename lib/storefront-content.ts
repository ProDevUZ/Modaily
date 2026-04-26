import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { defaultHomeAbout, defaultHomeHero, defaultSiteSettings } from "@/lib/content-defaults";
import { buildProductBadges } from "@/lib/product-badges";

const promoButtonLabels = {
  uz: "Batafsil",
  ru: "Узнать подробнее",
  en: "Learn more"
} as const;

function localizeInternalLink(link: string | null | undefined, locale: Locale, fallback: string) {
  const value = link?.trim();

  if (!value) {
    return fallback;
  }

  if (/^https?:\/\//i.test(value) || value.startsWith("#")) {
    return value;
  }

  if (value.startsWith("/uz/") || value.startsWith("/ru/") || value.startsWith("/en/")) {
    return `/${locale}${value.slice(3)}`;
  }

  if (value === "/uz" || value === "/ru" || value === "/en") {
    return `/${locale}`;
  }

  if (value.startsWith("/")) {
    return `/${locale}${value}`;
  }

  return fallback;
}

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

function localizedFlexibleValue(entry: Record<string, unknown>, base: string, locale: Locale) {
  return (
    localizedValue(entry, base, locale) ||
    (typeof entry[`${base}Uz`] === "string" ? (entry[`${base}Uz`] as string) : "") ||
    (typeof entry[`${base}Ru`] === "string" ? (entry[`${base}Ru`] as string) : "") ||
    (typeof entry[`${base}En`] === "string" ? (entry[`${base}En`] as string) : "")
  );
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
    footerEmail: settings.footerEmail || "",
    footerTelegram: settings.footerTelegram || "",
    footerTelegramLink: settings.footerTelegramLink || "",
    footerInstagram: settings.footerInstagram || "",
    footerInstagramLink: settings.footerInstagramLink || "",
    storeAddress: settings.storeAddress || "",
    storeMapLink: settings.storeMapLink || "",
    footerAddress: localizedValue(settings, "footerAddress", locale),
    newsletterTitle:
      localizedValue(settings, "newsletterTitle", locale) || localizedValue(defaultSiteSettings, "newsletterTitle", locale),
    newsletterPlaceholder:
      localizedValue(settings, "newsletterPlaceholder", locale) ||
      localizedValue(defaultSiteSettings, "newsletterPlaceholder", locale),
    aboutPage: {
      title: localizedValue(settings, "aboutTitle", locale) || localizedValue(defaultHomeAbout, "title", locale),
      description:
        localizedValue(settings, "aboutDescription", locale) || localizedValue(defaultHomeAbout, "description", locale),
      brandTitle:
        localizedValue(settings, "aboutBrandTitle", locale) || localizedValue(defaultHomeAbout, "secondaryTitle", locale),
      panelDescription:
        localizedValue(settings, "aboutPanelDescription", locale) || localizedValue(defaultHomeAbout, "secondaryDescription", locale),
      panelSecondaryDescription:
        localizedValue(settings, "aboutPanelSecondaryDescription", locale) || localizedValue(defaultHomeAbout, "bottomDescription", locale),
      imageUrl: settings.aboutImageUrl || defaultHomeAbout.imageUrl
    }
  };
}

export async function getHomePageContent(locale: Locale) {
  noStore();
  const [heroRow, aboutRow, promoRows, galleryRows, galleryHeadingRows, testimonialRows, bestsellers] = await Promise.all([
    prisma.homeHero.findFirst({
      orderBy: { createdAt: "asc" },
      include: {
        heroProduct: {
          select: {
            slug: true,
            active: true
          }
        }
      }
    }),
    prisma.homeAboutSection.findFirst({ orderBy: { createdAt: "asc" } }),
    prisma.homePromoCard.findMany({
      where: { active: true },
      include: {
        promoProduct: {
          select: {
            slug: true,
            active: true
          }
        }
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
    }),
    prisma.galleryItem.findMany({ where: { active: true }, orderBy: [{ type: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.gallerySectionHeading.findMany({ where: { active: true }, orderBy: [{ type: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.testimonial.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.product.findMany({
      where: { active: true, isBestseller: true },
      orderBy: [{ homeSortOrder: "asc" }, { createdAt: "asc" }],
      take: 4
    })
  ]);

  const hero = heroRow ?? defaultHomeHero;
  const about = aboutRow ?? defaultHomeAbout;
  const heroPrimaryCtaLink =
    heroRow?.heroProduct?.active && heroRow.heroProduct.slug
      ? `/${locale}/catalog/${heroRow.heroProduct.slug}`
      : localizeInternalLink(hero.primaryCtaLink, locale, `/${locale}/catalog`);

  return {
    hero: {
      primaryCtaLink: heroPrimaryCtaLink,
      imageUrl: hero.imageUrl || "",
      mobileImageUrl: hero.mobileImageUrl || hero.imageUrl || ""
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
      badges: buildProductBadges(product, locale),
      imageUrl: product.imageUrl || ""
    })),
    promoCards: promoRows.map((row) => ({
      id: row.id,
      title: localizedValue(row, "title", locale),
      description: localizedValue(row, "description", locale),
      buttonLabel: promoButtonLabels[locale],
      buttonLink:
        row.promoProduct?.active && row.promoProduct.slug
          ? `/${locale}/catalog/${row.promoProduct.slug}`
          : `/${locale}/catalog`,
      imageUrl: row.imageUrl || ""
    })),
    galleryImages: galleryRows
      .filter((row) => row.type === "IMAGE")
      .map((row) => ({
        id: row.id,
        title: localizedValue(row, "title", locale),
        imageUrl: row.imageUrl
      })),
    galleryImageHeadings: galleryHeadingRows
      .filter((row) => row.type === "IMAGE")
      .map((row) => localizedFlexibleValue(row, "text", locale))
      .filter((value) => value.trim().length > 0),
    galleryVideos: galleryRows
      .filter((row) => row.type === "VIDEO")
      .map((row) => ({
        id: row.id,
        title: localizedValue(row, "title", locale),
        imageUrl: row.imageUrl,
        videoUrl: row.videoUrl || ""
      })),
    galleryVideoHeadings: galleryHeadingRows
      .filter((row) => row.type === "VIDEO")
      .map((row) => localizedFlexibleValue(row, "text", locale))
      .filter((value) => value.trim().length > 0),
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
