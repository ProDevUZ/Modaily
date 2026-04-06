"use client";

import { useMemo, useState } from "react";

import { ProductCard } from "@/components/product-card";
import type { Locale } from "@/lib/i18n";
import type { StorefrontProduct } from "@/lib/storefront-products";

type CatalogBrowserProps = {
  locale: Locale;
  products: StorefrontProduct[];
  hideCommerce?: boolean;
};

type FilterSectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

const copyByLocale = {
  uz: {
    search: "Qidiruv",
    price: "Narx",
    skinType: "Teri turi",
    category: "Mahsulot turi",
    allResults: "mahsulot",
    empty: "Tanlangan filter bo'yicha mahsulot topilmadi.",
    dry: "Quruq",
    combination: "Kombi",
    oily: "Yog'li",
    sensitive: "Sezuvchan"
  },
  ru: {
    search: "Поиск",
    price: "Цена",
    skinType: "Тип кожи",
    category: "Тип продукта",
    allResults: "товаров",
    empty: "По выбранным фильтрам товары не найдены.",
    dry: "Сухой",
    combination: "Комби",
    oily: "Жирный",
    sensitive: "Чувствительный"
  },
  en: {
    search: "Search",
    price: "Price",
    skinType: "Skin type",
    category: "Product type",
    allResults: "products",
    empty: "No products found for the selected filters.",
    dry: "Dry",
    combination: "Combination",
    oily: "Oily",
    sensitive: "Sensitive"
  }
} as const;

const skinTypeOrder = ["dry", "combination", "oily", "sensitive"] as const;

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="border-t border-black/10 py-4 first:border-t-0 first:pt-0">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="text-[19px] font-normal leading-none text-black/80">{title}</span>
        <span className={`text-[18px] leading-none text-black/55 transition ${open ? "rotate-180" : ""}`}>⌃</span>
      </button>
      {open ? <div className="pt-4">{children}</div> : null}
    </section>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-[18px] leading-none text-black/60">
      <span
        className={`flex h-[22px] w-[22px] items-center justify-center rounded-[6px] border text-[14px] transition ${
          checked ? "border-[#ba0c2f] bg-[#ba0c2f] text-white" : "border-black/35 bg-white text-transparent"
        }`}
      >
        ✓
      </span>
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU").format(price);
}

