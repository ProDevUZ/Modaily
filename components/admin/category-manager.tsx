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

function FieldGroup({
  children,
  hint
}: {
  children: React.ReactNode;
  hint: string;
}) {
  return (
    <div>
      {children}
      <p className="admin-form-hint">{hint}</p>
    </div>
  );
}

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
      setCategories(await requestJson<AdminCategory[]>("/api/categories"));
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

      setEditingId(null);
      setForm(emptyForm);
      setMessage(editingId ? "Category updated." : "Category created.");
      await loadCategories();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save category.");
    }
  }

  async function handleDelete(category: AdminCategory) {
    if ((category._count?.products || 0) > 0) {
      setMessage(null);
      setError("This category still has products. Move those products to another category first.");
      return;
    }

    if (!window.confirm("Delete this category?")) {
      return;
    }

    try {
      await requestJson(`/api/categories/${category.id}`, { method: "DELETE" });
      if (editingId === category.id) {
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
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={handleSubmit} className="admin-panel p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl font-semibold text-slate-950">{editingId ? "Edit category" : "Create category"}</h3>
          {editingId ? (
            <button
              type="button"
              className="text-sm font-semibold text-slate-500"
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
          <FieldGroup hint="Slug: category URL va ichki texnik identifikator.">
            <input className="admin-input" aria-label="Slug" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Name UZ: uzbek storefront ko‘rinishidagi category nomi.">
            <input className="admin-input" aria-label="Name UZ" value={form.nameUz} onChange={(event) => setForm((current) => ({ ...current, nameUz: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Name RU: rus tilidagi category nomi.">
            <input className="admin-input" aria-label="Name RU" value={form.nameRu} onChange={(event) => setForm((current) => ({ ...current, nameRu: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Name EN: english storefront category nomi.">
            <input className="admin-input" aria-label="Name EN" value={form.nameEn} onChange={(event) => setForm((current) => ({ ...current, nameEn: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Description UZ: category uchun uzbekcha qisqa izoh.">
            <textarea className="admin-textarea" aria-label="Description UZ" value={form.descriptionUz} onChange={(event) => setForm((current) => ({ ...current, descriptionUz: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Description RU: category uchun ruscha qisqa izoh.">
            <textarea className="admin-textarea" aria-label="Description RU" value={form.descriptionRu} onChange={(event) => setForm((current) => ({ ...current, descriptionRu: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Description EN: category uchun inglizcha qisqa izoh.">
            <textarea className="admin-textarea" aria-label="Description EN" value={form.descriptionEn} onChange={(event) => setForm((current) => ({ ...current, descriptionEn: event.target.value }))} />
          </FieldGroup>
        </div>

        {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}
        {message ? <p className="mt-4 text-sm font-semibold text-emerald-600">{message}</p> : null}

        <button type="submit" className="admin-button-primary mt-6 w-full">
          {editingId ? "Update category" : "Create category"}
        </button>
      </form>

      <div className="admin-panel p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-2xl font-semibold text-slate-950">Categories</h3>
          <span className="admin-badge">{categories.length}</span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {loading ? <p className="text-sm text-slate-500">Loading categories...</p> : null}
          {!loading && categories.length === 0 ? <p className="text-sm text-slate-500">No categories yet.</p> : null}
          {categories.map((category) => (
            <article key={category.id} className="admin-panel-muted p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{category.slug}</p>
                  <h4 className="mt-2 text-lg font-semibold text-slate-950">{category.nameEn}</h4>
                  <p className="mt-1 text-sm text-slate-600">{category.nameUz}</p>
                  <p className="text-sm text-slate-600">{category.nameRu}</p>
                </div>
                <span className="admin-badge">{category._count?.products || 0} products</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="admin-button-secondary"
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
                <button
                  type="button"
                  className="admin-button-danger disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:hover:bg-slate-100"
                  onClick={() => handleDelete(category)}
                  disabled={(category._count?.products || 0) > 0}
                  title={(category._count?.products || 0) > 0 ? "Move products out of this category before deleting it." : "Delete category"}
                >
                  Delete
                </button>
              </div>
              {(category._count?.products || 0) > 0 ? (
                <p className="mt-3 text-xs text-slate-500">
                  Delete is locked while this category has linked products.
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
