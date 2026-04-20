"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  type AdminCategory,
  type AdminProduct,
  requestJson
} from "@/components/admin/admin-types";
import { getDiscountPercent } from "@/lib/product-badges";
import { SKIN_TYPE_LABELS_RU, SKIN_TYPE_OPTIONS } from "@/lib/skin-types";

type GalleryFormItem = {
  type: "IMAGE" | "VIDEO";
  imageUrl: string;
  videoUrl: string;
  sortOrder: number;
};

type ProductSubmitError = {
  message: string;
  hint?: string | null;
};

type ProductFormState = {
  sku: string;
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  shortDescriptionUz: string;
  shortDescriptionRu: string;
  shortDescriptionEn: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  featureUz: string;
  featureRu: string;
  featureEn: string;
  ingredientsUz: string;
  ingredientsRu: string;
  ingredientsEn: string;
  usageUz: string;
  usageRu: string;
  usageEn: string;
  storeImageUrl: string;
  storeLocationUz: string;
  storeLocationRu: string;
  storeLocationEn: string;
  storeContactsUz: string;
  storeContactsRu: string;
  storeContactsEn: string;
  skinTypes: string[];
  size: string;
  price: string;
  discountAmount: string;
  stock: string;
  active: boolean;
  isBestseller: boolean;
  isHit: boolean;
  isNew: boolean;
  homeSortOrder: string;
  imageUrl: string;
  colorFrom: string;
  colorTo: string;
  categoryId: string;
  recommendedProductIds: string[];
  galleryImages: GalleryFormItem[];
};

type ProductEditorProps = {
  productId?: string;
};

const MAX_GALLERY_ITEMS = 6;
const STATUS_MESSAGE: Record<string, string> = {
  created: "Товар создан.",
  updated: "Изменения сохранены.",
  deleted: "Товар удален."
};

const emptyForm: ProductFormState = {
  sku: "",
  slug: "",
  nameUz: "",
  nameRu: "",
  nameEn: "",
  shortDescriptionUz: "",
  shortDescriptionRu: "",
  shortDescriptionEn: "",
  descriptionUz: "",
  descriptionRu: "",
  descriptionEn: "",
  featureUz: "",
  featureRu: "",
  featureEn: "",
  ingredientsUz: "",
  ingredientsRu: "",
  ingredientsEn: "",
  usageUz: "",
  usageRu: "",
  usageEn: "",
  storeImageUrl: "",
  storeLocationUz: "",
  storeLocationRu: "",
  storeLocationEn: "",
  storeContactsUz: "",
  storeContactsRu: "",
  storeContactsEn: "",
  skinTypes: [],
  size: "",
  price: "0",
  discountAmount: "0",
  stock: "0",
  active: true,
  isBestseller: false,
  isHit: false,
  isNew: false,
  homeSortOrder: "0",
  imageUrl: "",
  colorFrom: "",
  colorTo: "",
  categoryId: "",
  recommendedProductIds: [],
  galleryImages: []
};

type FieldGroupProps = {
  children: ReactNode;
  hint: string;
  label?: ReactNode;
  className?: string;
  hintClassName?: string;
};

function FieldGroup({ children, hint, label, className, hintClassName }: FieldGroupProps) {
  return (
    <div className={`space-y-2.5 ${className || ""}`}>
      {label ? <div className="text-[0.98rem] font-medium text-slate-700">{label}</div> : null}
      {children}
      <p className={`admin-form-hint ${hintClassName || ""}`}>{hint}</p>
    </div>
  );
}

