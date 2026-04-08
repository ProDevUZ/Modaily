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
        setError(loadError instanceof Error ? loadError.message : "Could not load settings.");
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
        body: JSON.stringify({
          ...settings
        })
      });

      setMessage("Settings updated.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save settings.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-panel max-w-[560px] p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-2xl font-semibold text-slate-950">Глобальные настройки</h3>
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
          Скрыть цены и оформление заказа
        </label>
        <p className="admin-form-hint">Скрывает цены, корзину и действия оформления заказа на всей витрине.</p>
      </div>

      {loading ? <p className="mt-4 text-sm text-slate-500">Загрузка настроек...</p> : null}
      {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}
      {message ? <p className="mt-4 text-sm font-semibold text-emerald-600">{message}</p> : null}

      <button type="submit" className="admin-button-primary mt-6 w-full" disabled={!settings}>
        Сохранить настройки
      </button>
    </form>
  );
}
