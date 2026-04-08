import type { Metadata } from "next";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { sectionRevealVariant } from "@/lib/reveal-variants";
import { SERVICES, formatPrice } from "@/lib/services";

export const metadata: Metadata = {
  title: "Услуги и цены",
  description:
    "Тарифы на удалённую техническую помощь: консультация, настройка системы, комплексная поддержка, индивидуальный расчёт.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <ScrollReveal immediate className="max-w-2xl">
        <h1
          className="font-display text-4xl font-semibold tracking-tight text-slate-900 animate-fade-in-up"
          style={{ animationDelay: "0.04s" }}
        >
          Услуги и цены
        </h1>
        <p
          className="mt-4 text-lg text-slate-600 animate-fade-in-up"
          style={{ animationDelay: "0.12s" }}
        >
          Все работы выполняются дистанционно. Итоговая стоимость фиксируется до оплаты, кроме
          индивидуального тарифа — там смета после краткого описания задачи.
        </p>
      </ScrollReveal>

      <ul className="mt-12 grid gap-6 lg:grid-cols-2">
        {SERVICES.map((s, i) => (
          <li key={s.id} className="min-h-0">
            <ScrollReveal delayMs={i * 55} className="h-full">
              <div className="card-lift flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-semibold text-slate-900">{s.title}</h2>
                <p className="mt-1 text-sm font-medium text-teal-700">{s.short}</p>
              </div>
              <p className="text-lg font-bold text-slate-900">{formatPrice(s.priceRub)}</p>
            </div>
            <p className="mt-4 flex-1 text-slate-600">{s.description}</p>
            <p className="mt-3 text-sm text-slate-500">Ориентир по времени: {s.durationHint}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {s.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-teal-600" aria-hidden>
                    ✓
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <AddToCartButton serviceId={s.id} />
              <Link
                href="/cart"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors duration-200 hover:border-teal-300 hover:bg-teal-50/60"
              >
                Перейти к заказу
              </Link>
            </div>
              </div>
            </ScrollReveal>
          </li>
        ))}
      </ul>

      <ScrollReveal
        variant={sectionRevealVariant(4)}
        delayMs={SERVICES.length * 55 + 40}
        durationMs={760}
        className="mt-10"
      >
        <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-slate-800">
          Оплата банковской картой через ЮKassa: после нажатия «Оплатить» на странице заказа вы
          перейдёте на защищённую страницу платёжного провайдера и вернётесь на сайт после
          завершения оплаты.
        </p>
      </ScrollReveal>
    </div>
  );
}
