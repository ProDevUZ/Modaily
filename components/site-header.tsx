"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useCart } from "@/components/cart-provider";
import { localeNames, locales, type Dictionary, type Locale } from "@/lib/i18n";

type SiteHeaderProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function SiteHeader({ locale, dictionary }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { count } = useCart();

  const navItems = [
    { href: `/${locale}`, label: dictionary.nav.home },
    { href: `/${locale}/catalog`, label: dictionary.nav.catalog },
    { href: `/${locale}/cart`, label: dictionary.nav.cart }
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
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/65 backdrop-blur-xl">
      <div className="shell">
        <div className="flex items-center justify-between gap-4 py-4">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <span className="rounded-full border border-clay/30 bg-clay/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.34em] text-clay">
              Modaily
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-semibold text-stone-700 transition hover:text-clay">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center rounded-full border border-stone-200 bg-white/75 p-1">
              {locales.map((entry) => (
                <Link
                  key={entry}
                  href={switchLocale(entry)}
                  className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] ${
                    entry === locale ? "bg-ink text-sand" : "text-stone-500"
                  }`}
                >
                  {localeNames[entry]}
                </Link>
              ))}
            </div>
            <Link href={`/${locale}/cart`} className="rounded-full border border-stone-200 bg-white/75 px-4 py-3 text-sm font-semibold text-ink">
              {dictionary.nav.cart} ({count})
            </Link>
          </div>

          <button
            type="button"
            className="rounded-full border border-stone-200 bg-white/75 px-4 py-3 text-sm font-semibold text-ink md:hidden"
            onClick={() => setIsOpen((current) => !current)}
          >
            Menu
          </button>
        </div>

        {isOpen ? (
          <div className="flex flex-col gap-4 border-t border-stone-200/70 py-4 md:hidden">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-semibold text-stone-700" onClick={() => setIsOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href={`/${locale}/cart`} className="text-sm font-semibold text-ink" onClick={() => setIsOpen(false)}>
              {dictionary.nav.cart} ({count})
            </Link>
            <div className="flex gap-2 pt-2">
              {locales.map((entry) => (
                <Link
                  key={entry}
                  href={switchLocale(entry)}
                  className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] ${
                    entry === locale ? "bg-ink text-sand" : "bg-white text-stone-500"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {localeNames[entry]}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
