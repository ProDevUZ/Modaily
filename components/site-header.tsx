"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDeferredValue, useEffect, useState } from "react";

import { useCart } from "@/components/cart-provider";
import { localeNames, locales, type Dictionary, type Locale } from "@/lib/i18n";
import type { LocalizedProduct } from "@/lib/products";

type SiteHeaderProps = {
  locale: Locale;
  dictionary: Dictionary;
  siteSettings: {
    brandName: string;
    announcementText: string;
    announcementLinkLabel: string;
    announcementLink: string;
  };
  searchProducts: LocalizedProduct[];
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

const searchLabels = {
  uz: {
    placeholder: "Mahsulot qidirish...",
    title: "Mahsulot qidiruvi",
    empty: "Mos mahsulot topilmadi.",
    browseAll: "Barcha mahsulotlar"
  },
  ru: {
    placeholder: "Поиск товара...",
    title: "Поиск по товарам",
    empty: "Подходящие товары не найдены.",
    browseAll: "Все товары"
  },
  en: {
    placeholder: "Search products...",
    title: "Product search",
    empty: "No matching products found.",
    browseAll: "Browse all products"
  }
} as const;

export function SiteHeader({ locale, siteSettings, searchProducts }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { count } = useCart();
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const searchCopy = searchLabels[locale];

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

  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  const normalizedQuery = deferredSearchQuery.trim().toLowerCase();
  const filteredProducts = normalizedQuery
    ? searchProducts.filter((product) => {
        const haystack = [product.name, product.category, product.shortDescription, product.description].join(" ").toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : searchProducts.slice(0, 6);

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
            <button
              type="button"
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full text-black"
              onClick={() => {
                setIsSearchOpen((current) => !current);
                setIsOpen(false);
              }}
            >
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

      {isSearchOpen ? (
        <div className="border-b border-black/8 bg-white px-4 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
          <div className="mx-auto max-w-[1180px]">
            <div className="flex flex-col gap-4 rounded-[1.5rem] border border-black/8 bg-[#faf7f5] p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/35">{searchCopy.title}</p>
                  <p className="mt-1 text-sm text-black/50">{searchCopy.browseAll}</p>
                </div>
                <Link href={`/${locale}/catalog`} className="text-sm font-semibold text-[#bf1730]">
                  {searchCopy.browseAll}
                </Link>
              </div>

              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={searchCopy.placeholder}
                  className="h-12 w-full rounded-[1rem] border border-black/10 bg-white px-4 pr-12 text-sm text-black outline-none transition focus:border-[#bf1730]"
                />
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-black/35">
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="11" cy="11" r="6.5" />
                    <path d="m16 16 4 4" />
                  </svg>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.length > 0 ? (
                  filteredProducts.slice(0, 6).map((product) => (
                    <Link
                      key={product.slug}
                      href={`/${locale}/catalog/${product.slug}`}
                      className="rounded-[1rem] border border-black/8 bg-white p-4 transition hover:border-[#bf1730] hover:shadow-[0_12px_28px_rgba(191,23,48,0.08)]"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/35">{product.category}</p>
                      <p className="mt-2 text-base font-semibold text-black">{product.name}</p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/55">{product.shortDescription}</p>
                      <p className="mt-3 text-sm font-semibold text-[#bf1730]">${product.price}</p>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-[1rem] border border-dashed border-black/12 bg-white p-4 text-sm text-black/50">
                    {searchCopy.empty}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
