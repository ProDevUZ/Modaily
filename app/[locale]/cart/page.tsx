import type { Metadata } from "next";

import { CartProvider } from "@/components/cart-provider";
import { CartPageView } from "@/components/cart-page-view";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { noIndexRobots } from "@/lib/seo";
import { getLocalizedSiteSettings } from "@/lib/storefront-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

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
    title: dictionary.meta.cart.title,
    description: dictionary.meta.cart.description,
    robots: noIndexRobots,
    alternates: {
      canonical: `/${locale}/cart`
    }
  };
}

export default async function CartPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return null;
  }

  const dictionary = getDictionary(locale);
  const siteSettings = await getLocalizedSiteSettings(locale);

  if (siteSettings.hideCommerce) {
    return (
      <CartProvider locale={locale} currency={dictionary.currency}>
        <CartPageView locale={locale} dictionary={dictionary} />
      </CartProvider>
    );
  }

  return <CartPageView locale={locale} dictionary={dictionary} />;
}
