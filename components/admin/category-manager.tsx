"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

type CategoryEditorProps = {
  categoryId?: string;
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

const STATUS_MESSAGE: Record<string, string> = {
  created: "Категория создана.",
  updated: "Изменения сохранены.",
  deleted: "Категория удалена."
};

function FieldGroup({
  children,
  hint,
  className
}: {
  children: ReactNode;
  hint: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {children}
      <p className="admin-form-hint">{hint}</p>
    </div>
  );
}

function getCategoryDisplayName(category: AdminCategory) {
  return category.nameRu || category.nameEn || category.nameUz;
}

function EmptyCategoryList({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center px-6 py-16 text-center">
      <div className="max-w-sm space-y-2">
        <p className="text-lg font-semibold text-slate-900">
          {searchQuery ? "Ничего не найдено" : "Список категорий пуст"}
        </p>
        <p className="text-sm leading-6 text-slate-500">
          {searchQuery
            ? "Попробуйте изменить поисковый запрос."
            : "Создайте первую категорию через зеленую кнопку в правом нижнем углу."}
        </p>
      </div>
    </div>
  );
}

export function CategoryListManager() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchQuery = (searchParams.get("q") || "").trim().toLowerCase();
  const statusMessage = STATUS_MESSAGE[searchParams.get("status") || ""] || null;

  const filteredCategories = useMemo(() => {
    if (!searchQuery) {
      return categories;
    }

    return categories.filter((category) =>
      [
        category.slug,
        category.nameUz,
        category.nameRu,
        category.nameEn,
        category.descriptionUz,
        category.descriptionRu,
        category.descriptionEn
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery)
    );
  }, [categories, searchQuery]);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      setLoading(true);
      setError(null);

      try {
        const payload = await requestJson<AdminCategory[]>("/api/categories");
        if (active) {
          setCategories(payload);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить категории.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      {statusMessage ? (
        <div className="mx-6 mt-6 rounded-[1.25rem] border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700 lg:mx-8">
          {statusMessage}
        </div>
      ) : null}

      <section className="min-h-screen bg-white">
        <div className="flex items-start justify-between gap-4 px-6 pb-8 pt-8 lg:px-8">
          <div>
            <h2 className="text-[2.1rem] font-semibold tracking-tight text-slate-950">Список категорий</h2>
            <p className="mt-3 text-base leading-7 text-slate-500">
              Базовая структура каталога для быстрых правок и перехода в редактор.
            </p>
          </div>
          <span className="mt-1 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
            {filteredCategories.length}
          </span>
        </div>

        <div className="border-t border-[#eef2f7]">
          <div className="hidden items-center gap-4 border-b border-[#eef2f7] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 lg:grid lg:grid-cols-[minmax(0,2.2fr)_200px_140px_28px] lg:px-8">
            <span>Название</span>
            <span>Слаг</span>
            <span>Товаров</span>
            <span />
          </div>

          <div className="max-h-[calc(100vh-11rem)] overflow-y-auto">
            {loading ? <div className="px-6 py-12 text-sm text-slate-500 lg:px-8">Загружаем категории...</div> : null}
            {!loading && error ? <div className="px-6 py-12 text-sm font-medium text-red-600 lg:px-8">{error}</div> : null}
            {!loading && !error && filteredCategories.length === 0 ? <EmptyCategoryList searchQuery={searchQuery} /> : null}

            {!loading && !error
              ? filteredCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/admin123/categories/${category.id}`}
                    className="block border-b border-[#eef2f7] transition last:border-b-0 hover:bg-slate-50/60"
                  >
                    <div className="grid gap-3 px-6 py-5 lg:grid-cols-[minmax(0,2.2fr)_200px_140px_28px] lg:items-center lg:px-8">
                      <div className="min-w-0">
                        <p className="truncate text-[1.15rem] font-semibold text-slate-950">{getCategoryDisplayName(category)}</p>
                        <p className="mt-2 truncate text-xs uppercase tracking-[0.18em] text-slate-400">
                          {category.nameUz} / {category.nameEn}
                        </p>
                      </div>
                      <p className="truncate text-sm text-slate-600">{category.slug}</p>
                      <p className="text-sm font-medium text-slate-700">{category._count?.products || 0}</p>
                      <div className="hidden justify-end text-slate-300 lg:flex">
                        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))
              : null}
          </div>
        </div>
      </section>

      <Link
        href="/admin123/categories/new"
        aria-label="Создать категорию"
        className="fixed bottom-8 right-8 z-[80] inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_18px_40px_rgba(16,185,129,0.32)] transition hover:scale-[1.03] hover:bg-emerald-600"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.25">
          <path d="M12 5v14" strokeLinecap="round" />
          <path d="M5 12h14" strokeLinecap="round" />
        </svg>
      </Link>
    </>
  );
}

export function CategoryEditor({ categoryId }: CategoryEditorProps) {
  const router = useRouter();
  const isEditing = Boolean(categoryId);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [linkedProductsCount, setLinkedProductsCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadCategory() {
      if (!categoryId) {
        setForm(emptyForm);
        setLinkedProductsCount(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const category = await requestJson<AdminCategory>(`/api/categories/${categoryId}`);

        if (!active) {
          return;
        }

        setForm({
          slug: category.slug,
          nameUz: category.nameUz,
          nameRu: category.nameRu,
          nameEn: category.nameEn,
          descriptionUz: category.descriptionUz || "",
          descriptionRu: category.descriptionRu || "",
          descriptionEn: category.descriptionEn || ""
        });
        setLinkedProductsCount(category._count?.products || 0);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить категорию.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadCategory();

    return () => {
      active = false;
    };
  }, [categoryId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    try {
      await requestJson(categoryId ? `/api/categories/${categoryId}` : "/api/categories", {
        method: categoryId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      router.push(`/admin123/categories?status=${isEditing ? "updated" : "created"}`);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось сохранить категорию.");
    }
  }

  async function handleDelete() {
    if (!categoryId) {
      return;
    }

    if (linkedProductsCount > 0) {
      setMessage(null);
      setError("В этой категории еще есть товары. Сначала перенесите их в другую категорию.");
      return;
    }

    if (!window.confirm("Удалить эту категорию?")) {
      return;
    }

    try {
      await requestJson(`/api/categories/${categoryId}`, { method: "DELETE" });
      router.push("/admin123/categories?status=deleted");
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Не удалось удалить категорию.");
    }
  }

  if (loading) {
    return <div className="px-6 py-12 text-sm text-slate-500 lg:px-8">Загружаем форму категории...</div>;
  }

  return (
    <section className="min-h-screen bg-white px-6 py-8 lg:px-8">
      <Link
        href="/admin123/categories"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Назад к списку категорий
      </Link>

      <div className="mt-6 flex flex-col gap-4 border-b border-[#edf2f7] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            {isEditing ? "Редактирование" : "Создание"}
          </p>
          <h2 className="mt-3 text-[2.1rem] font-semibold tracking-tight text-slate-950">
            {isEditing ? "Карточка категории" : "Новая категория"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Отдельная рабочая форма без списка и лишних блоков. Все языковые поля редактируются в одном потоке.
          </p>
        </div>

        {isEditing ? (
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
            {linkedProductsCount} товаров
          </span>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup hint="Слаг категории для URL и внутренней технической идентификации.">
            <input className="admin-input" aria-label="Слаг" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
          </FieldGroup>
          <div />
          <FieldGroup hint="Название категории для витрины на узбекском языке.">
            <input className="admin-input" aria-label="Название UZ" value={form.nameUz} onChange={(event) => setForm((current) => ({ ...current, nameUz: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Название категории для витрины на русском языке.">
            <input className="admin-input" aria-label="Название RU" value={form.nameRu} onChange={(event) => setForm((current) => ({ ...current, nameRu: event.target.value }))} />
          </FieldGroup>
          <FieldGroup className="md:col-span-2" hint="Название категории для витрины на английском языке.">
            <input className="admin-input" aria-label="Название EN" value={form.nameEn} onChange={(event) => setForm((current) => ({ ...current, nameEn: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Короткое описание категории на узбекском языке.">
            <textarea className="admin-textarea min-h-28" aria-label="Описание UZ" value={form.descriptionUz} onChange={(event) => setForm((current) => ({ ...current, descriptionUz: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Короткое описание категории на русском языке.">
            <textarea className="admin-textarea min-h-28" aria-label="Описание RU" value={form.descriptionRu} onChange={(event) => setForm((current) => ({ ...current, descriptionRu: event.target.value }))} />
          </FieldGroup>
          <FieldGroup className="md:col-span-2" hint="Короткое описание категории на английском языке.">
            <textarea className="admin-textarea min-h-28" aria-label="Описание EN" value={form.descriptionEn} onChange={(event) => setForm((current) => ({ ...current, descriptionEn: event.target.value }))} />
          </FieldGroup>
        </div>

        {error ? <p className="mt-5 text-sm font-semibold text-red-600">{error}</p> : null}
        {message ? <p className="mt-5 text-sm font-semibold text-emerald-600">{message}</p> : null}

        <div className="mt-8 flex flex-col gap-3 border-t border-[#edf2f7] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {isEditing ? (
              <button type="button" className="admin-button-danger" onClick={handleDelete}>
                Удалить категорию
              </button>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/admin123/categories" className="admin-button-secondary text-center">
              Назад
            </Link>
            <button type="submit" className="admin-button-primary">
              {isEditing ? "Сохранить изменения" : "Создать категорию"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export function CategoryManager() {
  return <CategoryListManager />;
}
