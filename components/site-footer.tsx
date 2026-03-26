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
    pages: "Sahifalar",
    stores: "Do'konlarimiz",
    subscribe: "Yangiliklarimizga obuna bo'ling!"
  },
  ru: {
    pages: "Страницы",
    stores: "Наши магазины",
    subscribe: "Подпишись на наши новости!"
  },
  en: {
    pages: "Pages",
    stores: "Our stores",
    subscribe: "Subscribe to our updates!"
  }
} as const;

export function SiteFooter({ locale, dictionary, siteSettings }: SiteFooterProps) {
  const labels = footerLabels[locale];

  return (
    <footer className="brand-footer-surface text-white">
      <div className="brand-footer-grid">
        <div className="mx-auto max-w-[1560px] px-8 py-8 lg:px-10 lg:py-10 xl:px-12 xl:py-12">
          <div className="border-t border-white/35 pt-10 lg:pt-12">
            <div className="grid gap-10 lg:grid-cols-[1.42fr_0.56fr_0.94fr] lg:gap-14 xl:gap-20">
              <div className="pt-2">
                <p className="text-[4.1rem] font-black uppercase leading-none tracking-[-0.08em] text-white lg:text-[4.7rem]">
                  {siteSettings.brandName}
                </p>

                <div className="mt-12 space-y-5 text-[1.05rem] text-white/92 lg:text-[1.08rem]">
                  <p className="flex items-center gap-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35">
                      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                        <path d="M6.5 4.5h2.4l1.2 3.4-1.6 1.6a15.7 15.7 0 0 0 6 6l1.6-1.6 3.4 1.2v2.4a1.5 1.5 0 0 1-1.6 1.5A16.4 16.4 0 0 1 5 6.1a1.5 1.5 0 0 1 1.5-1.6Z" />
                      </svg>
                    </span>
                    {siteSettings.footerPhone}
                  </p>

                  <p className="flex items-center gap-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35">
                      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                        <path d="M4 7.5 12 13l8-5.5" />
                        <rect x="4" y="6" width="16" height="12" rx="2" />
                      </svg>
                    </span>
                    {siteSettings.footerEmail}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-[1.05rem] text-white/92 lg:text-[1.08rem]">
                    <p className="flex items-center gap-4">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35">
                        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                          <path d="M20 11.5A8.5 8.5 0 0 1 8 19l-4 1 1-4a8.5 8.5 0 1 1 15-4.5Z" />
                          <path d="M9 9.5c.3 1.8 2.2 3.7 4 4" />
                        </svg>
                      </span>
                      {siteSettings.footerTelegram}
                    </p>

                    <p className="flex items-center gap-4">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35">
                        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                          <path d="m21 4-3 14-5.5-4-3 2 1-4.5L21 4Z" />
                        </svg>
                      </span>
                      {siteSettings.footerInstagram}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <p className="text-[1.12rem] font-medium text-white">{labels.pages}</p>
                <div className="mt-8 space-y-5 text-[1.05rem] text-white/88">
                  <Link href={`/${locale}`} className="block transition hover:text-white">
                    {dictionary.nav.home}
                  </Link>
                  <Link href={`/${locale}/catalog`} className="block transition hover:text-white">
                    {dictionary.nav.catalog}
                  </Link>
                  <Link href={`/${locale}#video-gallery`} className="block transition hover:text-white">
                    Blog
                  </Link>
                  <Link href={`/${locale}#about`} className="block transition hover:text-white">
                    O nas
                  </Link>
                </div>
              </div>

              <div className="pt-1">
                <p className="text-[1.12rem] font-medium text-white">{labels.stores}</p>
                <p className="mt-8 max-w-[420px] text-[1.05rem] leading-8 text-white/88">
                  {siteSettings.footerAddress}
                </p>

                <p className="mt-12 text-[1.12rem] font-medium text-white">
                  {siteSettings.newsletterTitle || labels.subscribe}
                </p>

                <div className="mt-7 flex items-center gap-4 border-b border-white/28 pb-4 text-[1.05rem] text-white/62">
                  <span>{siteSettings.newsletterPlaceholder}</span>
                  <span className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/35">
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                      <path d="M4 7.5 12 13l8-5.5" />
                      <rect x="4" y="6" width="16" height="12" rx="2" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-14 text-center text-[1rem] text-white/55">
              © 2026 {siteSettings.brandName}. All rights reserved.
            </p>

            <div className="mt-8 border-t border-white/30" />
          </div>
        </div>
      </div>
    </footer>
  );
}
