"use client";

import { useEffect, useState, type FormEvent } from "react";
import { type AdminSiteSettings, requestJson } from "@/components/admin/admin-types";

function Field({
  label,
  hint,
  value,
  placeholder,
  onChange
}: {
  label: string;
  hint?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-800">{label}</label>
      <input
        className="admin-input mt-2"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      {hint ? <p className="admin-form-hint">{hint}</p> : null}
    </div>
  );
}

function Area({
  label,
  hint,
  value,
  placeholder,
  onChange,
  rows = 4
}: {
  label: string;
  hint?: string;
  value: string;
  placeholder?: string;
  rows?: number;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-800">{label}</label>
      <textarea
        className="admin-input mt-2 min-h-[112px] resize-y"
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      {hint ? <p className="admin-form-hint">{hint}</p> : null}
    </div>
  );
}

function Section({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h4 className="text-lg font-semibold text-slate-950">{title}</h4>
        {description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function SettingsManager() {
  const [settings, setSettings] = useState<AdminSiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      setError(null);

      try {
        const payload = await requestJson<AdminSiteSettings>("/api/content/site-settings");
        setSettings(payload);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить настройки.");
      } finally {
        setLoading(false);
      }
    }

    void loadSettings();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!settings) {
      return;
    }

    setError(null);
    setMessage(null);

    try {
      await requestJson("/api/content/site-settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(settings)
      });

      setMessage("Настройки сохранены.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось сохранить настройки.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-[980px] space-y-6 px-2 pb-8">
      <section className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-slate-950">Глобальные настройки</h3>
            <p className="mt-2 max-w-[720px] text-sm leading-6 text-slate-500">
              Здесь управляются контакты витрины и общие ссылки, которые используются в футере и на странице «О нас».
            </p>
          </div>
        </div>

        <label className="admin-panel-muted mt-5 flex items-center gap-3 rounded-[16px] px-4 py-3 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={Boolean(settings?.hideCommerce)}
            onChange={(event) =>
              setSettings((current) => (current ? { ...current, hideCommerce: event.target.checked } : current))
            }
          />
          Включить скрытый режим
        </label>
        <p className="admin-form-hint">
          При включении этого режима на витрине скрываются цены, корзина и элементы оформления заказа.
        </p>
      </section>

      <Section title="Контакты и ссылки" description="Эти данные отображаются на странице «О нас», в футере и в связанных блоках витрины.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Номер телефона"
            value={settings?.footerPhone || ""}
            onChange={(value) => setSettings((current) => (current ? { ...current, footerPhone: value } : current))}
            placeholder="+998 90 123 45 67"
            hint="Используется для телефона, WhatsApp и ссылки `tel:`."
          />
          <Field
            label="Email"
            value={settings?.footerEmail || ""}
            onChange={(value) => setSettings((current) => (current ? { ...current, footerEmail: value } : current))}
            placeholder="modaily_cis@gmail.com"
            hint="Отображается в контактах и в футере."
          />
          <Field
            label="Подпись Telegram"
            value={settings?.footerTelegram || ""}
            onChange={(value) => setSettings((current) => (current ? { ...current, footerTelegram: value } : current))}
            placeholder="@modaily_cis"
          />
          <Field
            label="Ссылка Telegram"
            value={settings?.footerTelegramLink || ""}
            onChange={(value) =>
              setSettings((current) => (current ? { ...current, footerTelegramLink: value } : current))
            }
            placeholder="https://t.me/modaily_cis"
          />
          <Field
            label="Подпись Instagram"
            value={settings?.footerInstagram || ""}
            onChange={(value) => setSettings((current) => (current ? { ...current, footerInstagram: value } : current))}
            placeholder="@modaily_cis"
          />
          <Field
            label="Ссылка Instagram"
            value={settings?.footerInstagramLink || ""}
            onChange={(value) =>
              setSettings((current) => (current ? { ...current, footerInstagramLink: value } : current))
            }
            placeholder="https://instagram.com/modaily_cis"
          />
          <Field
            label="Ссылка на карту"
            value={settings?.storeMapLink || ""}
            onChange={(value) => setSettings((current) => (current ? { ...current, storeMapLink: value } : current))}
            placeholder="https://maps.google.com/..."
            hint="Карта для блока контактов на странице «О нас»."
          />
          <Area
            label="Адрес в футере UZ"
            value={settings?.footerAddressUz || ""}
            onChange={(value) => setSettings((current) => (current ? { ...current, footerAddressUz: value } : current))}
            rows={3}
            hint="Этот адрес используется и в футере, и в карточке магазина на странице «О нас»."
          />
          <Area
            label="Адрес в футере RU"
            value={settings?.footerAddressRu || ""}
            onChange={(value) => setSettings((current) => (current ? { ...current, footerAddressRu: value } : current))}
            rows={3}
            hint="Этот адрес используется и в футере, и в карточке магазина на странице «О нас»."
          />
          <Area
            label="Адрес в футере EN"
            value={settings?.footerAddressEn || ""}
            onChange={(value) => setSettings((current) => (current ? { ...current, footerAddressEn: value } : current))}
            rows={3}
            hint="Этот адрес используется и в футере, и в карточке магазина на странице «О нас»."
          />
        </div>
      </Section>

      {loading ? <p className="text-sm text-slate-500">Загружаем настройки...</p> : null}
      {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
      {message ? <p className="text-sm font-semibold text-emerald-600">{message}</p> : null}

      <button type="submit" className="admin-button-primary w-full max-w-[320px]" disabled={!settings}>
        Сохранить
      </button>
    </form>
  );
}
