"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

import { type AdminShopLocation, requestJson } from "@/components/admin/admin-types";

type WorkingHourFormState = {
  id?: string;
  label: string;
  value: string;
  sortOrder: number;
};

type ShopFormState = {
  id?: string;
  address: string;
  mapLink: string;
  active: boolean;
  sortOrder: number;
  workingHours: WorkingHourFormState[];
};

function formatUpdatedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Без даты";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function emptyForm(nextSortOrder = 0): ShopFormState {
  return {
    address: "",
    mapLink: "",
    active: true,
    sortOrder: nextSortOrder,
    workingHours: [
      {
        label: "",
        value: "",
        sortOrder: 0
      }
    ]
  };
}

function buildForm(location: AdminShopLocation): ShopFormState {
  return {
    id: location.id,
    address: location.address,
    mapLink: location.mapLink || "",
    active: location.active,
    sortOrder: location.sortOrder,
    workingHours: location.workingHours.length
      ? location.workingHours.map((entry, index) => ({
          id: entry.id,
          label: entry.label || "",
          value: entry.value,
          sortOrder: index
        }))
      : [
          {
            label: "",
            value: "",
            sortOrder: 0
          }
        ]
  };
}

function normalizeHours(hours: WorkingHourFormState[]) {
  return hours.map((hour, index) => ({
    ...hour,
    sortOrder: index
  }));
}

