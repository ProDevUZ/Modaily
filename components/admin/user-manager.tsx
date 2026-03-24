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
      const payload = await requestJson<AdminUser[]>("/api/users");
      setUsers(payload);
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

      setForm(emptyForm);
      setEditingId(null);
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

    setError(null);
    setMessage(null);

    try {
      await requestJson(`/api/users/${id}`, {
        method: "DELETE"
      });

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
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <form onSubmit={handleSubmit} className="glass rounded-[2rem] p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-3xl text-ink">{editingId ? "Edit user" : "Create user"}</h3>
          {editingId ? (
            <button
              type="button"
              className="text-sm font-semibold text-clay"
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
          <input className="w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Full name" value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} />
          <input className="w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          <input className="w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
          <input className="w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="City" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
          <textarea className="min-h-28 w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-3" placeholder="Notes" value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
        </div>

        {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}
        {message ? <p className="mt-4 text-sm font-semibold text-moss">{message}</p> : null}

        <button type="submit" className="cta-primary mt-6 w-full">
          {editingId ? "Update user" : "Create user"}
        </button>
      </form>

      <div className="glass rounded-[2rem] p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-display text-3xl text-ink">Users</h3>
          <span className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-stone-600">{users.length}</span>
        </div>

        <div className="mt-5 space-y-4">
          {loading ? <p className="text-sm text-stone-500">Loading users...</p> : null}
          {!loading && users.length === 0 ? <p className="text-sm text-stone-500">No users yet.</p> : null}
          {users.map((user) => (
            <article key={user.id} className="rounded-[1.5rem] border border-stone-200 bg-white/70 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-ink">{user.fullName}</h4>
                  <p className="mt-1 text-sm text-stone-600">{user.email}</p>
                  <p className="mt-2 text-sm text-stone-500">
                    {[user.phone, user.city].filter(Boolean).join(" · ") || "No extra details"}
                  </p>
                  {user.notes ? <p className="mt-3 text-sm leading-6 text-stone-600">{user.notes}</p> : null}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-sand"
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
                  <button type="button" className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600" onClick={() => handleDelete(user.id)}>
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
