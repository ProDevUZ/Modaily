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
import { RichTextTextarea } from "@/components/admin/rich-text-textarea";
import type { BlogPostLinkedProduct } from "@/lib/blog-post-types";

type BlogEditorProps = {
  postId?: string;
};

type LocalizedText = {
  uz: string;
  ru: string;
  en: string;
};

type BlogSectionFormItem = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  sortOrder: number;
};

type BlogMediaFormItem = {
  id: string;
  type: "IMAGE" | "VIDEO";
  imageUrl: string;
  videoUrl: string;
  sortOrder: number;
};

type BlogFormState = {
  cardTitle: LocalizedText;
  media: BlogMediaFormItem[];
  publishDate: string;
  category: LocalizedText;
  slug: string;
  featured: boolean;
  mainTitle: LocalizedText;
  introDescription: LocalizedText;
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

function createLocalizedText(initial = ""): LocalizedText {
  return {
    uz: initial,
    ru: initial,
    en: initial
  };
}

const emptyForm: BlogFormState = {
  cardTitle: createLocalizedText(),
  media: [],
  publishDate: new Date().toISOString().slice(0, 10),
  category: createLocalizedText(),
  slug: "",
  featured: false,
  mainTitle: createLocalizedText(),
  introDescription: createLocalizedText(),
  linkedProductId: "",
  dynamicSections: [],
  seoTitle: "",
  metaDescription: ""
};
const MAX_BLOG_MEDIA_ITEMS = 6;
const RICH_TEXT_HINT = "Поддерживаются **жирный**, *курсив*, списки (-, 1.) и переносы строк.";

function createLocalSection(index: number): BlogSectionFormItem {
  return {
    id: `section-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: createLocalizedText(),
    description: createLocalizedText(),
    sortOrder: index
  };
}

function normalizeSections(sections: BlogSectionFormItem[]) {
  return sections.map((section, index) => ({
    ...section,
    sortOrder: index
  }));
}

function createLocalMedia(item: {
  id?: string;
  type: "IMAGE" | "VIDEO";
  imageUrl?: string | null;
  videoUrl?: string | null;
  sortOrder?: number;
}): BlogMediaFormItem {
  return {
    id: item.id || `media-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: item.type,
    imageUrl: item.imageUrl || "",
    videoUrl: item.videoUrl || "",
    sortOrder: item.sortOrder ?? 0
  };
}

function normalizeMedia(media: BlogMediaFormItem[]) {
  return media.map((item, index) => ({
    ...item,
    sortOrder: index
  }));
}

function buildFormFromPost(post: AdminBlogPost): BlogFormState {
  return {
    cardTitle: {
      uz: post.cardTitleUz || post.cardTitle,
      ru: post.cardTitleRu || post.cardTitle,
      en: post.cardTitleEn || post.cardTitle
    },
    media: normalizeMedia(
      (post.media.length
        ? post.media
        : post.coverImage
          ? [
              {
                id: `${post.id}-cover`,
                type: "IMAGE" as const,
                imageUrl: post.coverImage,
                videoUrl: null,
                sortOrder: 0
              }
            ]
          : []
      ).map((item) =>
        createLocalMedia({
          id: item.id,
          type: item.type,
          imageUrl: item.imageUrl,
          videoUrl: item.videoUrl,
          sortOrder: item.sortOrder
        })
      )
    ),
    publishDate: post.publishDate.slice(0, 10),
    category: {
      uz: post.categoryUz || post.category,
      ru: post.categoryRu || post.category,
      en: post.categoryEn || post.category
    },
    slug: post.slug,
    featured: post.featured,
    mainTitle: {
      uz: post.mainTitleUz || post.mainTitle,
      ru: post.mainTitleRu || post.mainTitle,
      en: post.mainTitleEn || post.mainTitle
    },
    introDescription: {
      uz: post.introDescriptionUz || post.introDescription,
      ru: post.introDescriptionRu || post.introDescription,
      en: post.introDescriptionEn || post.introDescription
    },
    linkedProductId: post.linkedProductId || "",
    dynamicSections: normalizeSections(
      post.dynamicSections.map((section, index) => ({
        id: section.id || `section-${index}`,
        title: {
          uz: section.titleUz || section.title,
          ru: section.titleRu || section.title,
          en: section.titleEn || section.title
        },
        description: {
          uz: section.descriptionUz || section.description,
          ru: section.descriptionRu || section.description,
          en: section.descriptionEn || section.description
        },
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

function getPrimaryLocalizedValue(value: LocalizedText) {
  return value.ru || value.en || value.uz || "";
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

function LocalizedInputFields({
  value,
  onChange,
  required = false,
  placeholder
}: {
  value: LocalizedText;
  onChange: (value: LocalizedText) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="grid gap-3">
      {(["uz", "ru", "en"] as const).map((localeKey) => (
        <div key={localeKey} className="grid gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {localeKey.toUpperCase()}
          </p>
          <input
            className="admin-input h-12"
            required={required}
            placeholder={placeholder}
            value={value[localeKey]}
            onChange={(event) =>
              onChange({
                ...value,
                [localeKey]: event.target.value
              })
            }
          />
        </div>
      ))}
    </div>
  );
}

function LocalizedTextareaFields({
  value,
  onChange,
  required = false,
  minHeightClassName = "min-h-[110px]"
}: {
  value: LocalizedText;
  onChange: (value: LocalizedText) => void;
  required?: boolean;
  minHeightClassName?: string;
}) {
  return (
    <div className="grid gap-3">
      {(["uz", "ru", "en"] as const).map((localeKey) => (
        <div key={localeKey} className="grid gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {localeKey.toUpperCase()}
          </p>
          <RichTextTextarea
            className={`admin-textarea ${minHeightClassName}`}
            required={required}
            value={value[localeKey]}
            onChange={(nextValue) =>
              onChange({
                ...value,
                [localeKey]: nextValue
              })
            }
          />
        </div>
      ))}
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

function MediaTypeBadge({ type }: { type: BlogMediaFormItem["type"] }) {
  return (
    <span className="inline-flex rounded-full border border-[#dde5ef] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
      {type === "IMAGE" ? "Image" : "Video"}
    </span>
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
  const [uploadingMediaImages, setUploadingMediaImages] = useState(false);
  const [uploadingMediaVideos, setUploadingMediaVideos] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<BlogSubmitError | null>(null);
  const [linkedProductQuery, setLinkedProductQuery] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const coverMedia = useMemo(
    () => form.media.find((item) => item.type === "IMAGE" && item.imageUrl) || null,
    [form.media]
  );

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

  async function uploadBlogImage(file: File) {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    return requestJson<{ url: string }>("/api/uploads/promo-image", {
      method: "POST",
      body: uploadFormData
    });
  }

  async function uploadBlogVideo(file: File) {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    return requestJson<{ url: string }>("/api/uploads/product-video", {
      method: "POST",
      body: uploadFormData
    });
  }

  async function handleMediaImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).slice(
      0,
      Math.max(0, MAX_BLOG_MEDIA_ITEMS - form.media.length)
    );

    if (files.length === 0) {
      return;
    }

    setError(null);
    setMessage(null);
    setUploadingMediaImages(true);

    try {
      const uploaded = await Promise.all(files.map((file) => uploadBlogImage(file)));

      setForm((current) => {
        const nextMedia = [...current.media];

        uploaded.forEach((item) => {
          nextMedia.push(
            createLocalMedia({
              type: "IMAGE",
              imageUrl: item.url,
              sortOrder: nextMedia.length
            })
          );
        });

        return {
          ...current,
          media: normalizeMedia(nextMedia.slice(0, MAX_BLOG_MEDIA_ITEMS))
        };
      });
      setMessage("Изображения загружены.");
    } catch (uploadError) {
      setError({
        message: uploadError instanceof Error ? uploadError.message : "Не удалось загрузить изображения."
      });
    } finally {
      setUploadingMediaImages(false);
      event.target.value = "";
    }
  }

  async function handleMediaVideoUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).slice(
      0,
      Math.max(0, MAX_BLOG_MEDIA_ITEMS - form.media.length)
    );

    if (files.length === 0) {
      return;
    }

    setError(null);
    setMessage(null);
    setUploadingMediaVideos(true);

    try {
      const uploaded = await Promise.all(files.map((file) => uploadBlogVideo(file)));

      setForm((current) => {
        const nextMedia = [...current.media];

        uploaded.forEach((item) => {
          nextMedia.push(
            createLocalMedia({
              type: "VIDEO",
              videoUrl: item.url,
              sortOrder: nextMedia.length
            })
          );
        });

        return {
          ...current,
          media: normalizeMedia(nextMedia.slice(0, MAX_BLOG_MEDIA_ITEMS))
        };
      });
      setMessage("Видео загружены.");
    } catch (uploadError) {
      setError({
        message: uploadError instanceof Error ? uploadError.message : "Не удалось загрузить видео."
      });
    } finally {
      setUploadingMediaVideos(false);
      event.target.value = "";
    }
  }

  function moveMedia(index: number, direction: -1 | 1) {
    setForm((current) => {
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= current.media.length) {
        return current;
      }

      const nextMedia = [...current.media];
      const [item] = nextMedia.splice(index, 1);
      nextMedia.splice(targetIndex, 0, item);

      return {
        ...current,
        media: normalizeMedia(nextMedia)
      };
    });
  }

  function removeMedia(id: string) {
    setForm((current) => ({
      ...current,
      media: normalizeMedia(current.media.filter((item) => item.id !== id))
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
          publishDate: form.publishDate,
          slug: form.slug,
          featured: form.featured,
          linkedProductId: form.linkedProductId || null,
          seoTitle: form.seoTitle,
          metaDescription: form.metaDescription,
          cardTitleUz: form.cardTitle.uz,
          cardTitleRu: form.cardTitle.ru,
          cardTitleEn: form.cardTitle.en,
          categoryUz: form.category.uz,
          categoryRu: form.category.ru,
          categoryEn: form.category.en,
          mainTitleUz: form.mainTitle.uz,
          mainTitleRu: form.mainTitle.ru,
          mainTitleEn: form.mainTitle.en,
          introDescriptionUz: form.introDescription.uz,
          introDescriptionRu: form.introDescription.ru,
          introDescriptionEn: form.introDescription.en,
          media: normalizeMedia(form.media).map((item, index) => ({
            type: item.type,
            imageUrl: item.type === "IMAGE" ? item.imageUrl : null,
            videoUrl: item.type === "VIDEO" ? item.videoUrl : null,
            sortOrder: index
          })),
          dynamicSections: normalizeSections(form.dynamicSections).map((section, index) => ({
            titleUz: section.title.uz,
            titleRu: section.title.ru,
            titleEn: section.title.en,
            descriptionUz: section.description.uz,
            descriptionRu: section.description.ru,
            descriptionEn: section.description.en,
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
                  <LocalizedInputFields
                    required
                    value={form.cardTitle}
                    onChange={(value) => {
                      setForm((current) => ({
                        ...current,
                        cardTitle: value,
                        slug: slugManuallyEdited ? current.slug : slugify(value.ru || value.en || value.uz)
                      }));
                    }}
                  />
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
                              getPrimaryLocalizedValue(form.category).trim().toLowerCase() === category.trim().toLowerCase();

                            return (
                              <button
                                key={category}
                                type="button"
                                onClick={() =>
                                  setForm((current) => ({
                                    ...current,
                                    category: {
                                      uz: current.category.uz || category,
                                      ru: category,
                                      en: current.category.en || category
                                    }
                                  }))
                                }
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
                  <LocalizedInputFields
                    required
                    value={form.category}
                    onChange={(value) => setForm((current) => ({ ...current, category: value }))}
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

            <EditorCard title="Media">
              <div className="space-y-5">
                <FieldGroup
                  label="Файлы публикации"
                  hint="Загрузите до 6 изображений или видео. Первая фотография автоматически станет cover для карточек и страницы статьи."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex cursor-pointer items-center justify-center gap-3 rounded-[1.15rem] border border-dashed border-[#d5dce8] bg-[#fbfcfe] px-4 py-4 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white">
                      <UploadPlaceholderIcon className="h-6 w-6 text-slate-300" />
                      {uploadingMediaImages ? "Загрузка..." : "Добавить image"}
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        multiple
                        className="hidden"
                        onChange={handleMediaImageUpload}
                        disabled={uploadingMediaImages || form.media.length >= MAX_BLOG_MEDIA_ITEMS}
                      />
                    </label>
                    <label className="flex cursor-pointer items-center justify-center gap-3 rounded-[1.15rem] border border-dashed border-[#d5dce8] bg-[#fbfcfe] px-4 py-4 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white">
                      <UploadPlaceholderIcon className="h-6 w-6 text-slate-300" />
                      {uploadingMediaVideos ? "Загрузка..." : "Добавить video"}
                      <input
                        type="file"
                        accept=".mp4,.webm,.mov"
                        multiple
                        className="hidden"
                        onChange={handleMediaVideoUpload}
                        disabled={uploadingMediaVideos || form.media.length >= MAX_BLOG_MEDIA_ITEMS}
                      />
                    </label>
                  </div>
                </FieldGroup>

                {form.media.length ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {form.media.map((item, index) => {
                      const isCover = item.type === "IMAGE" && coverMedia?.id === item.id;

                      return (
                        <div
                          key={item.id}
                          className="overflow-hidden rounded-[1.25rem] border border-[#e4e9f1] bg-white"
                        >
                          <div className="relative flex h-[180px] items-center justify-center overflow-hidden bg-[#f8fafc]">
                            {item.type === "IMAGE" && item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={`Media ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                            ) : item.videoUrl ? (
                              <video
                                src={item.videoUrl}
                                className="h-full w-full object-cover"
                                muted
                                playsInline
                                preload="metadata"
                              />
                            ) : (
                              <UploadPlaceholderIcon className="h-8 w-8 text-slate-300" />
                            )}

                            <div className="absolute left-3 top-3 flex items-center gap-2">
                              <MediaTypeBadge type={item.type} />
                              {isCover ? (
                                <span className="inline-flex rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                                  Cover
                                </span>
                              ) : null}
                            </div>
                          </div>

                          <div className="space-y-3 px-4 py-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                              Позиция {index + 1} из {MAX_BLOG_MEDIA_ITEMS}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <SectionActionButton
                                label="Влево"
                                disabled={index === 0}
                                onClick={() => moveMedia(index, -1)}
                              />
                              <SectionActionButton
                                label="Вправо"
                                disabled={index === form.media.length - 1}
                                onClick={() => moveMedia(index, 1)}
                              />
                              <button
                                type="button"
                                onClick={() => removeMedia(item.id)}
                                className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                              >
                                Удалить
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-[1.25rem] border border-dashed border-[#d5dce8] bg-[#fbfcfe] px-5 py-6 text-sm text-slate-500">
                    Медиа пока не добавлены. Загрузите хотя бы одну фотографию, чтобы пост получил cover.
                  </div>
                )}
              </div>
            </EditorCard>

            <EditorCard title="Article Header">
              <div className="space-y-5">
                <FieldGroup label="Main title" hint="Главный заголовок статьи на detail page.">
                  <LocalizedInputFields
                    required
                    value={form.mainTitle}
                    onChange={(value) => setForm((current) => ({ ...current, mainTitle: value }))}
                  />
                </FieldGroup>

                <FieldGroup label="Intro description" hint={`Вводный абзац под основным заголовком статьи. ${RICH_TEXT_HINT}`}>
                  <LocalizedTextareaFields
                    minHeightClassName="min-h-[140px]"
                    required
                    value={form.introDescription}
                    onChange={(value) => setForm((current) => ({ ...current, introDescription: value }))}
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
                          <LocalizedInputFields
                            value={section.title}
                            onChange={(value) => updateSection(section.id, { title: value })}
                          />
                        </FieldGroup>

                        <FieldGroup label="Description" hint={`Основной текст секции. ${RICH_TEXT_HINT}`}>
                          <LocalizedTextareaFields
                            minHeightClassName="min-h-[150px]"
                            value={section.description}
                            onChange={(value) => updateSection(section.id, { description: value })}
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
                  <RichTextTextarea
                    className="admin-textarea min-h-[120px]"
                    required
                    value={form.metaDescription}
                    onChange={(value) => setForm((current) => ({ ...current, metaDescription: value }))}
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
                    <p className="mt-1 font-medium text-slate-800">{getPrimaryLocalizedValue(form.category) || "Не указана"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Featured</p>
                    <p className="mt-1 font-medium text-slate-800">{form.featured ? "Да" : "Нет"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Media</p>
                    <p className="mt-1 font-medium text-slate-800">{form.media.length} / {MAX_BLOG_MEDIA_ITEMS}</p>
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
                    {coverMedia?.imageUrl ? (
                      <img
                        src={coverMedia.imageUrl}
                        alt={getPrimaryLocalizedValue(form.cardTitle) || "Cover preview"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <UploadPlaceholderIcon className="mx-auto h-10 w-10 text-slate-300" />
                        <p className="mt-3 text-sm text-slate-400">Cover появится после первой загруженной фотографии</p>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-[#e7edf6] px-4 py-4">
                    <p className="text-base font-semibold text-slate-900">{getPrimaryLocalizedValue(form.cardTitle) || "Card title"}</p>
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
