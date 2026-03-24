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
          stock: Number(form.stock)
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

    setError(null);
    setMessage(null);

    try {
      await requestJson(`/api/products/${id}`, {
        method: "DELETE"
      });

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
    <div className="grid gap-6 xl:grid-cols-[520px_1fr]">
      <form onSubmit={handleSubmit} className="glass rounded-[2rem] p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-3xl text-ink">{editingId ? "Edit product" : "Create product"}</h3>
          {editingId ? (
            <button
              type="button"
              className="text-sm font-semibold text-clay"
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
          <input className="rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="SKU" value={form.sku} onChange={(event) => setForm((current) => ({ ...current, sku: event.target.value }))} />
          <input className="rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Slug" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
          <input className="rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Name UZ" value={form.nameUz} onChange={(event) => setForm((current) => ({ ...current, nameUz: event.target.value }))} />
          <input className="rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Name RU" value={form.nameRu} onChange={(event) => setForm((current) => ({ ...current, nameRu: event.target.value }))} />
          <input className="rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 md:col-span-2" placeholder="Name EN" value={form.nameEn} onChange={(event) => setForm((current) => ({ ...current, nameEn: event.target.value }))} />
          <textarea className="min-h-24 rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Short description UZ" value={form.shortDescriptionUz} onChange={(event) => setForm((current) => ({ ...current, shortDescriptionUz: event.target.value }))} />
          <textarea className="min-h-24 rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Short description RU" value={form.shortDescriptionRu} onChange={(event) => setForm((current) => ({ ...current, shortDescriptionRu: event.target.value }))} />
          <textarea className="min-h-24 rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 md:col-span-2" placeholder="Short description EN" value={form.shortDescriptionEn} onChange={(event) => setForm((current) => ({ ...current, shortDescriptionEn: event.target.value }))} />
          <textarea className="min-h-28 rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Description UZ" value={form.descriptionUz} onChange={(event) => setForm((current) => ({ ...current, descriptionUz: event.target.value }))} />
          <textarea className="min-h-28 rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Description RU" value={form.descriptionRu} onChange={(event) => setForm((current) => ({ ...current, descriptionRu: event.target.value }))} />
          <textarea className="min-h-28 rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 md:col-span-2" placeholder="Description EN" value={form.descriptionEn} onChange={(event) => setForm((current) => ({ ...current, descriptionEn: event.target.value }))} />
          <input className="rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Size" value={form.size} onChange={(event) => setForm((current) => ({ ...current, size: event.target.value }))} />
          <input className="rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Price" type="number" min="0" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} />
          <input className="rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Stock" type="number" min="0" value={form.stock} onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))} />
          <select className="rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" value={form.categoryId} onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nameEn}
              </option>
            ))}
          </select>
          <input className="rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Color from" value={form.colorFrom} onChange={(event) => setForm((current) => ({ ...current, colorFrom: event.target.value }))} />
          <input className="rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Color to" value={form.colorTo} onChange={(event) => setForm((current) => ({ ...current, colorTo: event.target.value }))} />
          <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 text-sm font-semibold text-stone-700">
            <input type="checkbox" checked={form.active} onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))} />
            Active product
          </label>
        </div>

        {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}
        {message ? <p className="mt-4 text-sm font-semibold text-moss">{message}</p> : null}

        <button type="submit" className="cta-primary mt-6 w-full">
          {editingId ? "Update product" : "Create product"}
        </button>
      </form>

      <div className="glass rounded-[2rem] p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-display text-3xl text-ink">Products</h3>
          <span className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-stone-600">{products.length}</span>
        </div>

        <div className="mt-5 space-y-4">
          {loading ? <p className="text-sm text-stone-500">Loading products...</p> : null}
          {!loading && products.length === 0 ? <p className="text-sm text-stone-500">No products yet.</p> : null}
          {products.map((product) => (
            <article key={product.id} className="rounded-[1.5rem] border border-stone-200 bg-white/70 p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
                    {product.sku} · {product.slug}
                  </p>
                  <h4 className="mt-2 text-lg font-semibold text-ink">{product.nameEn}</h4>
                  <p className="mt-1 text-sm text-stone-600">{product.category?.nameEn || "Uncategorized"}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    ${product.price} · Stock {product.stock} · {product.active ? "Active" : "Draft"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-sand"
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
                        colorFrom: product.colorFrom || "",
                        colorTo: product.colorTo || "",
                        categoryId: product.categoryId
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button type="button" className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600" onClick={() => handleDelete(product.id)}>
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
