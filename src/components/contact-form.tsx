"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
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
        className="w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 sm:w-auto sm:px-8"
      >
        Отправить
      </button>
    </form>
  );
}
