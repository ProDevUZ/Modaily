import Link from "next/link";

import type { Dictionary, Locale } from "@/lib/i18n";

type SiteFooterProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  return (
    <footer className="border-t border-stone-200/60 py-10">
      <div className="shell">
        <div className="glass rounded-[2rem] p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xl font-display text-ink">Modaily</p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">{dictionary.footer.copy}</p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm font-semibold text-stone-600">
              <Link href={`/${locale}`}>{dictionary.nav.home}</Link>
              <Link href={`/${locale}/catalog`}>{dictionary.nav.catalog}</Link>
              <Link href={`/${locale}/cart`}>{dictionary.nav.cart}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
