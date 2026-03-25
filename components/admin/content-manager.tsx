"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

import {
  type AdminGalleryItem,
  type AdminHomeAbout,
  type AdminHomeHero,
  type AdminHomePromoCard,
  type AdminProduct,
  type AdminSiteSettings,
  type AdminTestimonial,
  requestJson
} from "@/components/admin/admin-types";

type SiteSettingsForm = Omit<AdminSiteSettings, "id" | "createdAt" | "updatedAt">;
type HeroForm = Omit<AdminHomeHero, "id" | "createdAt" | "updatedAt">;
type AboutForm = Omit<AdminHomeAbout, "id" | "createdAt" | "updatedAt">;
type PromoForm = Omit<AdminHomePromoCard, "id" | "createdAt" | "updatedAt">;
type GalleryForm = Omit<AdminGalleryItem, "id" | "createdAt" | "updatedAt">;
type TestimonialForm = Omit<AdminTestimonial, "id" | "createdAt" | "updatedAt">;

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

function SectionCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="admin-panel p-6">
      <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({ value, onChange, placeholder, type = "text" }: { value: string | null; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return <input className="admin-input" type={type} value={value ?? ""} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />;
}

function Area({ value, onChange, placeholder }: { value: string | null; onChange: (value: string) => void; placeholder: string }) {
  return <textarea className="admin-textarea" value={value ?? ""} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />;
}

export function ContentManager() {
  const [siteSettings, setSiteSettings] = useState<SiteSettingsForm | null>(null);
  const [hero, setHero] = useState<HeroForm | null>(null);
  const [about, setAbout] = useState<AboutForm | null>(null);
  const [promoCards, setPromoCards] = useState<AdminHomePromoCard[]>([]);
  const [galleryItems, setGalleryItems] = useState<AdminGalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [promoForm, setPromoForm] = useState<PromoForm>(emptyPromoForm);
  const [galleryForm, setGalleryForm] = useState<GalleryForm>(emptyGalleryForm);
  const [testimonialForm, setTestimonialForm] = useState<TestimonialForm>(emptyTestimonialForm);
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const [dashboard, productPayload] = await Promise.all([
        requestJson<{
          siteSettings: SiteSettingsForm;
          hero: HeroForm;
          about: AboutForm;
          promoCards: AdminHomePromoCard[];
          galleryItems: AdminGalleryItem[];
          testimonials: AdminTestimonial[];
        }>("/api/content/dashboard"),
        requestJson<AdminProduct[]>("/api/products")
      ]);

      setSiteSettings(dashboard.siteSettings);
      setHero(dashboard.hero);
      setAbout(dashboard.about);
      setPromoCards(dashboard.promoCards);
      setGalleryItems(dashboard.galleryItems);
      setTestimonials(dashboard.testimonials);
      setProducts(productPayload);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load content.");
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
      setError(saveError instanceof Error ? saveError.message : "Could not save content.");
    }
  }

  async function handlePromoSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await requestJson(editingPromoId ? `/api/content/home-promo-cards/${editingPromoId}` : "/api/content/home-promo-cards", {
        method: editingPromoId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promoForm)
      });
      setEditingPromoId(null);
      setPromoForm(emptyPromoForm);
      setMessage(editingPromoId ? "Promo updated." : "Promo created.");
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save promo.");
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
      setGalleryForm(emptyGalleryForm);
      setMessage(editingGalleryId ? "Gallery item updated." : "Gallery item created.");
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save gallery item.");
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
      setMessage(editingTestimonialId ? "Testimonial updated." : "Testimonial created.");
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save testimonial.");
    }
  }

  async function handleDelete(endpoint: string, successMessage: string, reset: () => void) {
    if (!window.confirm("Delete this item?")) {
      return;
    }

    try {
      await requestJson(endpoint, { method: "DELETE" });
      reset();
      setMessage(successMessage);
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete item.");
    }
  }

  const bestsellers = products.filter((product) => product.isBestseller).sort((a, b) => a.homeSortOrder - b.homeSortOrder);

  return (
    <div className="space-y-6">
      {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p> : null}
      {message ? <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600">{message}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading content dashboard...</p> : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Bestseller" description="Bestseller mahsulot tanlovi Product CRUD ichidagi flag va sort order orqali boshqariladi.">
          <div className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <div>
              <p className="text-sm font-semibold text-slate-950">Selected products</p>
              <p className="mt-1 text-sm text-slate-500">{bestsellers.length} ta mahsulot tanlangan.</p>
            </div>
            <Link href="/admin/products" className="admin-button-secondary">
              Open Products
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {bestsellers.map((product) => (
              <div key={product.id} className="admin-panel-muted flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{product.nameEn}</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{product.sku}</p>
                </div>
                <span className="admin-badge">#{product.homeSortOrder}</span>
              </div>
            ))}
            {bestsellers.length === 0 ? <p className="text-sm text-slate-500">No bestseller products yet.</p> : null}
          </div>
        </SectionCard>

        <SectionCard title="Site Settings" description="Top bar, footer va newsletter matnlari uchun global content.">
          {siteSettings ? (
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                void saveSingleton("/api/content/site-settings", siteSettings, "Site settings updated.");
              }}
            >
              <Field value={siteSettings.brandName} onChange={(value) => setSiteSettings((current) => (current ? { ...current, brandName: value } : current))} placeholder="Brand name" />
              <Field value={siteSettings.announcementLink} onChange={(value) => setSiteSettings((current) => (current ? { ...current, announcementLink: value } : current))} placeholder="Announcement link" />
              <Field value={siteSettings.announcementTextUz} onChange={(value) => setSiteSettings((current) => (current ? { ...current, announcementTextUz: value } : current))} placeholder="Announcement UZ" />
              <Field value={siteSettings.announcementTextRu} onChange={(value) => setSiteSettings((current) => (current ? { ...current, announcementTextRu: value } : current))} placeholder="Announcement RU" />
              <Field value={siteSettings.announcementTextEn} onChange={(value) => setSiteSettings((current) => (current ? { ...current, announcementTextEn: value } : current))} placeholder="Announcement EN" />
              <Field value={siteSettings.footerPhone} onChange={(value) => setSiteSettings((current) => (current ? { ...current, footerPhone: value } : current))} placeholder="Footer phone" />
              <Field value={siteSettings.footerEmail} onChange={(value) => setSiteSettings((current) => (current ? { ...current, footerEmail: value } : current))} placeholder="Footer email" />
              <Field value={siteSettings.footerInstagram} onChange={(value) => setSiteSettings((current) => (current ? { ...current, footerInstagram: value } : current))} placeholder="Instagram" />
              <Area value={siteSettings.footerAddressUz} onChange={(value) => setSiteSettings((current) => (current ? { ...current, footerAddressUz: value } : current))} placeholder="Footer address UZ" />
              <Area value={siteSettings.footerAddressRu} onChange={(value) => setSiteSettings((current) => (current ? { ...current, footerAddressRu: value } : current))} placeholder="Footer address RU" />
              <Area value={siteSettings.footerAddressEn} onChange={(value) => setSiteSettings((current) => (current ? { ...current, footerAddressEn: value } : current))} placeholder="Footer address EN" />
              <Field value={siteSettings.newsletterTitleRu} onChange={(value) => setSiteSettings((current) => (current ? { ...current, newsletterTitleRu: value } : current))} placeholder="Newsletter title RU" />
              <button type="submit" className="admin-button-primary md:col-span-2">
                Save site settings
              </button>
            </form>
          ) : null}
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Hero" description="Main page birinchi katta blok.">
          {hero ? (
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                void saveSingleton("/api/content/home-hero", hero, "Hero updated.");
              }}
            >
              <Field value={hero.badgeUz} onChange={(value) => setHero((current) => (current ? { ...current, badgeUz: value } : current))} placeholder="Badge UZ" />
              <Field value={hero.badgeRu} onChange={(value) => setHero((current) => (current ? { ...current, badgeRu: value } : current))} placeholder="Badge RU" />
              <Field value={hero.badgeEn} onChange={(value) => setHero((current) => (current ? { ...current, badgeEn: value } : current))} placeholder="Badge EN" />
              <Field value={hero.imageUrl} onChange={(value) => setHero((current) => (current ? { ...current, imageUrl: value } : current))} placeholder="Image URL" />
              <Field value={hero.titleUz} onChange={(value) => setHero((current) => (current ? { ...current, titleUz: value } : current))} placeholder="Title UZ" />
              <Field value={hero.titleRu} onChange={(value) => setHero((current) => (current ? { ...current, titleRu: value } : current))} placeholder="Title RU" />
              <Field value={hero.titleEn} onChange={(value) => setHero((current) => (current ? { ...current, titleEn: value } : current))} placeholder="Title EN" />
              <Field value={hero.primaryCtaLink} onChange={(value) => setHero((current) => (current ? { ...current, primaryCtaLink: value } : current))} placeholder="Primary link" />
              <Area value={hero.descriptionUz} onChange={(value) => setHero((current) => (current ? { ...current, descriptionUz: value } : current))} placeholder="Description UZ" />
              <Area value={hero.descriptionRu} onChange={(value) => setHero((current) => (current ? { ...current, descriptionRu: value } : current))} placeholder="Description RU" />
              <Area value={hero.descriptionEn} onChange={(value) => setHero((current) => (current ? { ...current, descriptionEn: value } : current))} placeholder="Description EN" />
              <Field value={hero.secondaryCtaLink} onChange={(value) => setHero((current) => (current ? { ...current, secondaryCtaLink: value } : current))} placeholder="Secondary link" />
              <Field value={hero.primaryCtaUz} onChange={(value) => setHero((current) => (current ? { ...current, primaryCtaUz: value } : current))} placeholder="Primary CTA UZ" />
              <Field value={hero.primaryCtaRu} onChange={(value) => setHero((current) => (current ? { ...current, primaryCtaRu: value } : current))} placeholder="Primary CTA RU" />
              <Field value={hero.primaryCtaEn} onChange={(value) => setHero((current) => (current ? { ...current, primaryCtaEn: value } : current))} placeholder="Primary CTA EN" />
              <button type="submit" className="admin-button-primary md:col-span-2">
                Save hero
              </button>
            </form>
          ) : null}
        </SectionCard>

        <SectionCard title="About" description="Brand story va product lineup bloki.">
          {about ? (
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                void saveSingleton("/api/content/home-about", about, "About updated.");
              }}
            >
              <Field value={about.titleUz} onChange={(value) => setAbout((current) => (current ? { ...current, titleUz: value } : current))} placeholder="Title UZ" />
              <Field value={about.titleRu} onChange={(value) => setAbout((current) => (current ? { ...current, titleRu: value } : current))} placeholder="Title RU" />
              <Field value={about.titleEn} onChange={(value) => setAbout((current) => (current ? { ...current, titleEn: value } : current))} placeholder="Title EN" />
              <Field value={about.imageUrl} onChange={(value) => setAbout((current) => (current ? { ...current, imageUrl: value } : current))} placeholder="Image URL" />
              <Area value={about.descriptionUz} onChange={(value) => setAbout((current) => (current ? { ...current, descriptionUz: value } : current))} placeholder="Description UZ" />
              <Area value={about.descriptionRu} onChange={(value) => setAbout((current) => (current ? { ...current, descriptionRu: value } : current))} placeholder="Description RU" />
              <Area value={about.descriptionEn} onChange={(value) => setAbout((current) => (current ? { ...current, descriptionEn: value } : current))} placeholder="Description EN" />
              <Field value={about.secondaryTitleRu} onChange={(value) => setAbout((current) => (current ? { ...current, secondaryTitleRu: value } : current))} placeholder="Secondary title RU" />
              <Area value={about.secondaryDescriptionRu} onChange={(value) => setAbout((current) => (current ? { ...current, secondaryDescriptionRu: value } : current))} placeholder="Secondary description RU" />
              <button type="submit" className="admin-button-primary md:col-span-2">
                Save about
              </button>
            </form>
          ) : null}
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[520px_1fr]">
        <SectionCard title="Promo Cards" description="Bestseller’dan keyingi editorial bannerlar.">
          <form onSubmit={handlePromoSubmit} className="grid gap-4 md:grid-cols-2">
            <Field value={promoForm.titleUz} onChange={(value) => setPromoForm((current) => ({ ...current, titleUz: value }))} placeholder="Title UZ" />
            <Field value={promoForm.titleRu} onChange={(value) => setPromoForm((current) => ({ ...current, titleRu: value }))} placeholder="Title RU" />
            <Field value={promoForm.titleEn} onChange={(value) => setPromoForm((current) => ({ ...current, titleEn: value }))} placeholder="Title EN" />
            <Field value={promoForm.imageUrl} onChange={(value) => setPromoForm((current) => ({ ...current, imageUrl: value }))} placeholder="Image URL" />
            <Area value={promoForm.descriptionUz} onChange={(value) => setPromoForm((current) => ({ ...current, descriptionUz: value }))} placeholder="Description UZ" />
            <Area value={promoForm.descriptionRu} onChange={(value) => setPromoForm((current) => ({ ...current, descriptionRu: value }))} placeholder="Description RU" />
            <Area value={promoForm.descriptionEn} onChange={(value) => setPromoForm((current) => ({ ...current, descriptionEn: value }))} placeholder="Description EN" />
            <Field value={promoForm.buttonLink} onChange={(value) => setPromoForm((current) => ({ ...current, buttonLink: value }))} placeholder="Button link" />
            <Field value={promoForm.buttonLabelUz} onChange={(value) => setPromoForm((current) => ({ ...current, buttonLabelUz: value }))} placeholder="Button UZ" />
            <Field value={promoForm.buttonLabelRu} onChange={(value) => setPromoForm((current) => ({ ...current, buttonLabelRu: value }))} placeholder="Button RU" />
            <Field value={promoForm.buttonLabelEn} onChange={(value) => setPromoForm((current) => ({ ...current, buttonLabelEn: value }))} placeholder="Button EN" />
            <Field value={String(promoForm.sortOrder)} onChange={(value) => setPromoForm((current) => ({ ...current, sortOrder: Number(value) || 0 }))} placeholder="Sort order" type="number" />
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 md:col-span-2">
              <input type="checkbox" checked={promoForm.active} onChange={(event) => setPromoForm((current) => ({ ...current, active: event.target.checked }))} />
              Active card
            </label>
            <button type="submit" className="admin-button-primary md:col-span-2">
              {editingPromoId ? "Update promo card" : "Create promo card"}
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Promo List" description="Joriy promo kartalar.">
          <div className="space-y-4">
            {promoCards.map((card) => (
              <article key={card.id} className="admin-panel-muted p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Promo #{card.sortOrder}</p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950">{card.titleRu}</h3>
                    <p className="mt-1 text-sm text-slate-500">{card.imageUrl || "No image"}</p>
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
                          sortOrder: card.sortOrder,
                          active: card.active
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-button-danger"
                      onClick={() => void handleDelete(`/api/content/home-promo-cards/${card.id}`, "Promo card deleted.", () => {
                        setEditingPromoId(null);
                        setPromoForm(emptyPromoForm);
                      })}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {promoCards.length === 0 ? <p className="text-sm text-slate-500">No promo cards yet.</p> : null}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[520px_1fr]">
        <SectionCard title="Gallery" description="IMAGE va VIDEO bitta modelda boshqariladi.">
          <form onSubmit={handleGallerySubmit} className="grid gap-4 md:grid-cols-2">
            <select className="admin-select" value={galleryForm.type} onChange={(event) => setGalleryForm((current) => ({ ...current, type: event.target.value as GalleryForm["type"] }))}>
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Video</option>
            </select>
            <Field value={galleryForm.imageUrl} onChange={(value) => setGalleryForm((current) => ({ ...current, imageUrl: value }))} placeholder="Cover image URL" />
            <Field value={galleryForm.videoUrl} onChange={(value) => setGalleryForm((current) => ({ ...current, videoUrl: value }))} placeholder="Video URL" />
            <Field value={String(galleryForm.sortOrder)} onChange={(value) => setGalleryForm((current) => ({ ...current, sortOrder: Number(value) || 0 }))} placeholder="Sort order" type="number" />
            <Field value={galleryForm.titleUz} onChange={(value) => setGalleryForm((current) => ({ ...current, titleUz: value }))} placeholder="Title UZ" />
            <Field value={galleryForm.titleRu} onChange={(value) => setGalleryForm((current) => ({ ...current, titleRu: value }))} placeholder="Title RU" />
            <Field value={galleryForm.titleEn} onChange={(value) => setGalleryForm((current) => ({ ...current, titleEn: value }))} placeholder="Title EN" />
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 md:col-span-2">
              <input type="checkbox" checked={galleryForm.active} onChange={(event) => setGalleryForm((current) => ({ ...current, active: event.target.checked }))} />
              Active item
            </label>
            <button type="submit" className="admin-button-primary md:col-span-2">
              {editingGalleryId ? "Update gallery item" : "Create gallery item"}
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Gallery List" description="Galereya va video preview elementlari.">
          <div className="space-y-4">
            {galleryItems.map((item) => (
              <article key={item.id} className="admin-panel-muted p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{item.type} #{item.sortOrder}</p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950">{item.titleRu || item.titleEn || "Untitled"}</h3>
                    <p className="mt-1 text-sm text-slate-500">{item.imageUrl}</p>
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
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-button-danger"
                      onClick={() => void handleDelete(`/api/content/gallery-items/${item.id}`, "Gallery item deleted.", () => {
                        setEditingGalleryId(null);
                        setGalleryForm(emptyGalleryForm);
                      })}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {galleryItems.length === 0 ? <p className="text-sm text-slate-500">No gallery items yet.</p> : null}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[520px_1fr]">
        <SectionCard title="Testimonials" description="Reviews section kartalari.">
          <form onSubmit={handleTestimonialSubmit} className="grid gap-4 md:grid-cols-2">
            <Field value={testimonialForm.authorName} onChange={(value) => setTestimonialForm((current) => ({ ...current, authorName: value }))} placeholder="Author name" />
            <Field value={testimonialForm.avatarUrl} onChange={(value) => setTestimonialForm((current) => ({ ...current, avatarUrl: value }))} placeholder="Avatar URL" />
            <Field value={testimonialForm.authorRoleUz} onChange={(value) => setTestimonialForm((current) => ({ ...current, authorRoleUz: value }))} placeholder="Role UZ" />
            <Field value={testimonialForm.authorRoleRu} onChange={(value) => setTestimonialForm((current) => ({ ...current, authorRoleRu: value }))} placeholder="Role RU" />
            <Field value={testimonialForm.authorRoleEn} onChange={(value) => setTestimonialForm((current) => ({ ...current, authorRoleEn: value }))} placeholder="Role EN" />
            <Field value={String(testimonialForm.rating)} onChange={(value) => setTestimonialForm((current) => ({ ...current, rating: Number(value) || 5 }))} placeholder="Rating" type="number" />
            <Field value={testimonialForm.productNameUz} onChange={(value) => setTestimonialForm((current) => ({ ...current, productNameUz: value }))} placeholder="Product UZ" />
            <Field value={testimonialForm.productNameRu} onChange={(value) => setTestimonialForm((current) => ({ ...current, productNameRu: value }))} placeholder="Product RU" />
            <Field value={testimonialForm.productNameEn} onChange={(value) => setTestimonialForm((current) => ({ ...current, productNameEn: value }))} placeholder="Product EN" />
            <Field value={String(testimonialForm.sortOrder)} onChange={(value) => setTestimonialForm((current) => ({ ...current, sortOrder: Number(value) || 0 }))} placeholder="Sort order" type="number" />
            <Area value={testimonialForm.bodyUz} onChange={(value) => setTestimonialForm((current) => ({ ...current, bodyUz: value }))} placeholder="Review UZ" />
            <Area value={testimonialForm.bodyRu} onChange={(value) => setTestimonialForm((current) => ({ ...current, bodyRu: value }))} placeholder="Review RU" />
            <Area value={testimonialForm.bodyEn} onChange={(value) => setTestimonialForm((current) => ({ ...current, bodyEn: value }))} placeholder="Review EN" />
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 md:col-span-2">
              <input type="checkbox" checked={testimonialForm.active} onChange={(event) => setTestimonialForm((current) => ({ ...current, active: event.target.checked }))} />
              Active review
            </label>
            <button type="submit" className="admin-button-primary md:col-span-2">
              {editingTestimonialId ? "Update testimonial" : "Create testimonial"}
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Testimonial List" description="Joriy otzivlar ro‘yxati.">
          <div className="space-y-4">
            {testimonials.map((item) => (
              <article key={item.id} className="admin-panel-muted p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Review #{item.sortOrder}</p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950">{item.authorName}</h3>
                    <p className="mt-1 text-sm text-slate-500">{item.productNameRu || item.productNameEn || "No product label"}</p>
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
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-button-danger"
                      onClick={() => void handleDelete(`/api/content/testimonials/${item.id}`, "Testimonial deleted.", () => {
                        setEditingTestimonialId(null);
                        setTestimonialForm(emptyTestimonialForm);
                      })}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {testimonials.length === 0 ? <p className="text-sm text-slate-500">No testimonials yet.</p> : null}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
