import Link from "next/link";

import { FooterGradientBackground } from "@/components/footer-gradient-background";
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

function ContactIcon({
  children,
  href,
  label
}: {
  children: React.ReactNode;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/50 text-white transition hover:bg-white/10"
    >
      {children}
    </a>
  );
}

export function SiteFooter({ locale, dictionary, siteSettings }: SiteFooterProps) {
  const labels = footerLabels[locale];

  return (
    <FooterGradientBackground imageSrc="/images/home/ModailyBGred.jpg" className="text-white">
      <footer>
        <div className="mx-auto max-w-[1560px] px-6 py-8 lg:px-10 lg:py-10 xl:px-12 xl:py-12">
          <div className="lg:hidden">
            <div className="border-t border-white/35 px-5 pt-8 pb-6 text-center">
              <p className="brand-wordmark text-[42px] uppercase leading-none text-white">
                {siteSettings.brandName}
              </p>

              <div className="mx-auto mt-5 h-[2px] w-[34px] rounded-full bg-white/75" />

              <nav className="mt-5 flex items-center justify-center gap-6 text-[15px] text-white">
                <Link href={`/${locale}`} className="transition hover:text-white/80">
                  {dictionary.nav.home}
                </Link>
                <Link href={`/${locale}/catalog`} className="transition hover:text-white/80">
                  {dictionary.nav.catalog}
                </Link>
                <Link href={`/${locale}#video-gallery`} className="transition hover:text-white/80">
                  Blog
                </Link>
                <Link href={`/${locale}#about`} className="transition hover:text-white/80">
                  O nas
                </Link>
              </nav>

              <div className="mt-8 text-left">
                <p className="text-[14px] font-medium text-white">{labels.stores}</p>
                <p className="mt-3 max-w-[260px] text-[14px] leading-8 text-white/90">
                  {siteSettings.footerAddress}
                </p>
              </div>

              <div className="mt-8 text-left">
                <p className="text-[14px] font-medium text-white">
                  {siteSettings.newsletterTitle || labels.subscribe}
                </p>
                <div className="mt-4 flex items-center gap-3 border-b border-white/35 pb-3 text-[14px] text-white/75">
                  <span>{siteSettings.newsletterPlaceholder}</span>
                  <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-[4px] border border-white/70">
                    <svg viewBox="0 0 24 24" className="h-[14px] w-[14px]" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                      <path d="M4 7.5 12 13l8-5.5" />
                      <rect x="4" y="6" width="16" height="12" rx="2" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mt-7 border-t border-white/30 pt-5">
                <div className="flex items-center justify-center gap-4">
                  <ContactIcon href={`tel:${siteSettings.footerPhone.replace(/\s+/g, "")}`} label="Phone">
                    <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                      <path d="M6.5 4.5h2.4l1.2 3.4-1.6 1.6a15.7 15.7 0 0 0 6 6l1.6-1.6 3.4 1.2v2.4a1.5 1.5 0 0 1-1.6 1.5A16.4 16.4 0 0 1 5 6.1a1.5 1.5 0 0 1 1.5-1.6Z" />
                    </svg>
                  </ContactIcon>

                  <ContactIcon href={`https://instagram.com/${siteSettings.footerInstagram.replace(/^@/, "")}`} label="Instagram">
                    <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                      <rect x="4.5" y="4.5" width="15" height="15" rx="4.5" />
                      <circle cx="12" cy="12" r="3.6" />
                      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
                    </svg>
                  </ContactIcon>

                  <ContactIcon href={`mailto:${siteSettings.footerEmail}`} label="Email">
                    <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                      <path d="M4 7.5 12 13l8-5.5" />
                      <rect x="4" y="6" width="16" height="12" rx="2" />
                    </svg>
                  </ContactIcon>

                  <ContactIcon href={`https://t.me/${siteSettings.footerTelegram.replace(/^@/, "")}`} label="Telegram">
                    <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                      <path d="m21 4-3 14-5.5-4-3 2 1-4.5L21 4Z" />
                    </svg>
                  </ContactIcon>

                  <ContactIcon href={`https://wa.me/${siteSettings.footerPhone.replace(/\D/g, "")}`} label="WhatsApp">
                    <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                      <path d="M20 11.5A8.5 8.5 0 0 1 8 19l-4 1 1-4a8.5 8.5 0 1 1 15-4.5Z" />
                      <path d="M9 9.5c.3 1.8 2.2 3.7 4 4" />
                    </svg>
                  </ContactIcon>
                </div>
              </div>

              <p className="mt-7 text-center text-[12px] text-white/85">
                © 2026 {siteSettings.brandName}. All rights reserved.
              </p>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="border-t border-white/35 pt-10 lg:pt-12">
              <div className="grid gap-10 lg:grid-cols-[1.42fr_0.56fr_0.94fr] lg:gap-14 xl:gap-20">
                <div className="pt-2">
                  <p className="brand-wordmark text-[4.1rem] uppercase leading-none text-white lg:text-[4.7rem]">
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
                © 2026 <span className="brand-wordmark align-baseline text-[1rem] uppercase">{siteSettings.brandName}</span>. All rights reserved.
              </p>

              <div className="mt-8 border-t border-white/30" />
            </div>
          </div>
        </div>
      </footer>
    </FooterGradientBackground>
  );
}
