import Link from "next/link";

import type { Dictionary, Locale } from "@/lib/i18n";

type SiteFooterProps = {
  locale: Locale;
  dictionary: Dictionary;
  siteSettings: {
    brandName: string;
    footerPhone: string;
    footerEmail: string;
    footerTelegram: string;
    footerInstagram: string;
    footerAddress: string;
    newsletterTitle: string;
    newsletterPlaceholder: string;
  };
};

const footerLabels = {
  uz: {
    pages: "Stranitsi",
    stores: "Nashi magazini",
    subscribe: "Podpishites na nashi novosti!"
  },
  ru: {
    pages: "Страницы",
    stores: "Наши магазины",
    subscribe: "Подпишись на наши новости!"
  },
  en: {
    pages: "Pages",
    stores: "Stores",
    subscribe: "Subscribe to our updates!"
  }
} as const;

export function SiteFooter({ locale, dictionary, siteSettings }: SiteFooterProps) {
  const labels = footerLabels[locale];

  return (
    <footer className="bg-[linear-gradient(135deg,#7d0a1d_0%,#b10f2a_52%,#8a1124_100%)] text-white">
      <div className="mx-auto max-w-[1180px] px-4 py-12 lg:px-6">
        <div className="border-t border-white/20 pt-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.7fr_1fr]">
            <div>
              <p className="text-[2.1rem] font-black uppercase tracking-[-0.05em]">{siteSettings.brandName}</p>
              <div className="mt-6 space-y-3 text-[13px] text-white/82">
                <p>{siteSettings.footerPhone}</p>
                <p>{siteSettings.footerEmail}</p>
                <p>{siteSettings.footerTelegram}</p>
                <p>{siteSettings.footerInstagram}</p>
              </div>
            </div>

            <div>
              <p className="text-[13px] text-white/75">{labels.pages}</p>
              <div className="mt-5 space-y-3 text-[13px] text-white/82">
                <Link href={`/${locale}`}>{dictionary.nav.home}</Link>
                <Link href={`/${locale}/catalog`}>{dictionary.nav.catalog}</Link>
                <Link href={`/${locale}#video-gallery`}>Blog</Link>
                <Link href={`/${locale}#about`}>O nas</Link>
              </div>
            </div>

            <div>
              <p className="text-[13px] text-white/75">{labels.stores}</p>
              <p className="mt-5 max-w-[260px] text-[13px] leading-6 text-white/82">{siteSettings.footerAddress}</p>
              <p className="mt-6 text-[13px] text-white/82">{labels.subscribe}</p>
              <div className="mt-3 flex items-center gap-3 border-b border-white/25 pb-2 text-[13px] text-white/60">
                <span>{siteSettings.newsletterPlaceholder}</span>
                <span className="ml-auto text-[12px]">[]</span>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-[11px] text-white/45">(c) 2026 {siteSettings.brandName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
