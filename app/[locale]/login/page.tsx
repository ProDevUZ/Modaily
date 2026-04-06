import type { Metadata } from "next";

import { LoginPageView } from "@/components/login-page-view";
import { getDictionary, isLocale, locales } from "@/lib/i18n";

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

  return <LoginPageView locale={locale} dictionary={dictionary} />;
}
