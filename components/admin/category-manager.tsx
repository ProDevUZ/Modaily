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
      setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить категории.");
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
      setMessage(editingId ? "Категория обновлена." : "Категория создана.");
      await loadCategories();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось сохранить категорию.");
    }
  }

  async function handleDelete(category: AdminCategory) {
    if ((category._count?.products || 0) > 0) {
      setMessage(null);
      setError("В этой категории еще есть товары. Сначала перенесите их в другую категорию.");
      return;
    }

    if (!window.confirm("Удалить эту категорию?")) {
      return;
    }

    try {
      await requestJson(`/api/categories/${category.id}`, { method: "DELETE" });
      if (editingId === category.id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      setMessage("Категория удалена.");
      await loadCategories();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Не удалось удалить категорию.");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={handleSubmit} className="admin-panel p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl font-semibold text-slate-950">{editingId ? "Редактирование категории" : "Создание категории"}</h3>
          {editingId ? (
            <button
              type="button"
              className="text-sm font-semibold text-slate-500"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Отмена
            </button>
          ) : null}
        </div>

        <div className="mt-5 space-y-4">
          <FieldGroup hint="Слаг категории для URL и внутренней технической идентификации.">
            <input className="admin-input" aria-label="Слаг" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Название категории для витрины на узбекском языке.">
            <input className="admin-input" aria-label="Название UZ" value={form.nameUz} onChange={(event) => setForm((current) => ({ ...current, nameUz: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Название категории для витрины на русском языке.">
            <input className="admin-input" aria-label="Название RU" value={form.nameRu} onChange={(event) => setForm((current) => ({ ...current, nameRu: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Название категории для витрины на английском языке.">
            <input className="admin-input" aria-label="Название EN" value={form.nameEn} onChange={(event) => setForm((current) => ({ ...current, nameEn: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Короткое описание категории на узбекском языке.">
            <textarea className="admin-textarea" aria-label="Описание UZ" value={form.descriptionUz} onChange={(event) => setForm((current) => ({ ...current, descriptionUz: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Короткое описание категории на русском языке.">
            <textarea className="admin-textarea" aria-label="Описание RU" value={form.descriptionRu} onChange={(event) => setForm((current) => ({ ...current, descriptionRu: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Короткое описание категории на английском языке.">
            <textarea className="admin-textarea" aria-label="Описание EN" value={form.descriptionEn} onChange={(event) => setForm((current) => ({ ...current, descriptionEn: event.target.value }))} />
          </FieldGroup>
        </div>

        {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}
        {message ? <p className="mt-4 text-sm font-semibold text-emerald-600">{message}</p> : null}

        <button type="submit" className="admin-button-primary mt-6 w-full">
          {editingId ? "Обновить категорию" : "Создать категорию"}
        </button>
      </form>

      <div className="admin-panel p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-2xl font-semibold text-slate-950">Категории</h3>
          <span className="admin-badge">{categories.length}</span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {loading ? <p className="text-sm text-slate-500">Загружаем категории...</p> : null}
          {!loading && categories.length === 0 ? <p className="text-sm text-slate-500">Категорий пока нет.</p> : null}
          {categories.map((category) => (
            <article key={category.id} className="admin-panel-muted p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{category.slug}</p>
                  <h4 className="mt-2 text-lg font-semibold text-slate-950">{category.nameRu || category.nameEn || category.nameUz}</h4>
                  <p className="mt-1 text-sm text-slate-600">{category.nameUz}</p>
                  <p className="text-sm text-slate-600">{category.nameEn}</p>
                </div>
                <span className="admin-badge">{category._count?.products || 0} товаров</span>
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
                  Редактировать
                </button>
                <button
                  type="button"
                  className="admin-button-danger disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:hover:bg-slate-100"
                  onClick={() => handleDelete(category)}
                  disabled={(category._count?.products || 0) > 0}
                  title={(category._count?.products || 0) > 0 ? "Сначала перенесите товары в другую категорию." : "Удалить категорию"}
                >
                  Удалить
                </button>
              </div>
              {(category._count?.products || 0) > 0 ? (
                <p className="mt-3 text-xs text-slate-500">
                  Удаление недоступно, пока в этой категории есть связанные товары.
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
