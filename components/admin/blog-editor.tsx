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
import { useRouter } from "next/navigation";

import {
  type AdminBlogPost,
  type AdminProduct,
  requestJson
} from "@/components/admin/admin-types";
import type { BlogPostLinkedProduct } from "@/lib/blog-post-types";

type BlogEditorProps = {
  postId?: string;
};

type BlogSectionFormItem = {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
};

type BlogFormState = {
  cardTitle: string;
  excerpt: string;
  coverImage: string;
  publishDate: string;
  category: string;
  slug: string;
  featured: boolean;
  mainTitle: string;
  introDescription: string;
  linkedProductId: string;
  dynamicSections: BlogSectionFormItem[];
  seoTitle: string;
  metaDescription: string;
};

type BlogSubmitError = {
  message: string;
};

type ProductSummary = Pick<
  AdminProduct,
  "id" | "sku" | "slug" | "nameUz" | "nameRu" | "nameEn" | "imageUrl" | "price" | "active"
>;

const emptyForm: BlogFormState = {
  cardTitle: "",
  excerpt: "",
  coverImage: "",
  publishDate: new Date().toISOString().slice(0, 10),
  category: "",
  slug: "",
  featured: false,
  mainTitle: "",
  introDescription: "",
  linkedProductId: "",
  dynamicSections: [],
  seoTitle: "",
  metaDescription: ""
};

