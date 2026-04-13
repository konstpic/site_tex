"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    setPending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });
      if (!res.ok) {
        setError("Не удалось отправить. Попробуйте позже или напишите на почту.");
        return;
      }
      setSent(true);
      form.reset();
    } catch {
      setError("Сеть недоступна. Попробуйте позже или напишите на почту.");
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6 text-teal-900">
        <p className="font-semibold">Сообщение принято</p>
        <p className="mt-2 text-sm text-teal-800">
          Мы ответим на указанную почту или перезвоним в ближайшее рабочее время.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Имя
        </label>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          placeholder="Как к вам обращаться"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
          Телефон (необязательно)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          placeholder="+7 …"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700">
          Сообщение
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          placeholder="Кратко опишите задачу и удобный способ связи"
        />
      </div>
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      <p className="text-xs text-slate-500">
        Нажимая «Отправить», вы соглашаетесь с{" "}
        <a href="/privacy" className="text-teal-700 underline hover:no-underline">
          политикой конфиденциальности
        </a>{" "}
        и{" "}
        <a href="/consent" className="text-teal-700 underline hover:no-underline">
          обработкой персональных данных
        </a>
        . Прямой контакт:{" "}
        <a className="text-teal-700 underline" href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>
        .
      </p>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 enabled:hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {pending ? "Отправка…" : "Отправить"}
      </button>
    </form>
  );
}
