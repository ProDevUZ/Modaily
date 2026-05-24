import type { Metadata } from "next";

import { CustomerProfileProvider } from "@/components/customer-profile-provider";
import { LoginPageView } from "@/components/login-page-view";
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

  return {
    title: "Login",
    robots: noIndexRobots,
    alternates: {
      canonical: `/${locale}/login`
    }
  };
}

export default async function LoginPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return null;
  }

  const dictionary = getDictionary(locale);
  const siteSettings = await getLocalizedSiteSettings(locale);

  if (siteSettings.hideCommerce) {
    return (
      <CustomerProfileProvider>
        <LoginPageView locale={locale} dictionary={dictionary} />
      </CustomerProfileProvider>
    );
  }

  return <LoginPageView locale={locale} dictionary={dictionary} />;
}
