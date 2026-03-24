import type { Metadata } from "next";

import { CartPageView } from "@/components/cart-page-view";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";

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

  return <CartPageView locale={locale} dictionary={dictionary} />;
}