export function ShopManager() {
  const [locations, setLocations] = useState<AdminShopLocation[]>([]);
  const [selectedId, setSelectedId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<ShopFormState>(() => emptyForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedLocation = useMemo(
    () => (selectedId && selectedId !== "new" ? locations.find((entry) => entry.id === selectedId) || null : null),
    [locations, selectedId]
  );
  const editorOpen = selectedId !== null;

  useEffect(() => {
    let active = true;

    async function loadLocations() {
      setLoading(true);
      setError(null);

      try {
        const payload = await requestJson<AdminShopLocation[]>("/api/shop-locations");

        if (!active) {
          return;
        }

        setLocations(payload);
        setSelectedId(null);
        setForm(emptyForm(payload.length));
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить точки продаж.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadLocations();

    return () => {
      active = false;
    };
  }, []);

  function startCreate() {
    setSelectedId("new");
    setError(null);
    setMessage(null);
    setForm(emptyForm(locations.length));
  }

  function selectLocation(location: AdminShopLocation) {
    setSelectedId(location.id);
    setError(null);
    setMessage(null);
    setForm(buildForm(location));
  }

  function closeEditor() {
    setSelectedId(null);
    setError(null);
    setMessage(null);
    setForm(emptyForm(locations.length));
  }

  function updateHour(index: number, patch: Partial<WorkingHourFormState>) {
    setForm((current) => ({
      ...current,
      workingHours: current.workingHours.map((hour, hourIndex) =>
        hourIndex === index ? { ...hour, ...patch } : hour
      )
    }));
  }

  function addHour() {
    setForm((current) => ({
      ...current,
      workingHours: [
        ...current.workingHours,
        {
          label: "",
          value: "",
          sortOrder: current.workingHours.length
        }
      ]
    }));
  }

  function removeHour(index: number) {
    setForm((current) => {
      const nextHours = current.workingHours.filter((_, hourIndex) => hourIndex !== index);

      return {
        ...current,
        workingHours: normalizeHours(
          nextHours.length
            ? nextHours
            : [
                {
                  label: "",
                  value: "",
                  sortOrder: 0
                }
              ]
        )
      };
    });
  }

  function moveHour(index: number, direction: -1 | 1) {
    setForm((current) => {
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= current.workingHours.length) {
        return current;
      }

      const nextHours = [...current.workingHours];
      const [moved] = nextHours.splice(index, 1);
      nextHours.splice(nextIndex, 0, moved);

      return {
        ...current,
        workingHours: normalizeHours(nextHours)
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const payload = {
        address: form.address,
        mapLink: form.mapLink,
        active: form.active,
        sortOrder: form.sortOrder,
        workingHours: normalizeHours(form.workingHours)
      };

      const nextLocation = await requestJson<AdminShopLocation>(
        form.id ? `/api/shop-locations/${form.id}` : "/api/shop-locations",
        {
          method: form.id ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      setLocations((current) => {
        const next = form.id
          ? current.map((entry) => (entry.id === nextLocation.id ? nextLocation : entry))
          : [...current, nextLocation];

        return [...next].sort((left, right) => {
          if (left.sortOrder !== right.sortOrder) {
            return left.sortOrder - right.sortOrder;
          }

          return left.createdAt.localeCompare(right.createdAt);
        });
      });

      setSelectedId(nextLocation.id);
      setForm(buildForm(nextLocation));
      setMessage(form.id ? "Точка продаж обновлена." : "Точка продаж добавлена.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось сохранить точку продаж.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!form.id) {
      startCreate();
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await requestJson<{ success: true }>(`/api/shop-locations/${form.id}`, {
        method: "DELETE"
      });

      const nextLocations = locations.filter((entry) => entry.id !== form.id);
      setLocations(nextLocations);
      setSelectedId(null);
      setForm(emptyForm(nextLocations.length));

      setMessage("Точка продаж удалена.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Не удалось удалить точку продаж.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="min-h-screen bg-[#f7f9fc] px-5 py-6 lg:px-8 lg:py-8">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[1.75rem] border border-[#e3eaf4] bg-white shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-5 border-b border-[#e8eef7] px-5 py-5 lg:flex-row lg:items-start lg:justify-between lg:px-6">
            <div className="max-w-3xl">
              <h2 className="text-[2.05rem] font-semibold tracking-tight text-slate-950">Точки продаж</h2>
              <p className="mt-2.5 text-sm leading-7 text-slate-500">
                Управляйте адресами, картами и временем работы для глобального overlay блока «Где купить».
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-[#f3f6fb] px-4 text-sm font-semibold text-slate-500">
                {locations.length}
              </span>
              <button type="button" className="admin-button-primary h-12 px-5" onClick={startCreate}>
                + Добавить точку
              </button>
            </div>
          </div>

          <div className="hidden items-center gap-4 border-b border-[#eef2f7] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 lg:grid lg:grid-cols-[minmax(0,1.8fr)_180px_180px_140px]">
            <span>Адрес</span>
            <span>Время работы</span>
            <span>Обновлено</span>
            <span className="text-right">Действие</span>
          </div>

          <div className="max-h-[calc(100vh-19rem)] overflow-y-auto">
            {loading ? <div className="px-6 py-12 text-sm text-slate-500">Загружаем точки продаж...</div> : null}

            {!loading && locations.length === 0 ? (
              <div className="px-6 py-12 text-sm leading-6 text-slate-500">
                Пока нет ни одной точки продаж. Нажмите «Добавить точку», чтобы открыть форму и создать первую локацию.
              </div>
            ) : null}

            {!loading
              ? locations.map((location) => {
                  const active = selectedId === location.id;

                  return (
                    <div
                      key={location.id}
                      className={`border-b border-[#eef2f7] px-6 py-5 transition last:border-b-0 ${
                        active ? "bg-[#f7f9ff]" : "hover:bg-slate-50/70"
                      }`}
                    >
                      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_180px_180px_140px] lg:items-start">
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-[1rem] font-semibold text-slate-900">{location.address}</p>
                          <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                            Sort order: {location.sortOrder}
                          </p>
                        </div>

                        <div className="text-sm text-slate-600">
                          {location.workingHours.length > 0 ? (
                            <div className="space-y-1.5">
                              {location.workingHours.slice(0, 2).map((hour) => (
                                <p key={hour.id} className="leading-6">
                                  <span className="font-medium text-slate-700">{hour.label || "Время"}</span>
                                  <span className="mx-1.5 text-slate-300">•</span>
                                  <span>{hour.value}</span>
                                </p>
                              ))}
                              {location.workingHours.length > 2 ? (
                                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                                  +{location.workingHours.length - 2} строк(и)
                                </p>
                              ) : null}
                            </div>
                          ) : (
                            <span className="text-slate-400">Не указано</span>
                          )}
                        </div>

                        <p className="text-sm text-slate-500">{formatUpdatedAt(location.updatedAt)}</p>

                        <div className="flex items-center justify-between gap-3 lg:justify-end">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              location.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {location.active ? "Активно" : "Скрыто"}
                          </span>

                          <button
                            type="button"
                            onClick={() => selectLocation(location)}
                            className="inline-flex h-10 items-center rounded-xl border border-[#dfe7f2] px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                          >
                            Изменить
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </section>

        {message ? (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        ) : null}

        {editorOpen ? (
          <form
            onSubmit={handleSubmit}
            className="rounded-[1.75rem] border border-[#e3eaf4] bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.05)] lg:p-6"
          >
          <div className="flex flex-col gap-4 border-b border-[#ebf0f7] pb-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                {selectedId === "new" || !selectedLocation ? "Новая локация" : "Редактор локации"}
              </p>
              <h3 className="mt-2 text-[1.8rem] font-semibold tracking-tight text-slate-950">
                {selectedId === "new" || !selectedLocation ? "Добавить точку продаж" : "Параметры точки продаж"}
              </h3>
              <p className="mt-2 max-w-[720px] text-sm leading-6 text-slate-500">
                Заполните адрес, ссылку на карту и строки графика работы. Эти данные показываются пользователю в overlay.
              </p>
            </div>

            {selectedLocation ? (
              <div className="rounded-2xl border border-[#e6ebf5] bg-[#fafcff] px-4 py-3 text-sm text-slate-500">
                Обновлено: {formatUpdatedAt(selectedLocation.updatedAt)}
              </div>
            ) : null}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.7fr)_minmax(300px,0.3fr)]">
            <div className="space-y-6">
              <section className="rounded-[1.5rem] border border-[#e9eef7] bg-[#fcfdff] p-5">
                <div className="grid gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800">Адрес магазина</label>
                    <textarea
                      className="admin-textarea mt-2 min-h-[112px]"
                      value={form.address}
                      onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                      placeholder="г. Ташкент, Яшнабадский район, улица Умурбод, дом 5"
                    />
                    <p className="admin-form-hint">Основной текст карточки магазина в overlay и в админ-списке.</p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_140px]">
                    <div>
                      <label className="block text-sm font-semibold text-slate-800">Ссылка на карту</label>
                      <input
                        className="admin-input mt-2"
                        value={form.mapLink}
                        onChange={(event) => setForm((current) => ({ ...current, mapLink: event.target.value }))}
                        placeholder="https://maps.google.com/..."
                      />
                      <p className="admin-form-hint">Кнопка «Открыть карту» в overlay будет вести на эту ссылку.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800">Sort order</label>
                      <input
                        type="number"
                        className="admin-input mt-2"
                        value={form.sortOrder}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, sortOrder: Number(event.target.value) || 0 }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-[#e9eef7] bg-[#fcfdff] p-5">
                <div className="flex flex-col gap-4 border-b border-[#ebf0f7] pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-950">Время работы</h4>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Добавляйте строки в удобном порядке. Например: «Пн–Пт» и «10:00–20:00».
                    </p>
                  </div>

                  <button type="button" className="admin-button-secondary" onClick={addHour}>
                    + Добавить строку
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  {form.workingHours.map((hour, index) => (
                    <div
                      key={hour.id || `hour-${index}`}
                      className="overflow-hidden rounded-[1.35rem] border border-[#e6ebf5] bg-white shadow-[0_10px_24px_rgba(148,163,184,0.06)]"
                    >
                      <div className="flex flex-col gap-4 border-b border-[#edf2f8] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                            Строка {String(index + 1).padStart(2, "0")}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Пример: <span className="font-medium text-slate-700">Пн–Пт</span> /{" "}
                            <span className="font-medium text-slate-700">10:00–20:00</span>
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="admin-button-secondary h-10 min-w-10 px-3 disabled:cursor-not-allowed disabled:opacity-45"
                            onClick={() => moveHour(index, -1)}
                            disabled={index === 0}
                            aria-label="Переместить выше"
                            title="Переместить выше"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className="admin-button-secondary h-10 min-w-10 px-3 disabled:cursor-not-allowed disabled:opacity-45"
                            onClick={() => moveHour(index, 1)}
                            disabled={index === form.workingHours.length - 1}
                            aria-label="Переместить ниже"
                            title="Переместить ниже"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            className="inline-flex h-10 min-w-10 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 px-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                            onClick={() => removeHour(index)}
                            aria-label="Удалить строку"
                            title="Удалить строку"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-4 px-4 py-4 lg:grid-cols-[220px_minmax(0,1fr)]">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700">Период</label>
                          <input
                            className="admin-input mt-2 h-11"
                            value={hour.label}
                            onChange={(event) => updateHour(index, { label: event.target.value })}
                            placeholder="Пн–Пт"
                          />
                          <p className="admin-form-hint">Короткая подпись для дня или диапазона.</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700">Время работы</label>
                          <input
                            className="admin-input mt-2 h-11"
                            value={hour.value}
                            onChange={(event) => updateHour(index, { value: event.target.value })}
                            placeholder="10:00–20:00"
                          />
                          <p className="admin-form-hint">Основное значение, которое увидит пользователь в overlay.</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-[1.5rem] border border-[#e9eef7] bg-[#fcfdff] p-5">
                <h4 className="text-base font-semibold text-slate-950">Сводка точки</h4>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="rounded-2xl border border-[#e6ebf5] bg-white px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Статус</p>
                    <p className="mt-2 font-medium text-slate-900">{form.active ? "Активна на витрине" : "Скрыта"}</p>
                  </div>
                  <div className="rounded-2xl border border-[#e6ebf5] bg-white px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Адрес</p>
                    <p className="mt-2 leading-6 text-slate-700">{form.address || "Пока не заполнен"}</p>
                  </div>
                  <div className="rounded-2xl border border-[#e6ebf5] bg-white px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Строки графика</p>
                    <p className="mt-2 font-medium text-slate-900">{form.workingHours.filter((item) => item.value.trim()).length}</p>
                  </div>
                  <div className="rounded-2xl border border-[#e6ebf5] bg-white px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Map link</p>
                    <p className="mt-2 break-all leading-6 text-slate-700">{form.mapLink || "Не указан"}</p>
                  </div>
                </div>

                <label className="mt-5 flex items-center gap-3 rounded-2xl border border-[#e6ebf5] bg-white px-4 py-3 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))}
                  />
                  Показывать в overlay
                </label>
              </section>

              <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
                <button type="submit" className="admin-button-primary h-12 flex-1" disabled={saving}>
                  {saving ? "Сохраняем..." : form.id ? "Сохранить изменения" : "Создать точку"}
                </button>

                <button type="button" className="admin-button-secondary h-12 flex-1" onClick={closeEditor} disabled={saving}>
                  Закрыть форму
                </button>

                <button type="button" className="admin-button-danger h-12 flex-1" onClick={handleDelete} disabled={saving}>
                  {form.id ? "Удалить" : "Очистить форму"}
                </button>
              </div>
            </aside>
          </div>
          </form>
        ) : null}
      </div>
    </section>
  );
}
