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
    stores: "Stores",
    subscribe: "Subscribe to our updates!"
  }
} as const;

export function SiteFooter({ locale, dictionary, siteSettings }: SiteFooterProps) {
  const labels = footerLabels[locale];

  return (
    <footer className="brand-footer-surface text-white">
      <div className="brand-footer-grid">
        <div className="mx-auto max-w-[1180px] px-4 py-12 lg:px-6 lg:py-16">
          <div className="border-t border-white/30 pt-10">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.55fr_0.9fr]">
              <div>
                <p className="text-[2.45rem] font-black uppercase tracking-[-0.06em] text-white">
                  {siteSettings.brandName}
                </p>

                <div className="mt-7 space-y-4 text-[14px] text-white/88">
                  <p className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/28">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                        <path d="M6.5 4.5h2.4l1.2 3.4-1.6 1.6a15.7 15.7 0 0 0 6 6l1.6-1.6 3.4 1.2v2.4a1.5 1.5 0 0 1-1.6 1.5A16.4 16.4 0 0 1 5 6.1a1.5 1.5 0 0 1 1.5-1.6Z" />
                      </svg>
                    </span>
                    {siteSettings.footerPhone}
                  </p>

                  <p className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/28">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                        <path d="M4 7.5 12 13l8-5.5" />
                        <rect x="4" y="6" width="16" height="12" rx="2" />
                      </svg>
                    </span>
                    {siteSettings.footerEmail}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[14px] text-white/88">
                    <p className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/28">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                          <path d="M20 11.5A8.5 8.5 0 0 1 8 19l-4 1 1-4a8.5 8.5 0 1 1 15-4.5Z" />
                          <path d="M9 9.5c.3 1.8 2.2 3.7 4 4" />
                        </svg>
                      </span>
                      {siteSettings.footerTelegram}
                    </p>

                    <p className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/28">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                          <path d="m21 4-3 14-5.5-4-3 2 1-4.5L21 4Z" />
                        </svg>
                      </span>
                      {siteSettings.footerInstagram}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[14px] text-white/86">{labels.pages}</p>
                <div className="mt-5 space-y-4 text-[14px] text-white/88">
                  <Link href={`/${locale}`} className="transition hover:text-white">
                    {dictionary.nav.home}
                  </Link>
                  <Link href={`/${locale}/catalog`} className="transition hover:text-white">
                    {dictionary.nav.catalog}
                  </Link>
                  <Link href={`/${locale}#video-gallery`} className="transition hover:text-white">
                    Blog
                  </Link>
                  <Link href={`/${locale}#about`} className="transition hover:text-white">
                    O nas
                  </Link>
                </div>
              </div>

              <div>
                <p className="text-[14px] text-white/86">{labels.stores}</p>
                <p className="mt-5 max-w-[270px] text-[14px] leading-6 text-white/86">
                  {siteSettings.footerAddress}
                </p>
                <p className="mt-8 text-[14px] font-medium text-white">
                  {siteSettings.newsletterTitle || labels.subscribe}
                </p>
                <div className="mt-4 flex items-center gap-3 border-b border-white/28 pb-3 text-[14px] text-white/58">
                  <span>{siteSettings.newsletterPlaceholder}</span>
                  <span className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/28">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                      <path d="M4 7.5 12 13l8-5.5" />
                      <rect x="4" y="6" width="16" height="12" rx="2" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-12 text-center text-[11px] text-white/48">
              (c) 2026 {siteSettings.brandName}. All rights reserved.
            </p>
            <div className="mt-8 border-t border-white/24" />
          </div>
        </div>
      </div>
    </footer>
  );
}
