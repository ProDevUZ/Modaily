import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import "./globals.css";

import { isLocale } from "@/lib/i18n";
import { DEFAULT_LOCALE, SEO_LOCALE_HEADER, SITE_NAME, SITE_URL } from "@/lib/seo";

const avenirBody = localFont({
  src: [
    {
      path: "../public/shrift/Avenir LT 55 Roman/avenirlt_roman.ttf",
      weight: "400",
      style: "normal"
    }
  ],
  variable: "--font-body",
  display: "swap",
  fallback: ["Arial", "sans-serif"]
});

const artegraDisplay = localFont({
  src: [
    {
      path: "../public/shrift/Artegra-Sans-Font-Family/Demo_Fonts/Fontspring-DEMO-artegra_sans-extended-alt-400-regular.otf",
      weight: "400",
      style: "normal"
    },
    {
      path: "../public/shrift/Artegra-Sans-Font-Family/Demo_Fonts/Fontspring-DEMO-artegra_sans-extended-alt-600-semibold.otf",
      weight: "600",
      style: "normal"
    },
    {
      path: "../public/shrift/Artegra-Sans-Font-Family/Demo_Fonts/Fontspring-DEMO-artegra_sans-extended-alt-900-black.otf",
      weight: "900",
      style: "normal"
    }
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Arial", "sans-serif"]
});

const artegraHeroTitle = localFont({
  src: [
    {
      path: "../public/shrift/Artegra-Sans-Font-Family/Demo_Fonts/Fontspring-DEMO-artegra_sans-extended-alt-900-black.otf",
      weight: "900",
      style: "normal"
    }
  ],
  variable: "--font-hero-title",
  preload: false,
  display: "swap",
  fallback: ["Arial", "sans-serif"]
});

const artegraBrand = localFont({
  src: [
    {
      path: "../public/shrift/Artegra-Sans-Font-Family/Demo_Fonts/Fontspring-DEMO-artegra_sans-extended-sc-800-extrabold.otf",
      weight: "800",
      style: "normal"
    }
  ],
  variable: "--font-brand",
  preload: false,
  display: "swap",
  fallback: ["Arial", "sans-serif"]
});

const artegraProductTitle = localFont({
  src: [
    {
      path: "../public/shrift/Artegra-Sans-Font-Family/Demo_Fonts/Fontspring-DEMO-artegra_sans-300-light.otf",
      weight: "300",
      style: "normal"
    }
  ],
  variable: "--font-product-title",
  preload: false,
  display: "swap",
  fallback: ["Arial", "sans-serif"]
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Modaily | Formulated in UK Skincare",
    template: "%s | Modaily"
  },
  description:
    "Modaily is a multilingual skincare storefront for women seeking UK-formulated daily rituals, barrier repair, glow and hydration.",
  openGraph: {
    title: "Modaily",
    description: "UK-formulated skincare for everyday rituals.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const localeHeader = requestHeaders.get(SEO_LOCALE_HEADER) || DEFAULT_LOCALE;
  const htmlLang = isLocale(localeHeader) ? localeHeader : DEFAULT_LOCALE;

  return (
    <html lang={htmlLang}>
      <body className={`${avenirBody.variable} ${artegraDisplay.variable} ${artegraHeroTitle.variable} ${artegraBrand.variable} ${artegraProductTitle.variable}`}>{children}</body>
    </html>
  );
}
