import { notFound } from "next/navigation";

import { CartProvider } from "@/components/cart-provider";
import { CustomerProfileProvider } from "@/components/customer-profile-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { getStorefrontProducts } from "@/lib/storefront-products";
import { getLocalizedSiteSettings } from "@/lib/storefront-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  const siteSettings = await getLocalizedSiteSettings(locale);
  const searchProducts = await getStorefrontProducts(locale);

  return (
    <CartProvider locale={locale} currency={dictionary.currency}>
      <CustomerProfileProvider>
        <div className="min-h-screen">
          <SiteHeader locale={locale} dictionary={dictionary} siteSettings={siteSettings} searchProducts={searchProducts} />
          <main>{children}</main>
          <SiteFooter locale={locale} dictionary={dictionary} siteSettings={siteSettings} />
        </div>
      </CustomerProfileProvider>
    </CartProvider>
  );
}
