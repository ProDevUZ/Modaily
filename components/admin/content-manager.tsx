"use client";

import Link from "next/link";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import { adminContentSections, type AdminContentSectionKey } from "@/lib/admin-content-navigation";
import {
  type AdminGalleryHeading,
  type AdminGalleryItem,
  type AdminHomeAbout,
  type AdminHomeHero,
  type AdminHomePromoCard,
  type AdminProduct,
  type AdminTestimonial,
  requestJson
} from "@/components/admin/admin-types";
import { RichTextTextarea } from "@/components/admin/rich-text-textarea";

type HeroForm = Omit<AdminHomeHero, "id" | "createdAt" | "updatedAt">;
type AboutForm = Omit<AdminHomeAbout, "id" | "createdAt" | "updatedAt">;
type PromoForm = Omit<AdminHomePromoCard, "id" | "createdAt" | "updatedAt">;
type GalleryHeadingForm = Omit<AdminGalleryHeading, "id" | "createdAt" | "updatedAt">;
type GalleryForm = Omit<AdminGalleryItem, "id" | "createdAt" | "updatedAt">;
type TestimonialForm = Omit<AdminTestimonial, "id" | "createdAt" | "updatedAt">;

function getProductOptionLabel(product: AdminProduct) {
  return product.nameRu || product.nameEn || product.nameUz;
}

const emptyPromoForm: PromoForm = {
  titleUz: "",
  titleRu: "",
  titleEn: "",
  descriptionUz: "",
  descriptionRu: "",
  descriptionEn: "",
  buttonLabelUz: "",
  buttonLabelRu: "",
  buttonLabelEn: "",
  buttonLink: "",
  imageUrl: "",
  promoProductId: null,
  sortOrder: 0,
  active: true
};

const emptyGalleryForm: GalleryForm = {
  type: "IMAGE",
  titleUz: "",
  titleRu: "",
  titleEn: "",
  descriptionUz: "",
  descriptionRu: "",
  descriptionEn: "",
  imageUrl: "",
  videoUrl: "",
  sortOrder: 0,
  active: true
};

const emptyGalleryHeadingForm: GalleryHeadingForm = {
  type: "IMAGE",
  textUz: "",
  textRu: "",
  textEn: "",
  sortOrder: 0,
  active: true
};

const emptyTestimonialForm: TestimonialForm = {
  authorName: "",
  authorRoleUz: "",
  authorRoleRu: "",
  authorRoleEn: "",
  productNameUz: "",
  productNameRu: "",
  productNameEn: "",
  bodyUz: "",
  bodyRu: "",
  bodyEn: "",
  avatarUrl: "",
  rating: 5,
  sortOrder: 0,
  active: true
};

const workspaceMeta: Record<
  AdminContentSectionKey,
  { eyebrow: string; title: string; description: string; tips: [string, string, string] }
> = {
  hero: {
    eyebrow: "Главный экран",
    title: "Рабочая зона хиро-блока",
    description: "Первый экран витрины. Здесь управляются отдельные изображения для desktop и mobile, а также привязка к товару.",
    tips: [
      "Используйте отдельный кадр для desktop и mobile, чтобы композиция не ломалась.",
      "После загрузки изображения его можно сразу проверить через предпросмотр.",
      "Привязанный товар открывается по клику на весь hero-блок."
    ]
  },
  about: {
    eyebrow: "История бренда",
    title: "Редактор блока «О бренде»",
    description: "Здесь собирается история бренда и длинный текстовый контент. В этом блоке особенно важны читабельность и структура.",
    tips: [
      "Проверяйте каждый языковой блок отдельно.",
      "Для длинных абзацев сохраняйте единый тон и ритм текста.",
      "После обновления изображения изменения на витрине появляются почти сразу."
    ]
  },
  promo: {
    eyebrow: "Редакционные блоки",
    title: "Менеджер промо-карточек",
    description: "Панель для быстрого создания, редактирования и сортировки промо-карточек после блока бестселлеров.",
    tips: [
      "Через порядок сортировки удобно управлять точным порядком карточек.",
      "Флаг активности помогает временно скрывать промо-блоки без удаления.",
      "Предпросмотр изображения помогает быстро проверить визуальный баланс карточки."
    ]
  },
  gallery: {
    eyebrow: "Медиатека",
    title: "Менеджер контента галереи",
    description: "Панель управления изображениями и видео для медиаблоков главной страницы.",
    tips: [
      "Режимы изображений и видео разделены на отдельные сценарии работы.",
      "Порядок сортировки определяет последовательность изображений и видеоблоков.",
      "Ссылка на загруженный файл сохраняется, поэтому его легко использовать повторно."
    ]
  },
  testimonials: {
    eyebrow: "Социальное доказательство",
    title: "Центр управления отзывами",
    description: "Из этого раздела управляются контент, порядок и статусы карточек с отзывами.",
    tips: [
      "Имя автора, товар и текст отзыва должны звучать в одном тоне.",
      "Рейтинг и порядок сортировки напрямую влияют на визуальный баланс блока.",
      "Активные отзывы сразу попадают на витрину."
    ]
  },
  bestseller: {
    eyebrow: "Мерчандайзинг главной",
    title: "Обзор блока бестселлеров",
    description: "Ассортимент бестселлеров управляется через раздел товаров, а здесь собраны быстрый обзор и переходы.",
    tips: [
      "Флаг бестселлера и порядок на главной настраиваются в разделе товаров.",
      "Этот раздел удобен для быстрого контроля мерчандайзинга на главной.",
      "При необходимости отсюда можно быстро перейти в раздел товаров."
    ]
  }
};

