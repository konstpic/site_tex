import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { sectionRevealVariant } from "@/lib/reveal-variants";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "О нас",
  description:
    `${SITE.name}: онлайн-сервис защищённого сетевого доступа, консультации и сопровождение подключения.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <ScrollReveal immediate className="max-w-2xl">
        <h1
          className="font-display text-4xl font-semibold tracking-tight text-slate-900 animate-fade-in-up"
          style={{ animationDelay: "0.04s" }}
        >
          О сервисе
        </h1>
        <p
          className="mt-4 text-lg text-slate-600 animate-fade-in-up"
          style={{ animationDelay: "0.12s" }}
        >
          {SITE.legalName}. {SITE.mission}
        </p>
      </ScrollReveal>

      <ScrollReveal
        variant={sectionRevealVariant(0)}
        delayMs={40}
        durationMs={760}
        className="mt-10 space-y-6 text-slate-700"
      >
        <p>
          Мы помогаем клиентам организовать{" "}
          <strong>цифровой доступ к защищённой сетевой инфраструктуре</strong>: от первичной
          консультации и проверки готовности устройств до пошаговой настройки клиентского ПО и
          сопровождения в день подключения.
        </p>
        <p>
          Работаем с частными пользователями и небольшими командами. Формат — созвон с демонстрацией
          экрана или чёткие инструкции, если вы предпочитаете настроить всё самостоятельно под нашим
          руководством.
        </p>
        <p>
          Подход: сначала уточняем сценарий (какие сети, сколько устройств, есть ли корпоративные
          ограничения), затем предлагаем тариф и фиксируем ожидаемый результат. Не берёмся за задачи,
          которые требуют доступа к оборудованию на месте или выходят за рамки договорённого объёма
          услуг.
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
