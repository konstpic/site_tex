import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { sectionRevealVariant } from "@/lib/reveal-variants";
import { getInn } from "@/lib/inn";
import { SITE } from "@/lib/site";

/** ИНН из env на каждый запрос (Docker и смена конфига без пересборки). */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Реквизиты",
  description:
    "Реквизиты исполнителя: ИНН, контакты. Информация для оплаты и договоров.",
};

export default function RequisitesPage() {
  const inn = getInn();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <ScrollReveal immediate className="max-w-2xl">
        <h1
          className="font-display text-3xl font-semibold text-slate-900 animate-fade-in-up"
          style={{ animationDelay: "0.04s" }}
        >
          Реквизиты
        </h1>
        <p
          className="mt-4 text-slate-700 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          {SITE.legalName}. Услуги оказываются в рамках налогового режима самозанятого (при
          применимости на вашей территории).
        </p>
      </ScrollReveal>

      <ScrollReveal
        variant={sectionRevealVariant(0)}
        delayMs={50}
        durationMs={760}
        className="mt-10"
      >
        <section className="card-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Реквизиты исполнителя
          </h2>
          <p className="mt-3 text-slate-800">
            <strong>ФИО:</strong> {SITE.fullName}
          </p>
          {inn ? (
            <p className="mt-2 text-lg font-semibold tracking-wide text-slate-900">
              ИНН: {inn}
            </p>
          ) : (
            <p className="mt-2 text-sm text-amber-800">
              ИНН будет отображён после задания переменной окружения{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-800">INN</code> на
              сервере.
            </p>
          )}
        </section>
      </ScrollReveal>

      <ScrollReveal
        variant={sectionRevealVariant(1)}
        delayMs={100}
        durationMs={740}
        className="mt-8"
      >
        <section>
          <h2 className="font-display text-xl font-semibold text-slate-900">Контакты</h2>
          <ul className="mt-3 space-y-2 text-slate-700">
            <li>
              Телефон:{" "}
              <a className="text-teal-700 underline hover:no-underline" href={`tel:${SITE.phone}`}>
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              Email:{" "}
              <a
                className="text-teal-700 underline hover:no-underline"
                href={`mailto:${SITE.email}`}
              >
                {SITE.email}
              </a>
            </li>
          </ul>
        </section>
      </ScrollReveal>

      <ScrollReveal
        variant={sectionRevealVariant(2)}
        delayMs={140}
        durationMs={720}
        className="mt-8"
      >
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          Цены, оферта и реквизиты размещены в открытом доступе —{" "}
          <strong>вход на сайт не требуется</strong> (отдельного логина и пароля для просмотра
          информации нет).
        </p>
      </ScrollReveal>

      <ScrollReveal variant="fade" delayMs={160} durationMs={700} className="mt-6">
        <p className="text-sm text-slate-600">
          Договорная документация:{" "}
          <Link href="/offer" className="text-teal-700 underline hover:no-underline">
            публичная оферта
          </Link>
          .
        </p>
      </ScrollReveal>
    </article>
  );
}
