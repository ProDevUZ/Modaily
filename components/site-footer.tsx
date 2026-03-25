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

export function SiteFooter({ locale, dictionary, siteSettings }: SiteFooterProps) {
  return (
    <footer className="mt-16 bg-[linear-gradient(135deg,#740718_0%,#b50f2c_52%,#7e0c20_100%)] text-white">
      <div className="mx-auto max-w-[1240px] px-4 py-12 lg:px-8">
        <div className="border-t border-white/20 pt-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.7fr_1fr]">
            <div>
              <p className="text-[2.4rem] font-black uppercase tracking-tight">{siteSettings.brandName}</p>
              <div className="mt-6 space-y-3 text-sm text-white/82">
                <p>{siteSettings.footerPhone}</p>
                <p>{siteSettings.footerEmail}</p>
                <p>{siteSettings.footerTelegram}</p>
                <p>{siteSettings.footerInstagram}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/75">Pages</p>
              <div className="mt-5 space-y-3 text-sm text-white/82">
                <Link href={`/${locale}`}>{dictionary.nav.home}</Link>
                <Link href={`/${locale}/catalog`}>{dictionary.nav.catalog}</Link>
                <Link href={`/${locale}#video-gallery`}>Blog</Link>
                <Link href={`/${locale}#about`}>About</Link>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/75">Store</p>
              <p className="mt-5 max-w-sm text-sm leading-7 text-white/82">{siteSettings.footerAddress}</p>
              <p className="mt-8 text-sm font-medium text-white/85">{siteSettings.newsletterTitle}</p>
              <div className="mt-3 flex items-center gap-3 border-b border-white/30 pb-2 text-sm text-white/65">
                <span>{siteSettings.newsletterPlaceholder}</span>
                <span className="ml-auto">send</span>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-xs text-white/55">(c) 2026 {siteSettings.brandName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
