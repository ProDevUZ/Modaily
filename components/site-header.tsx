"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDeferredValue, useEffect, useState } from "react";

import { useCart } from "@/components/cart-provider";
import { useCustomerProfile } from "@/components/customer-profile-provider";
import { FallbackImage } from "@/components/ui/fallback-image";
import { locales, type Dictionary, type Locale } from "@/lib/i18n";
import { matchesSearchQuery } from "@/lib/search-text";
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
    about: "Biz haqimizda",
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
    empty: "Mos mahsulot topilmadi."
  },
  ru: {
    placeholder: "Поиск товара...",
    empty: "Подходящие товары не найдены."
  },
  en: {
    placeholder: "Search products...",
    empty: "No matching products found."
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

const announcementLabels = {
  uz: {
    text: "Yangiliklar",
    cta: "Xaridlarga o'tish →"
  },
  ru: {
    text: "Новинки",
    cta: "Перейти к покупкам →"
  },
  en: {
    text: "New arrivals",
    cta: "Go shopping →"
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
  const announcementCopy = announcementLabels[locale];

  const navItems = [
    { href: `/${locale}/catalog`, label: navLabels[locale].catalog },
    { href: `/${locale}/main/about-us`, label: navLabels[locale].about },
    { href: `/${locale}/blog`, label: navLabels[locale].blog }
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
        return matchesSearchQuery(
          [
            product.searchIndex,
            product.name,
            product.shortDescription,
            product.description,
            product.category,
            ...product.categories.map((category) => category.name)
          ],
          normalizedQuery
        );
      })
    : [];
  const filteredCategories = normalizedQuery
    ? Array.from(
        new Map(
          filteredProducts
            .flatMap((product) =>
              product.categories.map((category) => [category.slug, category.name] as const)
            )
        ).entries()
      ).map(([slug, name]) => ({ slug, name }))
    : [];

  return (
    <header className="sticky top-0 z-[70] bg-white [font-family:var(--font-body)]">
      <div className="flex h-[30px] items-center justify-center bg-[#1a1a1a] px-4 text-center text-[11px] font-normal leading-none text-white md:h-[32px] md:text-[12px]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-5 overflow-hidden whitespace-nowrap px-6">
          <span className="text-white/88">{announcementCopy.text}</span>
          <Link href={`/${locale}/catalog`} className="text-white underline underline-offset-[5px] decoration-[0.8px] hover:text-white/90">
            {announcementCopy.cta}
          </Link>
        </div>
      </div>

      <div>
        <div className="mx-auto hidden h-[88px] max-w-[1440px] items-center px-6 lg:flex">
          <div className="grid h-[34px] w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-7">
            <div className="grid w-full grid-cols-[0.3fr_auto_0.7fr] items-center">
              <div />
              <Link
                href={`/${locale}`}
                className="brand-wordmark inline-flex h-[22px] w-[170px] items-center overflow-hidden whitespace-nowrap text-[25px] uppercase leading-[22px] text-[var(--brand)]"
              >
                {siteSettings.brandName}
              </Link>
              <div />
            </div>

            <nav className="flex items-center justify-center gap-[46px] text-[19px] font-normal leading-none text-black [font-family:var(--font-body)]">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="font-normal transition hover:text-[var(--brand)]">
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="grid w-full grid-cols-[0.7fr_auto_0.3fr] items-center">
              <div />
              <div className="flex items-center justify-end gap-3.5">
                {!siteSettings.hideCommerce && isLoggedIn && profile ? (
                  <div className="relative">
                    <button
                      type="button"
                      className="flex min-w-[128px] flex-col items-end text-right"
                      onClick={() => {
                        setIsProfileOpen((current) => !current);
                        setIsLocaleOpen(false);
                        setIsSearchOpen(false);
                        setIsOpen(false);
                      }}
                    >
                      <span className="text-[12px] font-medium leading-none text-black">{profile.fullName}</span>
                      <span className="mt-1 text-[11px] leading-none text-black/55">{profile.phone}</span>
                    </button>

                    {isProfileOpen ? (
                      <div className="absolute right-0 top-[calc(100%+10px)] z-20 min-w-[156px] overflow-hidden rounded-[10px] border border-black/12 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
                        <div className="border-b border-black/8 px-4 py-3">
                          <p className="text-[11px] text-black/35">{profileCopy.profile}</p>
                          <p className="mt-1 text-[13px] font-medium text-black">{profile.fullName}</p>
                          <p className="mt-1 text-[12px] text-black/55">{profile.phone}</p>
                        </div>
                        <button
                          type="button"
                          className="block w-full px-4 py-3 text-left text-[13px] text-[var(--brand)] transition hover:bg-[#f8f6f4]"
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
                    className="text-[13px] leading-none text-black transition hover:text-[var(--brand)]"
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
                    className="inline-flex items-center gap-1 text-[13px] leading-none text-black"
                    onClick={() => {
                      setIsLocaleOpen((current) => !current);
                      setIsProfileOpen(false);
                      setIsSearchOpen(false);
                      setIsOpen(false);
                    }}
                  >
                    <span>{localeCopy.trigger}</span>
                    <svg viewBox="0 0 16 16" className={`h-[13px] w-[13px] transition ${isLocaleOpen ? "rotate-180" : ""}`} fill="currentColor">
                      <path d="M4.2 6.1 8 9.9l3.8-3.8" />
                    </svg>
                  </button>

                  {isLocaleOpen ? (
                    <div className="absolute right-0 top-[calc(100%+10px)] z-20 min-w-[146px] overflow-hidden rounded-[8px] border border-black/12 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
                      {locales.map((entry, index) => (
                        <Link
                          key={entry}
                          href={switchLocale(entry)}
                          className={`block px-4 py-2.5 text-[13px] transition ${
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
                  className="flex h-7 w-7 shrink-0 items-center justify-center text-black"
                  onClick={() => {
                    setIsSearchOpen((current) => !current);
                    setIsLocaleOpen(false);
                    setIsProfileOpen(false);
                    setIsOpen(false);
                  }}
                >
                  <Image src="/icons/search.svg" alt="" width={31} height={31} className="h-7 w-7" aria-hidden="true" />
                </button>

                {!siteSettings.hideCommerce ? (
                  <Link href={`/${locale}/cart`} aria-label="Cart" className="relative flex h-7 w-7 shrink-0 items-center justify-center text-black">
                    <Image src="/icons/basket.svg" alt="" width={31} height={31} className="h-7 w-7" aria-hidden="true" />
                    <span className="absolute -right-[8px] -top-[7px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#ea0025] px-[4px] text-[10px] font-bold leading-none text-white">
                      {count}
                    </span>
                  </Link>
                ) : null}
              </div>
              <div />
            </div>
          </div>
        </div>

        <div className="mx-auto flex h-[65px] max-w-[1760px] items-center px-5 sm:px-6 lg:hidden [font-family:var(--font-body)]">
          <div className="relative flex w-full items-center justify-between">
            <div className="flex min-w-[34px] items-center">
              <button
                type="button"
                className="flex h-[34px] w-[34px] items-center justify-center text-black"
                onClick={() => {
                  setIsOpen((current) => !current);
                  setIsLocaleOpen(false);
                  setIsSearchOpen(false);
                  setIsProfileOpen(false);
                }}
              >
                {isOpen ? (
                  <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
                    <path d="M6 6 18 18M18 6 6 18" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                )}
              </button>
            </div>

            <Link
              href={`/${locale}`}
              className="brand-wordmark absolute left-1/2 top-0 inline-flex h-full w-[150px] max-w-[calc(100vw-168px)] translate-x-[calc(-50%+22px)] translate-y-[9px] items-center justify-center overflow-visible whitespace-nowrap text-[17px] uppercase leading-[18px] text-[var(--brand)]"
            >
              {siteSettings.brandName}
            </Link>

            <div className="flex min-w-[70px] items-center justify-end gap-2">
              <button
                type="button"
                aria-label="Search"
                className="flex h-[34px] w-[34px] items-center justify-center text-black"
                onClick={() => {
                  setIsSearchOpen((current) => !current);
                  setIsLocaleOpen(false);
                  setIsProfileOpen(false);
                  setIsOpen(false);
                }}
              >
                <Image src="/icons/search.svg" alt="" width={31} height={31} className="h-[22px] w-[22px]" aria-hidden="true" />
              </button>

              {!siteSettings.hideCommerce ? (
                <Link href={`/${locale}/cart`} aria-label="Cart" className="relative flex h-[34px] w-[34px] items-center justify-center text-black">
                  <Image src="/icons/basket.svg" alt="" width={31} height={31} className="h-[22px] w-[22px]" aria-hidden="true" />
                  <span className="absolute right-0 top-0 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#d1112e] px-1 text-[9px] font-bold text-white">
                    {count}
                  </span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        {isOpen ? (
          <div className="fixed inset-x-0 bottom-0 top-[95px] z-40 lg:hidden">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-black/22"
              onClick={() => {
                setIsOpen(false);
                setIsLocaleOpen(false);
              }}
            />
            <div className="relative h-full w-[min(86vw,360px)] overflow-y-auto border-r border-black/8 bg-white px-6 py-7 shadow-[0_18px_48px_rgba(0,0,0,0.16)]">
              <div className="flex flex-col gap-5 text-[17px] leading-[1.25] text-black">
                {!siteSettings.hideCommerce && isLoggedIn && profile ? (
                  <div className="rounded-[18px] border border-black/8 bg-[#faf8f6] px-5 py-4">
                    <p className="text-[12px] text-black/35">{profileCopy.profile}</p>
                    <p className="mt-1.5 text-[17px] font-medium text-black">{profile.fullName}</p>
                    <p className="mt-1 text-[14px] text-black/55">{profile.phone}</p>
                    <button
                      type="button"
                      className="mt-4 text-[14px] text-[#ba0c2f]"
                      onClick={() => {
                        clearProfile();
                        setIsOpen(false);
                      }}
                    >
                      {profileCopy.logout}
                    </button>
                  </div>
                ) : !siteSettings.hideCommerce ? (
                  <Link href={`/${locale}/login`} className="text-[17px] text-black" onClick={() => setIsOpen(false)}>
                    {profileCopy.login}
                  </Link>
                ) : null}

                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="text-[17px] text-black" onClick={() => setIsOpen(false)}>
                    {item.label}
                  </Link>
                ))}

                <div className="border-t border-black/8 pt-5">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-[17px] text-black"
                    onClick={() => setIsLocaleOpen((current) => !current)}
                  >
                    <span>{localeCopy.trigger}</span>
                    <svg viewBox="0 0 16 16" className={`h-[17px] w-[17px] transition ${isLocaleOpen ? "rotate-180" : ""}`} fill="currentColor">
                      <path d="M4.2 6.1 8 9.9l3.8-3.8" />
                    </svg>
                  </button>

                  {isLocaleOpen ? (
                    <div className="flex flex-wrap gap-2.5 pt-3">
                      {locales.map((entry) => (
                        <Link
                          key={entry}
                          href={switchLocale(entry)}
                          className={`rounded-full px-4 py-2 text-[14px] ${
                            entry === locale ? "bg-black text-white" : "border border-black/10 text-black/55"
                          }`}
                          onClick={() => {
                            setIsOpen(false);
                            setIsLocaleOpen(false);
                          }}
                        >
                          {localeCopy[entry]}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {isSearchOpen ? (
        <div className="border-b border-black/8 bg-white px-4 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
          <div className="mx-auto max-w-[1760px] px-4">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={searchCopy.placeholder}
                  className="h-10 w-full rounded-[0.9rem] border border-black/10 bg-white px-4 pr-11 text-[13px] text-black outline-none transition focus:border-[var(--brand)]"
                />
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-black/35">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="11" cy="11" r="6.5" />
                    <path d="m16 16 4 4" />
                  </svg>
                </div>
              </div>

              {normalizedQuery ? (
                <div className="space-y-4">
                  {filteredCategories.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5">
                      {filteredCategories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/${locale}/catalog?category=${encodeURIComponent(category.slug)}`}
                          className="rounded-full border border-black/10 bg-white px-3.5 py-2 text-[13px] font-medium text-black/75 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  ) : null}

                  {filteredProducts.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {filteredProducts.slice(0, 6).map((product) => (
                        <Link
                          key={product.slug}
                          href={`/${locale}/catalog/${product.slug}`}
                          className="rounded-[0.95rem] border border-black/8 bg-white p-3.5 transition hover:border-[var(--brand)] hover:shadow-[0_12px_28px_rgba(186,12,47,0.08)]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[0.8rem] bg-[#f4f1ee]">
                              <FallbackImage
                                src={product.imageUrl}
                                fallbackSrc="/images/home/mainpage.jpg"
                                alt={product.name}
                                className="h-[84%] w-[82%] object-contain"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-[14px] font-semibold text-black">{product.name}</p>
                              <p className="mt-1 truncate text-[12px] text-black/45">{product.category}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[1rem] border border-dashed border-black/12 bg-white p-4 text-sm text-black/50">
                      {searchCopy.empty}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