function EditorCard({
  title,
  children,
  className
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[1.6rem] border border-[#e4e9f1] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)] lg:p-7 ${
        className || ""
      }`}
    >
      <div className="border-b border-[#edf1f6] pb-4">
        <h3 className="text-[1.15rem] font-semibold tracking-tight text-slate-900">{title}</h3>
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}

function EditorSubsection({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-[#edf1f6] pt-6 first:border-t-0 first:pt-0">
      <h4 className="text-[1.02rem] font-semibold text-slate-800">{title}</h4>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="text-[1rem] font-medium text-slate-800">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      <span className="relative mt-1 inline-flex h-8 w-[54px] shrink-0">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className="absolute inset-0 rounded-full bg-[#e5e7ef] transition peer-checked:bg-[#111827]" />
        <span className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-[0_1px_3px_rgba(15,23,42,0.16)] transition peer-checked:translate-x-[22px]" />
      </span>
    </label>
  );
}

function UploadPlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className || "h-10 w-10"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

function buildInitialForm(categoryId: string) {
  return {
    ...emptyForm,
    categoryId
  };
}

function buildFormFromProduct(product: AdminProduct): ProductFormState {
  return {
    sku: product.sku,
    slug: product.slug,
    nameUz: product.nameUz,
    nameRu: product.nameRu,
    nameEn: product.nameEn,
    shortDescriptionUz: product.shortDescriptionUz || "",
    shortDescriptionRu: product.shortDescriptionRu || "",
    shortDescriptionEn: product.shortDescriptionEn || "",
    descriptionUz: product.descriptionUz || "",
    descriptionRu: product.descriptionRu || "",
    descriptionEn: product.descriptionEn || "",
    featureUz: product.featureUz || "",
    featureRu: product.featureRu || "",
    featureEn: product.featureEn || "",
    ingredientsUz: product.ingredientsUz || "",
    ingredientsRu: product.ingredientsRu || "",
    ingredientsEn: product.ingredientsEn || "",
    usageUz: product.usageUz || "",
    usageRu: product.usageRu || "",
    usageEn: product.usageEn || "",
    storeImageUrl: product.storeImageUrl || "",
    storeLocationUz: product.storeLocationUz || "",
    storeLocationRu: product.storeLocationRu || "",
    storeLocationEn: product.storeLocationEn || "",
    storeContactsUz: product.storeContactsUz || "",
    storeContactsRu: product.storeContactsRu || "",
    storeContactsEn: product.storeContactsEn || "",
    skinTypes: product.skinTypes
      ? product.skinTypes
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean)
          .slice(0, 1)
      : [],
    size: product.size || "",
    price: String(product.price),
    discountAmount: String(product.discountAmount ?? 0),
    stock: String(product.stock),
    active: product.active,
    isBestseller: Boolean(product.isBestseller),
    isHit: Boolean(product.isHit),
    isNew: Boolean(product.isNew),
    homeSortOrder: String(product.homeSortOrder ?? 0),
    imageUrl: product.imageUrl || "",
    colorFrom: product.colorFrom || "",
    colorTo: product.colorTo || "",
    categoryId: product.categoryId,
    recommendedProductIds: product.recommendedProductIds || [],
    galleryImages: (product.galleryImages || []).map((image, index) => ({
      type: image.type || "IMAGE",
      imageUrl: image.imageUrl || "",
      videoUrl: image.videoUrl || "",
      sortOrder: typeof image.sortOrder === "number" ? image.sortOrder : index
    }))
  };
}

function getProductDisplayName(product: AdminProduct) {
  return product.nameRu || product.nameEn || product.nameUz;
}

function getCategoryDisplayName(category?: AdminCategory | null) {
  if (!category) {
    return "Без категории";
  }

  return category.nameRu || category.nameEn || category.nameUz;
}

function formatSkinTypes(skinTypes?: string | null) {
  if (!skinTypes) {
    return null;
  }

  const labels = skinTypes
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => SKIN_TYPE_LABELS_RU[entry] || entry);

  return labels.length > 0 ? labels.join(", ") : null;
}

function formatPrice(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

function StatusBadge({ active, compact = false }: { active: boolean; compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold ${
        compact ? "min-w-[84px] px-2.5 py-1 text-[11px]" : "min-w-[96px] px-3 py-1 text-xs"
      } ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      {active ? "Активен" : "Черновик"}
    </span>
  );
}

function ProductThumbnail({ product }: { product: AdminProduct }) {
  if (product.imageUrl) {
    return (
      <div
        className="h-14 w-14 rounded-2xl border border-[#e7edf7] bg-slate-50 bg-cover bg-center"
        style={{ backgroundImage: `url(${product.imageUrl})` }}
      />
    );
  }

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e7edf7] bg-[#f8fafc] text-[0.78rem] font-medium text-slate-300">
      Img
    </div>
  );
}

function ProductGalleryItemPreview({
  item,
  className
}: {
  item: Pick<GalleryFormItem, "type" | "imageUrl" | "videoUrl">;
  className?: string;
}) {
  if (item.type === "VIDEO" && item.videoUrl) {
    return (
      <div className={`relative overflow-hidden bg-[#0f172a] ${className || ""}`}>
        <video
          src={item.videoUrl}
          className="h-full w-full object-cover"
          muted
          playsInline
          preload="metadata"
        />
        <span className="absolute left-3 top-3 inline-flex rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-900">
          Видео
        </span>
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6" fill="currentColor">
              <path d="m8 6 10 6-10 6z" />
            </svg>
          </span>
        </span>
      </div>
    );
  }

  return (
    <img
      src={item.imageUrl}
      alt="Медиа товара"
      className={className || "h-full w-full object-cover"}
    />
  );
}

