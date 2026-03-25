"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useCart } from "@/components/cart-provider";
import { localeNames, locales, type Dictionary, type Locale } from "@/lib/i18n";

type SiteHeaderProps = {
  locale: Locale;
  dictionary: Dictionary;
  siteSettings: {
    brandName: string;
    announcementText: string;
    announcementLinkLabel: string;
    announcementLink: string;
  };
};

const navLabels = {
  uz: { about: "Biz haqimizda", blog: "Blog" },
  ru: { about: "О нас", blog: "Блог" },
  en: { about: "About", blog: "Blog" }
} as const;

export function SiteHeader({ locale, dictionary, siteSettings }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { count } = useCart();

  const navItems = [
    { href: `/${locale}/catalog`, label: dictionary.nav.catalog },
    { href: `/${locale}#about`, label: navLabels[locale].about },
    { href: `/${locale}#video-gallery`, label: navLabels[locale].blog }
  ];

  const switchLocale = (nextLocale: Locale) => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
      return `/${nextLocale}`;
    }

    segments[0] = nextLocale;
    return `/${segments.join("/")}`;
  };

  return (
    <header className="relative z-50 bg-white">
      <div className="bg-[#161616] px-4 py-2 text-center text-[11px] text-white">
        <div className="mx-auto flex max-w-[1240px] items-center justify-center gap-3">
          <span className="opacity-90">{siteSettings.announcementText}</span>
          <Link href={siteSettings.announcementLink} className="opacity-75 transition hover:opacity-100">
            {siteSettings.announcementLinkLabel}
          </Link>
        </div>
      </div>

      <div className="border-b border-black/10">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 py-5 lg:px-8">
          <Link href={`/${locale}`} className="text-[2rem] font-black uppercase tracking-tight text-[#c21730]">
            {siteSettings.brandName}
          </Link>

          <nav className="hidden items-center gap-10 text-[17px] text-[#1b1b1b] lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-[#c21730]">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-black/10 px-2 py-1 md:flex">
              {locales.map((entry) => (
                <Link
                  key={entry}
                  href={switchLocale(entry)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                    entry === locale ? "bg-[#111] text-white" : "text-black/50"
                  }`}
                >
                  {localeNames[entry]}
                </Link>
              ))}
            </div>

            <button type="button" aria-label="Search" className="hidden h-11 w-11 items-center justify-center rounded-full border border-black/10 lg:flex">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" />
              </svg>
            </button>

            <Link href={`/${locale}/cart`} aria-label="Cart" className="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/10">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 7h13l-1.4 7H8.2L6 4H3" />
                <circle cx="9.5" cy="19" r="1.2" />
                <circle cx="17" cy="19" r="1.2" />
              </svg>
              {count > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d1122f] px-1 text-[11px] font-bold text-white">
                  {count}
                </span>
              ) : null}
            </Link>

            <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 lg:hidden" onClick={() => setIsOpen((current) => !current)}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>

        {isOpen ? (
          <div className="border-t border-black/10 px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-3 text-sm">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="font-medium text-[#1b1b1b]" onClick={() => setIsOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                {locales.map((entry) => (
                  <Link
                    key={entry}
                    href={switchLocale(entry)}
                    className={`rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                      entry === locale ? "bg-[#111] text-white" : "border border-black/10 text-black/55"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {localeNames[entry]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
