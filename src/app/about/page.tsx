import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { sectionRevealVariant } from "@/lib/reveal-variants";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "О нас",
  description:
    "Специалист по удалённым консультациям и настройке техники: опыт, подход, гарантии качества.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <ScrollReveal immediate className="max-w-2xl">
        <h1
          className="font-display text-4xl font-semibold tracking-tight text-slate-900 animate-fade-in-up"
          style={{ animationDelay: "0.04s" }}
        >
          О специалисте
        </h1>
        <p
          className="mt-4 text-lg text-slate-600 animate-fade-in-up"
          style={{ animationDelay: "0.12s" }}
        >
          {SITE.legalName}. Оказываю услуги дистанционно — настройка и консультации без выезда к
          клиенту.
        </p>
      </ScrollReveal>

      <ScrollReveal
        variant={sectionRevealVariant(0)}
        delayMs={40}
        durationMs={760}
        className="mt-10 space-y-6 text-slate-700"
      >
        <p>
          Более <strong>5 лет</strong> регулярной практики с частными клиентами и небольшими
          командами: операционные системы Windows и macOS, прикладные программы, мессенджеры и
          сервисы, базовая работа с сайтами — от домена до публикации на хостинге.
        </p>
        <p>
          В портфеле — свыше <strong>1000 успешных обращений</strong>: от разовых консультаций до
          комплексных настроек. Формат работы — созвон и удалённый доступ с вашего согласия
          (AnyDesk, Zoom).
        </p>
        <p>
          Подход: сначала уточняю задачу и ожидаемый результат, затем называю объём и стоимость.
          Не обещаю решений «любой ценой», если задача требует аппаратного ремонта или выходит за
          рамки удалённой помощи.
        </p>
      </ScrollReveal>

      <ScrollReveal
        variant={sectionRevealVariant(1)}
        delayMs={80}
        durationMs={780}
        className="mt-10"
      >
        <div className="card-lift rounded-2xl border border-teal-200 bg-teal-50 p-6">
          <h2 className="font-display text-lg font-semibold text-teal-900">Связь</h2>
          <p className="mt-2 text-teal-800">
            <a className="font-semibold underline" href={`tel:${SITE.phone}`}>
              {SITE.phoneDisplay}
            </a>
            <br />
            <a className="font-semibold underline" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
          </p>
          <Link
            href="/contacts"
            className="mt-4 inline-flex rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Форма обратной связи
          </Link>
        </div>
      </ScrollReveal>
    </div>
  );
}
