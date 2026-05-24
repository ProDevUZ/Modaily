import type { Metadata } from "next";

import { normalizeDisplayText } from "@/lib/display-text";
import { locales, type Locale } from "@/lib/i18n";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || "https://modaily.uk";
export const SITE_NAME = "Modaily";
export const DEFAULT_LOCALE: Locale = "en";
export const SEO_LOCALE_HEADER = "x-modaily-locale";

const openGraphLocales: Record<Locale, string> = {
  uz: "uz_UZ",
  ru: "ru_RU",
  en: "en_US"
};

export const noIndexRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false
  }
};

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function localizedPath(locale: Locale, path = "") {
  const normalizedPath = path === "/" ? "" : path;
  return `/${locale}${normalizedPath.startsWith("/") || normalizedPath.length === 0 ? normalizedPath : `/${normalizedPath}`}`;
}

export function localizedLanguages(path = "") {
  return {
    ...Object.fromEntries(locales.map((locale) => [locale, localizedPath(locale, path)])),
    "x-default": localizedPath(DEFAULT_LOCALE, path)
  };
}

export function localizedAlternates(locale: Locale, path = ""): Metadata["alternates"] {
  return {
    canonical: localizedPath(locale, path),
    languages: localizedLanguages(path)
  };
}

export function metadataTitle(value: string) {
  const normalized = normalizeDisplayText(value).replace(/\s*\|\s*Modaily\s*$/i, "").trim();
  return normalized || SITE_NAME;
}

export function metadataDescription(value: string, fallback: string) {
  return normalizeDisplayText(value || fallback).trim();
}

export function localizedOpenGraph({
  locale,
  path,
  title,
  description,
  type = "website",
  images
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
  images?: NonNullable<Metadata["openGraph"]>["images"];
}): Metadata["openGraph"] {
  return {
    title,
    description,
    url: absoluteUrl(localizedPath(locale, path)),
    siteName: SITE_NAME,
    locale: openGraphLocales[locale],
    alternateLocale: locales.filter((entry) => entry !== locale).map((entry) => openGraphLocales[entry]),
    type,
    images
  };
}
