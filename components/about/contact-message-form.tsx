"use client";

import { useState, type FormEvent } from "react";

type ContactMessageFormProps = {
  locale: string;
  labels: {
    namePlaceholder: string;
    phonePlaceholder: string;
    messagePlaceholder: string;
    submit: string;
    submitPending: string;
    success: string;
    requiredError: string;
    fallbackError: string;
  };
};

type FormState = {
  fullName: string;
  phone: string;
  message: string;
};

const emptyForm: FormState = {
  fullName: "",
  phone: "",
  message: ""
};

export function ContactMessageForm({ locale, labels }: ContactMessageFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.fullName.trim() || !form.phone.trim()) {
      setError(labels.requiredError);
      setSuccess(null);
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          message: form.message,
          locale
        })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || labels.fallbackError);
      }

      setForm(emptyForm);
      setSuccess(labels.success);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : labels.fallbackError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <input
        type="text"
        required
        value={form.fullName}
        onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
        placeholder={labels.namePlaceholder}
        className="h-11 w-full border border-black/10 px-4 text-[13px] text-black outline-none placeholder:text-black/38 focus:border-[var(--brand)]"
      />
      <input
        type="tel"
        required
        value={form.phone}
        onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
        placeholder={labels.phonePlaceholder}
        className="h-11 w-full border border-black/10 px-4 text-[13px] text-black outline-none placeholder:text-black/38 focus:border-[var(--brand)]"
      />
      <textarea
        value={form.message}
        onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
        placeholder={labels.messagePlaceholder}
        rows={5}
        className="w-full resize-none border border-black/10 px-4 py-3 text-[13px] text-black outline-none placeholder:text-black/38 focus:border-[var(--brand)]"
      />

      {error ? <p className="text-[12px] font-medium text-[#ba0c2f]">{error}</p> : null}
      {success ? <p className="text-[12px] font-medium text-emerald-600">{success}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-10 items-center rounded-[4px] bg-[#ba0c2f] px-5 text-[12px] font-medium text-white transition hover:bg-[#a10a28] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? labels.submitPending : labels.submit}
      </button>
    </form>
  );
}
