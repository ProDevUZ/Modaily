"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { type AdminContactMessage, requestJson } from "@/components/admin/admin-types";

function formatReceivedAt(value: string) {
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

function getPhoneHref(phone: string) {
  const normalized = phone.trim().replace(/[^+\d]/g, "");
  return normalized ? `tel:${normalized}` : "";
}

function EmptyMessageList({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center px-6 py-16 text-center">
      <div className="max-w-sm space-y-2">
        <p className="text-lg font-semibold text-slate-900">
          {searchQuery ? "Сообщения не найдены" : "Сообщений пока нет"}
        </p>
        <p className="text-sm leading-6 text-slate-500">
          {searchQuery
            ? "Измените запрос, чтобы увидеть нужное обращение."
            : "Новые обращения с формы «О нас» появятся здесь автоматически."}
        </p>
      </div>
    </div>
  );
}

export function MessageListManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchValue = searchParams.get("q") || "";
  const searchQuery = searchValue.trim().toLowerCase();

  const filteredMessages = useMemo(() => {
    if (!searchQuery) {
      return messages;
    }

    return messages.filter((message) =>
      [message.fullName, message.phone, message.message]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery)
    );
  }, [messages, searchQuery]);

  useEffect(() => {
    let active = true;

    async function loadMessages() {
      setLoading(true);
      setError(null);

      try {
        const payload = await requestJson<AdminContactMessage[]>("/api/messages");

        if (active) {
          setMessages(payload);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить сообщения.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadMessages();

    return () => {
      active = false;
    };
  }, []);

  function updateSearch(value: string) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      nextParams.set("q", value);
    } else {
      nextParams.delete("q");
    }

    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }

  return (
    <section className="min-h-screen bg-[#f7f9fc] px-5 py-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-5 border-b border-[#e3eaf4] pb-7 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <h2 className="text-[2.15rem] font-semibold tracking-tight text-slate-950">Сообщения</h2>
          <p className="mt-2.5 text-base leading-7 text-slate-500">
            Здесь собираются обращения, которые пользователи отправляют с формы на странице «О нас».
          </p>
        </div>

        <span className="inline-flex h-11 items-center rounded-full bg-white px-4 text-sm font-semibold text-slate-500 shadow-[0_10px_22px_rgba(15,23,42,0.05)]">
          {filteredMessages.length}
        </span>
      </div>

      <div className="mt-7 overflow-hidden rounded-[1.75rem] border border-[#e3eaf4] bg-white shadow-[0_22px_52px_rgba(15,23,42,0.05)]">
        <div className="border-b border-[#e8eef7] p-4 lg:p-5">
          <div className="relative max-w-[420px]">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-300">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            <input
              className="admin-input h-12 bg-white pl-12"
              aria-label="Поиск сообщений"
              placeholder="Поиск по имени, номеру или тексту..."
              value={searchValue}
              onChange={(event) => updateSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="hidden items-center gap-4 border-b border-[#eef2f7] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 lg:grid lg:grid-cols-[220px_180px_minmax(0,1fr)_180px_140px] lg:px-8">
          <span>Имя</span>
          <span>Телефон</span>
          <span>Сообщение</span>
          <span>Получено</span>
          <span className="text-right">Действие</span>
        </div>

        <div className="max-h-[calc(100vh-13rem)] overflow-y-auto">
          {loading ? <div className="px-6 py-12 text-sm text-slate-500 lg:px-8">Загружаем сообщения...</div> : null}
          {!loading && error ? <div className="px-6 py-12 text-sm font-medium text-red-600 lg:px-8">{error}</div> : null}
          {!loading && !error && filteredMessages.length === 0 ? <EmptyMessageList searchQuery={searchQuery} /> : null}

          {!loading && !error
            ? filteredMessages.map((message) => {
                const phoneHref = getPhoneHref(message.phone);

                return (
                  <div
                    key={message.id}
                    className="border-b border-[#eef2f7] px-6 py-5 transition last:border-b-0 hover:bg-slate-50/60 lg:px-8"
                  >
                    <div className="grid gap-3 lg:grid-cols-[220px_180px_minmax(0,1fr)_180px_140px] lg:items-start">
                      <div className="min-w-0">
                        <p className="truncate text-[1.05rem] font-semibold text-slate-950">{message.fullName}</p>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                          Заявка с формы About us
                        </p>
                      </div>

                      <p className="truncate text-sm text-slate-600">{message.phone}</p>

                      <p className="text-sm leading-6 text-slate-600">
                        {message.message || "Без текста сообщения"}
                      </p>

                      <p className="text-sm text-slate-500">{formatReceivedAt(message.createdAt)}</p>

                      <div className="flex lg:justify-end">
                        {phoneHref ? (
                          <a
                            href={phoneHref}
                            className="inline-flex h-10 items-center rounded-xl border border-[#dfe7f2] px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                          >
                            Позвонить
                          </a>
                        ) : (
                          <span className="inline-flex h-10 items-center text-sm text-slate-300">Нет номера</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </section>
  );
}