function FilterSelect({
  value,
  onChange,
  children,
  ariaLabel
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  ariaLabel: string;
}) {
  return (
    <div className="relative">
      <select
        className="admin-select h-12 appearance-none bg-white pr-11 text-sm text-slate-700"
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-300">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}

function EmptyProductList({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex min-h-[340px] items-center justify-center px-6 py-16 text-center">
      <div className="max-w-sm space-y-2">
        <p className="text-lg font-semibold text-slate-900">
          {hasFilters ? "Ничего не найдено" : "Список товаров пуст"}
        </p>
        <p className="text-sm leading-6 text-slate-500">
          {hasFilters
            ? "Измените фильтры или поисковый запрос, чтобы увидеть нужные карточки."
            : "Создайте первый товар через кнопку в правом верхнем углу."}
        </p>
      </div>
    </div>
  );
}

export function ProductListManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchValue = searchParams.get("q") || "";
  const searchQuery = searchValue.trim().toLowerCase();
  const categoryFilter = searchParams.get("category") || "";
  const productStatusFilter = searchParams.get("productStatus") || "";
  const skinTypeFilter = searchParams.get("skinType") || "";
  const statusMessage = STATUS_MESSAGE[searchParams.get("status") || ""] || null;

  const categoryOptions = useMemo(() => {
    const categoryMap = new Map<string, string>();

    products.forEach((product) => {
      if (!product.categoryId) {
        return;
      }

      categoryMap.set(product.categoryId, getCategoryDisplayName(product.category));
    });

    return Array.from(categoryMap.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((left, right) => left.label.localeCompare(right.label, "ru"));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !searchQuery ||
        [
          product.nameUz,
          product.nameRu,
          product.nameEn,
          product.sku,
          product.slug,
          product.category?.nameUz,
          product.category?.nameRu,
          product.category?.nameEn,
          formatSkinTypes(product.skinTypes)
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery);

      const matchesCategory = !categoryFilter || product.categoryId === categoryFilter;
      const matchesStatus =
        !productStatusFilter ||
        (productStatusFilter === "active" ? product.active : !product.active);
      const matchesSkinType =
        !skinTypeFilter ||
        product.skinTypes
          ?.split(",")
          .map((entry) => entry.trim())
          .filter(Boolean)
          .includes(skinTypeFilter);

      return matchesSearch && matchesCategory && matchesStatus && matchesSkinType;
    });
  }, [products, searchQuery, categoryFilter, productStatusFilter, skinTypeFilter]);

  const hasFilters = Boolean(searchValue || categoryFilter || productStatusFilter || skinTypeFilter);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const payload = await requestJson<AdminProduct[]>("/api/products");
        if (active) {
          setProducts(payload);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить товары.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      active = false;
    };
  }, []);

  function updateFilterParam(key: string, value: string) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    nextParams.delete("status");
    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }

  return (
    <section className="min-h-screen bg-[#f7f9fc] px-5 py-6 lg:px-8 lg:py-8">
      {statusMessage ? (
        <div className="mb-6 rounded-[1.25rem] border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
          {statusMessage}
        </div>
      ) : null}

      <div className="flex flex-col gap-5 border-b border-[#e3eaf4] pb-7 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <h2 className="text-[2.15rem] font-semibold tracking-tight text-slate-950">Товары</h2>
          <p className="mt-2.5 text-base leading-7 text-slate-500">
            Управляйте карточками каталога, фильтрами и данными витрины в одном рабочем потоке.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-500 shadow-[0_10px_22px_rgba(15,23,42,0.05)]">
            {filteredProducts.length}
          </span>
          <Link
            href="/admin123/products/new"
            className="inline-flex h-[52px] items-center gap-3 rounded-[1.25rem] bg-[#0f172a] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(15,23,42,0.18)] transition hover:bg-[#111c32]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 5v14" strokeLinecap="round" />
              <path d="M5 12h14" strokeLinecap="round" />
            </svg>
            Добавить товар
          </Link>
        </div>
      </div>

      <div className="mt-7 overflow-hidden rounded-[1.75rem] border border-[#e3eaf4] bg-white shadow-[0_22px_52px_rgba(15,23,42,0.05)]">
        <div className="grid gap-3 border-b border-[#e8eef7] p-4 lg:grid-cols-[minmax(0,1.8fr)_220px_220px_220px] lg:p-5">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-300">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            <input
              className="admin-input h-12 bg-white pl-12"
              aria-label="Поиск товаров"
              placeholder="Поиск товаров..."
              value={searchValue}
              onChange={(event) => updateFilterParam("q", event.target.value)}
            />
          </div>

          <FilterSelect
            ariaLabel="Фильтр по категории"
            value={categoryFilter}
            onChange={(value) => updateFilterParam("category", value)}
          >
            <option value="">Все категории</option>
            {categoryOptions.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            ariaLabel="Фильтр по статусу"
            value={productStatusFilter}
            onChange={(value) => updateFilterParam("productStatus", value)}
          >
            <option value="">Все статусы</option>
            <option value="active">Активен</option>
            <option value="draft">Черновик</option>
          </FilterSelect>

          <FilterSelect
            ariaLabel="Фильтр по типу кожи"
            value={skinTypeFilter}
            onChange={(value) => updateFilterParam("skinType", value)}
          >
            <option value="">Все типы кожи</option>
            {SKIN_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.labelRu}
              </option>
            ))}
          </FilterSelect>
        </div>

        <div className="hidden grid-cols-[92px_minmax(0,2fr)_1.15fr_1.1fr_0.9fr_0.8fr] items-center gap-4 border-b border-[#e8eef7] px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 lg:grid">
          <span>Изображение</span>
          <span>Название</span>
          <span>Артикул</span>
          <span>Категория</span>
          <span>Цена</span>
          <span>Остаток</span>
        </div>

        {loading ? (
          <div className="px-5 py-12 text-sm text-slate-500">Загружаем товары...</div>
        ) : null}

        {!loading && error ? (
          <div className="px-5 py-12 text-sm font-medium text-red-600">{error}</div>
        ) : null}

        {!loading && !error && filteredProducts.length === 0 ? <EmptyProductList hasFilters={hasFilters} /> : null}

        {!loading && !error && filteredProducts.length > 0 ? (
          <>
            <div className="divide-y divide-[#edf2f7]">
              {filteredProducts.map((product) => {
                const skinTypeLabel = formatSkinTypes(product.skinTypes);

                return (
                  <Link
                    key={product.id}
                    href={`/admin123/products/${product.id}`}
                    className="block transition hover:bg-[#fafcff]"
                  >
                    <div className="hidden grid-cols-[92px_minmax(0,2fr)_1.15fr_1.1fr_0.9fr_0.8fr] items-center gap-4 px-5 py-5 lg:grid">
                      <ProductThumbnail product={product} />

                      <div className="min-w-0">
                        <p className="truncate text-[1.08rem] font-semibold text-slate-950">{getProductDisplayName(product)}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <StatusBadge active={product.active} compact />
                          {skinTypeLabel ? (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">
                              {skinTypeLabel}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-700">{product.sku}</p>
                        <p className="mt-1 truncate text-xs uppercase tracking-[0.18em] text-slate-400">{product.slug}</p>
                      </div>

                      <p className="truncate text-sm text-slate-600">{getCategoryDisplayName(product.category)}</p>
                      <p className="text-sm font-semibold text-slate-800">{formatPrice(product.price)}</p>

                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{product.stock}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {product.stock > 0 ? "На складе" : "Нет в наличии"}
                          </p>
                        </div>
                        <span className="text-slate-300">
                          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 px-4 py-4 lg:hidden">
                      <div className="flex items-start gap-4">
                        <ProductThumbnail product={product} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-base font-semibold text-slate-950">
                                {getProductDisplayName(product)}
                              </p>
                              <p className="mt-1 truncate text-xs uppercase tracking-[0.18em] text-slate-400">
                                {product.sku}
                              </p>
                            </div>
                            <span className="pt-1 text-slate-300">
                              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <StatusBadge active={product.active} compact />
                            {skinTypeLabel ? (
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">
                                {skinTypeLabel}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Категория</p>
                          <p className="mt-1.5 truncate text-slate-700">{getCategoryDisplayName(product.category)}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Цена</p>
                          <p className="mt-1.5 text-slate-700">{formatPrice(product.price)}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Остаток</p>
                          <p className="mt-1.5 text-slate-700">{product.stock}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 border-t border-[#e8eef7] px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Показано {filteredProducts.length} из {products.length} товаров
              </p>
              {hasFilters ? (
                <button
                  type="button"
                  onClick={() => {
                    const nextParams = new URLSearchParams(searchParams.toString());
                    nextParams.delete("q");
                    nextParams.delete("category");
                    nextParams.delete("productStatus");
                    nextParams.delete("skinType");
                    nextParams.delete("status");
                    const nextQuery = nextParams.toString();
                    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
                  }}
                  className="text-sm font-semibold text-slate-900 transition hover:text-[var(--brand)]"
                >
                  Сбросить фильтры
                </button>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

export function ProductEditor({ productId }: ProductEditorProps) {
  const router = useRouter();
  const isEditing = Boolean(productId);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<ProductSubmitError | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGalleryImages, setUploadingGalleryImages] = useState(false);
  const [uploadingGalleryVideos, setUploadingGalleryVideos] = useState(false);
  const [recommendationQuery, setRecommendationQuery] = useState("");
  const discountPercent = getDiscountPercent(Number(form.price), Number(form.discountAmount));

  useEffect(() => {
    let active = true;

    async function loadEditorData() {
      setLoading(true);
      setError(null);

      try {
        const [categoriesPayload, productsPayload, productPayload] = await Promise.all([
          requestJson<AdminCategory[]>("/api/categories"),
          requestJson<AdminProduct[]>("/api/products"),
          productId ? requestJson<AdminProduct>(`/api/products/${productId}`) : Promise.resolve(null)
        ]);

        if (!active) {
          return;
        }

        setCategories(categoriesPayload);
        setProducts(productsPayload);
        setForm(
          productPayload
            ? buildFormFromProduct(productPayload)
            : buildInitialForm(categoriesPayload[0]?.id || "")
        );
      } catch (loadError) {
        if (active) {
          setError({
            message:
              loadError instanceof Error ? loadError.message : "Не удалось подготовить форму товара."
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadEditorData();

    return () => {
      active = false;
    };
  }, [productId]);

  async function uploadProductImage(file: File) {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    return requestJson<{ url: string }>("/api/uploads/product-image", {
      method: "POST",
      body: uploadFormData
    });
  }

  async function uploadProductVideo(file: File) {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    return requestJson<{ url: string }>("/api/uploads/product-video", {
      method: "POST",
      body: uploadFormData
    });
  }

  async function handleCoverUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);
    setMessage(null);
    setUploadingCover(true);

    try {
      const payload = await uploadProductImage(file);
      setForm((current) => ({
        ...current,
        imageUrl: payload.url
      }));
      setMessage("Обложка загружена.");
    } catch (uploadError) {
      setError({
        message:
          uploadError instanceof Error ? uploadError.message : "Не удалось загрузить обложку."
      });
    } finally {
      setUploadingCover(false);
      event.target.value = "";
    }
  }

  async function handleGalleryImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).slice(
      0,
      Math.max(0, MAX_GALLERY_ITEMS - form.galleryImages.length)
    );

    if (files.length === 0) {
      return;
    }

    setError(null);
    setMessage(null);
    setUploadingGalleryImages(true);

    try {
      const uploaded = await Promise.all(files.map((file) => uploadProductImage(file)));

      setForm((current) => {
        const nextImages = [...current.galleryImages];

        uploaded.forEach((image, index) => {
          nextImages.push({
            type: "IMAGE",
            imageUrl: image.url,
            videoUrl: "",
            sortOrder: nextImages.length + index
          });
        });

        return {
          ...current,
          galleryImages: nextImages.slice(0, MAX_GALLERY_ITEMS).map((item, itemIndex) => ({
            ...item,
            sortOrder: itemIndex
          }))
        };
      });

      setMessage("Изображения галереи загружены.");
    } catch (uploadError) {
      setError({
        message:
          uploadError instanceof Error
            ? uploadError.message
            : "Не удалось загрузить изображения галереи."
      });
    } finally {
      setUploadingGalleryImages(false);
      event.target.value = "";
    }
  }

  async function handleGalleryVideoUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).slice(
      0,
      Math.max(0, MAX_GALLERY_ITEMS - form.galleryImages.length)
    );

    if (files.length === 0) {
      return;
    }

    setError(null);
    setMessage(null);
    setUploadingGalleryVideos(true);

    try {
      const uploaded = await Promise.all(files.map((file) => uploadProductVideo(file)));

      setForm((current) => {
        const nextImages = [...current.galleryImages];

        uploaded.forEach((video, index) => {
          nextImages.push({
            type: "VIDEO",
            imageUrl: "",
            videoUrl: video.url,
            sortOrder: nextImages.length + index
          });
        });

        return {
          ...current,
          galleryImages: nextImages.slice(0, MAX_GALLERY_ITEMS).map((item, itemIndex) => ({
            ...item,
            sortOrder: itemIndex
          }))
        };
      });

      setMessage("Видео галереи загружены.");
    } catch (uploadError) {
      setError({
        message:
          uploadError instanceof Error ? uploadError.message : "Не удалось загрузить видео галереи."
      });
    } finally {
      setUploadingGalleryVideos(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(productId ? `/api/products/${productId}` : "/api/products", {
        method: productId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          discountAmount: Number(form.discountAmount),
          stock: Number(form.stock),
          homeSortOrder: Number(form.homeSortOrder),
          skinTypes: form.skinTypes,
          recommendedProductIds: form.recommendedProductIds,
          galleryImages: form.galleryImages.map((image, index) => ({
            type: image.type,
            imageUrl: image.type === "IMAGE" ? image.imageUrl : null,
            videoUrl: image.type === "VIDEO" ? image.videoUrl : null,
            sortOrder: index
          }))
        })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string; hint?: string }
          | null;
        throw {
          message: payload?.error || (isEditing ? "Не удалось обновить товар." : "Не удалось создать товар."),
          hint: payload?.hint || null
        } satisfies ProductSubmitError;
      }

      router.push(`/admin123/products?status=${isEditing ? "updated" : "created"}`);
      router.refresh();
    } catch (submitError) {
      if (
        submitError &&
        typeof submitError === "object" &&
        "message" in submitError &&
        typeof submitError.message === "string"
      ) {
        setError({
          message: submitError.message,
          hint:
            "hint" in submitError && typeof submitError.hint === "string" ? submitError.hint : null
        });
      } else {
        setError({
          message: isEditing ? "Не удалось обновить товар." : "Не удалось создать товар."
        });
      }
    }
  }

  async function handleDelete() {
    if (!productId || !window.confirm("Удалить этот товар?")) {
      return;
    }

    try {
      await requestJson(`/api/products/${productId}`, { method: "DELETE" });
      router.push("/admin123/products?status=deleted");
      router.refresh();
    } catch (deleteError) {
      setError({
        message: deleteError instanceof Error ? deleteError.message : "Не удалось удалить товар."
      });
    }
  }

  if (loading) {
    return (
      <div className="px-6 py-12 text-sm text-slate-500 lg:px-8">
        Загружаем форму товара...
      </div>
    );
  }

  const selectedRecommendedProducts = form.recommendedProductIds
    .map((recommendedProductId) => products.find((product) => product.id === recommendedProductId))
    .filter((product): product is AdminProduct => Boolean(product));

  const availableRecommendationProducts = products
    .filter((product) => product.id !== productId)
    .filter((product) => !form.recommendedProductIds.includes(product.id))
    .filter((product) => {
      const query = recommendationQuery.trim().toLowerCase();

      if (!query) {
        return true;
      }

      return [
        getProductDisplayName(product),
        product.slug,
        product.sku
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });

  return (
    <section className="min-h-screen bg-[#f6f8fb] px-5 py-6 lg:px-8 lg:py-8">
      <Link
        href="/admin123/products"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Назад к списку товаров
      </Link>

      <div className="mt-6 border-b border-[#e6ebf2] pb-6">
        <div className="max-w-3xl">
          <h2 className="text-[2.35rem] font-semibold tracking-tight text-slate-950">
            {isEditing ? "Редактирование товара" : "Новый товар"}
          </h2>
          <p className="mt-2.5 text-base leading-7 text-slate-500">
            {isEditing
              ? "Обновите данные карточки и сохраните изменения в каталоге."
              : "Заполните поля товара и подготовьте карточку для публикации."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        {error ? (
          <div className="mb-6 rounded-[1.1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error.message}
            {error.hint ? (
              <span className="ml-2 font-normal text-red-600/90">Подсказка: {error.hint}</span>
            ) : null}
          </div>
        ) : null}

        {message ? (
          <div className="mb-6 rounded-[1.1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_360px]">
          <div className="space-y-6">
            <EditorCard title="Основная информация">
              <div className="grid gap-5 md:grid-cols-2">
                <FieldGroup label="SKU" hint="Внутренний код товара для админки и склада.">
                  <input
                    className="admin-input h-12"
                    aria-label="SKU"
                    placeholder="e.g. MDL-001"
                    value={form.sku}
                    onChange={(event) => setForm((current) => ({ ...current, sku: event.target.value }))}
                  />
                </FieldGroup>
                <FieldGroup label="Slug" hint="Сегмент URL, который используется в ссылке на товар.">
                  <input
                    className="admin-input h-12"
                    aria-label="Слаг"
                    placeholder="e.g. balancing-foam-cleanser"
                    value={form.slug}
                    onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                  />
                </FieldGroup>

                <FieldGroup className="md:col-span-2" label="Название (UZ)" hint="Название товара для витрины на узбекском языке.">
                  <input
                    className="admin-input h-12"
                    aria-label="Название UZ"
                    value={form.nameUz}
                    onChange={(event) => setForm((current) => ({ ...current, nameUz: event.target.value }))}
                  />
                </FieldGroup>
                <FieldGroup className="md:col-span-2" label="Название (RU)" hint="Название товара для витрины на русском языке.">
                  <input
                    className="admin-input h-12"
                    aria-label="Название RU"
                    value={form.nameRu}
                    onChange={(event) => setForm((current) => ({ ...current, nameRu: event.target.value }))}
                  />
                </FieldGroup>
                <FieldGroup className="md:col-span-2" label="Название (EN)" hint="Название товара для витрины на английском языке.">
                  <input
                    className="admin-input h-12"
                    aria-label="Название EN"
                    value={form.nameEn}
                    onChange={(event) => setForm((current) => ({ ...current, nameEn: event.target.value }))}
                  />
                </FieldGroup>
              </div>
            </EditorCard>

            <EditorCard title="Описания">
              <div className="space-y-6">
                <EditorSubsection title="Короткое описание">
                  <div className="space-y-4">
                    <FieldGroup label="UZ" hint="Короткий текст для карточек и превью на узбекском языке.">
                      <textarea
                        className="admin-textarea min-h-[104px]"
                        aria-label="Короткое описание UZ"
                        value={form.shortDescriptionUz}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, shortDescriptionUz: event.target.value }))
                        }
                      />
                    </FieldGroup>
                    <FieldGroup label="RU" hint="Короткий текст для карточек и превью на русском языке.">
                      <textarea
                        className="admin-textarea min-h-[104px]"
                        aria-label="Короткое описание RU"
                        value={form.shortDescriptionRu}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, shortDescriptionRu: event.target.value }))
                        }
                      />
                    </FieldGroup>
                    <FieldGroup label="EN" hint="Короткий текст для карточек и превью на английском языке.">
                      <textarea
                        className="admin-textarea min-h-[104px]"
                        aria-label="Короткое описание EN"
                        value={form.shortDescriptionEn}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, shortDescriptionEn: event.target.value }))
                        }
                      />
                    </FieldGroup>
                  </div>
                </EditorSubsection>

                <EditorSubsection title="Полное описание">
                  <div className="space-y-4">
                    <FieldGroup label="UZ" hint="Основное описание товара для детальной страницы на узбекском языке.">
                      <textarea
                        className="admin-textarea min-h-[124px]"
                        aria-label="Описание UZ"
                        value={form.descriptionUz}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, descriptionUz: event.target.value }))
                        }
                      />
                    </FieldGroup>
                    <FieldGroup label="RU" hint="Основное описание товара для детальной страницы на русском языке.">
                      <textarea
                        className="admin-textarea min-h-[124px]"
                        aria-label="Описание RU"
                        value={form.descriptionRu}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, descriptionRu: event.target.value }))
                        }
                      />
                    </FieldGroup>
                    <FieldGroup label="EN" hint="Основное описание товара для детальной страницы на английском языке.">
                      <textarea
                        className="admin-textarea min-h-[124px]"
                        aria-label="Описание EN"
                        value={form.descriptionEn}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, descriptionEn: event.target.value }))
                        }
                      />
                    </FieldGroup>
                  </div>
                </EditorSubsection>

                <EditorSubsection title="Свойства">
                  <div className="space-y-4">
                    <FieldGroup label="UZ" hint="Текст о свойствах товара в аккордеоне на узбекском языке.">
                      <textarea
                        className="admin-textarea min-h-[104px]"
                        aria-label="Свойства UZ"
                        value={form.featureUz}
                        onChange={(event) => setForm((current) => ({ ...current, featureUz: event.target.value }))}
                      />
                    </FieldGroup>
                    <FieldGroup label="RU" hint="Текст о свойствах товара в аккордеоне на русском языке.">
                      <textarea
                        className="admin-textarea min-h-[104px]"
                        aria-label="Свойства RU"
                        value={form.featureRu}
                        onChange={(event) => setForm((current) => ({ ...current, featureRu: event.target.value }))}
                      />
                    </FieldGroup>
                    <FieldGroup label="EN" hint="Текст о свойствах товара в аккордеоне на английском языке.">
                      <textarea
                        className="admin-textarea min-h-[104px]"
                        aria-label="Свойства EN"
                        value={form.featureEn}
                        onChange={(event) => setForm((current) => ({ ...current, featureEn: event.target.value }))}
                      />
                    </FieldGroup>
                  </div>
                </EditorSubsection>

                <EditorSubsection title="Ингредиенты">
                  <div className="space-y-4">
                    <FieldGroup label="UZ" hint="Текст с ключевыми ингредиентами для детальной страницы на узбекском языке.">
                      <textarea
                        className="admin-textarea min-h-[104px]"
                        aria-label="Ингредиенты UZ"
                        value={form.ingredientsUz}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, ingredientsUz: event.target.value }))
                        }
                      />
                    </FieldGroup>
                    <FieldGroup label="RU" hint="Текст с ключевыми ингредиентами для детальной страницы на русском языке.">
                      <textarea
                        className="admin-textarea min-h-[104px]"
                        aria-label="Ингредиенты RU"
                        value={form.ingredientsRu}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, ingredientsRu: event.target.value }))
                        }
                      />
                    </FieldGroup>
                    <FieldGroup label="EN" hint="Текст с ключевыми ингредиентами для детальной страницы на английском языке.">
                      <textarea
                        className="admin-textarea min-h-[104px]"
                        aria-label="Ингредиенты EN"
                        value={form.ingredientsEn}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, ingredientsEn: event.target.value }))
                        }
                      />
                    </FieldGroup>
                  </div>
                </EditorSubsection>

                <EditorSubsection title="Применение">
                  <div className="space-y-4">
                    <FieldGroup label="UZ" hint="Инструкция по применению для детальной страницы на узбекском языке.">
                      <textarea
                        className="admin-textarea min-h-[104px]"
                        aria-label="Применение UZ"
                        value={form.usageUz}
                        onChange={(event) => setForm((current) => ({ ...current, usageUz: event.target.value }))}
                      />
                    </FieldGroup>
                    <FieldGroup label="RU" hint="Инструкция по применению для детальной страницы на русском языке.">
                      <textarea
                        className="admin-textarea min-h-[104px]"
                        aria-label="Применение RU"
                        value={form.usageRu}
                        onChange={(event) => setForm((current) => ({ ...current, usageRu: event.target.value }))}
                      />
                    </FieldGroup>
                    <FieldGroup label="EN" hint="Инструкция по применению для детальной страницы на английском языке.">
                      <textarea
                        className="admin-textarea min-h-[104px]"
                        aria-label="Применение EN"
                        value={form.usageEn}
                        onChange={(event) => setForm((current) => ({ ...current, usageEn: event.target.value }))}
                      />
                    </FieldGroup>
                  </div>
                </EditorSubsection>
              </div>
            </EditorCard>

            <EditorCard title="Медиа">
              <div className="space-y-6">
                <FieldGroup label="Обложка" hint="Основная обложка для карточек и первого слота галереи. JPG, PNG или WebP до 5 МБ.">
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.35rem] border border-dashed border-[#d5dce8] bg-[#fbfcfe] px-6 py-8 text-center transition hover:border-slate-400 hover:bg-white">
                    {form.imageUrl ? (
                      <img
                        src={form.imageUrl}
                        alt="Обложка товара"
                        className="mb-4 h-28 w-28 object-contain"
                      />
                    ) : (
                      <UploadPlaceholderIcon className="h-12 w-12 text-slate-300" />
                    )}
                    <p className="mt-4 text-lg font-semibold text-slate-800">
                      {uploadingCover ? "Загрузка..." : "Загрузите файл или перетащите"}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">PNG, JPG, WEBP до 5 МБ</p>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={handleCoverUpload}
                      disabled={uploadingCover}
                    />
                  </label>
                </FieldGroup>

                <FieldGroup label="Галерея" hint="Добавляйте изображения и видео для страницы товара. Можно смешивать оба типа, максимум 6 медиа-элементов.">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {form.galleryImages.map((image, index) => (
                      <div
                        key={`${image.type}-${image.imageUrl || image.videoUrl}-${index}`}
                        className="overflow-hidden rounded-[1.25rem] border border-[#e5eaf2] bg-[#fbfcff]"
                      >
                        <ProductGalleryItemPreview
                          item={image}
                          className="h-36 w-full"
                        />
                        <div className="flex items-center justify-between gap-3 p-3">
                          <p className="truncate text-xs text-slate-500">
                            {image.type === "VIDEO" ? `Видео ${index + 1}` : `Изображение ${index + 1}`}
                          </p>
                          <button
                            type="button"
                            className="text-xs font-semibold text-red-600"
                            onClick={() =>
                              setForm((current) => ({
                                ...current,
                                galleryImages: current.galleryImages
                                  .filter((_, imageIndex) => imageIndex !== index)
                                  .map((entry, imageIndex) => ({
                                    ...entry,
                                    sortOrder: imageIndex
                                  }))
                              }))
                            }
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    ))}

                    {form.galleryImages.length < MAX_GALLERY_ITEMS ? (
                      <>
                        <label className="flex h-[196px] cursor-pointer flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-[#d5dce8] bg-white text-center transition hover:border-slate-400 hover:bg-[#fbfcfe]">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-8 w-8 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 5v14" />
                            <path d="M5 12h14" />
                          </svg>
                          <p className="mt-3 text-base font-semibold text-slate-700">
                            {uploadingGalleryImages ? "Загрузка..." : "Добавить изображение"}
                          </p>
                          <p className="mt-2 text-xs text-slate-400">PNG, JPG, WEBP до 5 МБ</p>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            multiple
                            className="hidden"
                            onChange={handleGalleryImageUpload}
                            disabled={uploadingGalleryImages || form.galleryImages.length >= MAX_GALLERY_ITEMS}
                          />
                        </label>

                        <label className="flex h-[196px] cursor-pointer flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-[#d5dce8] bg-[#fbfcff] text-center transition hover:border-slate-400 hover:bg-white">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111827] text-white">
                            <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6" fill="currentColor">
                              <path d="m8 6 10 6-10 6z" />
                            </svg>
                          </span>
                          <p className="mt-3 text-base font-semibold text-slate-700">
                            {uploadingGalleryVideos ? "Загрузка..." : "Добавить видео"}
                          </p>
                          <p className="mt-2 text-xs text-slate-400">MP4, WEBM, MOV до 50 МБ</p>
                          <input
                            type="file"
                            accept=".mp4,.webm,.mov"
                            multiple
                            className="hidden"
                            onChange={handleGalleryVideoUpload}
                            disabled={uploadingGalleryVideos || form.galleryImages.length >= MAX_GALLERY_ITEMS}
                          />
                        </label>
                      </>
                    ) : null}
                  </div>
                </FieldGroup>

                <FieldGroup label="Предпросмотр" hint="Обложка используется в карточках товара, поиске и первом слоте детальной галереи.">
                  <div className="flex h-52 items-center justify-center rounded-[1.35rem] border border-[#e5eaf2] bg-[#fbfcff]">
                    {form.imageUrl ? (
                      <img
                        src={form.imageUrl}
                        alt="Предпросмотр товара"
                        className="h-40 w-40 object-contain"
                      />
                    ) : (
                      <div className="text-center">
                        <UploadPlaceholderIcon className="mx-auto h-10 w-10 text-slate-300" />
                        <p className="mt-3 text-sm text-slate-400">Изображение не выбрано</p>
                      </div>
                    )}
                  </div>
                </FieldGroup>
              </div>
            </EditorCard>

            <EditorCard title="Возможно вам понравится">
              <div className="space-y-5">
                <FieldGroup
                  label="Поиск товара"
                  hint="Ищите по названию, SKU или slug, затем добавляйте товар в блок рекомендаций на странице продукта."
                >
                  <input
                    className="admin-input h-12"
                    aria-label="Поиск рекомендованных товаров"
                    placeholder="Поиск по названию, SKU или slug"
                    value={recommendationQuery}
                    onChange={(event) => setRecommendationQuery(event.target.value)}
                  />
                </FieldGroup>

                <FieldGroup
                  label="Выбранные товары"
                  hint="Эти товары будут показаны в блоке «Возможно вам понравится» на странице текущего продукта."
                >
                  {selectedRecommendedProducts.length > 0 ? (
                    <div className="space-y-3">
                      {selectedRecommendedProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-3 rounded-[1rem] border border-[#dbe3f0] bg-white px-3 py-3"
                        >
                          <ProductThumbnail product={product} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {getProductDisplayName(product)}
                            </p>
                            <p className="mt-1 truncate text-xs uppercase tracking-[0.22em] text-slate-500">
                              {product.slug}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="shrink-0 text-xs font-semibold text-red-600"
                            onClick={() =>
                              setForm((current) => ({
                                ...current,
                                recommendedProductIds: current.recommendedProductIds.filter(
                                  (recommendedProductId) => recommendedProductId !== product.id
                                )
                              }))
                            }
                          >
                            Удалить
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[1rem] border border-dashed border-[#dbe3f0] bg-[#fbfcfe] px-4 py-4 text-sm text-slate-400">
                      Пока не выбрано ни одного товара для блока рекомендаций.
                    </div>
                  )}
                </FieldGroup>

                <FieldGroup
                  label="Список товаров"
                  hint="Список берется из существующего каталога. Можно добавлять сколько угодно товаров."
                >
                  <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
                    {availableRecommendationProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 rounded-[1rem] border border-[#dbe3f0] bg-white px-3 py-3"
                      >
                        <ProductThumbnail product={product} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {getProductDisplayName(product)}
                          </p>
                          <p className="mt-1 truncate text-xs uppercase tracking-[0.22em] text-slate-500">
                            {product.sku} / {product.slug}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="admin-button-secondary shrink-0"
                          onClick={() =>
                            setForm((current) => ({
                              ...current,
                              recommendedProductIds: [...current.recommendedProductIds, product.id]
                            }))
                          }
                        >
                          Добавить
                        </button>
                      </div>
                    ))}
                    {availableRecommendationProducts.length === 0 ? (
                      <div className="rounded-[1rem] border border-dashed border-[#dbe3f0] bg-[#fbfcfe] px-4 py-4 text-sm text-slate-400">
                        По этому запросу товары не найдены.
                      </div>
                    ) : null}
                  </div>
                </FieldGroup>
              </div>
            </EditorCard>
          </div>

          <div className="space-y-6">
            <EditorCard title="Атрибуты">
              <div className="space-y-5">
                <FieldGroup label="Тип кожи" hint="Выберите один обязательный тип кожи для витрины и фильтра каталога.">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    {SKIN_TYPE_OPTIONS.map((option) => {
                      const checked = form.skinTypes.includes(option.value);

                      return (
                        <label
                          key={option.value}
                          className={`flex items-center gap-3 rounded-[1rem] border px-4 py-3 text-sm font-medium transition ${
                            checked
                              ? "border-slate-900 bg-slate-50 text-slate-900"
                              : "border-[#dbe3f0] bg-white text-slate-600"
                          }`}
                        >
                          <input
                            type="radio"
                            name="skin-type"
                            checked={checked}
                            onChange={() =>
                              setForm((current) => ({
                                ...current,
                                skinTypes: [option.value]
                              }))
                            }
                          />
                          {option.labelRu}
                        </label>
                      );
                    })}
                  </div>
                </FieldGroup>

                <FieldGroup label="Размер / объем" hint="Размер упаковки или объем товара, например 150 ml.">
                  <input
                    className="admin-input h-12"
                    aria-label="Размер"
                    placeholder="e.g. 150 ml"
                    value={form.size}
                    onChange={(event) => setForm((current) => ({ ...current, size: event.target.value }))}
                  />
                </FieldGroup>

                <FieldGroup label="Категория" hint="Категория, к которой относится товар в каталоге.">
                  <select
                    className="admin-select h-12"
                    value={form.categoryId}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, categoryId: event.target.value }))
                    }
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nameRu || category.nameEn || category.nameUz}
                      </option>
                    ))}
                  </select>
                </FieldGroup>

                <FieldGroup label="Цена" hint="Цена продажи, которая показывается в карточках и при оформлении заказа.">
                  <input
                    className="admin-input h-12"
                    aria-label="Цена"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                  />
                </FieldGroup>

                <FieldGroup label="Сумма скидки" hint="Сумма скидки в сумах. Процент для бейджа рассчитывается автоматически от основной цены товара.">
                  <input
                    className="admin-input h-12"
                    aria-label="Сумма скидки"
                    type="number"
                    min="0"
                    value={form.discountAmount}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, discountAmount: event.target.value }))
                    }
                  />
                </FieldGroup>

                <FieldGroup label="Остаток" hint="Доступное количество на складе.">
                  <input
                    className="admin-input h-12"
                    aria-label="Остаток"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
                  />
                </FieldGroup>

                <FieldGroup label="Порядок на главной" hint="Порядок на главной странице внутри блока бестселлеров. Меньшее число показывается раньше.">
                  <input
                    className="admin-input h-12"
                    aria-label="Порядок на главной"
                    type="number"
                    min="0"
                    value={form.homeSortOrder}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, homeSortOrder: event.target.value }))
                    }
                  />
                </FieldGroup>

                <FieldGroup label="Цветовой диапазон" hint="Начальный и конечный цвет градиента для заглушек и карточек.">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-500">От</p>
                      <div className="flex items-center gap-3 rounded-[1rem] border border-[#dbe3f0] bg-white px-3 py-2.5">
                        <span
                          className="h-9 w-9 rounded-[0.8rem] border border-slate-200 bg-white"
                          style={{ backgroundColor: form.colorFrom || "#ffffff" }}
                        />
                        <input
                          className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none"
                          aria-label="Цвет от"
                          placeholder="#FFFFFF"
                          value={form.colorFrom}
                          onChange={(event) => setForm((current) => ({ ...current, colorFrom: event.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-500">До</p>
                      <div className="flex items-center gap-3 rounded-[1rem] border border-[#dbe3f0] bg-white px-3 py-2.5">
                        <span
                          className="h-9 w-9 rounded-[0.8rem] border border-slate-200 bg-black"
                          style={{ backgroundColor: form.colorTo || "#000000" }}
                        />
                        <input
                          className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none"
                          aria-label="Цвет до"
                          placeholder="#000000"
                          value={form.colorTo}
                          onChange={(event) => setForm((current) => ({ ...current, colorTo: event.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </FieldGroup>
              </div>
            </EditorCard>

            <EditorCard title="Статус">
              <div className="divide-y divide-[#edf1f6]">
                <ToggleRow
                  title="Активность"
                  description="Если выключено, товар остается в админке, но скрывается от покупателей."
                  checked={form.active}
                  onChange={(checked) => setForm((current) => ({ ...current, active: checked }))}
                />
                <ToggleRow
                  title="Бестселлер"
                  description="Включите, чтобы показывать товар в блоке бестселлеров на главной странице."
                  checked={form.isBestseller}
                  onChange={(checked) => setForm((current) => ({ ...current, isBestseller: checked }))}
                />
                <ToggleRow
                  title="Хит продаж"
                  description="Желтый карточный бейдж. Можно включать одновременно со скидкой и новинкой."
                  checked={form.isHit}
                  onChange={(checked) => setForm((current) => ({ ...current, isHit: checked }))}
                />
                <ToggleRow
                  title="Новинка"
                  description="Бирюзовый карточный бейдж. Можно включать одновременно со скидкой и хитом."
                  checked={form.isNew}
                  onChange={(checked) => setForm((current) => ({ ...current, isNew: checked }))}
                />
              </div>
            </EditorCard>

            <EditorCard title="Предпросмотр бейджей">
              <div className="flex flex-wrap items-start gap-2">
                {discountPercent > 0 ? (
                  <span className="inline-flex min-h-10 items-center justify-center rounded-[0.6rem] bg-[#ff2a93] px-3 text-sm font-semibold text-white">
                    {discountPercent}%
                  </span>
                ) : null}
                {form.isHit ? (
                  <span className="inline-flex min-h-10 items-center justify-center rounded-[0.6rem] bg-[#fff100] px-3 text-sm font-semibold text-black">
                    ХИТ
                  </span>
                ) : null}
                {form.isNew ? (
                  <span className="inline-flex min-h-10 items-center justify-center rounded-[0.6rem] bg-[#E8FBF6] px-3 text-sm font-semibold text-[#0F766E]">
                    НОВИНКА
                  </span>
                ) : null}
                {discountPercent <= 0 && !form.isHit && !form.isNew ? (
                  <p className="text-sm text-slate-400">Бейджи пока не выбраны.</p>
                ) : null}
              </div>
              <p className="mt-4 text-[11px] leading-5 text-slate-400">
                На витрине эти бейджи выводятся вместе и могут комбинироваться в одной карточке товара.
              </p>
            </EditorCard>
          </div>
        </div>

        <div className="sticky bottom-0 mt-8 border-t border-[#e6ebf2] bg-[#f6f8fb]/95 py-5 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {isEditing ? (
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-[1rem] border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  onClick={handleDelete}
                >
                  Удалить товар
                </button>
              ) : null}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/admin123/products"
                className="inline-flex items-center justify-center rounded-[1rem] border border-[#d9e1ec] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#fbfcfe]"
              >
                Отмена
              </Link>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-[1rem] bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
              >
                {isEditing ? "Сохранить товар" : "Опубликовать товар"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export function ProductManager() {
  return <ProductListManager />;
}
