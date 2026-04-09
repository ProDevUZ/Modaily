"use client";

import { useEffect, useState, type FormEvent } from "react";

import { type AdminSiteSettings, requestJson } from "@/components/admin/admin-types";

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
        setError(loadError instanceof Error ? loadError.message : "Nastroykalarni yuklab bo'lmadi.");
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

      setMessage("Nastroykalar saqlandi.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Nastroykalarni saqlab bo'lmadi.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-panel max-w-[620px] p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-2xl font-semibold text-slate-950">Global nastroykalar</h3>
      </div>

      <div className="mt-5 space-y-4">
        <label className="admin-panel-muted flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={Boolean(settings?.hideCommerce)}
            onChange={(event) =>
              setSettings((current) => (current ? { ...current, hideCommerce: event.target.checked } : current))
            }
          />
          Hidden mode yoqilsin
        </label>
        <p className="admin-form-hint">
          Bu yoqilsa vitrineda narx, savatcha va buyurtma elementlari yashiriladi.
        </p>

        <div>
          <label className="block text-sm font-semibold text-slate-800">Telefon raqami</label>
          <input
            className="admin-input mt-2"
            value={settings?.footerPhone || ""}
            onChange={(event) =>
              setSettings((current) => (current ? { ...current, footerPhone: event.target.value } : current))
            }
            placeholder="+998 90 123 45 67"
          />
          <p className="admin-form-hint">Footer ichidagi telefon va tel ssilka uchun ishlatiladi.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800">Instagram nomi</label>
          <input
            className="admin-input mt-2"
            value={settings?.footerInstagram || ""}
            onChange={(event) =>
              setSettings((current) => (current ? { ...current, footerInstagram: event.target.value } : current))
            }
            placeholder="@modaily_cis"
          />
          <p className="admin-form-hint">Footer ichida ko'rinadigan Instagram nomi.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800">Instagram ssilka</label>
          <input
            className="admin-input mt-2"
            value={settings?.footerInstagramLink || ""}
            onChange={(event) =>
              setSettings((current) =>
                current ? { ...current, footerInstagramLink: event.target.value } : current
              )
            }
            placeholder="https://instagram.com/modaily_cis"
          />
          <p className="admin-form-hint">Instagram ikon bosilganda shu ssilka ochiladi.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800">Telegram nomi</label>
          <input
            className="admin-input mt-2"
            value={settings?.footerTelegram || ""}
            onChange={(event) =>
              setSettings((current) => (current ? { ...current, footerTelegram: event.target.value } : current))
            }
            placeholder="@modaily_cis"
          />
          <p className="admin-form-hint">Footer ichida ko'rinadigan Telegram nomi.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800">Telegram ssilka</label>
          <input
            className="admin-input mt-2"
            value={settings?.footerTelegramLink || ""}
            onChange={(event) =>
              setSettings((current) =>
                current ? { ...current, footerTelegramLink: event.target.value } : current
              )
            }
            placeholder="https://t.me/modaily_cis"
          />
          <p className="admin-form-hint">Telegram ikon bosilganda shu ssilka ochiladi.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800">Do'kon manzili</label>
          <input
            className="admin-input mt-2"
            value={settings?.storeAddress || ""}
            onChange={(event) =>
              setSettings((current) => (current ? { ...current, storeAddress: event.target.value } : current))
            }
            placeholder="Yunusobod, Toshkent, ko'cha va uy raqam"
          />
          <p className="admin-form-hint">Flagship store sahifasida ko'rinadigan ko'cha nomi va uy raqam.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800">Map ssilka</label>
          <input
            className="admin-input mt-2"
            value={settings?.storeMapLink || ""}
            onChange={(event) =>
              setSettings((current) => (current ? { ...current, storeMapLink: event.target.value } : current))
            }
            placeholder="https://maps.google.com/..."
          />
          <p className="admin-form-hint">Otkryt v karte tugmasi shu ssilkani ochadi.</p>
        </div>
      </div>

      {loading ? <p className="mt-4 text-sm text-slate-500">Nastroykalar yuklanmoqda...</p> : null}
      {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}
      {message ? <p className="mt-4 text-sm font-semibold text-emerald-600">{message}</p> : null}

      <button type="submit" className="admin-button-primary mt-6 w-full" disabled={!settings}>
        Saqlash
      </button>
    </form>
  );
}
