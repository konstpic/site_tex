import Link from "next/link";
import {
  ArrowRightIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
} from "@/components/icons";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { RevealVariant } from "@/lib/reveal-variants";
import { SITE } from "@/lib/site";

const GRID_VARIANTS: RevealVariant[] = [
  "left",
  "up",
  "right",
  "fade",
  "scale",
  "down",
];

const REVIEW_VARIANTS: RevealVariant[] = ["up", "right", "left", "scale"];

const STEP_CARD_VARIANTS: RevealVariant[] = ["left", "scale", "right"];

const reviews = [
  {
    name: "Марина К.",
    role: "удалённая работа",
    text: "Помогли навести порядок в автозагрузке и обновлениях Windows за один созвон. Всё объяснили спокойно, без давления.",
    rating: 5,
  },
  {
    name: "Сергей Т.",
    role: "малый бизнес",
    text: "Настроили почту и резервное копирование на MacBook. Подключение через AnyDesk — удобно, вижу каждый шаг.",
    rating: 5,
  },
  {
    name: "Елена В.",
    role: "частный клиент",
    text: "Заявку приняли быстро, попросили скрин ошибки — через 20 минут проблема с установкой программы была решена.",
    rating: 5,
  },
  {
    name: "Андрей Л.",
    role: "фриланс",
    text: "Понятная стоимость до начала работ. Комплексный тариф окупился: и сайт в хостинге поправили, и систему ускорили.",
    rating: 5,
  },
];

