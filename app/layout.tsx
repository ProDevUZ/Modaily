import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  display: "swap",
  fallback: ["Arial", "sans-serif"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://modaily.com"),
  title: {
    default: "Modaily | Formulated in UK Skincare",
    template: "%s | Modaily"
  },
  description:
    "Modaily is a multilingual skincare storefront for women seeking UK-formulated daily rituals, barrier repair, glow and hydration.",
  openGraph: {
    title: "Modaily",
    description: "UK-formulated skincare for everyday rituals.",
    url: "https://modaily.com",
    siteName: "Modaily",
    locale: "uz_UZ",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${avenirBody.variable} ${artegraDisplay.variable} ${artegraHeroTitle.variable} ${artegraBrand.variable} ${artegraProductTitle.variable}`}>{children}</body>
    </html>
  );
}
