"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { type AdminUser, requestJson } from "@/components/admin/admin-types";

type UserFormState = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  notes: string;
};

type UserEditorProps = {
  userId?: string;
};

const emptyForm: UserFormState = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  notes: ""
};

const STATUS_MESSAGE: Record<string, string> = {
  created: "Пользователь создан.",
  updated: "Изменения сохранены.",
  deleted: "Пользователь удален."
};

function FieldGroup({
  children,
  hint,
  className
}: {
  children: ReactNode;
  hint: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {children}
      <p className="admin-form-hint">{hint}</p>
    </div>
  );
}

function EmptyUserList({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center px-6 py-16 text-center">
      <div className="max-w-sm space-y-2">
        <p className="text-lg font-semibold text-slate-900">
          {searchQuery ? "Ничего не найдено" : "Список пользователей пуст"}
        </p>
        <p className="text-sm leading-6 text-slate-500">
          {searchQuery
            ? "Попробуйте изменить поисковый запрос."
            : "Создайте первую запись через зеленую кнопку в правом нижнем углу."}
        </p>
      </div>
    </div>
  );
}

export function UserListManager() {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchQuery = (searchParams.get("q") || "").trim().toLowerCase();
  const statusMessage = STATUS_MESSAGE[searchParams.get("status") || ""] || null;

  const filteredUsers = useMemo(() => {
    if (!searchQuery) {
      return users;
    }

    return users.filter((user) =>
      [user.fullName, user.email, user.phone, user.city, user.notes]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery)
    );
  }, [users, searchQuery]);

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      setLoading(true);
      setError(null);

      try {
        const payload = await requestJson<AdminUser[]>("/api/users");
        if (active) {
          setUsers(payload);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить пользователей.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadUsers();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      {statusMessage ? (
        <div className="mx-6 mt-6 rounded-[1.25rem] border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700 lg:mx-8">
          {statusMessage}
        </div>
      ) : null}

      <section className="min-h-screen bg-white">
        <div className="flex items-start justify-between gap-4 px-6 pb-8 pt-8 lg:px-8">
          <div>
            <h2 className="text-[2.1rem] font-semibold tracking-tight text-slate-950">Список пользователей</h2>
            <p className="mt-3 text-base leading-7 text-slate-500">
              Единый список клиентов и внутренних записей с быстрым переходом в редактор.
            </p>
          </div>
          <span className="mt-1 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
            {filteredUsers.length}
          </span>
        </div>

        <div className="border-t border-[#eef2f7]">
          <div className="hidden items-center gap-4 border-b border-[#eef2f7] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 lg:grid lg:grid-cols-[minmax(0,2fr)_1.4fr_180px_180px_28px] lg:px-8">
            <span>Пользователь</span>
            <span>Email</span>
            <span>Телефон</span>
            <span>Город</span>
            <span />
          </div>

          <div className="max-h-[calc(100vh-11rem)] overflow-y-auto">
            {loading ? <div className="px-6 py-12 text-sm text-slate-500 lg:px-8">Загружаем пользователей...</div> : null}
            {!loading && error ? <div className="px-6 py-12 text-sm font-medium text-red-600 lg:px-8">{error}</div> : null}
            {!loading && !error && filteredUsers.length === 0 ? <EmptyUserList searchQuery={searchQuery} /> : null}

            {!loading && !error
              ? filteredUsers.map((user) => (
                  <Link
                    key={user.id}
                    href={`/admin123/users/${user.id}`}
                    className="block border-b border-[#eef2f7] transition last:border-b-0 hover:bg-slate-50/60"
                  >
                    <div className="grid gap-3 px-6 py-5 lg:grid-cols-[minmax(0,2fr)_1.4fr_180px_180px_28px] lg:items-center lg:px-8">
                      <div className="min-w-0">
                        <p className="truncate text-[1.15rem] font-semibold text-slate-950">{user.fullName}</p>
                        <p className="mt-2 truncate text-xs uppercase tracking-[0.18em] text-slate-400">
                          {user.notes || "Без заметок"}
                        </p>
                      </div>
                      <p className="truncate text-sm text-slate-600">{user.email}</p>
                      <p className="truncate text-sm text-slate-600">{user.phone || "Не указан"}</p>
                      <p className="truncate text-sm text-slate-600">{user.city || "Не указан"}</p>
                      <div className="hidden justify-end text-slate-300 lg:flex">
                        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))
              : null}
          </div>
        </div>
      </section>

      <Link
        href="/admin123/users/new"
        aria-label="Создать пользователя"
        className="fixed bottom-8 right-8 z-[80] inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_18px_40px_rgba(16,185,129,0.32)] transition hover:scale-[1.03] hover:bg-emerald-600"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.25">
          <path d="M12 5v14" strokeLinecap="round" />
          <path d="M5 12h14" strokeLinecap="round" />
        </svg>
      </Link>
    </>
  );
}