function SectionCard({
  title,
  description,
  children,
  eyebrow = "Редактор контента",
  actions
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  eyebrow?: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="admin-panel overflow-hidden">
      <div className="admin-panel-header px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">{eyebrow}</p>
            <h2 className="mt-2 text-[1.65rem] font-semibold tracking-tight text-slate-950">{title}</h2>
            <p className="mt-2 max-w-[62ch] text-sm leading-6 text-slate-500">{description}</p>
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function Field({ value, onChange, placeholder, type = "text" }: { value: string | null; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return (
    <div>
      <input className="admin-input" type={type} value={value ?? ""} aria-label={placeholder} onChange={(event) => onChange(event.target.value)} />
      <p className="admin-form-hint">{placeholder}</p>
    </div>
  );
}

function Area({ value, onChange, placeholder }: { value: string | null; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div>
      <textarea className="admin-textarea" value={value ?? ""} aria-label={placeholder} onChange={(event) => onChange(event.target.value)} />
      <p className="admin-form-hint">{placeholder}</p>
    </div>
  );
}

export function ContentManager({ section, galleryMode }: { section: AdminContentSectionKey; galleryMode?: "image" | "video" }) {
  const [hero, setHero] = useState<HeroForm | null>(null);
  const [about, setAbout] = useState<AboutForm | null>(null);
  const [promoCards, setPromoCards] = useState<AdminHomePromoCard[]>([]);
  const [galleryHeadings, setGalleryHeadings] = useState<AdminGalleryHeading[]>([]);
  const [galleryItems, setGalleryItems] = useState<AdminGalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [promoForm, setPromoForm] = useState<PromoForm>(emptyPromoForm);
  const [galleryHeadingForm, setGalleryHeadingForm] = useState<GalleryHeadingForm>(emptyGalleryHeadingForm);
  const [galleryForm, setGalleryForm] = useState<GalleryForm>(emptyGalleryForm);
  const [testimonialForm, setTestimonialForm] = useState<TestimonialForm>(emptyTestimonialForm);
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [editingGalleryHeadingId, setEditingGalleryHeadingId] = useState<string | null>(null);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [heroDesktopUploadPending, setHeroDesktopUploadPending] = useState(false);
  const [heroMobileUploadPending, setHeroMobileUploadPending] = useState(false);
  const [aboutUploadPending, setAboutUploadPending] = useState(false);
  const [promoUploadPending, setPromoUploadPending] = useState(false);
  const [galleryUploadPending, setGalleryUploadPending] = useState(false);
  const [galleryVideoUploadPending, setGalleryVideoUploadPending] = useState(false);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const [dashboard, productPayload] = await Promise.all([
        requestJson<{
          hero: HeroForm;
          about: AboutForm;
          promoCards: AdminHomePromoCard[];
          galleryHeadings: AdminGalleryHeading[];
          galleryItems: AdminGalleryItem[];
          testimonials: AdminTestimonial[];
        }>("/api/content/dashboard"),
        requestJson<AdminProduct[]>("/api/products")
      ]);

      setHero(dashboard.hero);
      setAbout(dashboard.about);
      setPromoCards(dashboard.promoCards);
      setGalleryHeadings(dashboard.galleryHeadings);
      setGalleryItems(dashboard.galleryItems);
      setTestimonials(dashboard.testimonials);
      setProducts(productPayload);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить контент.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function saveSingleton(endpoint: string, payload: unknown, successMessage: string) {
    setError(null);
    setMessage(null);
    try {
      await requestJson(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setMessage(successMessage);
      await loadData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Не удалось сохранить контент.");
    }
  }

  async function handleHeroImageUpload(event: ChangeEvent<HTMLInputElement>, target: "desktop" | "mobile") {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (target === "desktop") {
      setHeroDesktopUploadPending(true);
    } else {
      setHeroMobileUploadPending(true);
    }
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const payload = await requestJson<{ url: string }>("/api/uploads/promo-image", {
        method: "POST",
        body: formData
      });

      setHero((current) =>
        current
          ? target === "desktop"
            ? { ...current, imageUrl: payload.url }
            : { ...current, mobileImageUrl: payload.url }
          : current
      );
      setMessage(target === "desktop" ? "Desktop-изображение hero загружено." : "Mobile-изображение hero загружено.");
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : target === "desktop"
            ? "Не удалось загрузить desktop-изображение hero."
            : "Не удалось загрузить mobile-изображение hero."
      );
    } finally {
      if (target === "desktop") {
        setHeroDesktopUploadPending(false);
      } else {
        setHeroMobileUploadPending(false);
      }
      event.target.value = "";
    }
  }

  async function handlePromoSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const payload = {
        ...promoForm,
        buttonLabelUz: "",
        buttonLabelRu: "",
        buttonLabelEn: "",
        buttonLink: ""
      };

      await requestJson(editingPromoId ? `/api/content/home-promo-cards/${editingPromoId}` : "/api/content/home-promo-cards", {
        method: editingPromoId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setEditingPromoId(null);
      setPromoForm(emptyPromoForm);
      setMessage(editingPromoId ? "Промо-карточка обновлена." : "Промо-карточка создана.");
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось сохранить промо-карточку.");
    }
  }

  async function handleAboutImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAboutUploadPending(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const payload = await requestJson<{ url: string }>("/api/uploads/promo-image", {
        method: "POST",
        body: formData
      });

      setAbout((current) => (current ? { ...current, imageUrl: payload.url } : current));
      setMessage("Изображение блока «О бренде» загружено.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Не удалось загрузить изображение блока «О бренде».");
    } finally {
      setAboutUploadPending(false);
      event.target.value = "";
    }
  }

  async function handlePromoImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPromoUploadPending(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const payload = await requestJson<{ url: string }>("/api/uploads/promo-image", {
        method: "POST",
        body: formData
      });

      setPromoForm((current) => ({
        ...current,
        imageUrl: payload.url
      }));
      setMessage("Изображение промо-карточки загружено.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Не удалось загрузить изображение промо-карточки.");
    } finally {
      setPromoUploadPending(false);
      event.target.value = "";
    }
  }

  async function handleGallerySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await requestJson(editingGalleryId ? `/api/content/gallery-items/${editingGalleryId}` : "/api/content/gallery-items", {
        method: editingGalleryId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(galleryForm)
      });
      setEditingGalleryId(null);
      setGalleryForm({ ...emptyGalleryForm, type: activeGalleryType });
      setMessage(editingGalleryId ? "Элемент галереи обновлен." : "Элемент галереи создан.");
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось сохранить элемент галереи.");
    }
  }

  async function handleGalleryHeadingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await requestJson(
        editingGalleryHeadingId ? `/api/content/gallery-headings/${editingGalleryHeadingId}` : "/api/content/gallery-headings",
        {
          method: editingGalleryHeadingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(galleryHeadingForm)
        }
      );
      setEditingGalleryHeadingId(null);
      setGalleryHeadingForm({ ...emptyGalleryHeadingForm, type: activeGalleryType });
      setMessage(editingGalleryHeadingId ? "Динамический текст обновлен." : "Динамический текст добавлен.");
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось сохранить динамический текст.");
    }
  }

  async function handleGalleryImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setGalleryUploadPending(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const payload = await requestJson<{ url: string }>("/api/uploads/gallery-image", {
        method: "POST",
        body: formData
      });

      setGalleryForm((current) => ({
        ...current,
        imageUrl: payload.url
      }));
      setMessage("Изображение галереи загружено.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Не удалось загрузить изображение галереи.");
    } finally {
      setGalleryUploadPending(false);
      event.target.value = "";
    }
  }

  async function handleGalleryVideoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setGalleryVideoUploadPending(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const payload = await requestJson<{ url: string }>("/api/uploads/gallery-video", {
        method: "POST",
        body: formData
      });

      setGalleryForm((current) => ({
        ...current,
        videoUrl: payload.url
      }));
      setMessage("Видео галереи загружено.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Не удалось загрузить видео галереи.");
    } finally {
      setGalleryVideoUploadPending(false);
      event.target.value = "";
    }
  }

  async function handleTestimonialSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await requestJson(editingTestimonialId ? `/api/content/testimonials/${editingTestimonialId}` : "/api/content/testimonials", {
        method: editingTestimonialId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonialForm)
      });
      setEditingTestimonialId(null);
      setTestimonialForm(emptyTestimonialForm);
      setMessage(editingTestimonialId ? "Отзыв обновлен." : "Отзыв создан.");
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось сохранить отзыв.");
    }
  }

  async function handleDelete(endpoint: string, successMessage: string, reset: () => void) {
    if (!window.confirm("Удалить этот элемент?")) {
      return;
    }

    try {
      await requestJson(endpoint, { method: "DELETE" });
      reset();
      setMessage(successMessage);
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Не удалось удалить элемент.");
    }
  }

  const bestsellers = products.filter((product) => product.isBestseller).sort((a, b) => a.homeSortOrder - b.homeSortOrder);
  const heroProductOptions = [...products]
    .filter((product) => product.active || product.id === hero?.heroProductId)
    .sort((first, second) => getProductOptionLabel(first).localeCompare(getProductOptionLabel(second), "ru"));
  const promoProductOptions = [...products]
    .filter((product) => product.active || product.id === promoForm.promoProductId)
    .sort((first, second) => getProductOptionLabel(first).localeCompare(getProductOptionLabel(second), "ru"));
  const activeGalleryType = galleryMode === "video" ? "VIDEO" : "IMAGE";
  const activeGalleryLabel = galleryMode === "video" ? "Видео" : "Изображение";
  const filteredGalleryHeadings = galleryHeadings.filter((item) => item.type === activeGalleryType);
  const filteredGalleryItems = galleryItems.filter((item) => item.type === activeGalleryType);
  const selectedHeroProduct = hero?.heroProductId ? products.find((product) => product.id === hero.heroProductId) ?? null : null;
  const selectedPromoProduct = promoForm.promoProductId ? products.find((product) => product.id === promoForm.promoProductId) ?? null : null;
  const sectionMeta = workspaceMeta[section];
  const sectionDefinition = adminContentSections.find((entry) => entry.key === section);
  const managedCount =
    section === "promo"
      ? promoCards.length
      : section === "gallery"
        ? filteredGalleryItems.length + filteredGalleryHeadings.length
        : section === "testimonials"
          ? testimonials.length
          : section === "bestseller"
            ? bestsellers.length
          : 1;
  useEffect(() => {
    if (section === "gallery") {
      if (!editingGalleryId) {
        setGalleryForm((current) => ({ ...current, type: activeGalleryType }));
      }

      if (!editingGalleryHeadingId) {
        setGalleryHeadingForm((current) => ({ ...current, type: activeGalleryType }));
      }
    }
  }, [section, activeGalleryType, editingGalleryId, editingGalleryHeadingId]);

  return (
    <div className="space-y-6">
      <section className="admin-workspace-hero px-6 py-6 lg:px-8 lg:py-7">
        <div className="max-w-[76ch]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[#f5f8fd] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
              {sectionMeta.eyebrow}
            </span>
            {sectionDefinition ? (
              <span className="inline-flex items-center rounded-full bg-[var(--brand)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand)]">
                {sectionDefinition.label}
              </span>
            ) : null}
          </div>

          <h2 className="mt-4 max-w-[16ch] text-[2.15rem] font-semibold tracking-[-0.05em] text-slate-950 sm:max-w-none lg:text-[2.55rem]">
            {sectionMeta.title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[15px] leading-7 text-slate-500">{sectionMeta.description}</p>

          {sectionDefinition?.description ? (
            <p className="mt-4 text-sm leading-6 text-slate-400">{sectionDefinition.description}</p>
          ) : null}
        </div>
      </section>

      {error ? <p className="rounded-[1.35rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 shadow-[0_10px_20px_rgba(248,113,113,0.08)]">{error}</p> : null}
      {message ? <p className="rounded-[1.35rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600 shadow-[0_10px_20px_rgba(16,185,129,0.08)]">{message}</p> : null}
      {loading ? <p className="rounded-[1.35rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">Загружаем контент-панель...</p> : null}

      <div className="space-y-6">

      {section === "bestseller" ? (
        <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Бестселлеры" description="Состав блока бестселлеров управляется через раздел товаров: флагом бестселлера и порядком на главной.">
          <div className="admin-list-card flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm font-semibold text-slate-950">Выбранные товары</p>
              <p className="mt-1 text-sm text-slate-500">Сейчас выбрано {bestsellers.length} товаров.</p>
            </div>
            <Link href="/admin123/products" className="admin-button-secondary">
              Открыть товары
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {bestsellers.map((product) => (
              <div key={product.id} className="admin-list-card flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{getProductOptionLabel(product)}</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{product.sku}</p>
                </div>
                <span className="admin-badge">#{product.homeSortOrder}</span>
              </div>
            ))}
            {bestsellers.length === 0 ? <p className="text-sm text-slate-500">Пока нет товаров, отмеченных как бестселлеры.</p> : null}
          </div>
        </SectionCard>
        </div>
      ) : null}

      {section === "hero" ? (
        <SectionCard
          title="Хиро-блок"
          description="Первый и самый заметный блок главной страницы."
          actions={
            hero ? (
              <button
                type="button"
                className="admin-button-primary"
                onClick={() => {
                  void saveSingleton("/api/content/home-hero", hero, "Хиро-блок обновлен.");
                }}
              >
                Сохранить хиро-блок
              </button>
            ) : null
          }
        >
          {hero ? (
            <form
              className="grid gap-8"
              onSubmit={(event) => {
                event.preventDefault();
                void saveSingleton("/api/content/home-hero", hero, "Хиро-блок обновлен.");
              }}
            >
              <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px] 2xl:items-start">
                <div className="grid min-w-0 gap-6">
                  <div className="admin-panel-muted overflow-hidden p-0">
                    <div className="flex flex-col gap-4 border-b border-slate-200/80 px-5 py-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2.5">
                          <p className="text-[15px] font-semibold text-slate-950">Desktop-изображение</p>
                          <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            1720×1100
                          </span>
                        </div>
                        <p className="mt-1.5 max-w-[58ch] text-xs leading-5 text-slate-500">
                          Основной кадр для больших экранов. Лучше использовать широкую композицию с безопасными полями по краям.
                        </p>
                      </div>

                      <label className={`admin-button-secondary shrink-0 ${heroDesktopUploadPending ? "pointer-events-none opacity-60" : "cursor-pointer"}`}>
                        {heroDesktopUploadPending ? "Загрузка..." : "Выбрать файл"}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          className="hidden"
                          onChange={(event) => {
                            void handleHeroImageUpload(event, "desktop");
                          }}
                          disabled={heroDesktopUploadPending}
                        />
                      </label>
                    </div>

                    <div className="grid gap-5 px-5 py-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
                      <div className="space-y-3">
                        <Field
                          value={hero.imageUrl}
                          onChange={(value) => setHero((current) => (current ? { ...current, imageUrl: value } : current))}
                          placeholder="URL desktop-изображения"
                        />
                        <p className="admin-form-hint">Рекомендуемый размер: 1720×1100 px. После загрузки можно заменить URL вручную.</p>
                      </div>

                      <div className="overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white">
                        {hero.imageUrl ? (
                          <img src={hero.imageUrl} alt="Desktop hero preview" className="h-[210px] w-full object-cover" />
                        ) : (
                          <div className="flex h-[210px] items-center justify-center bg-slate-50 px-6 text-center text-sm leading-6 text-slate-400">
                            Загрузите desktop-изображение или вставьте прямую ссылку.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="admin-panel-muted overflow-hidden p-0">
                    <div className="flex flex-col gap-4 border-b border-slate-200/80 px-5 py-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2.5">
                          <p className="text-[15px] font-semibold text-slate-950">Mobile-изображение</p>
                          <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            900×1400
                          </span>
                        </div>
                        <p className="mt-1.5 max-w-[58ch] text-xs leading-5 text-slate-500">
                          Отдельный мобильный кадр. Здесь лучше держать ключевой объект ближе к центру и выше линии fold.
                        </p>
                      </div>

                      <label className={`admin-button-secondary shrink-0 ${heroMobileUploadPending ? "pointer-events-none opacity-60" : "cursor-pointer"}`}>
                        {heroMobileUploadPending ? "Загрузка..." : "Выбрать файл"}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          className="hidden"
                          onChange={(event) => {
                            void handleHeroImageUpload(event, "mobile");
                          }}
                          disabled={heroMobileUploadPending}
                        />
                      </label>
                    </div>

                    <div className="grid gap-5 px-5 py-5 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-start">
                      <div className="space-y-3">
                        <Field
                          value={hero.mobileImageUrl}
                          onChange={(value) => setHero((current) => (current ? { ...current, mobileImageUrl: value } : current))}
                          placeholder="URL mobile-изображения"
                        />
                        <p className="admin-form-hint">Рекомендуемый размер: 900×1400 px. Лучше использовать самостоятельный кадр под mobile.</p>
                      </div>

                      <div className="overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white">
                        {hero.mobileImageUrl ? (
                          <img src={hero.mobileImageUrl} alt="Mobile hero preview" className="h-[280px] w-full object-cover object-top" />
                        ) : (
                          <div className="flex h-[280px] items-center justify-center bg-slate-50 px-6 text-center text-sm leading-6 text-slate-400">
                            Загрузите mobile-изображение или вставьте прямую ссылку.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="admin-panel-muted overflow-hidden p-0">
                    <div className="border-b border-slate-200/80 px-5 py-5">
                      <p className="text-[15px] font-semibold text-slate-950">Товар для hero-блока</p>
                      <p className="mt-1.5 text-xs leading-5 text-slate-500">
                        Весь hero остаётся clickable и открывает страницу выбранного товара. Привязка обязательна.
                      </p>
                    </div>

                    <div className="space-y-5 px-5 py-5">
                      <div>
                        <select
                          className="admin-select"
                          value={hero.heroProductId ?? ""}
                          onChange={(event) => setHero((current) => (current ? { ...current, heroProductId: event.target.value || null } : current))}
                        >
                          <option value="">Выберите товар</option>
                          {heroProductOptions.map((product) => (
                            <option key={product.id} value={product.id}>
                              {getProductOptionLabel(product)}
                            </option>
                          ))}
                        </select>
                        <p className="admin-form-hint">Используются товары витрины. После сохранения клик по hero ведёт на выбранный SKU.</p>
                      </div>

                      <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4">
                        {selectedHeroProduct ? (
                          <>
                          <p className="text-sm font-semibold text-slate-950">{getProductOptionLabel(selectedHeroProduct)}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">{selectedHeroProduct.sku}</p>
                          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Сценарий перехода</p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            Клик по hero откроет страницу товара <span className="font-semibold text-slate-900">{getProductOptionLabel(selectedHeroProduct)}</span>.
                          </p>
                          </>
                        ) : (
                          <div className="text-sm leading-6 text-slate-400">
                            Сначала выберите товар, чтобы зафиксировать переход по клику на hero.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : null}
        </SectionCard>
      ) : null}

      {section === "about" ? (
        <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="О бренде" description="Блок с историей бренда и контентом о линейке продуктов.">
          {about ? (
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                void saveSingleton("/api/content/home-about", about, "Блок «О бренде» обновлен.");
              }}
            >
              <Field value={about.titleUz} onChange={(value) => setAbout((current) => (current ? { ...current, titleUz: value } : current))} placeholder="Заголовок UZ" />
              <Field value={about.titleRu} onChange={(value) => setAbout((current) => (current ? { ...current, titleRu: value } : current))} placeholder="Заголовок RU" />
              <Field value={about.titleEn} onChange={(value) => setAbout((current) => (current ? { ...current, titleEn: value } : current))} placeholder="Заголовок EN" />
              <div className="space-y-3 md:col-span-2">
                <label className="admin-panel-muted flex cursor-pointer items-center justify-between gap-4 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Загрузка изображения</p>
                    <p className="mt-1 text-xs text-slate-500">
                      JPG, PNG, WebP, AVIF. До 20 МБ. Рекомендуемый размер: 1200×760 px или любое горизонтальное изображение с похожей пропорцией для блока «О бренде».
                    </p>
                  </div>
                  <span className="admin-button-secondary">{aboutUploadPending ? "Загрузка..." : "Выбрать файл"}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                    onChange={handleAboutImageUpload}
                    disabled={aboutUploadPending}
                  />
                </label>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
                  <Field value={about.imageUrl} onChange={(value) => setAbout((current) => (current ? { ...current, imageUrl: value } : current))} placeholder="URL изображения" />

                  <div className="admin-panel-muted overflow-hidden p-0">
                    {about.imageUrl ? (
                      <img src={about.imageUrl} alt="Предпросмотр блока «О бренде»" className="h-40 w-full object-cover" />
                    ) : (
                      <div className="flex h-40 items-center justify-center bg-slate-50 px-5 text-center text-sm leading-6 text-slate-400">
                        Загрузите изображение или вставьте прямую ссылку для превью.
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <Area value={about.descriptionUz} onChange={(value) => setAbout((current) => (current ? { ...current, descriptionUz: value } : current))} placeholder="Описание UZ" />
              </div>
              <div className="md:col-span-2">
                <Area value={about.descriptionRu} onChange={(value) => setAbout((current) => (current ? { ...current, descriptionRu: value } : current))} placeholder="Описание RU" />
              </div>
              <div className="md:col-span-2">
                <Area value={about.descriptionEn} onChange={(value) => setAbout((current) => (current ? { ...current, descriptionEn: value } : current))} placeholder="Описание EN" />
              </div>
              <div className="md:col-span-2">
                <Area value={about.secondaryDescriptionUz} onChange={(value) => setAbout((current) => (current ? { ...current, secondaryDescriptionUz: value } : current))} placeholder="Текст красного блока UZ" />
              </div>
              <div className="md:col-span-2">
                <Area value={about.secondaryDescriptionRu} onChange={(value) => setAbout((current) => (current ? { ...current, secondaryDescriptionRu: value } : current))} placeholder="Текст красного блока RU" />
              </div>
              <div className="md:col-span-2">
                <Area value={about.secondaryDescriptionEn} onChange={(value) => setAbout((current) => (current ? { ...current, secondaryDescriptionEn: value } : current))} placeholder="Текст красного блока EN" />
              </div>
              <button type="submit" className="admin-button-primary md:col-span-2">
                Сохранить блок «О бренде»
              </button>
            </form>
          ) : null}
        </SectionCard>
        </div>
      ) : null}

      {section === "promo" ? (
        <div className="grid gap-6 xl:grid-cols-[520px_1fr]">
        <SectionCard title="Промо-карточки" description="Редакционные баннеры после блока бестселлеров.">
          <form onSubmit={handlePromoSubmit} className="grid gap-4 md:grid-cols-2">
            <Field value={promoForm.titleUz} onChange={(value) => setPromoForm((current) => ({ ...current, titleUz: value }))} placeholder="Заголовок UZ" />
            <Field value={promoForm.titleRu} onChange={(value) => setPromoForm((current) => ({ ...current, titleRu: value }))} placeholder="Заголовок RU" />
            <Field value={promoForm.titleEn} onChange={(value) => setPromoForm((current) => ({ ...current, titleEn: value }))} placeholder="Заголовок EN" />
            <div className="space-y-3 md:col-span-2">
              <label className="admin-panel-muted flex cursor-pointer items-center justify-between gap-4 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Загрузка изображения</p>
                  <p className="mt-1 text-xs text-slate-500">JPG, PNG, WebP, AVIF. До 20 МБ. Рекомендуемый размер: 584×356 px или любое горизонтальное изображение с таким же соотношением сторон, чтобы картинка полностью заполняла промо-блок на главной странице.</p>
                </div>
                <span className="admin-button-secondary">{promoUploadPending ? "Загрузка..." : "Выбрать файл"}</span>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={handlePromoImageUpload} disabled={promoUploadPending} />
              </label>

              {promoForm.imageUrl ? (
                <div className="admin-panel-muted flex items-center gap-4 px-4 py-3">
                  <img src={promoForm.imageUrl} alt="Предпросмотр промо-карточки" className="h-20 w-32 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-950">{promoForm.imageUrl}</p>
                    <p className="mt-1 text-xs text-slate-500">Изображение будет показано в промо-карточке на главной странице. Лучше использовать формат 584×356 px, чтобы блок заполнялся без обрезки.</p>
                  </div>
                </div>
              ) : null}
            </div>
            <Area value={promoForm.descriptionUz} onChange={(value) => setPromoForm((current) => ({ ...current, descriptionUz: value }))} placeholder="Описание UZ" />
            <Area value={promoForm.descriptionRu} onChange={(value) => setPromoForm((current) => ({ ...current, descriptionRu: value }))} placeholder="Описание RU" />
            <Area value={promoForm.descriptionEn} onChange={(value) => setPromoForm((current) => ({ ...current, descriptionEn: value }))} placeholder="Описание EN" />
            <div className="admin-panel-muted px-4 py-3 md:col-span-2">
              <p className="text-sm font-semibold text-slate-950">Товар для промо-карточки</p>
              <p className="mt-1 text-xs text-slate-500">Кнопка «Узнать подробнее» будет вести на страницу выбранного товара. Выбор обязателен.</p>
              <div className="mt-4">
                <select
                  className="admin-select"
                  value={promoForm.promoProductId ?? ""}
                  onChange={(event) =>
                    setPromoForm((current) => ({
                      ...current,
                      promoProductId: event.target.value || null
                    }))
                  }
                  required
                >
                  <option value="">Выберите товар</option>
                  {promoProductOptions.map((product) => (
                    <option key={product.id} value={product.id}>
                      {getProductOptionLabel(product)}
                    </option>
                  ))}
                </select>
                <p className="admin-form-hint">Используются только активные товары витрины.</p>
              </div>
              {selectedPromoProduct ? (
                <div className="mt-4 flex items-center gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                    {selectedPromoProduct.imageUrl ? (
                      <img
                        src={selectedPromoProduct.imageUrl}
                        alt={getProductOptionLabel(selectedPromoProduct)}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">{getProductOptionLabel(selectedPromoProduct)}</p>
                    <p className="mt-1 truncate text-xs uppercase tracking-[0.22em] text-slate-500">{selectedPromoProduct.slug}</p>
                  </div>
                </div>
              ) : null}
            </div>
            <Field value={String(promoForm.sortOrder)} onChange={(value) => setPromoForm((current) => ({ ...current, sortOrder: Number(value) || 0 }))} placeholder="Порядок сортировки" type="number" />
            <label className="admin-panel-muted flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 md:col-span-2">
              <input type="checkbox" checked={promoForm.active} onChange={(event) => setPromoForm((current) => ({ ...current, active: event.target.checked }))} />
              Карточка активна
            </label>
            <div className="admin-panel-muted px-4 py-3 text-sm text-slate-500 md:col-span-2">
              Кнопка промо-блока автоматически ведет на выбранный товар. Подпись и ссылка отдельно не задаются.
            </div>
            <button type="submit" className="admin-button-primary md:col-span-2">
              {editingPromoId ? "Обновить промо-карточку" : "Создать промо-карточку"}
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Список промо-карточек" description="Текущие промо-карточки.">
          <div className="space-y-4">
            {promoCards.map((card) => (
              <article key={card.id} className="admin-list-card p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="h-20 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                      {card.imageUrl ? <img src={card.imageUrl} alt={card.titleRu} className="h-full w-full object-cover" /> : null}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Промо #{card.sortOrder}</p>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${card.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                          {card.active ? "Активно" : "Черновик"}
                        </span>
                      </div>
                      <h3 className="mt-2 truncate text-lg font-semibold text-slate-950">{card.titleRu}</h3>
                      <p className="mt-1 truncate text-sm text-slate-500">
                        {products.find((product) => product.id === card.promoProductId)
                          ? getProductOptionLabel(products.find((product) => product.id === card.promoProductId)!)
                          : card.imageUrl || "Товар не выбран"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="admin-button-secondary"
                      onClick={() => {
                        setEditingPromoId(card.id);
                        setPromoForm({
                          titleUz: card.titleUz,
                          titleRu: card.titleRu,
                          titleEn: card.titleEn,
                          descriptionUz: card.descriptionUz,
                          descriptionRu: card.descriptionRu,
                          descriptionEn: card.descriptionEn,
                          buttonLabelUz: card.buttonLabelUz,
                          buttonLabelRu: card.buttonLabelRu,
                          buttonLabelEn: card.buttonLabelEn,
                          buttonLink: card.buttonLink,
                          imageUrl: card.imageUrl,
                          promoProductId: card.promoProductId,
                          sortOrder: card.sortOrder,
                          active: card.active
                        });
                      }}
                    >
                      Редактировать
                    </button>
                    <button
                      type="button"
                      className="admin-button-danger"
                      onClick={() => void handleDelete(`/api/content/home-promo-cards/${card.id}`, "Промо-карточка удалена.", () => {
                        setEditingPromoId(null);
                        setPromoForm(emptyPromoForm);
                      })}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {promoCards.length === 0 ? <p className="text-sm text-slate-500">Промо-карточек пока нет.</p> : null}
          </div>
        </SectionCard>
        </div>
      ) : null}

      {section === "gallery" ? (
        <div className="grid gap-6 xl:grid-cols-[520px_1fr]">
        <SectionCard
          title={galleryMode === "video" ? "Видео" : "Изображения"}
          description={galleryMode === "video" ? "В этом разделе управляются видео для медиаблока на главной странице." : "В этом разделе управляются изображения для двухрядной галереи на главной странице."}
        >
          <div className="space-y-6">
          <form onSubmit={handleGalleryHeadingSubmit} className="admin-panel-muted space-y-4 px-4 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-950">Динамический заголовок секции</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Добавьте несколько текстов для {galleryMode === "video" ? "видеогалереи" : "фотогалереи"}. На витрине они будут меняться каждые 2 секунды.
                </p>
              </div>
              <span className="admin-badge">{activeGalleryLabel}</span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <RichTextTextarea
                  value={galleryHeadingForm.textUz ?? ""}
                  onChange={(value) => setGalleryHeadingForm((current) => ({ ...current, textUz: value }))}
                  className="admin-textarea min-h-[120px]"
                  ariaLabel="Динамический текст UZ"
                  placeholder="Текст UZ"
                />
                <p className="admin-form-hint">Динамический текст UZ</p>
              </div>
              <div>
                <RichTextTextarea
                  value={galleryHeadingForm.textRu ?? ""}
                  onChange={(value) => setGalleryHeadingForm((current) => ({ ...current, textRu: value }))}
                  className="admin-textarea min-h-[120px]"
                  ariaLabel="Динамический текст RU"
                  placeholder="Текст RU"
                />
                <p className="admin-form-hint">Динамический текст RU</p>
              </div>
              <div>
                <RichTextTextarea
                  value={galleryHeadingForm.textEn ?? ""}
                  onChange={(value) => setGalleryHeadingForm((current) => ({ ...current, textEn: value }))}
                  className="admin-textarea min-h-[120px]"
                  ariaLabel="Динамический текст EN"
                  placeholder="Текст EN"
                />
                <p className="admin-form-hint">Динамический текст EN</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[170px_auto]">
              <Field
                value={String(galleryHeadingForm.sortOrder)}
                onChange={(value) => setGalleryHeadingForm((current) => ({ ...current, sortOrder: Number(value) || 0 }))}
                placeholder="Порядок сортировки"
                type="number"
              />
              <label className="admin-panel-muted flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={galleryHeadingForm.active}
                  onChange={(event) => setGalleryHeadingForm((current) => ({ ...current, active: event.target.checked }))}
                />
                Текст активен
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="submit" className="admin-button-primary">
                {editingGalleryHeadingId ? "Обновить текст" : "Добавить текст"}
              </button>
              {editingGalleryHeadingId ? (
                <button
                  type="button"
                  className="admin-button-secondary"
                  onClick={() => {
                    setEditingGalleryHeadingId(null);
                    setGalleryHeadingForm({ ...emptyGalleryHeadingForm, type: activeGalleryType });
                  }}
                >
                  Сбросить
                </button>
              ) : null}
            </div>
          </form>

          {filteredGalleryHeadings.length > 0 ? (
            <div className="space-y-3">
              {filteredGalleryHeadings.map((item) => {
                const previewText = item.textRu || item.textUz || item.textEn || "Без текста";

                return (
                  <article key={item.id} className="admin-list-card p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                            {galleryMode === "video" ? "Видео заголовок" : "Заголовок галереи"} #{item.sortOrder}
                          </p>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                            {item.active ? "Активно" : "Черновик"}
                          </span>
                        </div>
                        <p className="mt-2 whitespace-pre-line text-base font-medium leading-6 text-slate-950">
                          {previewText}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="admin-button-secondary"
                          onClick={() => {
                            setEditingGalleryHeadingId(item.id);
                            setGalleryHeadingForm({
                              type: item.type,
                              textUz: item.textUz,
                              textRu: item.textRu,
                              textEn: item.textEn,
                              sortOrder: item.sortOrder,
                              active: item.active
                            });
                          }}
                        >
                          Редактировать
                        </button>
                        <button
                          type="button"
                          className="admin-button-danger"
                          onClick={() =>
                            void handleDelete("/api/content/gallery-headings/" + item.id, "Динамический текст удален.", () => {
                              setEditingGalleryHeadingId(null);
                              setGalleryHeadingForm({ ...emptyGalleryHeadingForm, type: activeGalleryType });
                            })
                          }
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}

          <form onSubmit={handleGallerySubmit} className="grid gap-4 md:grid-cols-2">
            <div className="admin-panel-muted flex items-center justify-between px-4 py-3 md:col-span-2">
              <span className="text-sm font-semibold text-slate-900">Тип контента</span>
              <span className="admin-badge">{activeGalleryLabel}</span>
            </div>
            {galleryMode === "image" ? (
              <div className="space-y-3 md:col-span-2">
                <label className="admin-panel-muted flex cursor-pointer items-center justify-between gap-4 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Загрузка изображения</p>
                    <p className="mt-1 text-xs text-slate-500">Только изображения. До 20 МБ. Исходное качество сохраняется.</p>
                  </div>
                  <span className="admin-button-secondary">{galleryUploadPending ? "Загрузка..." : "Выбрать файл"}</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={handleGalleryImageUpload} disabled={galleryUploadPending} />
                </label>

                {galleryForm.imageUrl ? (
                  <div className="admin-panel-muted flex items-center gap-4 px-4 py-3">
                    <img src={galleryForm.imageUrl} alt="Предпросмотр изображения галереи" className="h-20 w-20 rounded-2xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-950">{galleryForm.imageUrl}</p>
                      <p className="mt-1 text-xs text-slate-500">Это изображение будет показано в галерее на главной странице.</p>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="space-y-3 md:col-span-2">
                <div className="admin-panel-muted flex items-center justify-between gap-4 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Обложка видео</p>
                    <p className="mt-1 text-xs text-slate-500">Рекомендуется вертикальное изображение 9:16. Эта обложка будет видна до запуска видео, поэтому без нее карточка может выглядеть пустой.</p>
                  </div>
                  <label className={`admin-button-secondary ${galleryUploadPending ? "pointer-events-none opacity-60" : "cursor-pointer"}`}>
                    {galleryUploadPending ? "Загрузка..." : "Выбрать обложку"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="hidden"
                      onChange={handleGalleryImageUpload}
                      disabled={galleryUploadPending}
                    />
                  </label>
                </div>

                <Field
                  value={galleryForm.imageUrl}
                  onChange={(value) => setGalleryForm((current) => ({ ...current, imageUrl: value }))}
                  placeholder="Ссылка на обложку видео"
                />

                {galleryForm.imageUrl ? (
                  <div className="admin-panel-muted flex items-center gap-4 px-4 py-3">
                    <img src={galleryForm.imageUrl} alt="Предпросмотр обложки видео" className="h-24 w-16 rounded-2xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-950">{galleryForm.imageUrl}</p>
                      <p className="mt-1 text-xs text-slate-500">Эта обложка будет показана в видеогалерее до нажатия на play.</p>
                    </div>
                  </div>
                ) : null}

                <div className="admin-panel-muted flex items-center justify-between gap-4 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Загрузка видео</p>
                    <p className="mt-1 text-xs text-slate-500">MP4, WebM, MOV. До 250 МБ. Видео будет использовано в медиаблоке на главной странице.</p>
                  </div>
                  <label className={`admin-button-secondary ${galleryVideoUploadPending ? "pointer-events-none opacity-60" : "cursor-pointer"}`}>
                    {galleryVideoUploadPending ? "Загрузка..." : "Выбрать видео"}
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                      className="hidden"
                      onChange={handleGalleryVideoUpload}
                      disabled={galleryVideoUploadPending}
                    />
                  </label>
                </div>

                <Field value={galleryForm.videoUrl} onChange={(value) => setGalleryForm((current) => ({ ...current, videoUrl: value }))} placeholder="Ссылка на видео" />

                {galleryForm.videoUrl ? (
                  <div className="admin-panel-muted space-y-2 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-slate-950">{galleryForm.videoUrl}</p>
                    <p className="text-xs text-slate-500">Эта ссылка будет использоваться в видеоблоке на главной странице.</p>
                  </div>
                ) : null}
              </div>
            )}
            <Field value={String(galleryForm.sortOrder)} onChange={(value) => setGalleryForm((current) => ({ ...current, sortOrder: Number(value) || 0 }))} placeholder="Порядок сортировки" type="number" />
            {galleryMode === "image" ? (
              <>
                <Field value={galleryForm.titleUz} onChange={(value) => setGalleryForm((current) => ({ ...current, titleUz: value }))} placeholder="Заголовок UZ" />
                <Field value={galleryForm.titleRu} onChange={(value) => setGalleryForm((current) => ({ ...current, titleRu: value }))} placeholder="Заголовок RU" />
                <Field value={galleryForm.titleEn} onChange={(value) => setGalleryForm((current) => ({ ...current, titleEn: value }))} placeholder="Заголовок EN" />
              </>
            ) : null}
            <label className="admin-panel-muted flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 md:col-span-2">
              <input type="checkbox" checked={galleryForm.active} onChange={(event) => setGalleryForm((current) => ({ ...current, active: event.target.checked }))} />
              Элемент активен
            </label>
            <button type="submit" className="admin-button-primary md:col-span-2">
              {editingGalleryId
                ? galleryMode === "video"
                  ? "Обновить видеоэлемент"
                  : "Обновить элемент галереи"
                : galleryMode === "video"
                  ? "Создать видеоэлемент"
                  : "Создать элемент галереи"}
            </button>
          </form>
          </div>
        </SectionCard>

        <SectionCard title={galleryMode === "video" ? "Список видео" : "Список изображений"} description={galleryMode === "video" ? "Текущие видеоэлементы медиаблока." : "Текущие изображения для галереи на главной странице."}>
          <div className="space-y-4">
            {filteredGalleryItems.map((item) => (
              <article key={item.id} className="admin-list-card p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="h-20 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                      {galleryMode === "image" ? <img src={item.imageUrl} alt={item.titleRu || item.titleEn || "Изображение галереи"} className="h-full w-full object-cover" /> : null}
                      {galleryMode === "video" ? (
                        item.imageUrl ? (
                          <img src={item.imageUrl} alt={`Обложка видео ${item.sortOrder}`} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-950 text-xs font-semibold uppercase tracking-[0.26em] text-white">
                            Видео
                          </div>
                        )
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{item.type === "VIDEO" ? "Видео" : "Изображение"} #{item.sortOrder}</p>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                          {item.active ? "Активно" : "Черновик"}
                        </span>
                      </div>
                      <h3 className="mt-2 truncate text-lg font-semibold text-slate-950">
                        {galleryMode === "video" ? `Видеоэлемент ${item.sortOrder}` : item.titleRu || item.titleEn || "Без названия"}
                      </h3>
                      <p className="mt-1 truncate text-sm text-slate-500">{galleryMode === "video" ? item.videoUrl || "Ссылка на видео не указана" : item.imageUrl}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="admin-button-secondary"
                      onClick={() => {
                        setEditingGalleryId(item.id);
                        setGalleryForm({
                          type: item.type,
                          titleUz: item.titleUz,
                          titleRu: item.titleRu,
                          titleEn: item.titleEn,
                          descriptionUz: item.descriptionUz,
                          descriptionRu: item.descriptionRu,
                          descriptionEn: item.descriptionEn,
                          imageUrl: item.imageUrl,
                          videoUrl: item.videoUrl,
                          sortOrder: item.sortOrder,
                          active: item.active
                        });
                      }}
                    >
                      Редактировать
                    </button>
                    <button
                      type="button"
                      className="admin-button-danger"
                      onClick={() => void handleDelete(`/api/content/gallery-items/${item.id}`, "Элемент галереи удален.", () => {
                        setEditingGalleryId(null);
                        setGalleryForm({ ...emptyGalleryForm, type: activeGalleryType });
                      })}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {filteredGalleryItems.length === 0 ? <p className="text-sm text-slate-500">{galleryMode === "video" ? "Видеоэлементов" : "Изображений"} пока нет.</p> : null}
          </div>
        </SectionCard>
        </div>
      ) : null}

      {section === "testimonials" ? (
        <div className="grid gap-6 xl:grid-cols-[520px_1fr]">
        <SectionCard title="Отзывы" description="Карточки отзывов для главной страницы.">
          <form onSubmit={handleTestimonialSubmit} className="grid gap-4 md:grid-cols-2">
            <Field value={testimonialForm.authorName} onChange={(value) => setTestimonialForm((current) => ({ ...current, authorName: value }))} placeholder="Имя автора" />
            <Field value={testimonialForm.avatarUrl} onChange={(value) => setTestimonialForm((current) => ({ ...current, avatarUrl: value }))} placeholder="Ссылка на аватар" />
            <Field value={testimonialForm.authorRoleUz} onChange={(value) => setTestimonialForm((current) => ({ ...current, authorRoleUz: value }))} placeholder="Роль UZ" />
            <Field value={testimonialForm.authorRoleRu} onChange={(value) => setTestimonialForm((current) => ({ ...current, authorRoleRu: value }))} placeholder="Роль RU" />
            <Field value={testimonialForm.authorRoleEn} onChange={(value) => setTestimonialForm((current) => ({ ...current, authorRoleEn: value }))} placeholder="Роль EN" />
            <Field value={String(testimonialForm.rating)} onChange={(value) => setTestimonialForm((current) => ({ ...current, rating: Number(value) || 5 }))} placeholder="Оценка" type="number" />
            <Field value={testimonialForm.productNameUz} onChange={(value) => setTestimonialForm((current) => ({ ...current, productNameUz: value }))} placeholder="Название товара UZ" />
            <Field value={testimonialForm.productNameRu} onChange={(value) => setTestimonialForm((current) => ({ ...current, productNameRu: value }))} placeholder="Название товара RU" />
            <Field value={testimonialForm.productNameEn} onChange={(value) => setTestimonialForm((current) => ({ ...current, productNameEn: value }))} placeholder="Название товара EN" />
            <Field value={String(testimonialForm.sortOrder)} onChange={(value) => setTestimonialForm((current) => ({ ...current, sortOrder: Number(value) || 0 }))} placeholder="Порядок сортировки" type="number" />
            <Area value={testimonialForm.bodyUz} onChange={(value) => setTestimonialForm((current) => ({ ...current, bodyUz: value }))} placeholder="Отзыв UZ" />
            <Area value={testimonialForm.bodyRu} onChange={(value) => setTestimonialForm((current) => ({ ...current, bodyRu: value }))} placeholder="Отзыв RU" />
            <Area value={testimonialForm.bodyEn} onChange={(value) => setTestimonialForm((current) => ({ ...current, bodyEn: value }))} placeholder="Отзыв EN" />
            <label className="admin-panel-muted flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 md:col-span-2">
              <input type="checkbox" checked={testimonialForm.active} onChange={(event) => setTestimonialForm((current) => ({ ...current, active: event.target.checked }))} />
              Отзыв активен
            </label>
            <button type="submit" className="admin-button-primary md:col-span-2">
              {editingTestimonialId ? "Обновить отзыв" : "Создать отзыв"}
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Список отзывов" description="Текущий список отзывов.">
          <div className="space-y-4">
            {testimonials.map((item) => (
              <article key={item.id} className="admin-list-card p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#fff3f6] text-lg font-semibold text-[var(--brand)]">
                      {item.avatarUrl ? <img src={item.avatarUrl} alt={item.authorName} className="h-full w-full object-cover" /> : item.authorName.slice(0, 1)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Отзыв #{item.sortOrder}</p>
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-600">
                          {item.rating}/5
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                          {item.active ? "Активно" : "Черновик"}
                        </span>
                      </div>
                      <h3 className="mt-2 truncate text-lg font-semibold text-slate-950">{item.authorName}</h3>
                      <p className="mt-1 truncate text-sm text-slate-500">{item.productNameRu || item.productNameEn || "Товар не указан"}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="admin-button-secondary"
                      onClick={() => {
                        setEditingTestimonialId(item.id);
                        setTestimonialForm({
                          authorName: item.authorName,
                          authorRoleUz: item.authorRoleUz,
                          authorRoleRu: item.authorRoleRu,
                          authorRoleEn: item.authorRoleEn,
                          productNameUz: item.productNameUz,
                          productNameRu: item.productNameRu,
                          productNameEn: item.productNameEn,
                          bodyUz: item.bodyUz,
                          bodyRu: item.bodyRu,
                          bodyEn: item.bodyEn,
                          avatarUrl: item.avatarUrl,
                          rating: item.rating,
                          sortOrder: item.sortOrder,
                          active: item.active
                        });
                      }}
                    >
                      Редактировать
                    </button>
                    <button
                      type="button"
                      className="admin-button-danger"
                      onClick={() => void handleDelete(`/api/content/testimonials/${item.id}`, "Отзыв удален.", () => {
                        setEditingTestimonialId(null);
                        setTestimonialForm(emptyTestimonialForm);
                      })}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {testimonials.length === 0 ? <p className="text-sm text-slate-500">Отзывов пока нет.</p> : null}
          </div>
        </SectionCard>
        </div>
      ) : null}

      </div>
    </div>
  );
}
