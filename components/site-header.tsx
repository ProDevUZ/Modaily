"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { FallbackImage } from "@/components/ui/fallback-image";
import { locales, type Locale } from "@/lib/i18n";
import { matchesSearchQuery } from "@/lib/search-text";
import type { StorefrontProductSearchItem } from "@/lib/storefront-products";

type SiteHeaderProps = {
  locale: Locale;
  siteSettings: {
    brandName: string;
    hideCommerce: boolean;
    announcementText: string;
    announcementLinkLabel: string;
    announcementLink: string;
  };
  searchProducts: StorefrontProductSearchItem[];
};

const DesktopHeaderCommerceActions = dynamic(
  () => import("@/components/header-commerce-actions").then((module) => module.DesktopHeaderCommerceActions),
  { ssr: false }
);

const MobileHeaderCartAction = dynamic(
  () => import("@/components/header-commerce-actions").then((module) => module.MobileHeaderCartAction),
  { ssr: false }
);

const DesktopHeaderCartAction = dynamic(
  () => import("@/components/header-commerce-actions").then((module) => module.DesktopHeaderCartAction),
  { ssr: false }
);

const MobileMenuProfileAction = dynamic(
  () => import("@/components/header-commerce-actions").then((module) => module.MobileMenuProfileAction),
  { ssr: false }
);

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

const mobileLocaleOrder = ["en", "uz", "ru"] as const satisfies readonly Locale[];