const faq = [
  {
    q: "Как проходит удалённое подключение?",
    a: "Согласуем время, подключаемся через AnyDesk или созваниваемся в Zoom — вы видите экран и подтверждаете действия. Выход из сеанса в любой момент.",
  },
  {
    q: "Это безопасно?",
    a: "Работаем только в рамках описанной задачи. Не запрашиваем пароли от банков и коды из СМС. Рекомендуем не оставлять посторонних программ после сеанса и при необходимости менять пароли доступа к ПК.",
  },
  {
    q: "Что если не получится помочь?",
    a: "Если задача окажется вне компетенции или потребует выездного ремонта железа, честно скажем об этом до оплаты или предложим частичное решение без доплат.",
  },
  {
    q: "Как оплатить?",
    a: "Оформите заказ на странице «Заказ» и нажмите «Оплатить» — откроется страница ЮKassa для оплаты картой. После оплаты вы вернётесь на сайт, статус платежа отображается автоматически.",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <span className="text-amber-500" aria-hidden>
      {"★".repeat(n)}
    </span>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="hero-gradient-shift pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(13,148,136,0.12),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p
            className="animate-hero-in-left text-sm font-semibold uppercase tracking-wide text-teal-700"
            style={{ animationDelay: "0.04s" }}
          >
            Только онлайн · без выезда
          </p>
          <h1
            className="animate-hero-in-scale font-display mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl"
            style={{ animationDelay: "0.12s" }}
          >
            {SITE.tagline}
          </h1>
          <p
            className="animate-hero-in-right mt-6 max-w-2xl text-lg text-slate-600"
            style={{ animationDelay: "0.22s" }}
          >
            Настройка Windows и macOS, программы и мессенджеры, базовая помощь с сайтами и
            хостингом — консультации и пошаговая настройка по удалённому доступу.
          </p>
          <div
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center animate-sequence-cta"
          >
            <Link
              href="/services"
              className="group cta-pulse inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-600/25"
            >
              Заказать услугу
              <ArrowRightIcon
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
            <Link
              href="/contacts"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-800 transition-all duration-200 hover:border-teal-300 hover:bg-teal-50/50 hover:shadow-sm"
            >
              Оставить заявку
            </Link>
          </div>
          <ul className="stagger-fade-children mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { icon: ClockIcon, t: "Старт от 15 минут", d: "Согласуем окно в день обращения" },
              { icon: ShieldCheckIcon, t: "Прозрачные условия", d: "Цена и объём до начала работ" },
              { icon: BoltIcon, t: "Без выезда", d: "Экономите время — всё дистанционно" },
            ].map((x) => (
              <li
                key={x.t}
                className="card-lift flex gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm"
              >
                <x.icon className="floating-soft h-8 w-8 shrink-0 text-teal-600" aria-hidden />
                <div>
                  <p className="font-semibold text-slate-900">{x.t}</p>
                  <p className="mt-1 text-sm text-slate-600">{x.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <ScrollReveal variant="fade" durationMs={720} className="text-center">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            Что мы делаем
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Фокус на консультациях и настройке — без переустановки системы «с нуля», если она не
            нужна.
          </p>
        </ScrollReveal>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Настройка Windows и macOS: учётные записи, обновления, типовая оптимизация",
            "Установка и настройка программ под ваши задачи",
            "Мессенджеры: «Макс», сервисы Яндекса и другие — вход, синхронизация, уведомления",
            "Сайты: домены, хостинг, базовая публикация и мелкие правки по инструкции",
            "Ускорение работы ПК: автозагрузка, фоновые процессы, диск, рекомендации",
            "Удалённая диагностика: ошибки, зависания, сетевые подключения",
          ].map((text, i) => (
            <li key={text} className="min-h-0">
              <ScrollReveal
                variant={GRID_VARIANTS[i % GRID_VARIANTS.length]}
                delayMs={i * 70}
                durationMs={760}
                className="h-full"
              >
                <div className="card-lift flex h-full gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <WrenchScrewdriverIcon
                    className="h-6 w-6 shrink-0 text-teal-600"
                    aria-hidden
                  />
                  <span className="text-slate-700">{text}</span>
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-y border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal variant="down" durationMs={750} className="text-center">
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              Как проходит работа
            </h2>
          </ScrollReveal>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Заявка и уточнение",
                body: "Опишите задачу в форме или выберите тариф. Согласуем время и способ связи.",
              },
              {
                step: "2",
                title: "Созвон и доступ",
                body: "Подключаемся через AnyDesk или работаем в Zoom — вы контролируете процесс.",
              },
              {
                step: "3",
                title: "Результат и памятка",
                body: "Фиксируем сделанные шаги, при необходимости отправляем краткую инструкцию.",
              },
            ].map((s, i) => (
                <li key={s.step} className="min-h-0">
                  <ScrollReveal
                    variant={STEP_CARD_VARIANTS[i] ?? "up"}
                    delayMs={i * 110}
                    durationMs={820}
                    className="h-full"
                  >
                    <div className="card-lift flex h-full gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-full bg-teal-100 text-lg font-bold text-teal-800">
                        {s.step}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-xl font-semibold text-slate-900">
                          {s.title}
                        </h3>
                        <p className="mt-2 text-slate-600">{s.body}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <ScrollReveal variant="scale" durationMs={740} className="text-center">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            Почему нам доверяют
          </h2>
        </ScrollReveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <ScrollReveal variant="left" delayMs={0} durationMs={780}>
            <div className="card-lift rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <ShieldCheckIcon className="mx-auto h-12 w-12 text-teal-600" aria-hidden />
              <p className="mt-4 font-semibold text-slate-900">Гарантия понятного результата</p>
              <p className="mt-2 text-sm text-slate-600">
                Объясняем на русском, без жаргона. Если задача не решается удалённо — скажем до
                оплаты.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="fade" delayMs={90} durationMs={800}>
            <div className="card-lift rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <ChatBubbleLeftRightIcon
                className="mx-auto h-12 w-12 text-teal-600"
                aria-hidden
              />
              <p className="mt-4 font-semibold text-slate-900">Поддержка после сеанса</p>
              <p className="mt-2 text-sm text-slate-600">
                Короткий уточняющий ответ по chat или почте в течение 24 часов после оплаченной
                услуги.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="right" delayMs={180} durationMs={780}>
            <div className="card-lift rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <ClockIcon className="mx-auto h-12 w-12 text-teal-600" aria-hidden />
              <p className="mt-4 font-semibold text-slate-900">Уважение к времени</p>
              <p className="mt-2 text-sm text-slate-600">
                Назначаем слот, придерживаемся длительности тарифа, не затягиваем созвон.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-100/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal variant="up" durationMs={720} className="text-center">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Отзывы</h2>
          </ScrollReveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {reviews.map((r, i) => (
              <ScrollReveal
                key={r.name}
                variant={REVIEW_VARIANTS[i % REVIEW_VARIANTS.length]}
                delayMs={i * 85}
                durationMs={800}
                className="min-h-0"
              >
                <blockquote className="card-lift h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-slate-800">{r.text}</p>
                  <footer className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
                    <div>
                      <cite className="not-italic font-semibold text-slate-900">{r.name}</cite>
                      <p className="text-sm text-slate-500">{r.role}</p>
                    </div>
                    <Stars n={r.rating} />
                  </footer>
                </blockquote>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <ScrollReveal variant="fade" durationMs={780} className="text-center">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            Частые вопросы
          </h2>
        </ScrollReveal>
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {faq.map((item) => (
            <details
              key={item.q}
              className="faq-item group rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-shadow duration-300 open:shadow-md"
            >
              <summary className="cursor-pointer list-none font-semibold text-slate-900">
                <span className="flex items-center justify-between gap-2">
                  {item.q}
                  <span className="faq-chevron text-teal-600">›</span>
                </span>
              </summary>
              <p className="faq-answer mt-3 text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      <ScrollReveal
        className="border-t border-slate-200 bg-teal-800 py-16 text-white"
        variant="up"
        durationMs={850}
      >
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-semibold">Готовы начать?</h2>
          <p className="mx-auto mt-3 max-w-xl text-teal-100">
            Выберите тариф или напишите — ответим и предложим ближайшее окно для созвона.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/cart"
              className="cta-pulse inline-flex rounded-2xl bg-white px-6 py-3.5 text-base font-semibold text-teal-900 hover:bg-teal-50"
            >
              Перейти к заказу
            </Link>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex rounded-2xl border border-teal-400 px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-teal-700/50 hover:shadow-lg"
            >
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </ScrollReveal>
    </>
  );
}
