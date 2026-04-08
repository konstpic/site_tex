import type { Metadata } from "next";
import { ScrollReveal } from "@/components/scroll-reveal";
import { sectionRevealVariant } from "@/lib/reveal-variants";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных",
  description: "Текст согласия субъекта данных на обработку персональных данных.",
};

export default function ConsentPage() {
  return (
    <article className="legal-doc mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <ScrollReveal immediate className="max-w-2xl">
        <h1
          className="font-display text-3xl font-semibold text-slate-900 animate-fade-in-up"
          style={{ animationDelay: "0.04s" }}
        >
          Согласие на обработку персональных данных
        </h1>
        <p
          className="mt-4 text-sm text-slate-500 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          Редакция от 08.04.2026
        </p>
      </ScrollReveal>

      <ScrollReveal variant={sectionRevealVariant(0)} delayMs={40} durationMs={760} className="mt-10">
        <section className="space-y-4 text-slate-700">
          <p>
            Настоящим, заполняя формы на сайте {SITE.name} или направляя обращение Исполнителю по
            контактным данным на сайте, субъект персональных данных (далее — «Субъект») даёт своё
            осознанное и добровольное согласие на обработку своих персональных данных{" "}
            {SITE.legalName} (далее — «Оператор») на следующих условиях.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal variant={sectionRevealVariant(1)} delayMs={60} durationMs={740} className="mt-10">
        <section className="space-y-4 text-slate-700">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            1. Перечень данных и действий
          </h2>
          <p>
            Согласие распространяется на обработку персональных данных, которые Субъект предоставляет
            самостоятельно, включая: фамилию, имя, отчество (при указании); номер телефона; адрес
            электронной почты; иные сведения, содержащиеся в тексте обращения.
          </p>
          <p>
            Оператор вправе осуществлять сбор, запись, систематизацию, накопление, хранение, уточнение,
            использование, передачу (предоставление) третьим лицам в объёме, необходимом для целей,
            указанных ниже, обезличивание, блокирование, удаление и уничтожение персональных данных.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal variant={sectionRevealVariant(2)} delayMs={80} durationMs={760} className="mt-10">
        <section className="space-y-4 text-slate-700">
          <h2 className="font-display text-xl font-semibold text-slate-900">2. Цели обработки</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>рассмотрение обращения и связь с Субъектом;</li>
            <li>заключение и исполнение договора на оказание услуг;</li>
            <li>направление ответов, в том числе после оказания услуг;</li>
            <li>ведение внутреннего учёта и статистики в обезличенном виде.</li>
          </ul>
        </section>
      </ScrollReveal>

      <ScrollReveal variant={sectionRevealVariant(3)} delayMs={100} durationMs={720} className="mt-10">
        <section className="space-y-4 text-slate-700">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            3. Срок действия согласия
          </h2>
          <p>
            Согласие действует до достижения целей обработки или до отзыва Субъектом. Субъект может
            отозвать согласие, направив уведомление на адрес {SITE.email} с пометкой «отзыв
            согласия». Оператор прекращает обработку и уничтожает данные в срок, не превышающий
            разумного периода, необходимого для выполнения требований применимого права, если иное не
            требуется для исполнения уже заключённого договора или споров.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal variant={sectionRevealVariant(4)} delayMs={120} durationMs={700} className="mt-10">
        <section className="space-y-4 text-slate-700">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            4. Передача третьим лицам
          </h2>
          <p>
            Субъект согласен с тем, что Оператор может передавать данные платёжным организациям,
            хостинг-провайдерам и сервисам коммуникаций строго в рамках указанных целей.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal variant={sectionRevealVariant(5)} delayMs={140} durationMs={780} className="mt-10">
        <section className="space-y-4 text-slate-700">
          <h2 className="font-display text-xl font-semibold text-slate-900">5. Контакты</h2>
          <p>
            По вопросам обработки данных: {SITE.email}, тел. {SITE.phoneDisplay}. Политика
            конфиденциальности доступна по адресу /privacy на данном сайте.
          </p>
        </section>
      </ScrollReveal>
    </article>
  );
}
