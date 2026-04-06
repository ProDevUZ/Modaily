"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";

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
  { value: "dry", label: "Quruq / Dry" },
  { value: "combination", label: "Kombi / Combination" },
  { value: "oily", label: "Yog'li / Oily" },
  { value: "sensitive", label: "Sezuvchan / Sensitive" }
] as const;

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
      <p className="mt-2 px-1 text-[11px] leading-4 text-slate-400">{hint}</p>
    </div>
  );
}

function buildInitialForm(categoryId: string) {
  return {
    ...emptyForm,
    categoryId
  };
}

export function ProductManager() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<ProductSubmitError | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

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
      setError({ message: loadError instanceof Error ? loadError.message : "Could not load products." });
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
      setMessage("Cover image uploaded.");
    } catch (uploadError) {
      setError({ message: uploadError instanceof Error ? uploadError.message : "Could not upload cover image." });
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

      setMessage("Gallery images uploaded.");
    } catch (uploadError) {
      setError({ message: uploadError instanceof Error ? uploadError.message : "Could not upload gallery images." });
    } finally {
      setUploadingGallery(false);
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
          message: payload?.error || (editingId ? "Product could not be updated." : "Product could not be created."),
          hint: payload?.hint || null
        } satisfies ProductSubmitError;
      }

      resetForm();
      setMessage(editingId ? "Product updated." : "Product created.");
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
        setError({ message: editingId ? "Product could not be updated." : "Product could not be created." });
      }
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {
      await requestJson(`/api/products/${id}`, { method: "DELETE" });

      if (editingId === id) {
        resetForm();
      }

      setMessage("Product deleted.");
      await loadData();
    } catch (deleteError) {
      setError({ message: deleteError instanceof Error ? deleteError.message : "Could not delete product." });
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[560px_1fr]">
      <form onSubmit={handleSubmit} className="admin-panel p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl font-semibold text-slate-950">{editingId ? "Edit product" : "Create product"}</h3>
          {editingId ? (
            <button type="button" className="text-sm font-semibold text-slate-500" onClick={resetForm}>
              Cancel
            </button>
          ) : null}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <FieldGroup hint="Internal product code used in admin and warehouse.">
            <input className="admin-input" placeholder="SKU" value={form.sku} onChange={(event) => setForm((current) => ({ ...current, sku: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Product URL segment used in the storefront link.">
            <input className="admin-input" placeholder="Slug" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
          </FieldGroup>

          <FieldGroup hint="Product name shown in Uzbek storefront pages.">
            <input className="admin-input" placeholder="Name UZ" value={form.nameUz} onChange={(event) => setForm((current) => ({ ...current, nameUz: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Product name shown in Russian storefront pages.">
            <input className="admin-input" placeholder="Name RU" value={form.nameRu} onChange={(event) => setForm((current) => ({ ...current, nameRu: event.target.value }))} />
          </FieldGroup>
          <FieldGroup className="md:col-span-2" hint="Product name shown in English storefront pages.">
            <input className="admin-input" placeholder="Name EN" value={form.nameEn} onChange={(event) => setForm((current) => ({ ...current, nameEn: event.target.value }))} />
          </FieldGroup>

          <FieldGroup hint="Short teaser text for Uzbek cards and previews.">
            <textarea className="admin-textarea" placeholder="Short description UZ" value={form.shortDescriptionUz} onChange={(event) => setForm((current) => ({ ...current, shortDescriptionUz: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Short teaser text for Russian cards and previews.">
            <textarea className="admin-textarea" placeholder="Short description RU" value={form.shortDescriptionRu} onChange={(event) => setForm((current) => ({ ...current, shortDescriptionRu: event.target.value }))} />
          </FieldGroup>
          <FieldGroup className="md:col-span-2" hint="Short teaser text for English cards and previews.">
            <textarea className="admin-textarea" placeholder="Short description EN" value={form.shortDescriptionEn} onChange={(event) => setForm((current) => ({ ...current, shortDescriptionEn: event.target.value }))} />
          </FieldGroup>

          <FieldGroup hint="Main product description for Uzbek detail page.">
            <textarea className="admin-textarea min-h-28" placeholder="Description UZ" value={form.descriptionUz} onChange={(event) => setForm((current) => ({ ...current, descriptionUz: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Main product description for Russian detail page.">
            <textarea className="admin-textarea min-h-28" placeholder="Description RU" value={form.descriptionRu} onChange={(event) => setForm((current) => ({ ...current, descriptionRu: event.target.value }))} />
          </FieldGroup>
          <FieldGroup className="md:col-span-2" hint="Main product description for English detail page.">
            <textarea className="admin-textarea min-h-28" placeholder="Description EN" value={form.descriptionEn} onChange={(event) => setForm((current) => ({ ...current, descriptionEn: event.target.value }))} />
          </FieldGroup>

          <FieldGroup hint="Feature copy shown in Uzbek accordion section.">
            <textarea className="admin-textarea min-h-24" placeholder="Features UZ" value={form.featureUz} onChange={(event) => setForm((current) => ({ ...current, featureUz: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Feature copy shown in Russian accordion section.">
            <textarea className="admin-textarea min-h-24" placeholder="Features RU" value={form.featureRu} onChange={(event) => setForm((current) => ({ ...current, featureRu: event.target.value }))} />
          </FieldGroup>
          <FieldGroup className="md:col-span-2" hint="Feature copy shown in English accordion section.">
            <textarea className="admin-textarea min-h-24" placeholder="Features EN" value={form.featureEn} onChange={(event) => setForm((current) => ({ ...current, featureEn: event.target.value }))} />
          </FieldGroup>

          <FieldGroup hint="Key ingredients text for Uzbek detail page.">
            <textarea className="admin-textarea min-h-24" placeholder="Ingredients UZ" value={form.ingredientsUz} onChange={(event) => setForm((current) => ({ ...current, ingredientsUz: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Key ingredients text for Russian detail page.">
            <textarea className="admin-textarea min-h-24" placeholder="Ingredients RU" value={form.ingredientsRu} onChange={(event) => setForm((current) => ({ ...current, ingredientsRu: event.target.value }))} />
          </FieldGroup>
          <FieldGroup className="md:col-span-2" hint="Key ingredients text for English detail page.">
            <textarea className="admin-textarea min-h-24" placeholder="Ingredients EN" value={form.ingredientsEn} onChange={(event) => setForm((current) => ({ ...current, ingredientsEn: event.target.value }))} />
          </FieldGroup>

          <FieldGroup hint="How-to-use text for Uzbek detail page.">
            <textarea className="admin-textarea min-h-24" placeholder="Usage UZ" value={form.usageUz} onChange={(event) => setForm((current) => ({ ...current, usageUz: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="How-to-use text for Russian detail page.">
            <textarea className="admin-textarea min-h-24" placeholder="Usage RU" value={form.usageRu} onChange={(event) => setForm((current) => ({ ...current, usageRu: event.target.value }))} />
          </FieldGroup>
          <FieldGroup className="md:col-span-2" hint="How-to-use text for English detail page.">
            <textarea className="admin-textarea min-h-24" placeholder="Usage EN" value={form.usageEn} onChange={(event) => setForm((current) => ({ ...current, usageEn: event.target.value }))} />
          </FieldGroup>

          <FieldGroup className="md:col-span-2" hint="Optional skin types used in catalog filters. One or multiple can be selected.">
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

          <FieldGroup className="md:col-span-2" hint="Main cover image shown in cards and first gallery slot. Upload JPG, PNG or WebP up to 5 MB.">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Cover image</p>
                  <p className="mt-1 text-xs text-slate-400">{form.imageUrl || "No cover image uploaded yet"}</p>
                </div>
                <label className="admin-button-secondary cursor-pointer text-center">
                  {uploadingCover ? "Uploading..." : "Upload cover"}
                  <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleCoverUpload} disabled={uploadingCover} />
                </label>
              </div>
            </div>
          </FieldGroup>

          <FieldGroup className="md:col-span-2" hint="Additional gallery images for product page. Optional, 2-5 images is fine, maximum 6 images total.">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Product gallery</p>
                  <p className="mt-1 text-xs text-slate-400">{form.galleryImages.length}/{MAX_GALLERY_IMAGES} uploaded</p>
                </div>
                <label className={`admin-button-secondary cursor-pointer text-center ${form.galleryImages.length >= MAX_GALLERY_IMAGES ? "pointer-events-none opacity-50" : ""}`}>
                  {uploadingGallery ? "Uploading..." : "Upload gallery images"}
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
                      <img src={image.imageUrl} alt={`Gallery ${index + 1}`} className="h-40 w-full object-cover" />
                      <div className="flex items-center justify-between gap-3 p-3">
                        <p className="truncate text-xs text-slate-500">Image {index + 1}</p>
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
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-400">No gallery images uploaded yet.</p>
              )}
            </div>
          </FieldGroup>

          <FieldGroup hint="Package size or product volume, for example 150 ml.">
            <input className="admin-input" placeholder="Size" value={form.size} onChange={(event) => setForm((current) => ({ ...current, size: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Selling price shown in storefront cards and checkout.">
            <input className="admin-input" placeholder="Price" type="number" min="0" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Available quantity currently in stock.">
            <input className="admin-input" placeholder="Stock" type="number" min="0" value={form.stock} onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Homepage order inside bestseller section. Lower number comes first.">
            <input className="admin-input" placeholder="Home sort order" type="number" min="0" value={form.homeSortOrder} onChange={(event) => setForm((current) => ({ ...current, homeSortOrder: event.target.value }))} />
          </FieldGroup>

          <FieldGroup hint="Category this product belongs to in the catalog.">
            <select className="admin-select" value={form.categoryId} onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nameEn}
                </option>
              ))}
            </select>
          </FieldGroup>
          <FieldGroup hint="Gradient start color used for placeholders and cards.">
            <input className="admin-input" placeholder="Color from" value={form.colorFrom} onChange={(event) => setForm((current) => ({ ...current, colorFrom: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Gradient end color used for placeholders and cards.">
            <input className="admin-input" placeholder="Color to" value={form.colorTo} onChange={(event) => setForm((current) => ({ ...current, colorTo: event.target.value }))} />
          </FieldGroup>

          <FieldGroup hint="If disabled, the product stays in admin but is hidden from shoppers.">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={form.active} onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))} />
              Active product
            </label>
          </FieldGroup>
          <FieldGroup hint="Enable this to show the product in the homepage bestseller block.">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={form.isBestseller} onChange={(event) => setForm((current) => ({ ...current, isBestseller: event.target.checked }))} />
              Show in bestseller section
            </label>
          </FieldGroup>

          <div className="md:col-span-2 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Cover preview</p>
            <div className="mt-3 flex h-48 items-center justify-center rounded-[1.2rem] bg-white">
              {form.imageUrl ? <img src={form.imageUrl} alt="Product preview" className="h-40 w-40 object-contain" /> : <p className="text-sm text-slate-400">No image selected</p>}
            </div>
            <p className="mt-3 text-[11px] leading-4 text-slate-400">The cover image is used in product cards, search and the first slot of the detail gallery.</p>
          </div>
        </div>

        {error ? (
          <p className="mt-4 text-sm font-semibold text-red-600">
            {error.message}
            {error.hint ? <span className="ml-2 font-normal text-red-500/90">Hint: {error.hint}</span> : null}
          </p>
        ) : null}
        {message ? <p className="mt-4 text-sm font-semibold text-emerald-600">{message}</p> : null}

        <button type="submit" className="admin-button-primary mt-6 w-full">
          {editingId ? "Update product" : "Create product"}
        </button>
      </form>

      <div className="admin-panel p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-2xl font-semibold text-slate-950">Products</h3>
          <span className="admin-badge">{products.length}</span>
        </div>

        <div className="mt-5 space-y-4">
          {loading ? <p className="text-sm text-slate-500">Loading products...</p> : null}
          {!loading && products.length === 0 ? <p className="text-sm text-slate-500">No products yet.</p> : null}
          {products.map((product) => (
            <article key={product.id} className="admin-panel-muted p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.2rem] bg-white">
                    {product.imageUrl ? <img src={product.imageUrl} alt={product.nameEn} className="h-16 w-16 object-contain" /> : <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">No image</span>}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                      {product.sku} | {product.slug}
                    </p>
                    <h4 className="mt-2 text-lg font-semibold text-slate-950">{product.nameEn}</h4>
                    <p className="mt-1 text-sm text-slate-600">{product.category?.nameEn || "Uncategorized"}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      ${product.price} | Stock {product.stock} | {product.active ? "Active" : "Draft"} | Bestseller{" "}
                      {product.isBestseller ? `Yes (#${product.homeSortOrder})` : "No"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Gallery {product.galleryImages?.length || 0} | Reviews {product._count?.reviews || 0}
                      {product.skinTypes ? ` | Skin ${product.skinTypes}` : ""}
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
                    Edit
                  </button>
                  <button type="button" className="admin-button-danger" onClick={() => handleDelete(product.id)}>
                    Delete
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
