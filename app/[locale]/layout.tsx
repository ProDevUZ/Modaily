import { notFound } from "next/navigation";

import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);

  return (
    <CartProvider locale={locale} currency={dictionary.currency}>
      <div className="min-h-screen">
        <SiteHeader locale={locale} dictionary={dictionary} />
        <main>{children}</main>
        <SiteFooter locale={locale} dictionary={dictionary} />
      </div>
    </CartProvider>
  );
}
