import type { Metadata } from "next";
import { ScrollReveal } from "@/components/scroll-reveal";
import { sectionRevealVariant } from "@/lib/reveal-variants";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Как обрабатываются персональные данные посетителей сайта и клиентов.",
};

export default function PrivacyPage() {
  return (
    <article className="legal-doc mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <ScrollReveal immediate className="max-w-2xl">
        <h1
          className="font-display text-3xl font-semibold text-slate-900 animate-fade-in-up"
          style={{ animationDelay: "0.04s" }}
        >
          Политика конфиденциальности
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
          <h2 className="font-display text-xl font-semibold text-slate-900">1. Введение</h2>
          <p>
            Настоящая Политика описывает, как {SITE.name} (далее — «мы», «оператор сайта»)
            обрабатывает персональные данные пользователей сайта и клиентов при оказании услуг. Мы
            исходим из принципов минимизации данных, прозрачности и законности обработки.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal variant={sectionRevealVariant(1)} delayMs={60} durationMs={740} className="mt-10">
        <section className="space-y-4 text-slate-700">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            2. Какие данные мы можем получать
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Данные, которые вы указываете в формах: имя, адрес электронной почты, номер телефона,
              текст сообщения.
            </li>
            <li>
              Техническая информация: тип браузера, приблизительное местоположение по IP (если
              собирается средствами веб-аналитики), данные cookie и аналогичных технологий — в
              объёме, необходимом для работы сайта и статистики.
            </li>
            <li>
              Данные о заказах и платежах: состав услуг, сумма, идентификатор транзакции у
              платёжного провайдера (без полных реквизитов банковской карты).
            </li>
          </ul>
        </section>
      </ScrollReveal>

      <ScrollReveal variant={sectionRevealVariant(2)} delayMs={80} durationMs={760} className="mt-10">
        <section className="space-y-4 text-slate-700">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            3. Цели обработки
          </h2>
          <p>
            Мы используем данные для: обработки заявок и связи с вами; заключения и исполнения
            договора; приёма оплаты и ведения учёта; улучшения работы сайта и качества поддержки;
            соблюдения требований законодательства при наличии соответствующей обязанности.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal variant={sectionRevealVariant(3)} delayMs={100} durationMs={720} className="mt-10">
        <section className="space-y-4 text-slate-700">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            4. Передача третьим лицам
          </h2>
          <p>
            Мы можем передавать ограниченный объём данных платёжным провайдерам, хостинг-провайдерам
            и сервисам связи исключительно для обработки платежей, доставки сообщений и хостинга
            сайта. Такие получатели обязаны обеспечивать конфиденциальность в рамках своих договоров и
            политик.
          </p>
          <p>Мы не продаём персональные данные и не передаём их для несвязанного с вами маркетинга.</p>
        </section>
      </ScrollReveal>

      <ScrollReveal variant={sectionRevealVariant(4)} delayMs={120} durationMs={700} className="mt-10">
        <section className="space-y-4 text-slate-700">
          <h2 className="font-display text-xl font-semibold text-slate-900">5. Хранение и защита</h2>
          <p>
            Данные хранятся не дольше, чем это необходимо для целей обработки или в сроки,
            установленные применимым правом. Мы применяем организационные и технические меры,
            соответствующие характеру обрабатываемой информации.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal variant={sectionRevealVariant(5)} delayMs={140} durationMs={780} className="mt-10">
        <section className="space-y-4 text-slate-700">
          <h2 className="font-display text-xl font-semibold text-slate-900">6. Ваши права</h2>
          <p>
            В зависимости от применимого законодательства вы можете иметь право на доступ к своим
            данным, их уточнение, удаление или ограничение обработки, отзыв согласия, возражение
            против определённых видов обработки, а также право подать жалобу уполномоченному органу.
          </p>
          <p>
            Для реализации прав свяжитесь с нами: {SITE.email}, телефон {SITE.phoneDisplay}.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal variant={sectionRevealVariant(6)} delayMs={160} durationMs={740} className="mt-10">
        <section className="space-y-4 text-slate-700">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            7. Изменения политики
          </h2>
          <p>
            Мы можем обновлять Политику; актуальная версия всегда доступна на этой странице с
            указанием даты редакции.
          </p>
        </section>
      </ScrollReveal>
    </article>
  );
}
