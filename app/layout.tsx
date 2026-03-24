import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
