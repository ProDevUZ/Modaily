"use client";

import { useEffect, useState, type FormEvent } from "react";

import {
  type AdminCategory,
  type AdminProduct,
  requestJson
} from "@/components/admin/admin-types";

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
  size: "",
  price: "0",
  stock: "0",
  active: true,
  isBestseller: false,
  homeSortOrder: "0",
  imageUrl: "",
  colorFrom: "",
  colorTo: "",
  categoryId: ""
};

export function ProductManager() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      setError(loadError instanceof Error ? loadError.message : "Could not load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    try {
      await requestJson(editingId ? `/api/products/${editingId}` : "/api/products", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          homeSortOrder: Number(form.homeSortOrder)
        })
      });

      setEditingId(null);
      setForm({
        ...emptyForm,
        categoryId: categories[0]?.id || ""
      });
      setMessage(editingId ? "Product updated." : "Product created.");
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save product.");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {
      await requestJson(`/api/products/${id}`, { method: "DELETE" });

      if (editingId === id) {
        setEditingId(null);
        setForm({
          ...emptyForm,
          categoryId: categories[0]?.id || ""
        });
      }

      setMessage("Product deleted.");
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete product.");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[540px_1fr]">
      <form onSubmit={handleSubmit} className="admin-panel p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl font-semibold text-slate-950">{editingId ? "Edit product" : "Create product"}</h3>
          {editingId ? (
            <button
              type="button"
              className="text-sm font-semibold text-slate-500"
              onClick={() => {
                setEditingId(null);
                setForm({
                  ...emptyForm,
                  categoryId: categories[0]?.id || ""
                });
              }}
            >
              Cancel
            </button>
          ) : null}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input className="admin-input" placeholder="SKU" value={form.sku} onChange={(event) => setForm((current) => ({ ...current, sku: event.target.value }))} />
          <input className="admin-input" placeholder="Slug" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
          <input className="admin-input" placeholder="Name UZ" value={form.nameUz} onChange={(event) => setForm((current) => ({ ...current, nameUz: event.target.value }))} />
          <input className="admin-input" placeholder="Name RU" value={form.nameRu} onChange={(event) => setForm((current) => ({ ...current, nameRu: event.target.value }))} />
          <input className="admin-input md:col-span-2" placeholder="Name EN" value={form.nameEn} onChange={(event) => setForm((current) => ({ ...current, nameEn: event.target.value }))} />
          <textarea className="admin-textarea" placeholder="Short description UZ" value={form.shortDescriptionUz} onChange={(event) => setForm((current) => ({ ...current, shortDescriptionUz: event.target.value }))} />
          <textarea className="admin-textarea" placeholder="Short description RU" value={form.shortDescriptionRu} onChange={(event) => setForm((current) => ({ ...current, shortDescriptionRu: event.target.value }))} />
          <textarea className="admin-textarea md:col-span-2" placeholder="Short description EN" value={form.shortDescriptionEn} onChange={(event) => setForm((current) => ({ ...current, shortDescriptionEn: event.target.value }))} />
          <textarea className="admin-textarea min-h-28" placeholder="Description UZ" value={form.descriptionUz} onChange={(event) => setForm((current) => ({ ...current, descriptionUz: event.target.value }))} />
          <textarea className="admin-textarea min-h-28" placeholder="Description RU" value={form.descriptionRu} onChange={(event) => setForm((current) => ({ ...current, descriptionRu: event.target.value }))} />
          <textarea className="admin-textarea min-h-28 md:col-span-2" placeholder="Description EN" value={form.descriptionEn} onChange={(event) => setForm((current) => ({ ...current, descriptionEn: event.target.value }))} />
          <input className="admin-input md:col-span-2" placeholder="Image URL or /uploads path" value={form.imageUrl} onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))} />
          <input className="admin-input" placeholder="Size" value={form.size} onChange={(event) => setForm((current) => ({ ...current, size: event.target.value }))} />
          <input className="admin-input" placeholder="Price" type="number" min="0" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} />
          <input className="admin-input" placeholder="Stock" type="number" min="0" value={form.stock} onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))} />
          <input className="admin-input" placeholder="Home sort order" type="number" min="0" value={form.homeSortOrder} onChange={(event) => setForm((current) => ({ ...current, homeSortOrder: event.target.value }))} />
          <select className="admin-select" value={form.categoryId} onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nameEn}
              </option>
            ))}
          </select>
          <input className="admin-input" placeholder="Color from" value={form.colorFrom} onChange={(event) => setForm((current) => ({ ...current, colorFrom: event.target.value }))} />
          <input className="admin-input" placeholder="Color to" value={form.colorTo} onChange={(event) => setForm((current) => ({ ...current, colorTo: event.target.value }))} />
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={form.active} onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))} />
            Active product
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={form.isBestseller}
              onChange={(event) => setForm((current) => ({ ...current, isBestseller: event.target.checked }))}
            />
            Show in bestseller section
          </label>
          <div className="md:col-span-2 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Image preview</p>
            <div className="mt-3 flex h-40 items-center justify-center rounded-[1.2rem] bg-white">
              {form.imageUrl ? (
                <div
                  className="h-32 w-32 bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${form.imageUrl})` }}
                />
              ) : (
                <p className="text-sm text-slate-400">No image selected</p>
              )}
            </div>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}
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
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.2rem] bg-white">
                    {product.imageUrl ? (
                      <div className="h-16 w-16 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${product.imageUrl})` }} />
                    ) : (
                      <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">No image</span>
                    )}
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
                        size: product.size || "",
                        price: String(product.price),
                        stock: String(product.stock),
                        active: product.active,
                        isBestseller: Boolean(product.isBestseller),
                        homeSortOrder: String(product.homeSortOrder ?? 0),
                        imageUrl: product.imageUrl || "",
                        colorFrom: product.colorFrom || "",
                        colorTo: product.colorTo || "",
                        categoryId: product.categoryId
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