export function CatalogBrowser({ locale, products, hideCommerce = false }: CatalogBrowserProps) {
  const copy = copyByLocale[locale];
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const priceBounds = useMemo(() => {
    if (products.length === 0) {
      return { min: 0, max: 100 };
    }

    const prices = products.map((product) => product.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [products]);

  const [priceRange, setPriceRange] = useState(priceBounds);

  const categories = useMemo(() => {
    const map = new Map<string, string>();

    products.forEach((product) => {
      if (product.categorySlug && product.category) {
        map.set(product.categorySlug, product.category);
      }
    });

    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [products]);

  const availableSkinTypes = useMemo(() => {
    const set = new Set<string>();

    products.forEach((product) => {
      product.skinTypes.forEach((skinType) => set.add(skinType));
    });

    return skinTypeOrder.filter((skinType) => set.has(skinType));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedQuery ||
        [product.name, product.shortDescription, product.description, product.category]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.categorySlug);

      const matchesSkinType =
        selectedSkinTypes.length === 0 ||
        selectedSkinTypes.some((skinType) => product.skinTypes.includes(skinType));

      const matchesPrice = hideCommerce || (product.price >= priceRange.min && product.price <= priceRange.max);

      return matchesSearch && matchesCategory && matchesSkinType && matchesPrice;
    });
  }, [hideCommerce, priceRange.max, priceRange.min, products, search, selectedCategories, selectedSkinTypes]);

  const rangePercentStart =
    priceBounds.max === priceBounds.min ? 0 : ((priceRange.min - priceBounds.min) / (priceBounds.max - priceBounds.min)) * 100;
  const rangePercentEnd =
    priceBounds.max === priceBounds.min ? 100 : ((priceRange.max - priceBounds.min) / (priceBounds.max - priceBounds.min)) * 100;

  const filtersContent = (
    <>
      {!hideCommerce ? (
        <FilterSection title={copy.price}>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <label className="flex h-[42px] items-center rounded-[10px] border border-black/35 bg-white px-3 text-[12px] text-black/55">
              <span className="mr-2 text-black/65">UZS:</span>
              <input
                type="number"
                min={priceBounds.min}
                max={priceRange.max}
                value={priceRange.min}
                onChange={(event) =>
                  setPriceRange((current) => ({
                    ...current,
                    min: Math.min(Number(event.target.value || priceBounds.min), current.max)
                  }))
                }
                className="w-full bg-transparent text-[16px] text-black outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </label>

            <span className="text-black/40">-</span>

            <label className="flex h-[42px] items-center rounded-[10px] border border-black/35 bg-white px-3 text-[12px] text-black/55">
              <span className="mr-2 text-black/65">UZS:</span>
              <input
                type="number"
                min={priceRange.min}
                max={priceBounds.max}
                value={priceRange.max}
                onChange={(event) =>
                  setPriceRange((current) => ({
                    ...current,
                    max: Math.max(Number(event.target.value || priceBounds.max), current.min)
                  }))
                }
                className="w-full bg-transparent text-[16px] text-black outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </label>
          </div>

          <div className="relative mt-6 px-1 py-3">
            <div className="h-[6px] rounded-full bg-[#e6e6e6]" />
            <div
              className="absolute top-3 h-[6px] rounded-full bg-[#2d2f35]"
              style={{ left: `${rangePercentStart}%`, width: `${Math.max(rangePercentEnd - rangePercentStart, 0)}%` }}
            />
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              value={priceRange.min}
              onChange={(event) =>
                setPriceRange((current) => ({
                  ...current,
                  min: Math.min(Number(event.target.value), current.max)
                }))
              }
              className="catalog-range-thumb pointer-events-none absolute left-0 top-0 h-8 w-full appearance-none bg-transparent"
            />
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              value={priceRange.max}
              onChange={(event) =>
                setPriceRange((current) => ({
                  ...current,
                  max: Math.max(Number(event.target.value), current.min)
                }))
              }
              className="catalog-range-thumb pointer-events-none absolute left-0 top-0 h-8 w-full appearance-none bg-transparent"
            />
            <div className="mt-3 flex items-center justify-between text-[12px] text-black/35">
              <span>{formatPrice(priceRange.min)}</span>
              <span>{formatPrice(priceRange.max)}</span>
            </div>
          </div>
        </FilterSection>
      ) : null}

      <FilterSection title={copy.skinType}>
        <div className="space-y-3">
          {availableSkinTypes.map((skinType) => (
            <CheckboxRow
              key={skinType}
              label={copy[skinType]}
              checked={selectedSkinTypes.includes(skinType)}
              onChange={() =>
                setSelectedSkinTypes((current) =>
                  current.includes(skinType) ? current.filter((entry) => entry !== skinType) : [...current, skinType]
                )
              }
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title={copy.category}>
        <div className="space-y-3">
          {categories.map((category) => (
            <CheckboxRow
              key={category.slug}
              label={category.name}
              checked={selectedCategories.includes(category.slug)}
              onChange={() =>
                setSelectedCategories((current) =>
                  current.includes(category.slug)
                    ? current.filter((entry) => entry !== category.slug)
                    : [...current, category.slug]
                )
              }
            />
          ))}
        </div>
      </FilterSection>
    </>
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[252px_minmax(0,1fr)] xl:gap-[10px]">
      {hideCommerce ? (
        <div className="space-y-4 xl:hidden">
          <div className="grid grid-cols-[auto_1fr] gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((current) => !current)}
              className="inline-flex h-[44px] items-center gap-2 rounded-[14px] border border-[#f0f0ee] bg-white px-4 text-[14px] text-[var(--brand)]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7h8" />
                <path d="M16 7h4" />
                <path d="M10 7a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z" />
                <path d="M4 17h4" />
                <path d="M12 17h8" />
                <path d="M18 17a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z" />
              </svg>
              <span>{locale === "ru" ? "Фильтр" : locale === "en" ? "Filter" : "Filter"}</span>
            </button>

            <div className="rounded-[14px] bg-[#f6f6f4] px-[18px] py-[12px]">
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ba0c2f]" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="m16 16 4 4" />
                </svg>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={copy.search}
                  className="w-full bg-transparent text-[16px] text-black outline-none placeholder:text-black/35"
                />
              </div>
            </div>
          </div>

          {mobileFiltersOpen ? (
            <div className="rounded-[18px] border border-black/8 bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
              {filtersContent}
            </div>
          ) : null}
        </div>
      ) : null}

      <aside className={`xl:pr-0 ${hideCommerce ? "hidden xl:block" : ""}`}>
        <div className="rounded-[14px] bg-[#f6f6f4] px-[18px] py-[14px]">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#ba0c2f]" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={copy.search}
              className="w-full bg-transparent text-[17px] text-black outline-none placeholder:text-black/35"
            />
          </div>
        </div>

        <div className="mt-7">
          {filtersContent}
        </div>
      </aside>

      <div>
        <div className="mb-4 text-[14px] text-black/45">
          {filteredProducts.length} {copy.allResults}
        </div>

        {filteredProducts.length > 0 ? (
          <div
            className={
              hideCommerce
                ? "grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-x-[20px] xl:gap-y-[24px]"
                : "grid gap-x-5 gap-y-8 md:grid-cols-2 xl:grid-cols-4 xl:gap-x-[20px] xl:gap-y-[24px]"
            }
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.slug}
                locale={locale}
                product={product}
                variant="catalog"
                hideCommerce={hideCommerce}
                compactMobile={hideCommerce}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.25rem] border border-dashed border-black/12 bg-[#faf9f7] p-8 text-sm text-black/55">
            {copy.empty}
          </div>
        )}
      </div>
    </div>
  );
}
