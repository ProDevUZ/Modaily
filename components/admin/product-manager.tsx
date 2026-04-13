"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

import {
  type AdminCategory,
  type AdminProduct,
  requestJson
} from "@/components/admin/admin-types";

type GalleryFormImage = {
  imageUrl: string;
  sortOrder: number;
};

type ProductSubmitError = {
  message: string;
  hint?: string | null;
};

const MAX_GALLERY_IMAGES = 6;
const SKIN_TYPE_OPTIONS = [
  { value: "dry", label: "Сухая" },
  { value: "combination", label: "Комбинированная" },
  { value: "oily", label: "Жирная" },
  { value: "sensitive", label: "Чувствительная" }
] as const;

const SKIN_TYPE_LABELS: Record<string, string> = {
  dry: "Сухая",
  combination: "Комбинированная",
  oily: "Жирная",
  sensitive: "Чувствительная"
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
  stock: string;
  active: boolean;
  isBestseller: boolean;
  homeSortOrder: string;
  imageUrl: string;
  colorFrom: string;
  colorTo: string;
  categoryId: string;
  galleryImages: GalleryFormImage[];
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
  stock: "0",
  active: true,
  isBestseller: false,
  homeSortOrder: "0",
  imageUrl: "",
  colorFrom: "",
  colorTo: "",
  categoryId: "",
  galleryImages: []
};

type FieldGroupProps = {
  children: ReactNode;
  hint: string;
  className?: string;
};

function FieldGroup({ children, hint, className }: FieldGroupProps) {
  return (
    <div className={className}>
      {children}
      <p className="admin-form-hint">{hint}</p>
    </div>
  );
}