function LocaleFlag({ locale }: { locale: Locale }) {
  if (locale === "en") {
    return (
      <svg viewBox="0 0 60 40" className="h-[14px] w-[21px] overflow-hidden rounded-[2px]" aria-hidden="true">
        <rect width="60" height="40" fill="#012169" />
        <path d="M0 0 60 40M60 0 0 40" stroke="#fff" strokeWidth="8" />
        <path d="M0 0 60 40M60 0 0 40" stroke="#c8102e" strokeWidth="4" />
        <path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="13" />
        <path d="M30 0v40M0 20h60" stroke="#c8102e" strokeWidth="7" />
        <rect width="59" height="39" x="0.5" y="0.5" rx="3.5" fill="none" stroke="rgba(0,0,0,0.16)" />
      </svg>
    );
  }

  if (locale === "uz") {
    return (
      <svg viewBox="0 0 60 40" className="h-[14px] w-[21px] overflow-hidden rounded-[2px]" aria-hidden="true">
        <rect width="60" height="40" fill="#1eb6e9" />
        <rect y="13" width="60" height="2" fill="#ce1126" />
        <rect y="15" width="60" height="10" fill="#fff" />
        <rect y="25" width="60" height="2" fill="#ce1126" />
        <rect y="27" width="60" height="13" fill="#1eb53a" />
        <circle cx="9" cy="7" r="4" fill="#fff" />
        <circle cx="11" cy="7" r="4" fill="#1eb6e9" />
        <rect width="59" height="39" x="0.5" y="0.5" rx="3.5" fill="none" stroke="rgba(0,0,0,0.16)" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 60 40" className="h-[14px] w-[21px] overflow-hidden rounded-[2px]" aria-hidden="true">
      <rect width="60" height="40" fill="#fff" />
      <rect y="13.33" width="60" height="13.34" fill="#0039a6" />
      <rect y="26.67" width="60" height="13.33" fill="#d52b1e" />
      <rect width="59" height="39" x="0.5" y="0.5" rx="3.5" fill="none" stroke="rgba(0,0,0,0.16)" />
    </svg>
  );
}

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
  const [searchQuery, setSearchQuery] = useState("");
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
    setSearchQuery("");
  }, [pathname]);

  const normalizedQuery = deferredSearchQuery.trim().toLowerCase();
  const filteredProducts = useMemo(
    () =>
      normalizedQuery
        ? searchProducts.filter((product) => {
        return matchesSearchQuery(
          [
            product.searchIndex,
            product.name,
            product.category,
            ...product.categories.map((category) => category.name)
          ],
          normalizedQuery
        );
      })
        : [],
    [normalizedQuery, searchProducts]
  );
  const filteredCategories = useMemo(
    () =>
      normalizedQuery
        ? Array.from(
            new Map(
              filteredProducts
                .flatMap((product) =>
                  product.categories.map((category) => [category.slug, category.name] as const)
                )
            ).entries()
          ).map(([slug, name]) => ({ slug, name }))
        : [],
    [filteredProducts, normalizedQuery]
  );

  return (
    <header className="sticky top-0 z-[70] bg-white [font-family:var(--font-body)]">
      <div className="flex h-[30px] items-center justify-center bg-[#1a1a1a] px-4 text-center text-[11px] font-normal leading-none text-white md:h-[32px] md:text-[12px]">
        <div className="layout-bleed-container flex items-center justify-center gap-5 overflow-hidden whitespace-nowrap">
          <span className="text-white/88">{announcementCopy.text}</span>
          <Link href={`/${locale}/catalog`} className="text-white underline underline-offset-[5px] decoration-[0.8px] hover:text-white/90">
            {announcementCopy.cta}
          </Link>
        </div>
      </div>

      <div>
        <div className="layout-bleed-container hidden h-[80px] items-center lg:flex desktop:h-[88px]">
          <div className="grid h-[34px] w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-5 laptop:gap-6 desktop:gap-7">
            <div className="grid w-full grid-cols-[0.3fr_auto_0.7fr] items-center">
              <div />
              <Link
                href={`/${locale}`}
                className="brand-wordmark inline-flex h-[22px] w-[150px] items-center overflow-hidden whitespace-nowrap text-[23px] uppercase leading-[22px] text-[var(--brand)] laptop:w-[160px] laptop:text-[24px] desktop:w-[170px] desktop:text-[25px]"
              >
                {siteSettings.brandName}
              </Link>
              <div />
            </div>

            <nav className="flex items-center justify-center gap-7 text-[17px] font-normal leading-none text-black laptop:gap-9 laptop:text-[18px] desktop:gap-[46px] desktop:text-[19px] [font-family:var(--font-body)]">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="font-normal transition hover:text-[var(--brand)]">
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="grid w-full grid-cols-[0.7fr_auto_0.3fr] items-center">
              <div />
              <div className="flex items-center justify-end gap-3 laptop:gap-3.5">
                {!siteSettings.hideCommerce ? (
                  <DesktopHeaderCommerceActions
                    locale={locale}
                    labels={profileCopy}
                    onInteract={() => {
                      setIsLocaleOpen(false);
                      setIsSearchOpen(false);
                      setIsOpen(false);
                    }}
                  />
                ) : null}

                <div className="relative">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-[13px] leading-none text-black"
                    onClick={() => {
                      setIsLocaleOpen((current) => !current);
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
                    setIsOpen(false);
                  }}
                >
                  <Image src="/icons/search.svg" alt="" width={31} height={31} className="h-7 w-7" aria-hidden="true" />
                </button>

                {!siteSettings.hideCommerce ? <DesktopHeaderCartAction locale={locale} /> : null}
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
                  setIsOpen(false);
                }}
              >
                <Image src="/icons/search.svg" alt="" width={31} height={31} className="h-[22px] w-[22px]" aria-hidden="true" />
              </button>

              <div className="relative">
                <button
                  type="button"
                  aria-label={localeCopy.trigger}
                  className="flex h-[34px] w-[34px] items-center justify-center text-[19px] leading-none"
                onClick={() => {
                  setIsLocaleOpen((current) => !current);
                  setIsSearchOpen(false);
                  setIsOpen(false);
                }}
                >
                  <LocaleFlag locale={locale} />
                </button>

                {isLocaleOpen ? (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-50 flex overflow-hidden rounded-[8px] border border-black/12 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
                    {mobileLocaleOrder.map((entry) => (
                      <Link
                        key={entry}
                        href={switchLocale(entry)}
                        aria-label={localeCopy[entry]}
                        className={`flex h-[34px] w-[34px] items-center justify-center text-[18px] leading-none transition ${
                          entry === locale ? "bg-[#f8f6f4]" : "bg-white"
                        }`}
                        onClick={() => setIsLocaleOpen(false)}
                      >
                        <LocaleFlag locale={entry} />
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>

              {!siteSettings.hideCommerce ? <MobileHeaderCartAction locale={locale} /> : null}
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
                {!siteSettings.hideCommerce ? (
                  <MobileMenuProfileAction locale={locale} labels={profileCopy} onCloseMenu={() => setIsOpen(false)} />
                ) : null}

                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="text-[17px] text-black" onClick={() => setIsOpen(false)}>
                    {item.label}
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
