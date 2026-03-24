"use client";

import { useEffect, useState, type FormEvent } from "react";

import { type AdminCategory, requestJson } from "@/components/admin/admin-types";

type CategoryFormState = {
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
};

const emptyForm: CategoryFormState = {
  slug: "",
  nameUz: "",
  nameRu: "",
  nameEn: "",
  descriptionUz: "",
  descriptionRu: "",
  descriptionEn: ""
};

export function CategoryManager() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadCategories() {
    setLoading(true);
    try {
      const payload = await requestJson<AdminCategory[]>("/api/categories");
      setCategories(payload);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load categories.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    try {
      await requestJson(editingId ? `/api/categories/${editingId}` : "/api/categories", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      setForm(emptyForm);
      setEditingId(null);
      setMessage(editingId ? "Category updated." : "Category created.");
      await loadCategories();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save category.");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this category?")) {
      return;
    }

    setError(null);
    setMessage(null);

    try {
      await requestJson(`/api/categories/${id}`, {
        method: "DELETE"
      });

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }

      setMessage("Category deleted.");
      await loadCategories();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete category.");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[460px_1fr]">
      <form onSubmit={handleSubmit} className="glass rounded-[2rem] p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-3xl text-ink">{editingId ? "Edit category" : "Create category"}</h3>
          {editingId ? (
            <button
              type="button"
              className="text-sm font-semibold text-clay"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          ) : null}
        </div>

        <div className="mt-5 space-y-4">
          <input className="w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Slug" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
          <input className="w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Name UZ" value={form.nameUz} onChange={(event) => setForm((current) => ({ ...current, nameUz: event.target.value }))} />
          <input className="w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Name RU" value={form.nameRu} onChange={(event) => setForm((current) => ({ ...current, nameRu: event.target.value }))} />
          <input className="w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Name EN" value={form.nameEn} onChange={(event) => setForm((current) => ({ ...current, nameEn: event.target.value }))} />
          <textarea className="min-h-24 w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Description UZ" value={form.descriptionUz} onChange={(event) => setForm((current) => ({ ...current, descriptionUz: event.target.value }))} />
          <textarea className="min-h-24 w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Description RU" value={form.descriptionRu} onChange={(event) => setForm((current) => ({ ...current, descriptionRu: event.target.value }))} />
          <textarea className="min-h-24 w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Description EN" value={form.descriptionEn} onChange={(event) => setForm((current) => ({ ...current, descriptionEn: event.target.value }))} />
        </div>

        {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}
        {message ? <p className="mt-4 text-sm font-semibold text-moss">{message}</p> : null}

        <button type="submit" className="cta-primary mt-6 w-full">
          {editingId ? "Update category" : "Create category"}
        </button>
      </form>

      <div className="glass rounded-[2rem] p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-display text-3xl text-ink">Categories</h3>
          <span className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-stone-600">{categories.length}</span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {loading ? <p className="text-sm text-stone-500">Loading categories...</p> : null}
          {!loading && categories.length === 0 ? <p className="text-sm text-stone-500">No categories yet.</p> : null}
          {categories.map((category) => (
            <article key={category.id} className="rounded-[1.5rem] border border-stone-200 bg-white/70 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">{category.slug}</p>
                  <h4 className="mt-2 text-lg font-semibold text-ink">{category.nameEn}</h4>
                  <p className="mt-1 text-sm text-stone-600">{category.nameUz}</p>
                  <p className="text-sm text-stone-600">{category.nameRu}</p>
                </div>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                  {category._count?.products || 0} products
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-sand"
                  onClick={() => {
                    setEditingId(category.id);
                    setForm({
                      slug: category.slug,
                      nameUz: category.nameUz,
                      nameRu: category.nameRu,
                      nameEn: category.nameEn,
                      descriptionUz: category.descriptionUz || "",
                      descriptionRu: category.descriptionRu || "",
                      descriptionEn: category.descriptionEn || ""
                    });
                  }}
                >
                  Edit
                </button>
                <button type="button" className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600" onClick={() => handleDelete(category.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
