"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDeferredValue, useEffect, useState } from "react";

import { useCart } from "@/components/cart-provider";
import { useCustomerProfile } from "@/components/customer-profile-provider";
import { locales, type Dictionary, type Locale } from "@/lib/i18n";
import type { StorefrontProduct } from "@/lib/storefront-products";

type SiteHeaderProps = {
  locale: Locale;
  dictionary: Dictionary;
  siteSettings: {
    brandName: string;
    hideCommerce: boolean;
    announcementText: string;
    announcementLinkLabel: string;
    announcementLink: string;
  };
  searchProducts: StorefrontProduct[];
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

const localeDropdownLabels = {
  uz: {
    trigger: "Til",
    uz: "O'zbekcha",
    ru: "Русский",
    en: "English"
  },
  ru: {
    trigger: "Язык",
    uz: "O'zbekcha",
    ru: "Русский",
    en: "English"
  },
  en: {
    trigger: "Language",
    uz: "O'zbekcha",
    ru: "Русский",
    en: "English"
  }
} as const;

const profileLabels = {
  uz: {
    login: "Login",
    profile: "Profil",
    logout: "Chiqish"
  },
  ru: {
    login: "Login",
    profile: "Профиль",
    logout: "Выйти"
  },
  en: {
    login: "Login",
    profile: "Profile",
    logout: "Logout"
  }
} as const;

export function SiteHeader({ locale, siteSettings, searchProducts }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLocaleOpen, setIsLocaleOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { count } = useCart();
  const { profile, isLoggedIn, clearProfile } = useCustomerProfile();
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const searchCopy = searchLabels[locale];
  const localeCopy = localeDropdownLabels[locale];
  const profileCopy = profileLabels[locale];

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
    setIsLocaleOpen(false);
    setIsProfileOpen(false);
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
    <header className="relative z-50 bg-white [font-family:var(--font-body)]">
      <div className="flex h-[38px] items-center justify-center bg-[#191919] px-4 text-center text-[13px] leading-none text-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-2 overflow-hidden whitespace-nowrap px-6">
          <span className="opacity-75">{siteSettings.announcementText}</span>
          <Link href={siteSettings.announcementLink} className="opacity-100 underline-offset-4 hover:underline">
            {siteSettings.announcementLinkLabel}
          </Link>
        </div>
      </div>

      <div className="border-b border-black/8">
        <div className="mx-auto hidden h-[104px] max-w-[1440px] items-center lg:flex">
          <div className="grid h-[40px] w-full grid-cols-[231px_1fr_auto] items-center">
            <Link
              href={`/${locale}`}
              className="brand-wordmark inline-flex h-[25px] w-[200px] items-center overflow-hidden whitespace-nowrap text-[29px] uppercase leading-[25px] text-[var(--brand)]"
            >
              {siteSettings.brandName}
            </Link>

            <nav className="flex items-center justify-center gap-[55px] text-[22px] font-normal leading-none text-black [font-family:var(--font-body)]">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="font-normal transition hover:text-[var(--brand)]">
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center justify-end gap-4 justify-self-end">
              {!siteSettings.hideCommerce && isLoggedIn && profile ? (
                <div className="relative">
                  <button
                    type="button"
                    className="flex min-w-[150px] flex-col items-end text-right"
                    onClick={() => {
                      setIsProfileOpen((current) => !current);
                      setIsLocaleOpen(false);
                      setIsSearchOpen(false);
                      setIsOpen(false);
                    }}
                  >
                    <span className="text-[13px] font-medium leading-none text-black">{profile.fullName}</span>
                    <span className="mt-1 text-[12px] leading-none text-black/55">{profile.phone}</span>
                  </button>

                  {isProfileOpen ? (
                    <div className="absolute right-0 top-[calc(100%+12px)] z-20 min-w-[170px] overflow-hidden rounded-[10px] border border-black/12 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
                      <div className="border-b border-black/8 px-4 py-3">
                        <p className="text-[12px] text-black/35">{profileCopy.profile}</p>
                        <p className="mt-1 text-[14px] font-medium text-black">{profile.fullName}</p>
                        <p className="mt-1 text-[13px] text-black/55">{profile.phone}</p>
                      </div>
                      <button
                        type="button"
                        className="block w-full px-4 py-3 text-left text-[14px] text-[var(--brand)] transition hover:bg-[#f8f6f4]"
                        onClick={() => {
                          clearProfile();
                          setIsProfileOpen(false);
                        }}
                      >
                        {profileCopy.logout}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : !siteSettings.hideCommerce ? (
                <Link
                  href={`/${locale}/login`}
                  className="text-[15px] leading-none text-black transition hover:text-[var(--brand)]"
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsLocaleOpen(false);
                    setIsSearchOpen(false);
                  }}
                >
                  {profileCopy.login}
                </Link>
              ) : null}

              <div className="relative">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-[15px] leading-none text-black"
                  onClick={() => {
                    setIsLocaleOpen((current) => !current);
                    setIsProfileOpen(false);
                    setIsSearchOpen(false);
                    setIsOpen(false);
                  }}
                >
                  <span>{localeCopy.trigger}</span>
                  <svg viewBox="0 0 16 16" className={`h-4 w-4 transition ${isLocaleOpen ? "rotate-180" : ""}`} fill="currentColor">
                    <path d="M4.2 6.1 8 9.9l3.8-3.8" />
                  </svg>
                </button>

                {isLocaleOpen ? (
                  <div className="absolute right-0 top-[calc(100%+12px)] z-20 min-w-[160px] overflow-hidden rounded-[8px] border border-black/12 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
                    {locales.map((entry, index) => (
                      <Link
                        key={entry}
                        href={switchLocale(entry)}
                        className={`block px-5 py-3 text-[15px] transition ${
                          entry === locale
                            ? "bg-[#e74c57] text-white"
                            : "bg-white text-black/75 hover:bg-[#f8f6f4]"
                        } ${index !== 0 ? "border-t border-black/8" : ""}`}
                        onClick={() => setIsLocaleOpen(false)}
                      >
                        {localeCopy[entry]}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                aria-label="Search"
                className="flex h-8 w-8 shrink-0 items-center justify-center text-black"
                onClick={() => {
                  setIsSearchOpen((current) => !current);
                  setIsLocaleOpen(false);
                  setIsProfileOpen(false);
                  setIsOpen(false);
                }}
              >
                <Image src="/icons/search.svg" alt="" width={31} height={31} className="h-8 w-8" aria-hidden="true" />
              </button>

              {!siteSettings.hideCommerce ? (
                <Link href={`/${locale}/cart`} aria-label="Cart" className="relative flex h-8 w-8 shrink-0 items-center justify-center text-black">
                  <Image src="/icons/basket.svg" alt="" width={31} height={31} className="h-8 w-8" aria-hidden="true" />
                  <span className="absolute -right-[9px] -top-[8px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ea0025] px-[4px] text-[11px] font-bold leading-none text-white">
                    {count}
                  </span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mx-auto flex h-[76px] max-w-[1760px] items-center px-5 sm:px-6 lg:hidden [font-family:var(--font-body)]">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-5">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center text-black"
                onClick={() => {
                  setIsOpen((current) => !current);
                  setIsLocaleOpen(false);
                  setIsSearchOpen(false);
                  setIsProfileOpen(false);
                }}
              >
                <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>

              <Link
                href={`/${locale}`}
                className="brand-wordmark inline-flex h-[19px] w-[154px] items-center overflow-hidden whitespace-nowrap text-[18px] uppercase leading-[19px] text-[var(--brand)]"
              >
                {siteSettings.brandName}
              </Link>
            </div>

            <div className="flex items-center gap-[10px]">
              <button
                type="button"
                aria-label="Search"
                className="flex h-10 w-10 items-center justify-center text-black"
                onClick={() => {
                  setIsSearchOpen((current) => !current);
                  setIsLocaleOpen(false);
                  setIsProfileOpen(false);
                  setIsOpen(false);
                }}
              >
                <Image src="/icons/search.svg" alt="" width={31} height={31} className="h-[26px] w-[26px]" aria-hidden="true" />
              </button>

              {!siteSettings.hideCommerce ? (
                <Link href={`/${locale}/cart`} aria-label="Cart" className="relative flex h-10 w-10 items-center justify-center text-black">
                  <Image src="/icons/basket.svg" alt="" width={31} height={31} className="h-[26px] w-[26px]" aria-hidden="true" />
                  <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#d1112e] px-1 text-[10px] font-bold text-white">
                    {count}
                  </span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        {isOpen ? (
          <div className="border-t border-black/8 px-4 py-3 lg:hidden">
            <div className="mx-auto flex max-w-[1760px] flex-col gap-3 px-4 text-sm">
              {!siteSettings.hideCommerce && isLoggedIn && profile ? (
                <div className="rounded-[16px] border border-black/8 bg-[#faf8f6] px-4 py-3">
                  <p className="text-[12px] text-black/35">{profileCopy.profile}</p>
                  <p className="mt-1 text-[14px] font-medium text-black">{profile.fullName}</p>
                  <p className="mt-1 text-[13px] text-black/55">{profile.phone}</p>
                  <button
                    type="button"
                    className="mt-3 text-[13px] text-[#ba0c2f]"
                    onClick={() => {
                      clearProfile();
                      setIsOpen(false);
                    }}
                  >
                    {profileCopy.logout}
                  </button>
                </div>
              ) : !siteSettings.hideCommerce ? (
                <Link href={`/${locale}/login`} className="text-black" onClick={() => setIsOpen(false)}>
                  {profileCopy.login}
                </Link>
              ) : null}

              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="text-black" onClick={() => setIsOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <div className="relative pt-1">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-[14px] text-black"
                  onClick={() => setIsLocaleOpen((current) => !current)}
                >
                  <span>{localeCopy.trigger}</span>
                  <svg viewBox="0 0 16 16" className={`h-4 w-4 transition ${isLocaleOpen ? "rotate-180" : ""}`} fill="currentColor">
                    <path d="M4.2 6.1 8 9.9l3.8-3.8" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {locales.map((entry) => (
                  <Link
                    key={entry}
                    href={switchLocale(entry)}
                    className={`rounded-full px-3 py-1.5 text-[12px] ${
                      entry === locale ? "bg-black text-white" : "border border-black/10 text-black/55"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {localeCopy[entry]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {isSearchOpen ? (
        <div className="border-b border-black/8 bg-white px-4 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
          <div className="mx-auto max-w-[1760px] px-4">
            <div className="flex flex-col gap-4 rounded-[1.5rem] border border-black/8 bg-[#faf7f5] p-4 md:p-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/35">{searchCopy.title}</p>
                  <p className="mt-1 text-sm text-black/50">{searchCopy.browseAll}</p>
                </div>
                <Link href={`/${locale}/catalog`} className="text-sm font-semibold text-[var(--brand)]">
                  {searchCopy.browseAll}
                </Link>
              </div>

              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={searchCopy.placeholder}
                  className="h-12 w-full rounded-[1rem] border border-black/10 bg-white px-4 pr-12 text-sm text-black outline-none transition focus:border-[var(--brand)]"
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
                      className="rounded-[1rem] border border-black/8 bg-white p-4 transition hover:border-[var(--brand)] hover:shadow-[0_12px_28px_rgba(186,12,47,0.08)]"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/35">{product.category}</p>
                      <p className="mt-2 text-base font-semibold text-black">{product.name}</p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/55">{product.shortDescription}</p>
                      {!siteSettings.hideCommerce ? <p className="mt-3 text-sm font-semibold text-[var(--brand)]">${product.price}</p> : null}
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
