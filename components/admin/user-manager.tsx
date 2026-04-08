"use client";

import { useEffect, useState, type FormEvent } from "react";

import { type AdminUser, requestJson } from "@/components/admin/admin-types";

type UserFormState = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  notes: string;
};

const emptyForm: UserFormState = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  notes: ""
};

function FieldGroup({
  children,
  hint
}: {
  children: React.ReactNode;
  hint: string;
}) {
  return (
    <div>
      {children}
      <p className="admin-form-hint">{hint}</p>
    </div>
  );
}

export function UserManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadUsers() {
    setLoading(true);
    try {
      setUsers(await requestJson<AdminUser[]>("/api/users"));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    try {
      await requestJson(editingId ? `/api/users/${editingId}` : "/api/users", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      setEditingId(null);
      setForm(emptyForm);
      setMessage(editingId ? "User updated." : "User created.");
      await loadUsers();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save user.");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this user?")) {
      return;
    }

    try {
      await requestJson(`/api/users/${id}`, { method: "DELETE" });
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      setMessage("User deleted.");
      await loadUsers();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete user.");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[390px_1fr]">
      <form onSubmit={handleSubmit} className="admin-panel p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl font-semibold text-slate-950">{editingId ? "Edit user" : "Create user"}</h3>
          {editingId ? (
            <button
              type="button"
              className="text-sm font-semibold text-slate-500"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          ) : null}
        </div>

        <div className="mt-5 space-y-4">
          <FieldGroup hint="Full name: customerning to‘liq ismi.">
            <input className="admin-input" aria-label="Full name" value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Email: aloqa va login uchun email manzil.">
            <input className="admin-input" aria-label="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Phone: asosiy telefon raqam.">
            <input className="admin-input" aria-label="Phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="City: foydalanuvchi shahri yoki hududi.">
            <input className="admin-input" aria-label="City" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
          </FieldGroup>
          <FieldGroup hint="Notes: ichki admin eslatmalari va CRM qaydlari.">
            <textarea className="admin-textarea min-h-28" aria-label="Notes" value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
          </FieldGroup>
        </div>

        {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}
        {message ? <p className="mt-4 text-sm font-semibold text-emerald-600">{message}</p> : null}

        <button type="submit" className="admin-button-primary mt-6 w-full">
          {editingId ? "Update user" : "Create user"}
        </button>
      </form>

      <div className="admin-panel p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-2xl font-semibold text-slate-950">Users</h3>
          <span className="admin-badge">{users.length}</span>
        </div>

        <div className="mt-5 space-y-4">
          {loading ? <p className="text-sm text-slate-500">Loading users...</p> : null}
          {!loading && users.length === 0 ? <p className="text-sm text-slate-500">No users yet.</p> : null}
          {users.map((user) => (
            <article key={user.id} className="admin-panel-muted p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-slate-950">{user.fullName}</h4>
                  <p className="mt-1 text-sm text-slate-600">{user.email}</p>
                  <p className="mt-2 text-sm text-slate-500">
                    {[user.phone, user.city].filter(Boolean).join(" | ") || "No extra details"}
                  </p>
                  {user.notes ? <p className="mt-3 text-sm leading-6 text-slate-600">{user.notes}</p> : null}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="admin-button-secondary"
                    onClick={() => {
                      setEditingId(user.id);
                      setForm({
                        fullName: user.fullName,
                        email: user.email,
                        phone: user.phone || "",
                        city: user.city || "",
                        notes: user.notes || ""
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button type="button" className="admin-button-danger" onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
