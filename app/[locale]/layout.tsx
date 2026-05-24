import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDictionary, isLocale } from "@/lib/i18n";
import { buildGraphSchema, buildOrganizationSchema, buildWebSiteSchema } from "@/lib/structured-data";
import { getStorefrontProductSearchItems } from "@/lib/storefront-products";
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
  const [siteSettings, searchProducts] = await Promise.all([
    getLocalizedSiteSettings(locale),
    getStorefrontProductSearchItems(locale)
  ]);

  const shell = (
    <div className="min-h-screen">
      <JsonLd data={buildGraphSchema([buildOrganizationSchema(siteSettings), buildWebSiteSchema(siteSettings)])} />
      <SiteHeader locale={locale} siteSettings={siteSettings} searchProducts={searchProducts} />
      <main>{children}</main>
      <SiteFooter locale={locale} dictionary={dictionary} siteSettings={siteSettings} />
    </div>
  );

  if (siteSettings.hideCommerce) {
    return shell;
  }

  const [{ CartProvider }, { CustomerProfileProvider }] = await Promise.all([
    import("@/components/cart-provider"),
    import("@/components/customer-profile-provider")
  ]);

  return (
    <CartProvider locale={locale} currency={dictionary.currency}>
      <CustomerProfileProvider>{shell}</CustomerProfileProvider>
    </CartProvider>
  );
}