function buildInitialForm(categoryId: string) {
  return {
    ...emptyForm,
    categoryId
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
    .map((entry) => SKIN_TYPE_LABELS[entry] || entry);

  return labels.length > 0 ? labels.join(", ") : null;
}

export function ProductManager() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<ProductSubmitError | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingStoreImage, setUploadingStoreImage] = useState(false);
  const searchQuery = (searchParams.get("q") || "").trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!searchQuery) {
      return products;
    }

    return products.filter((product) =>
      [
        product.sku,
        product.slug,
        product.nameUz,
        product.nameRu,
        product.nameEn,
        product.shortDescriptionUz,
        product.shortDescriptionRu,
        product.shortDescriptionEn,
        product.category?.nameUz,
        product.category?.nameRu,
        product.category?.nameEn
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery)
    );
  }, [products, searchQuery]);

  async function loadData() {
    setLoading(true);
    try {
      const [productsPayload, categoriesPayload] = await Promise.all([
        requestJson<AdminProduct[]>("/api/products"),
        requestJson<AdminCategory[]>("/api/categories")
      ]);

      setProducts(productsPayload);
      setCategories(categoriesPayload);
      setForm((current) => ({
        ...current,
        categoryId: current.categoryId || categoriesPayload[0]?.id || ""
      }));
    } catch (loadError) {
      setError({ message: loadError instanceof Error ? loadError.message : "Не удалось загрузить товары." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm(buildInitialForm(categories[0]?.id || ""));
  }

  async function uploadSingleFile(file: File) {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    return requestJson<{ url: string }>("/api/uploads/product-image", {
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
      const payload = await uploadSingleFile(file);
      setForm((current) => ({
        ...current,
        imageUrl: payload.url
      }));
      setMessage("Обложка загружена.");
    } catch (uploadError) {
      setError({ message: uploadError instanceof Error ? uploadError.message : "Не удалось загрузить обложку." });
    } finally {
      setUploadingCover(false);
      event.target.value = "";
    }
  }

  async function handleGalleryUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).slice(0, Math.max(0, MAX_GALLERY_IMAGES - form.galleryImages.length));

    if (files.length === 0) {
      return;
    }

    setError(null);
    setMessage(null);
    setUploadingGallery(true);

    try {
      const uploaded = await Promise.all(files.map((file) => uploadSingleFile(file)));

      setForm((current) => {
        const nextImages = [...current.galleryImages];

        uploaded.forEach((image, index) => {
          nextImages.push({
            imageUrl: image.url,
            sortOrder: nextImages.length + index
          });
        });

        return {
          ...current,
          galleryImages: nextImages.slice(0, MAX_GALLERY_IMAGES).map((item, itemIndex) => ({
            ...item,
            sortOrder: itemIndex
          }))
        };
      });

      setMessage("Изображения галереи загружены.");
    } catch (uploadError) {
      setError({ message: uploadError instanceof Error ? uploadError.message : "Не удалось загрузить изображения галереи." });
    } finally {
      setUploadingGallery(false);
      event.target.value = "";
    }
  }

  async function handleStoreImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);
    setMessage(null);
    setUploadingStoreImage(true);

    try {
      const payload = await uploadSingleFile(file);
      setForm((current) => ({
        ...current,
        storeImageUrl: payload.url
      }));
      setMessage("Изображение магазина загружено.");
    } catch (uploadError) {
      setError({ message: uploadError instanceof Error ? uploadError.message : "Не удалось загрузить изображение магазина." });
    } finally {
      setUploadingStoreImage(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(editingId ? `/api/products/${editingId}` : "/api/products", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
          homeSortOrder: Number(form.homeSortOrder),
          skinTypes: form.skinTypes,
          galleryImages: form.galleryImages.map((image, index) => ({
            imageUrl: image.imageUrl,
            sortOrder: index
          }))
        })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string; hint?: string } | null;
        throw {
          message: payload?.error || (editingId ? "Не удалось обновить товар." : "Не удалось создать товар."),
          hint: payload?.hint || null
        } satisfies ProductSubmitError;
      }

      resetForm();
      setMessage(editingId ? "Товар обновлен." : "Товар создан.");
      await loadData();
    } catch (submitError) {
      if (
        submitError &&
        typeof submitError === "object" &&
        "message" in submitError &&
        typeof submitError.message === "string"
      ) {
        setError({
          message: submitError.message,
          hint: "hint" in submitError && typeof submitError.hint === "string" ? submitError.hint : null
        });
      } else {
        setError({ message: editingId ? "Не удалось обновить товар." : "Не удалось создать товар." });
      }
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Удалить этот товар?")) {
      return;
    }

    try {
      await requestJson(`/api/products/${id}`, { method: "DELETE" });

      if (editingId === id) {
        resetForm();
      }

      setMessage("Товар удален.");
      await loadData();
    } catch (deleteError) {
      setError({ message: deleteError instanceof Error ? deleteError.message : "Не удалось удалить товар." });
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[560px_1fr]">
      <form onSubmit={handleSubmit} className="admin-panel p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl font-semibold text-slate-950">{editingId ? "Редактирование товара" : "Создание товара"}</h3>
          {editingId ? (
            <button type="button" className="text-sm font-semibold text-slate-500" onClick={resetForm}>
              Отмена
            </button>
          ) : null}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <FieldGroup hint="Внутренний код товара для админки и склада.">
            <input className="admin-input" aria-label="SKU" value={form.sku} onChange={(event) => setForm((current) => ({ ...current, sku: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Сегмент URL, который используется в ссылке на товар.">
            <input className="admin-input" aria-label="Слаг" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
          </FieldGroup>

          <FieldGroup hint="Название товара для витрины на узбекском языке.">
            <input className="admin-input" aria-label="Название UZ" value={form.nameUz} onChange={(event) => setForm((current) => ({ ...current, nameUz: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Название товара для витрины на русском языке.">
            <input className="admin-input" aria-label="Название RU" value={form.nameRu} onChange={(event) => setForm((current) => ({ ...current, nameRu: event.target.value }))} />
          </FieldGroup>
          <FieldGroup className="md:col-span-2" hint="Название товара для витрины на английском языке.">
            <input className="admin-input" aria-label="Название EN" value={form.nameEn} onChange={(event) => setForm((current) => ({ ...current, nameEn: event.target.value }))} />
          </FieldGroup>

          <FieldGroup hint="Короткий текст для карточек и превью на узбекском языке.">
            <textarea className="admin-textarea" aria-label="Короткое описание UZ" value={form.shortDescriptionUz} onChange={(event) => setForm((current) => ({ ...current, shortDescriptionUz: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Короткий текст для карточек и превью на русском языке.">
            <textarea className="admin-textarea" aria-label="Короткое описание RU" value={form.shortDescriptionRu} onChange={(event) => setForm((current) => ({ ...current, shortDescriptionRu: event.target.value }))} />
          </FieldGroup>
          <FieldGroup className="md:col-span-2" hint="Короткий текст для карточек и превью на английском языке.">
            <textarea className="admin-textarea" aria-label="Короткое описание EN" value={form.shortDescriptionEn} onChange={(event) => setForm((current) => ({ ...current, shortDescriptionEn: event.target.value }))} />
          </FieldGroup>

          <FieldGroup hint="Основное описание товара для детальной страницы на узбекском языке.">
            <textarea className="admin-textarea min-h-28" aria-label="Описание UZ" value={form.descriptionUz} onChange={(event) => setForm((current) => ({ ...current, descriptionUz: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Основное описание товара для детальной страницы на русском языке.">
            <textarea className="admin-textarea min-h-28" aria-label="Описание RU" value={form.descriptionRu} onChange={(event) => setForm((current) => ({ ...current, descriptionRu: event.target.value }))} />
          </FieldGroup>
          <FieldGroup className="md:col-span-2" hint="Основное описание товара для детальной страницы на английском языке.">
            <textarea className="admin-textarea min-h-28" aria-label="Описание EN" value={form.descriptionEn} onChange={(event) => setForm((current) => ({ ...current, descriptionEn: event.target.value }))} />
          </FieldGroup>

          <FieldGroup hint="Текст о свойствах товара в аккордеоне на узбекском языке.">
            <textarea className="admin-textarea min-h-24" aria-label="Свойства UZ" value={form.featureUz} onChange={(event) => setForm((current) => ({ ...current, featureUz: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Текст о свойствах товара в аккордеоне на русском языке.">
            <textarea className="admin-textarea min-h-24" aria-label="Свойства RU" value={form.featureRu} onChange={(event) => setForm((current) => ({ ...current, featureRu: event.target.value }))} />
          </FieldGroup>
          <FieldGroup className="md:col-span-2" hint="Текст о свойствах товара в аккордеоне на английском языке.">
            <textarea className="admin-textarea min-h-24" aria-label="Свойства EN" value={form.featureEn} onChange={(event) => setForm((current) => ({ ...current, featureEn: event.target.value }))} />
          </FieldGroup>

          <FieldGroup hint="Текст с ключевыми ингредиентами для детальной страницы на узбекском языке.">
            <textarea className="admin-textarea min-h-24" aria-label="Ингредиенты UZ" value={form.ingredientsUz} onChange={(event) => setForm((current) => ({ ...current, ingredientsUz: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Текст с ключевыми ингредиентами для детальной страницы на русском языке.">
            <textarea className="admin-textarea min-h-24" aria-label="Ингредиенты RU" value={form.ingredientsRu} onChange={(event) => setForm((current) => ({ ...current, ingredientsRu: event.target.value }))} />
          </FieldGroup>
          <FieldGroup className="md:col-span-2" hint="Текст с ключевыми ингредиентами для детальной страницы на английском языке.">
            <textarea className="admin-textarea min-h-24" aria-label="Ингредиенты EN" value={form.ingredientsEn} onChange={(event) => setForm((current) => ({ ...current, ingredientsEn: event.target.value }))} />
          </FieldGroup>

          <FieldGroup hint="Инструкция по применению для детальной страницы на узбекском языке.">
            <textarea className="admin-textarea min-h-24" aria-label="Применение UZ" value={form.usageUz} onChange={(event) => setForm((current) => ({ ...current, usageUz: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Инструкция по применению для детальной страницы на русском языке.">
            <textarea className="admin-textarea min-h-24" aria-label="Применение RU" value={form.usageRu} onChange={(event) => setForm((current) => ({ ...current, usageRu: event.target.value }))} />
          </FieldGroup>
          <FieldGroup className="md:col-span-2" hint="Инструкция по применению для детальной страницы на английском языке.">
            <textarea className="admin-textarea min-h-24" aria-label="Применение EN" value={form.usageEn} onChange={(event) => setForm((current) => ({ ...current, usageEn: event.target.value }))} />
          </FieldGroup>

          <FieldGroup className="md:col-span-2" hint="Необязательные типы кожи для фильтров каталога. Можно выбрать один или несколько вариантов.">
            <div className="grid gap-3 sm:grid-cols-2">
              {SKIN_TYPE_OPTIONS.map((option) => {
                const checked = form.skinTypes.includes(option.value);

                return (
                  <label key={option.value} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          skinTypes: event.target.checked
                            ? [...current.skinTypes, option.value]
                            : current.skinTypes.filter((entry) => entry !== option.value)
                        }))
                      }
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
          </FieldGroup>

          <FieldGroup className="md:col-span-2" hint="Основная обложка для карточек и первого слота галереи. JPG, PNG или WebP до 5 МБ.">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Обложка</p>
                  <p className="mt-1 text-xs text-slate-400">{form.imageUrl || "Обложка пока не загружена"}</p>
                </div>
                <label className="admin-button-secondary cursor-pointer text-center">
                  {uploadingCover ? "Загрузка..." : "Загрузить обложку"}
                  <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleCoverUpload} disabled={uploadingCover} />
                </label>
              </div>
            </div>
          </FieldGroup>

          <FieldGroup className="md:col-span-2" hint="Дополнительные изображения для страницы товара. Оптимально 2-5 изображений, максимум 6.">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Галерея товара</p>
                  <p className="mt-1 text-xs text-slate-400">{form.galleryImages.length}/{MAX_GALLERY_IMAGES} загружено</p>
                </div>
                <label className={`admin-button-secondary cursor-pointer text-center ${form.galleryImages.length >= MAX_GALLERY_IMAGES ? "pointer-events-none opacity-50" : ""}`}>
                  {uploadingGallery ? "Загрузка..." : "Загрузить изображения"}
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    multiple
                    className="hidden"
                    onChange={handleGalleryUpload}
                    disabled={uploadingGallery || form.galleryImages.length >= MAX_GALLERY_IMAGES}
                  />
                </label>
              </div>

              {form.galleryImages.length > 0 ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {form.galleryImages.map((image, index) => (
                    <div key={`${image.imageUrl}-${index}`} className="overflow-hidden rounded-[1.2rem] border border-slate-200 bg-white">
                      <img src={image.imageUrl} alt={`Галерея ${index + 1}`} className="h-40 w-full object-cover" />
                      <div className="flex items-center justify-between gap-3 p-3">
                        <p className="truncate text-xs text-slate-500">Изображение {index + 1}</p>
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
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-400">Изображения галереи пока не загружены.</p>
              )}
            </div>
          </FieldGroup>

          <FieldGroup className="md:col-span-2" hint="Дополнительное фото магазина для страницы «Где купить». JPG, PNG или WebP до 5 МБ.">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Изображение магазина</p>
                  <p className="mt-1 text-xs text-slate-400">{form.storeImageUrl || "Изображение магазина пока не загружено"}</p>
                </div>
                <label className="admin-button-secondary cursor-pointer text-center">
                  {uploadingStoreImage ? "Загрузка..." : "Загрузить изображение"}
                  <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleStoreImageUpload} disabled={uploadingStoreImage} />
                </label>
              </div>
            </div>
          </FieldGroup>

          <FieldGroup hint="Адрес магазина для страницы «Где купить» на узбекском языке.">
            <textarea className="admin-textarea min-h-24" aria-label="Адрес магазина UZ" value={form.storeLocationUz} onChange={(event) => setForm((current) => ({ ...current, storeLocationUz: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Адрес магазина для страницы «Где купить» на русском языке.">
            <textarea className="admin-textarea min-h-24" aria-label="Адрес магазина RU" value={form.storeLocationRu} onChange={(event) => setForm((current) => ({ ...current, storeLocationRu: event.target.value }))} />
          </FieldGroup>
          <FieldGroup className="md:col-span-2" hint="Адрес магазина для страницы «Где купить» на английском языке.">
            <textarea className="admin-textarea min-h-24" aria-label="Адрес магазина EN" value={form.storeLocationEn} onChange={(event) => setForm((current) => ({ ...current, storeLocationEn: event.target.value }))} />
          </FieldGroup>

          <FieldGroup hint="Контакты магазина для страницы «Где купить» на узбекском языке. Телефон, Telegram и Instagram указывайте с новой строки.">
            <textarea className="admin-textarea min-h-24" aria-label="Контакты магазина UZ" value={form.storeContactsUz} onChange={(event) => setForm((current) => ({ ...current, storeContactsUz: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Контакты магазина для страницы «Где купить» на русском языке. Телефон, Telegram и Instagram указывайте с новой строки.">
            <textarea className="admin-textarea min-h-24" aria-label="Контакты магазина RU" value={form.storeContactsRu} onChange={(event) => setForm((current) => ({ ...current, storeContactsRu: event.target.value }))} />
          </FieldGroup>
          <FieldGroup className="md:col-span-2" hint="Контакты магазина для страницы «Где купить» на английском языке. Телефон, Telegram и Instagram указывайте с новой строки.">
            <textarea className="admin-textarea min-h-24" aria-label="Контакты магазина EN" value={form.storeContactsEn} onChange={(event) => setForm((current) => ({ ...current, storeContactsEn: event.target.value }))} />
          </FieldGroup>

          <FieldGroup hint="Размер упаковки или объем товара, например 150 ml.">
            <input className="admin-input" aria-label="Размер" value={form.size} onChange={(event) => setForm((current) => ({ ...current, size: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Цена продажи, которая показывается в карточках и при оформлении заказа.">
            <input className="admin-input" aria-label="Цена" type="number" min="0" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Доступное количество на складе.">
            <input className="admin-input" aria-label="Остаток" type="number" min="0" value={form.stock} onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Порядок на главной странице внутри блока бестселлеров. Меньшее число показывается раньше.">
            <input className="admin-input" aria-label="Порядок на главной" type="number" min="0" value={form.homeSortOrder} onChange={(event) => setForm((current) => ({ ...current, homeSortOrder: event.target.value }))} />
          </FieldGroup>

          <FieldGroup hint="Категория, к которой относится товар в каталоге.">
            <select className="admin-select" value={form.categoryId} onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}>
              <option value="">Выберите категорию</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nameRu || category.nameEn || category.nameUz}
                </option>
              ))}
            </select>
          </FieldGroup>
          <FieldGroup hint="Начальный цвет градиента для заглушек и карточек.">
            <input className="admin-input" aria-label="Цвет от" value={form.colorFrom} onChange={(event) => setForm((current) => ({ ...current, colorFrom: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Конечный цвет градиента для заглушек и карточек.">
            <input className="admin-input" aria-label="Цвет до" value={form.colorTo} onChange={(event) => setForm((current) => ({ ...current, colorTo: event.target.value }))} />
          </FieldGroup>

          <FieldGroup hint="Если выключено, товар остается в админке, но скрывается от покупателей.">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={form.active} onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))} />
              Товар активен
            </label>
          </FieldGroup>
          <FieldGroup hint="Включите, чтобы показывать товар в блоке бестселлеров на главной странице.">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={form.isBestseller} onChange={(event) => setForm((current) => ({ ...current, isBestseller: event.target.checked }))} />
              Показывать в блоке бестселлеров
            </label>
          </FieldGroup>

          <div className="md:col-span-2 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Предпросмотр обложки</p>
            <div className="mt-3 flex h-48 items-center justify-center rounded-[1.2rem] bg-white">
              {form.imageUrl ? <img src={form.imageUrl} alt="Предпросмотр товара" className="h-40 w-40 object-contain" /> : <p className="text-sm text-slate-400">Изображение не выбрано</p>}
            </div>
            <p className="mt-3 text-[11px] leading-4 text-slate-400">Обложка используется в карточках товара, поиске и первом слоте детальной галереи.</p>
          </div>
        </div>

        {error ? (
          <p className="mt-4 text-sm font-semibold text-red-600">
            {error.message}
            {error.hint ? <span className="ml-2 font-normal text-red-500/90">Подсказка: {error.hint}</span> : null}
          </p>
        ) : null}
        {message ? <p className="mt-4 text-sm font-semibold text-emerald-600">{message}</p> : null}

        <button type="submit" className="admin-button-primary mt-6 w-full">
          {editingId ? "Обновить товар" : "Создать товар"}
        </button>
      </form>

      <div className="admin-panel p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-2xl font-semibold text-slate-950">Products</h3>
          <span className="admin-badge">{filteredProducts.length}</span>
        </div>

        <div className="mt-5 space-y-4">
          {loading ? <p className="text-sm text-slate-500">Загружаем товары...</p> : null}
          {!loading && products.length === 0 ? <p className="text-sm text-slate-500">Товаров пока нет.</p> : null}
          {!loading && products.length > 0 && filteredProducts.length === 0 ? (
            <p className="text-sm text-slate-500">По этому запросу товары не найдены.</p>
          ) : null}
          {filteredProducts.map((product) => (
            <article key={product.id} className="admin-panel-muted p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.2rem] bg-white">
                    {product.imageUrl ? <img src={product.imageUrl} alt={getProductDisplayName(product)} className="h-16 w-16 object-contain" /> : <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Нет фото</span>}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                      {product.sku} | {product.slug}
                    </p>
                    <h4 className="mt-2 text-lg font-semibold text-slate-950">{getProductDisplayName(product)}</h4>
                    <p className="mt-1 text-sm text-slate-600">{getCategoryDisplayName(product.category)}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {product.price.toLocaleString("ru-RU")} сум | Остаток {product.stock} | {product.active ? "Активен" : "Черновик"} | Бестселлер{" "}
                      {product.isBestseller ? `Да (#${product.homeSortOrder})` : "Нет"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Галерея {product.galleryImages?.length || 0} | Отзывы {product._count?.reviews || 0}
                      {formatSkinTypes(product.skinTypes) ? ` | Тип кожи: ${formatSkinTypes(product.skinTypes)}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="admin-button-secondary"
                    onClick={() => {
                      setEditingId(product.id);
                      setForm({
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
                        skinTypes: product.skinTypes ? product.skinTypes.split(",").map((entry) => entry.trim()).filter(Boolean) : [],
                        size: product.size || "",
                        price: String(product.price),
                        stock: String(product.stock),
                        active: product.active,
                        isBestseller: Boolean(product.isBestseller),
                        homeSortOrder: String(product.homeSortOrder ?? 0),
                        imageUrl: product.imageUrl || "",
                        colorFrom: product.colorFrom || "",
                        colorTo: product.colorTo || "",
                        categoryId: product.categoryId,
                        galleryImages: (product.galleryImages || []).map((image, index) => ({
                          imageUrl: image.imageUrl,
                          sortOrder: typeof image.sortOrder === "number" ? image.sortOrder : index
                        }))
                      });
                    }}
                  >
                    Редактировать
                  </button>
                  <button type="button" className="admin-button-danger" onClick={() => handleDelete(product.id)}>
                    Удалить
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
