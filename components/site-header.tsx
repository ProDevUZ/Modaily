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
  uz: {
    catalog: "Katalog",
    about: "O nas",
    blog: "Blog"
  },
  ru: {
    catalog: "Каталог",
    about: "О нас",
    blog: "Блог"
  },
  en: {
    catalog: "Catalog",
    about: "About",
    blog: "Blog"
  }
} as const;

export function SiteHeader({ locale, siteSettings }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { count } = useCart();

  const navItems = [
    { href: `/${locale}/catalog`, label: navLabels[locale].catalog },
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
      <div className="bg-[#151515] px-4 py-1.5 text-center text-[10px] text-white">
        <div className="mx-auto flex max-w-[1180px] items-center justify-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="opacity-75">{siteSettings.announcementText}</span>
          <Link href={siteSettings.announcementLink} className="opacity-100 underline-offset-4 hover:underline">
            {siteSettings.announcementLinkLabel}
          </Link>
        </div>
      </div>

      <div className="border-b border-black/8">
        <div className="mx-auto flex h-[58px] max-w-[1180px] items-center justify-between px-4 lg:px-6">
          <Link href={`/${locale}`} className="text-[1.15rem] font-black uppercase tracking-[-0.04em] text-[#bf1730]">
            {siteSettings.brandName}
          </Link>

          <nav className="hidden items-center gap-10 text-[14px] text-black lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-[#bf1730]">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" aria-label="Search" className="hidden h-9 w-9 items-center justify-center rounded-full text-black lg:flex">
              <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" />
              </svg>
            </button>

            <Link href={`/${locale}/cart`} aria-label="Cart" className="relative flex h-9 w-9 items-center justify-center rounded-full text-black">
              <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 7h13l-1.4 7H8.2L6 4H3" />
                <circle cx="9.5" cy="19" r="1.2" />
                <circle cx="17" cy="19" r="1.2" />
              </svg>
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d1112e] px-1 text-[9px] font-bold text-white">
                {count}
              </span>
            </Link>

            <div className="hidden items-center gap-1 pl-2 lg:flex">
              {locales.map((entry) => (
                <Link
                  key={entry}
                  href={switchLocale(entry)}
                  className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                    entry === locale ? "bg-black text-white" : "text-black/45"
                  }`}
                >
                  {localeNames[entry]}
                </Link>
              ))}
            </div>

            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full lg:hidden" onClick={() => setIsOpen((current) => !current)}>
              <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>

        {isOpen ? (
          <div className="border-t border-black/8 px-4 py-3 lg:hidden">
            <div className="mx-auto flex max-w-[1180px] flex-col gap-3 text-sm">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="text-black" onClick={() => setIsOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-1">
                {locales.map((entry) => (
                  <Link
                    key={entry}
                    href={switchLocale(entry)}
                    className={`rounded-full px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                      entry === locale ? "bg-black text-white" : "border border-black/10 text-black/55"
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
