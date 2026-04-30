"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { type AdminReview, requestJson } from "@/components/admin/admin-types";

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

function EmptyReviewList({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center px-6 py-16 text-center">
      <div className="max-w-sm space-y-2">
        <p className="text-lg font-semibold text-slate-900">
          {searchQuery ? "Отзывы не найдены" : "Отзывов пока нет"}
        </p>
        <p className="text-sm leading-6 text-slate-500">
          {searchQuery
            ? "Измените запрос, чтобы увидеть нужный отзыв."
            : "Новые отзывы с карточек товаров появятся здесь автоматически."}
        </p>
      </div>
    </div>
  );
}

export function ReviewListManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const searchValue = searchParams.get("q") || "";
  const searchQuery = searchValue.trim().toLowerCase();

  const filteredReviews = useMemo(() => {
    if (!searchQuery) {
      return reviews;
    }

    return reviews.filter((review) =>
      [review.productName, review.phoneNumber, review.text]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery)
    );
  }, [reviews, searchQuery]);

  useEffect(() => {
    let active = true;

    async function loadReviews() {
      setLoading(true);
      setError(null);

      try {
        const payload = await requestJson<AdminReview[]>("/api/admin/reviews");

        if (active) {
          setReviews(payload);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить отзывы.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadReviews();

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

  async function deleteReview(review: AdminReview) {
    const confirmed = window.confirm(`Удалить отзыв к товару "${review.productName}"?`);

    if (!confirmed || deletingId) {
      return;
    }

    setDeletingId(review.id);
    setError(null);

    try {
      await requestJson(`/api/admin/reviews/${review.id}`, { method: "DELETE" });
      setReviews((current) => current.filter((entry) => entry.id !== review.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Не удалось удалить отзыв.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="min-h-screen bg-[#f7f9fc] px-5 py-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-5 border-b border-[#e3eaf4] pb-7 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <h2 className="text-[2.15rem] font-semibold tracking-tight text-slate-950">Отзывы</h2>
          <p className="mt-2.5 text-base leading-7 text-slate-500">
            Просматривайте отзывы покупателей и удаляйте неактуальные записи.
          </p>
        </div>

        <span className="inline-flex h-11 items-center rounded-full bg-white px-4 text-sm font-semibold text-slate-500 shadow-[0_10px_22px_rgba(15,23,42,0.05)]">
          {filteredReviews.length}
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
              aria-label="Поиск отзывов"
              placeholder="Поиск по товару, номеру или тексту..."
              value={searchValue}
              onChange={(event) => updateSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="hidden items-center gap-4 border-b border-[#eef2f7] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 lg:grid lg:grid-cols-[180px_220px_180px_minmax(0,1fr)_140px] lg:px-8">
          <span>Дата</span>
          <span>Товар</span>
          <span>Телефон</span>
          <span>Отзыв</span>
          <span className="text-right">Действие</span>
        </div>

        <div className="max-h-[calc(100vh-13rem)] overflow-y-auto">
          {loading ? <div className="px-6 py-12 text-sm text-slate-500 lg:px-8">Загружаем отзывы...</div> : null}
          {!loading && error ? <div className="px-6 py-12 text-sm font-medium text-red-600 lg:px-8">{error}</div> : null}
          {!loading && !error && filteredReviews.length === 0 ? <EmptyReviewList searchQuery={searchQuery} /> : null}

          {!loading && !error
            ? filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-[#eef2f7] px-6 py-5 transition last:border-b-0 hover:bg-slate-50/60 lg:px-8"
                >
                  <div className="grid gap-3 lg:grid-cols-[180px_220px_180px_minmax(0,1fr)_140px] lg:items-start">
                    <p className="text-sm text-slate-500">{formatReceivedAt(review.createdAt)}</p>
                    <p className="min-w-0 truncate text-[1.05rem] font-semibold text-slate-950">{review.productName}</p>
                    <p className="truncate text-sm text-slate-600">{review.phoneNumber || "Без номера"}</p>
                    <p className="text-sm leading-6 text-slate-600">{review.text}</p>

                    <div className="flex lg:justify-end">
                      <button
                        type="button"
                        className="inline-flex h-10 items-center rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                        disabled={deletingId === review.id}
                        onClick={() => void deleteReview(review)}
                      >
                        {deletingId === review.id ? "Удаляем..." : "Удалить"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </section>
  );
}