export function UserEditor({ userId }: UserEditorProps) {
  const router = useRouter();
  const isEditing = Boolean(userId);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      if (!userId) {
        setForm(emptyForm);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const user = await requestJson<AdminUser>(`/api/users/${userId}`);
        if (!active) {
          return;
        }

        setForm({
          fullName: user.fullName,
          email: user.email,
          phone: user.phone || "",
          city: user.city || "",
          notes: user.notes || ""
        });
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить пользователя.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      active = false;
    };
  }, [userId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    try {
      await requestJson(userId ? `/api/users/${userId}` : "/api/users", {
        method: userId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      router.push(`/admin123/users?status=${isEditing ? "updated" : "created"}`);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось сохранить пользователя.");
    }
  }

  async function handleDelete() {
    if (!userId || !window.confirm("Удалить этого пользователя?")) {
      return;
    }

    try {
      await requestJson(`/api/users/${userId}`, { method: "DELETE" });
      router.push("/admin123/users?status=deleted");
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Не удалось удалить пользователя.");
    }
  }

  if (loading) {
    return <div className="px-6 py-12 text-sm text-slate-500 lg:px-8">Загружаем форму пользователя...</div>;
  }

  return (
    <section className="min-h-screen bg-white px-6 py-8 lg:px-8">
      <Link
        href="/admin123/users"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Назад к списку пользователей
      </Link>

      <div className="mt-6 flex flex-col gap-4 border-b border-[#edf2f7] pb-6">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            {isEditing ? "Редактирование" : "Создание"}
          </p>
          <h2 className="mt-3 text-[2.1rem] font-semibold tracking-tight text-slate-950">
            {isEditing ? "Профиль пользователя" : "Новый пользователь"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Простая полноэкранная форма для клиентских данных, контактов и внутренних заметок.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup hint="Полное имя клиента.">
            <input className="admin-input" aria-label="Полное имя" value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Электронная почта для связи и входа.">
            <input className="admin-input" aria-label="Электронная почта" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Основной номер телефона.">
            <input className="admin-input" aria-label="Телефон" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Город или регион пользователя.">
            <input className="admin-input" aria-label="Город" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
          </FieldGroup>
          <FieldGroup className="md:col-span-2" hint="Внутренние заметки администратора и записи CRM.">
            <textarea className="admin-textarea min-h-28" aria-label="Заметки" value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
          </FieldGroup>
        </div>

        {error ? <p className="mt-5 text-sm font-semibold text-red-600">{error}</p> : null}
        {message ? <p className="mt-5 text-sm font-semibold text-emerald-600">{message}</p> : null}

        <div className="mt-8 flex flex-col gap-3 border-t border-[#edf2f7] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {isEditing ? (
              <button type="button" className="admin-button-danger" onClick={handleDelete}>
                Удалить пользователя
              </button>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/admin123/users" className="admin-button-secondary text-center">
              Назад
            </Link>
            <button type="submit" className="admin-button-primary">
              {isEditing ? "Сохранить изменения" : "Создать пользователя"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export function UserManager() {
  return <UserListManager />;
}
