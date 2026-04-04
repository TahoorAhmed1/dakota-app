"use client";

import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  weekPref: string;
  notes: string;
};

const empty: FormState = { name: "", email: "", phone: "", weekPref: "", notes: "" };

export default function WaitlistForm() {
  const [form, setForm] = useState<FormState>(empty);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Something went wrong");
      }
      setStatus("success");
      setForm(empty);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "success") {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-green-200 bg-green-50 px-8 py-10 text-center">
        <p className="text-lg font-bold text-green-800">You&apos;re on the list!</p>
        <p className="mt-2 text-sm leading-relaxed text-green-700">
          We&apos;ll reach out as soon as space opens up for your preferred week. Thank you for your interest in UGUIDE.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#281703]">
            Name <span className="text-orange-500">*</span>
          </label>
          <input
            required
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-md border border-[#d7c8b6] bg-white px-4 py-3 text-sm text-[#281703] outline-none focus:border-orange-400"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#281703]">
            Email <span className="text-orange-500">*</span>
          </label>
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-md border border-[#d7c8b6] bg-white px-4 py-3 text-sm text-[#281703] outline-none focus:border-orange-400"
            placeholder="your@email.com"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#281703]">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-md border border-[#d7c8b6] bg-white px-4 py-3 text-sm text-[#281703] outline-none focus:border-orange-400"
            placeholder="(555) 000-0000"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#281703]">
            Preferred Week
          </label>
          <input
            name="weekPref"
            value={form.weekPref}
            onChange={handleChange}
            className="w-full rounded-md border border-[#d7c8b6] bg-white px-4 py-3 text-sm text-[#281703] outline-none focus:border-orange-400"
            placeholder="e.g. Week 3 — Oct 31"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#281703]">
          Notes
        </label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          className="w-full resize-none rounded-md border border-[#d7c8b6] bg-white px-4 py-3 text-sm text-[#281703] outline-none focus:border-orange-400"
          placeholder="Camp preference, group size, any questions…"
        />
      </div>
      {status === "error" && (
        <p className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-md bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-400 disabled:opacity-60"
      >
        {status === "loading" ? "Submitting…" : "Join the Waitlist"}
      </button>
    </form>
  );
}
