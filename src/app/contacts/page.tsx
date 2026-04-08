import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { ScrollReveal } from "@/components/scroll-reveal";
import { sectionRevealVariant } from "@/lib/reveal-variants";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Контакты",
  description: `Свяжитесь с ${SITE.name}: телефон ${SITE.phoneDisplay}, email ${SITE.email}.`,
};

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <ScrollReveal immediate variant="left" durationMs={780} className="min-h-0">
          <h1
            className="font-display text-4xl font-semibold tracking-tight text-slate-900 animate-fade-in-up"
            style={{ animationDelay: "0.04s" }}
          >
            Контакты
          </h1>
          <p
            className="mt-4 text-lg text-slate-600 animate-fade-in-up"
            style={{ animationDelay: "0.12s" }}
          >
            Напишите задачу — ответим в рабочее время. Срочные вопросы удобнее продублировать
            звонком.
          </p>
          <ul className="mt-8 space-y-4 text-slate-800">
            <li>
              <span className="text-sm font-medium text-slate-500">Телефон</span>
              <br />
              <a
                className="text-lg font-semibold text-teal-700 hover:underline"
                href={`tel:${SITE.phone}`}
              >
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <span className="text-sm font-medium text-slate-500">Email</span>
              <br />
              <a
                className="text-lg font-semibold text-teal-700 hover:underline"
                href={`mailto:${SITE.email}`}
              >
                {SITE.email}
              </a>
            </li>
          </ul>
          <p className="mt-8 text-sm text-slate-600">
            Юридические документы:{" "}
            <a href="/offer" className="text-teal-700 underline">
              оферта
            </a>
            ,{" "}
            <a href="/privacy" className="text-teal-700 underline">
              конфиденциальность
            </a>
            .
          </p>
        </ScrollReveal>
        <ScrollReveal
          variant={sectionRevealVariant(1)}
          delayMs={90}
          durationMs={800}
          className="min-h-0"
        >
          <div className="card-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <h2 className="font-display text-xl font-semibold text-slate-900">Форма</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
