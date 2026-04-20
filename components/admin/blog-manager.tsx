"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { type AdminBlogPost, requestJson } from "@/components/admin/admin-types";

const STATUS_MESSAGE: Record<string, string> = {
  created: "Пост создан.",
  updated: "Изменения сохранены.",
  deleted: "Пост удален."
};

function formatPublishDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Без даты";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function FeaturedBadge({ featured }: { featured: boolean }) {
  return (
    <span
      className={`inline-flex min-w-[92px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${
        featured ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      {featured ? "Да" : "Нет"}
    </span>
  );
}

function CoverThumbnail({ post }: { post: AdminBlogPost }) {
  if (post.coverImage) {
    return (
      <div
        className="h-14 w-14 rounded-2xl border border-[#e7edf7] bg-slate-50 bg-cover bg-center"
        style={{ backgroundImage: `url(${post.coverImage})` }}
      />
    );
  }

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e7edf7] bg-[#f8fafc] text-[0.78rem] font-medium text-slate-300">
      Img
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  children,
  ariaLabel
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  ariaLabel: string;
}) {
  return (
    <div className="relative">
      <select
        className="admin-select h-12 appearance-none bg-white pr-11 text-sm text-slate-700"
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-300">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}

function EmptyBlogList({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center px-6 py-16 text-center">
      <div className="max-w-sm space-y-2">
        <p className="text-lg font-semibold text-slate-900">
          {hasFilters ? "Посты не найдены" : "Список постов пока пуст"}
        </p>
        <p className="text-sm leading-6 text-slate-500">
          {hasFilters
            ? "Измените поисковый запрос или фильтры, чтобы увидеть нужные публикации."
            : "Создайте первый пост через кнопку в правом верхнем углу."}
        </p>
      </div>
    </div>
  );
}

export function BlogListManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchValue = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category") || "";
  const featuredFilter = searchParams.get("featured") || "";
  const searchQuery = searchValue.trim().toLowerCase();
  const statusMessage = STATUS_MESSAGE[searchParams.get("status") || ""] || null;

  const categoryOptions = useMemo(() => {
    return Array.from(new Set(posts.map((post) => post.category).filter(Boolean))).sort((left, right) =>
      left.localeCompare(right, "ru")
    );
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !searchQuery ||
        [
          post.cardTitle,
          post.excerpt,
          post.category,
          post.slug,
          post.mainTitle,
          post.seoTitle,
          post.metaDescription
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery);

      const matchesCategory = !categoryFilter || post.category === categoryFilter;
      const matchesFeatured =
        !featuredFilter ||
        (featuredFilter === "featured" ? post.featured : !post.featured);

      return matchesSearch && matchesCategory && matchesFeatured;
    });
  }, [posts, searchQuery, categoryFilter, featuredFilter]);

  const hasFilters = Boolean(searchValue || categoryFilter || featuredFilter);

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      setLoading(true);
      setError(null);

      try {
        const payload = await requestJson<AdminBlogPost[]>("/api/content/blog-posts");

        if (active) {
          setPosts(payload);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить список постов.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPosts();

    return () => {
      active = false;
    };
  }, []);

  function updateFilterParam(key: string, value: string) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    nextParams.delete("status");
    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }

  function resetFilters() {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("q");
    nextParams.delete("category");
    nextParams.delete("featured");
    nextParams.delete("status");
    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }

  return (
    <section className="min-h-screen bg-[#f7f9fc] px-5 py-6 lg:px-8 lg:py-8">
      {statusMessage ? (
        <div className="mb-6 rounded-[1.25rem] border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
          {statusMessage}
        </div>
      ) : null}

      <div className="flex flex-col gap-5 border-b border-[#e3eaf4] pb-7 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <h2 className="text-[2.15rem] font-semibold tracking-tight text-slate-950">Блог</h2>
          <p className="mt-2.5 text-base leading-7 text-slate-500">
            Управляйте списком новостей и статей, чтобы быстро находить и редактировать публикации.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-500 shadow-[0_10px_22px_rgba(15,23,42,0.05)]">
            {filteredPosts.length}
          </span>
          <Link
            href="/admin123/blog/new"
            className="inline-flex h-[52px] items-center gap-3 rounded-[1.25rem] bg-[#0f172a] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(15,23,42,0.18)] transition hover:bg-[#111c32]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 5v14" strokeLinecap="round" />
              <path d="M5 12h14" strokeLinecap="round" />
            </svg>
            Add Post
          </Link>
        </div>
      </div>

      <div className="mt-7 overflow-hidden rounded-[1.75rem] border border-[#e3eaf4] bg-white shadow-[0_22px_52px_rgba(15,23,42,0.05)]">
        <div className="grid gap-3 border-b border-[#e8eef7] p-4 lg:grid-cols-[minmax(0,1.8fr)_220px_220px_220px] lg:p-5">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-300">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            <input
              className="admin-input h-12 bg-white pl-12"
              aria-label="Поиск постов"
              placeholder="Поиск постов..."
              value={searchValue}
              onChange={(event) => updateFilterParam("q", event.target.value)}
            />
          </div>

          <FilterSelect
            ariaLabel="Фильтр по категории"
            value={categoryFilter}
            onChange={(value) => updateFilterParam("category", value)}
          >
            <option value="">Все категории</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            ariaLabel="Фильтр по featured"
            value={featuredFilter}
            onChange={(value) => updateFilterParam("featured", value)}
          >
            <option value="">Все публикации</option>
            <option value="featured">Только featured</option>
            <option value="regular">Без featured</option>
          </FilterSelect>

          <div className="flex items-center justify-end">
            {hasFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-semibold text-slate-900 transition hover:text-[var(--brand)]"
              >
                Сбросить фильтры
              </button>
            ) : (
              <span className="text-sm text-slate-400">Готово для фильтрации</span>
            )}
          </div>
        </div>

        <div className="hidden grid-cols-[92px_minmax(0,1.8fr)_1fr_1fr_0.8fr_1.2fr_0.9fr] items-center gap-4 border-b border-[#e8eef7] px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 lg:grid">
          <span>Обложка</span>
          <span>Card title</span>
          <span>Категория</span>
          <span>Дата</span>
          <span>Featured</span>
          <span>Slug</span>
          <span>Actions</span>
        </div>

        {loading ? <div className="px-5 py-12 text-sm text-slate-500">Загружаем посты...</div> : null}

        {!loading && error ? (
          <div className="px-5 py-12 text-sm font-medium text-red-600">{error}</div>
        ) : null}

        {!loading && !error && filteredPosts.length === 0 ? <EmptyBlogList hasFilters={hasFilters} /> : null}

        {!loading && !error && filteredPosts.length > 0 ? (
          <>
            <div className="divide-y divide-[#edf2f7]">
              {filteredPosts.map((post) => (
                <div key={post.id} className="transition hover:bg-[#fafcff]">
                  <div className="hidden grid-cols-[92px_minmax(0,1.8fr)_1fr_1fr_0.8fr_1.2fr_0.9fr] items-center gap-4 px-5 py-5 lg:grid">
                    <CoverThumbnail post={post} />

                    <div className="min-w-0">
                      <p className="truncate text-[1.05rem] font-semibold text-slate-950">{post.cardTitle}</p>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-500">{post.excerpt}</p>
                    </div>

                    <p className="truncate text-sm text-slate-600">{post.category}</p>
                    <p className="text-sm text-slate-600">{formatPublishDate(post.publishDate)}</p>
                    <FeaturedBadge featured={post.featured} />
                    <p className="truncate text-sm text-slate-500">{post.slug}</p>

                    <div className="flex items-center justify-end">
                      <Link
                        href={`/admin123/blog/${post.id}`}
                        className="inline-flex items-center rounded-full border border-[#dbe4ef] px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-4 px-4 py-4 lg:hidden">
                    <div className="flex items-start gap-4">
                      <CoverThumbnail post={post} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-base font-semibold text-slate-950">{post.cardTitle}</p>
                            <p className="mt-1 text-sm text-slate-500">{post.category}</p>
                          </div>
                          <FeaturedBadge featured={post.featured} />
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{post.excerpt}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Дата</p>
                        <p className="mt-1.5 text-slate-700">{formatPublishDate(post.publishDate)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Slug</p>
                        <p className="mt-1.5 truncate text-slate-700">{post.slug}</p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Link
                        href={`/admin123/blog/${post.id}`}
                        className="inline-flex items-center rounded-full border border-[#dbe4ef] px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-[#e8eef7] px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Показано {filteredPosts.length} из {posts.length} постов
              </p>
              <p>Поиск и фильтры применяются на загруженном списке.</p>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