function createLocalSection(index: number): BlogSectionFormItem {
  return {
    id: `section-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: "",
    description: "",
    sortOrder: index
  };
}

function normalizeSections(sections: BlogSectionFormItem[]) {
  return sections.map((section, index) => ({
    ...section,
    sortOrder: index
  }));
}

function buildFormFromPost(post: AdminBlogPost): BlogFormState {
  return {
    cardTitle: post.cardTitle,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    publishDate: post.publishDate.slice(0, 10),
    category: post.category,
    slug: post.slug,
    featured: post.featured,
    mainTitle: post.mainTitle,
    introDescription: post.introDescription,
    linkedProductId: post.linkedProductId || "",
    dynamicSections: normalizeSections(
      post.dynamicSections.map((section, index) => ({
        id: section.id || `section-${index}`,
        title: section.title,
        description: section.description,
        sortOrder: section.sortOrder
      }))
    ),
    seoTitle: post.seoTitle,
    metaDescription: post.metaDescription
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatPublishDate(value: string) {
  if (!value) {
    return "Дата не выбрана";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Некорректная дата";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

function formatPrice(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

function getProductDisplayName(product: ProductSummary | BlogPostLinkedProduct | null | undefined) {
  if (!product) {
    return "Товар не выбран";
  }

  return product.nameRu || product.nameEn || product.nameUz;
}

function getPublicationStatusLabel(value: string) {
  if (!value) {
    return "Дата не указана";
  }

  const publishDate = new Date(value);

  if (Number.isNaN(publishDate.getTime())) {
    return "Проверьте дату";
  }

  const now = new Date();
  return publishDate > now ? "Запланирован" : "Готов к публикации";
}

function FieldGroup({
  children,
  hint,
  label,
  className,
  support
}: {
  children: ReactNode;
  hint: string;
  label?: ReactNode;
  className?: string;
  support?: ReactNode;
}) {
  return (
    <div className={`space-y-2.5 ${className || ""}`}>
      {label ? <div className="text-[0.98rem] font-medium text-slate-700">{label}</div> : null}
      {children}
      {support}
      <p className="admin-form-hint">{hint}</p>
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

function SectionActionButton({
  label,
  onClick,
  disabled = false
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        disabled
          ? "cursor-not-allowed border-[#e5e7ef] text-slate-300"
          : "border-[#dbe4ef] text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}

function ProductPreviewCard({
  product,
  onClear
}: {
  product: ProductSummary | BlogPostLinkedProduct;
  onClear?: () => void;
}) {
  return (
    <div className="rounded-[1.25rem] border border-[#e4e9f1] bg-[#fbfcff] p-4">
      <div className="flex gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border border-[#e5eaf2] bg-white">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={getProductDisplayName(product)} className="h-full w-full object-cover" />
          ) : (
            <UploadPlaceholderIcon className="h-7 w-7 text-slate-300" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{getProductDisplayName(product)}</p>
          <p className="mt-1 truncate text-xs uppercase tracking-[0.18em] text-slate-400">{product.slug}</p>
          <p className="mt-2 text-sm font-medium text-slate-600">{formatPrice(product.price)}</p>
        </div>
      </div>
      {onClear ? (
        <div className="mt-4 flex justify-end">
          <button type="button" onClick={onClear} className="text-sm font-semibold text-slate-500 transition hover:text-slate-900">
            Убрать связь
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function BlogEditor({ postId }: BlogEditorProps) {
  const router = useRouter();
  const isEditing = Boolean(postId);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [initialLinkedProduct, setInitialLinkedProduct] = useState<BlogPostLinkedProduct | null>(null);
  const [form, setForm] = useState<BlogFormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<BlogSubmitError | null>(null);
  const [linkedProductQuery, setLinkedProductQuery] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const selectedProduct = useMemo(() => {
    if (!form.linkedProductId) {
      return null;
    }

    return products.find((product) => product.id === form.linkedProductId) || initialLinkedProduct;
  }, [form.linkedProductId, products, initialLinkedProduct]);

  const filteredProducts = useMemo(() => {
    const query = linkedProductQuery.trim().toLowerCase();

    const source = query
      ? products.filter((product) =>
          [
            product.nameUz,
            product.nameRu,
            product.nameEn,
            product.slug,
            product.sku
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(query)
        )
      : products;

    return source.slice(0, 8);
  }, [products, linkedProductQuery]);

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const [productPayload, postsPayload, postPayload] = await Promise.all([
          requestJson<AdminProduct[]>("/api/products"),
          requestJson<AdminBlogPost[]>("/api/content/blog-posts"),
          postId ? requestJson<AdminBlogPost>(`/api/content/blog-posts/${postId}`) : Promise.resolve(null)
        ]);

        if (!active) {
          return;
        }

        setProducts(productPayload);
        setExistingCategories(
          Array.from(
            new Set(
              postsPayload
                .map((post) => post.category.trim())
                .filter(Boolean)
            )
          ).sort((left, right) => left.localeCompare(right, "ru"))
        );

        if (postPayload) {
          setForm(buildFormFromPost(postPayload));
          setInitialLinkedProduct(postPayload.linkedProduct);
          setSlugManuallyEdited(postPayload.slug !== slugify(postPayload.cardTitle));
        } else {
          setForm(emptyForm);
          setInitialLinkedProduct(null);
          setSlugManuallyEdited(false);
        }
      } catch (loadError) {
        if (active) {
          setError({
            message:
              loadError instanceof Error ? loadError.message : "Не удалось подготовить форму поста."
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      active = false;
    };
  }, [postId]);

  async function handleCoverUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);
    setMessage(null);
    setUploadingCover(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const payload = await requestJson<{ url: string }>("/api/uploads/promo-image", {
        method: "POST",
        body: uploadFormData
      });

      setForm((current) => ({
        ...current,
        coverImage: payload.url
      }));
      setMessage("Обложка загружена.");
    } catch (uploadError) {
      setError({
        message: uploadError instanceof Error ? uploadError.message : "Не удалось загрузить обложку."
      });
    } finally {
      setUploadingCover(false);
      event.target.value = "";
    }
  }

  function updateCardTitle(value: string) {
    setForm((current) => ({
      ...current,
      cardTitle: value,
      slug: slugManuallyEdited ? current.slug : slugify(value)
    }));
  }

  function addSection() {
    setForm((current) => ({
      ...current,
      dynamicSections: normalizeSections([
        ...current.dynamicSections,
        createLocalSection(current.dynamicSections.length)
      ])
    }));
  }

  function updateSection(id: string, patch: Partial<BlogSectionFormItem>) {
    setForm((current) => ({
      ...current,
      dynamicSections: normalizeSections(
        current.dynamicSections.map((section) =>
          section.id === id ? { ...section, ...patch } : section
        )
      )
    }));
  }

  function removeSection(id: string) {
    setForm((current) => ({
      ...current,
      dynamicSections: normalizeSections(current.dynamicSections.filter((section) => section.id !== id))
    }));
  }

  function moveSection(index: number, direction: -1 | 1) {
    setForm((current) => {
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= current.dynamicSections.length) {
        return current;
      }

      const nextSections = [...current.dynamicSections];
      const [target] = nextSections.splice(index, 1);
      nextSections.splice(nextIndex, 0, target);

      return {
        ...current,
        dynamicSections: normalizeSections(nextSections)
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(postId ? `/api/content/blog-posts/${postId}` : "/api/content/blog-posts", {
        method: postId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          linkedProductId: form.linkedProductId || null,
          dynamicSections: normalizeSections(form.dynamicSections).map((section, index) => ({
            title: section.title,
            description: section.description,
            sortOrder: index
          }))
        })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || (isEditing ? "Не удалось обновить пост." : "Не удалось создать пост."));
      }

      router.push(`/admin123/blog?status=${isEditing ? "updated" : "created"}`);
      router.refresh();
    } catch (submitError) {
      setError({
        message:
          submitError instanceof Error
            ? submitError.message
            : isEditing
              ? "Не удалось обновить пост."
              : "Не удалось создать пост."
      });
    }
  }

  async function handleDelete() {
    if (!postId || !window.confirm("Удалить этот пост?")) {
      return;
    }

    try {
      await requestJson(`/api/content/blog-posts/${postId}`, { method: "DELETE" });
      router.push("/admin123/blog?status=deleted");
      router.refresh();
    } catch (deleteError) {
      setError({
        message: deleteError instanceof Error ? deleteError.message : "Не удалось удалить пост."
      });
    }
  }

  if (loading) {
    return <div className="px-6 py-12 text-sm text-slate-500 lg:px-8">Загружаем форму поста...</div>;
  }

  return (
    <section className="min-h-screen bg-[#f6f8fb] px-5 py-6 lg:px-8 lg:py-8">
      <Link
        href="/admin123/blog"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Назад к списку постов
      </Link>

      <div className="mt-6 border-b border-[#e6ebf2] pb-6">
        <div className="max-w-3xl">
          <h2 className="text-[2.35rem] font-semibold tracking-tight text-slate-950">
            {isEditing ? "Редактирование поста" : "Новый пост"}
          </h2>
          <p className="mt-2.5 text-base leading-7 text-slate-500">
            {isEditing
              ? "Обновите структуру статьи, SEO и связь с товаром в одном рабочем пространстве."
              : "Подготовьте публикацию для блога: заголовки, обложку, динамические секции и связь с товаром."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        {error ? (
          <div className="mb-6 rounded-[1.1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error.message}
          </div>
        ) : null}

        {message ? (
          <div className="mb-6 rounded-[1.1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_360px]">
          <div className="space-y-6">
            <EditorCard title="Publication">
              <div className="grid gap-5 md:grid-cols-2">
                <FieldGroup className="md:col-span-2" label="Card title" hint="Заголовок карточки в списке блога и превью." >
                  <input
                    className="admin-input h-12"
                    required
                    value={form.cardTitle}
                    onChange={(event) => updateCardTitle(event.target.value)}
                  />
                </FieldGroup>

                <FieldGroup className="md:col-span-2" label="Excerpt" hint="Короткое описание для списка и мета-превью статьи.">
                  <textarea
                    className="admin-textarea min-h-[110px]"
                    required
                    value={form.excerpt}
                    onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))}
                  />
                </FieldGroup>

                <FieldGroup className="md:col-span-2" label="Cover image" hint="URL обложки. Можно вставить вручную или загрузить файл.">
                  <div className="space-y-3">
                    <input
                      className="admin-input h-12"
                      required
                      placeholder="https://..."
                      value={form.coverImage}
                      onChange={(event) => setForm((current) => ({ ...current, coverImage: event.target.value }))}
                    />
                    <label className="flex cursor-pointer items-center justify-center gap-3 rounded-[1.15rem] border border-dashed border-[#d5dce8] bg-[#fbfcfe] px-4 py-4 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white">
                      <UploadPlaceholderIcon className="h-6 w-6 text-slate-300" />
                      {uploadingCover ? "Загрузка..." : "Загрузить обложку"}
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        className="hidden"
                        onChange={handleCoverUpload}
                        disabled={uploadingCover}
                      />
                    </label>
                  </div>
                </FieldGroup>

                <FieldGroup label="Publish date" hint="Дата публикации или отложенного выхода статьи.">
                  <input
                    className="admin-input h-12"
                    required
                    type="date"
                    value={form.publishDate}
                    onChange={(event) => setForm((current) => ({ ...current, publishDate: event.target.value }))}
                  />
                </FieldGroup>

                <FieldGroup
                  label="Category"
                  hint="Категория или тематическая рубрика статьи."
                  support={
                    existingCategories.length ? (
                      <div className="space-y-2">
                        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                          Уже используются
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {existingCategories.map((category) => {
                            const selected =
                              form.category.trim().toLowerCase() === category.trim().toLowerCase();

                            return (
                              <button
                                key={category}
                                type="button"
                                onClick={() => setForm((current) => ({ ...current, category }))}
                                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                                  selected
                                    ? "border-slate-900 bg-slate-900 text-white"
                                    : "border-[#dbe4ef] bg-[#fbfcff] text-slate-600 hover:border-slate-300 hover:bg-white"
                                }`}
                              >
                                {category}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null
                  }
                >
                  <input
                    className="admin-input h-12"
                    required
                    value={form.category}
                    onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  />
                </FieldGroup>

                <FieldGroup label="Slug" hint="URL статьи. Автоматически заполняется из card title, но можно изменить вручную.">
                  <input
                    className="admin-input h-12"
                    required
                    value={form.slug}
                    onChange={(event) => {
                      setSlugManuallyEdited(true);
                      setForm((current) => ({ ...current, slug: event.target.value }));
                    }}
                  />
                </FieldGroup>

                <div className="md:col-span-2 rounded-[1.25rem] border border-[#e4e9f1] bg-[#fbfcff] px-4 py-2">
                  <ToggleRow
                    title="Featured"
                    description="Выведите статью в выделенный список или будущий featured-блок."
                    checked={form.featured}
                    onChange={(checked) => setForm((current) => ({ ...current, featured: checked }))}
                  />
                </div>
              </div>
            </EditorCard>

            <EditorCard title="Article Header">
              <div className="space-y-5">
                <FieldGroup label="Main title" hint="Главный заголовок статьи на detail page.">
                  <input
                    className="admin-input h-12"
                    required
                    value={form.mainTitle}
                    onChange={(event) => setForm((current) => ({ ...current, mainTitle: event.target.value }))}
                  />
                </FieldGroup>

                <FieldGroup label="Intro description" hint="Вводный абзац под основным заголовком статьи.">
                  <textarea
                    className="admin-textarea min-h-[140px]"
                    required
                    value={form.introDescription}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, introDescription: event.target.value }))
                    }
                  />
                </FieldGroup>
              </div>
            </EditorCard>

            <EditorCard title="Linked Product">
              <div className="space-y-5">
                <FieldGroup label="Поиск товара" hint="Найдите товар по названию, SKU или slug и свяжите его с постом. Связь необязательна.">
                  <input
                    className="admin-input h-12"
                    placeholder="Поиск товара..."
                    value={linkedProductQuery}
                    onChange={(event) => setLinkedProductQuery(event.target.value)}
                  />
                </FieldGroup>

                {selectedProduct ? (
                  <ProductPreviewCard
                    product={selectedProduct}
                    onClear={() =>
                      setForm((current) => ({
                        ...current,
                        linkedProductId: ""
                      }))
                    }
                  />
                ) : (
                  <div className="rounded-[1.25rem] border border-dashed border-[#d5dce8] bg-[#fbfcff] px-4 py-5 text-sm text-slate-500">
                    Связанный товар не выбран. Пост сохранится и без product relation.
                  </div>
                )}

                <div className="rounded-[1.25rem] border border-[#e4e9f1] bg-white">
                  <div className="border-b border-[#edf1f6] px-4 py-3 text-sm font-semibold text-slate-700">
                    Доступные товары
                  </div>
                  <div className="max-h-[320px] divide-y divide-[#edf1f6] overflow-y-auto">
                    {filteredProducts.map((product) => {
                      const selected = form.linkedProductId === product.id;

                      return (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => {
                            setForm((current) => ({ ...current, linkedProductId: product.id }));
                            setInitialLinkedProduct(null);
                            setLinkedProductQuery("");
                          }}
                          className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                            selected ? "bg-[#f8fafc]" : "hover:bg-[#fbfcff]"
                          }`}
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[0.9rem] border border-[#e5eaf2] bg-white">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={getProductDisplayName(product)} className="h-full w-full object-cover" />
                            ) : (
                              <UploadPlaceholderIcon className="h-5 w-5 text-slate-300" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-800">{getProductDisplayName(product)}</p>
                            <p className="mt-1 truncate text-xs uppercase tracking-[0.18em] text-slate-400">
                              {product.sku} / {product.slug}
                            </p>
                          </div>
                          <span className="text-sm font-medium text-slate-500">{formatPrice(product.price)}</span>
                        </button>
                      );
                    })}

                    {filteredProducts.length === 0 ? (
                      <div className="px-4 py-5 text-sm text-slate-500">Ничего не найдено по текущему запросу.</div>
                    ) : null}
                  </div>
                </div>
              </div>
            </EditorCard>

            <EditorCard title="Dynamic Sections">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm leading-6 text-slate-500">
                    Добавляйте смысловые блоки статьи. Секции можно переставлять кнопками вверх и вниз.
                  </p>
                  <button type="button" onClick={addSection} className="admin-button-secondary shrink-0">
                    Добавить section
                  </button>
                </div>

                {form.dynamicSections.length === 0 ? (
                  <div className="rounded-[1.25rem] border border-dashed border-[#d5dce8] bg-[#fbfcff] px-5 py-6 text-sm text-slate-500">
                    Секции пока не добавлены. Это не ошибка: статья может сохраниться и без dynamic sections.
                  </div>
                ) : null}

                <div className="space-y-4">
                  {form.dynamicSections.map((section, index) => (
                    <div key={section.id} className="rounded-[1.35rem] border border-[#e4e9f1] bg-[#fbfcff] p-4">
                      <div className="flex flex-col gap-3 border-b border-[#e7edf6] pb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Section {index + 1}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                            sortOrder: {section.sortOrder}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <SectionActionButton label="Вверх" disabled={index === 0} onClick={() => moveSection(index, -1)} />
                          <SectionActionButton
                            label="Вниз"
                            disabled={index === form.dynamicSections.length - 1}
                            onClick={() => moveSection(index, 1)}
                          />
                          <button
                            type="button"
                            onClick={() => removeSection(section.id)}
                            className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 space-y-4">
                        <FieldGroup label="Title" hint="Заголовок внутри тела статьи.">
                          <input
                            className="admin-input h-12"
                            value={section.title}
                            onChange={(event) => updateSection(section.id, { title: event.target.value })}
                          />
                        </FieldGroup>

                        <FieldGroup label="Description" hint="Основной текст секции.">
                          <textarea
                            className="admin-textarea min-h-[150px]"
                            value={section.description}
                            onChange={(event) => updateSection(section.id, { description: event.target.value })}
                          />
                        </FieldGroup>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </EditorCard>

            <EditorCard title="SEO">
              <div className="space-y-5">
                <FieldGroup label="SEO title" hint="Title-тег страницы статьи для SEO и соцсетей.">
                  <input
                    className="admin-input h-12"
                    required
                    value={form.seoTitle}
                    onChange={(event) => setForm((current) => ({ ...current, seoTitle: event.target.value }))}
                  />
                </FieldGroup>

                <FieldGroup label="Meta description" hint="Краткое описание страницы для search snippets.">
                  <textarea
                    className="admin-textarea min-h-[120px]"
                    required
                    value={form.metaDescription}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, metaDescription: event.target.value }))
                    }
                  />
                </FieldGroup>
              </div>
            </EditorCard>
          </div>

          <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <EditorCard title="Сводка поста">
              <div className="space-y-4 text-sm">
                <div className="rounded-[1rem] bg-[#fbfcff] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Режим</p>
                  <p className="mt-2 font-semibold text-slate-900">{isEditing ? "Редактирование" : "Создание"}</p>
                  <p className="mt-1 text-slate-500">{getPublicationStatusLabel(form.publishDate)}</p>
                </div>

                <div className="space-y-3 rounded-[1rem] border border-[#e7edf6] px-4 py-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Slug preview</p>
                    <p className="mt-1 break-all font-medium text-slate-800">/blog/{form.slug || "post-slug"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Publish date</p>
                    <p className="mt-1 font-medium text-slate-800">{formatPublishDate(form.publishDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Category</p>
                    <p className="mt-1 font-medium text-slate-800">{form.category || "Не указана"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Featured</p>
                    <p className="mt-1 font-medium text-slate-800">{form.featured ? "Да" : "Нет"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Dynamic sections</p>
                    <p className="mt-1 font-medium text-slate-800">{form.dynamicSections.length}</p>
                  </div>
                </div>
              </div>
            </EditorCard>

            <EditorCard title="Preview">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-[1.2rem] border border-[#e5eaf2] bg-[#fbfcff]">
                  <div className="flex min-h-[220px] items-center justify-center bg-white">
                    {form.coverImage ? (
                      <img src={form.coverImage} alt={form.cardTitle || "Cover preview"} className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <UploadPlaceholderIcon className="mx-auto h-10 w-10 text-slate-300" />
                        <p className="mt-3 text-sm text-slate-400">Обложка не выбрана</p>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-[#e7edf6] px-4 py-4">
                    <p className="text-base font-semibold text-slate-900">{form.cardTitle || "Card title"}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{form.excerpt || "Excerpt появится здесь."}</p>
                  </div>
                </div>

                {selectedProduct ? (
                  <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-400">Linked product</p>
                    <ProductPreviewCard product={selectedProduct} />
                  </div>
                ) : (
                  <div className="rounded-[1rem] border border-dashed border-[#d5dce8] bg-[#fbfcff] px-4 py-4 text-sm text-slate-500">
                    Связанный товар не выбран.
                  </div>
                )}
              </div>
            </EditorCard>

            <EditorCard title="Действия">
              <div className="space-y-3">
                <button type="submit" className="admin-button-primary w-full">
                  {isEditing ? "Сохранить изменения" : "Создать пост"}
                </button>
                <Link href="/admin123/blog" className="admin-button-secondary w-full">
                  Отмена
                </Link>
                {isEditing ? (
                  <button type="button" onClick={handleDelete} className="admin-button-danger w-full">
                    Удалить пост
                  </button>
                ) : null}
              </div>
            </EditorCard>
          </div>
        </div>
      </form>
    </section>
  );
}
