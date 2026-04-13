import Link from "next/link";
import {
  ArrowRightIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ShieldCheckIcon,
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
    text: "Подключили ноутбук и телефон к защищённому каналу за один сеанс. Объяснили простыми словами, зачем шифровать трафик в публичных Wi‑Fi.",
    rating: 5,
  },
  {
    name: "Сергей Т.",
    role: "малый бизнес",
    text: "Нужен был порядок с доступом для двух сотрудников. Настроили клиенты, проверили стабильность — работаем уже третий месяц без сюрпризов.",
    rating: 5,
  },
  {
    name: "Елена В.",
    role: "частный клиент",
    text: "Оплатила тариф «Стандарт», в тот же день получила инструкцию и помощь с первым подключением. Чувствую себя спокойнее в сети.",
    rating: 5,
  },
  {
    name: "Андрей Л.",
    role: "фриланс",
    text: "Расширенный пакет окупился: и домашний ПК, и планшет в поездках. Поддержка ответила быстро, когда роутер «капризничал».",
    rating: 5,
  },
];

const faq = [
  {
    q: "Что именно делает сервис?",
    a: "Мы оказываем информационно-техническое сопровождение: помогаем организовать доступ к защищённой сетевой инфраструктуре и настроить ваши устройства так, чтобы снизить риски перехвата данных и утечек при работе в интернете.",
  },
  {
    q: "Это замена антивирусу?",
    a: "Нет. Защищённый канал и гигиена устройств дополняют друг друга. Мы не обещаем «абсолютной безопасности», но помогаем усилить конфиденциальность и целостность трафика в типовых сценариях.",
  },
  {
    q: "Как проходит подключение?",
    a: "Вы выбираете тариф и оплачиваете заказ. После оплаты мы связываемся с вами и согласуем формат помощи: созвон и пошаговая настройка на вашем экране или инструкции для самостоятельного подключения — в зависимости от тарифа.",
  },
  {
    q: "Как оплатить?",
    a: "На странице «Заказ» нажмите «Оплатить» — откроется защищённая страница платёжного провайдера (ЮKassa или Сам.Эквайринг). После оплаты вы вернётесь на сайт, статус отображается автоматически.",
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
            Онлайн-сервис · защищённая инфраструктура
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
            {SITE.mission}
          </p>
          <div
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center animate-sequence-cta"
          >
            <Link
              href="/services"
              className="group cta-pulse inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-600/25"
            >
              Смотреть тарифы
              <ArrowRightIcon
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
            <Link
              href="/contacts"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-800 transition-all duration-200 hover:border-teal-300 hover:bg-teal-50/50 hover:shadow-sm"
            >
              Задать вопрос
            </Link>
          </div>
          <ul className="stagger-fade-children mt-12 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: LockClosedIcon,
                t: "Защита трафика",
                d: "Шифрование и безопасный канал к инфраструктуре",
              },
              {
                icon: ShieldCheckIcon,
                t: "Понятные условия",
                d: "Состав услуги и цена до оплаты",
              },
              {
                icon: GlobeAltIcon,
                t: "Дом, офис, дорога",
                d: "Сценарии для разных сетей и устройств",
              },
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
            Что входит в сервис
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Фокус на организации доступа и снижении рисков при работе в сети — без обещаний «волшебной кнопки», с честным описанием возможностей.
          </p>
        </ScrollReveal>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Консультации по сценариям: дом, офис, публичные Wi‑Fi, поездки",
            "Помощь с установкой и настройкой клиента для доступа к защищённой сети",
            "Проверка соединения, типовых ошибок и конфликтов с сетевыми настройками",
            "Рекомендации по безопасной работе с данными и учётным записям",
            "Тарифы для одного пользователя, семьи или небольшой команды",
            "Индивидуальные сценарии — по согласованию объёма и стоимости",
          ].map((text, i) => (
            <li key={text} className="min-h-0">
              <ScrollReveal
                variant={GRID_VARIANTS[i % GRID_VARIANTS.length]}
                delayMs={i * 70}
                durationMs={760}
                className="h-full"
              >
                <div className="card-lift flex h-full gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <BoltIcon className="h-6 w-6 shrink-0 text-teal-600" aria-hidden />
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
              Как это работает
            </h2>
          </ScrollReveal>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Тариф и оплата",
                body: "Выберите подходящий пакет на странице тарифов и оформите заказ. Оплата — на защищённой странице банка или эквайера.",
              },
              {
                step: "2",
                title: "Связь и настройка",
                body: "После оплаты мы пишем или звоним, согласуем время и формат: созвон с демонстрацией экрана или пошаговая инструкция.",
              },
              {
                step: "3",
                title: "Доступ и поддержка",
                body: "Вы подключаетесь к защищённой инфраструктуре. По тарифу — краткая памятка и ответы на уточняющие вопросы.",
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
            Почему выбирают нас
          </h2>
        </ScrollReveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <ScrollReveal variant="left" delayMs={0} durationMs={780}>
            <div className="card-lift rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <ShieldCheckIcon className="mx-auto h-12 w-12 text-teal-600" aria-hidden />
              <p className="mt-4 font-semibold text-slate-900">Честные ожидания</p>
              <p className="mt-2 text-sm text-slate-600">
                Объясняем, что даёт защищённый канал и чего он не заменяет. Если задача вне формата — скажем до оплаты.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="fade" delayMs={90} durationMs={800}>
            <div className="card-lift rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <ChatBubbleLeftRightIcon
                className="mx-auto h-12 w-12 text-teal-600"
                aria-hidden
              />
              <p className="mt-4 font-semibold text-slate-900">Поддержка после подключения</p>
              <p className="mt-2 text-sm text-slate-600">
                По тарифу — короткий ответ в мессенджере или на почте после оказания услуги, чтобы закрепить результат.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="right" delayMs={180} durationMs={780}>
            <div className="card-lift rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <GlobeAltIcon className="mx-auto h-12 w-12 text-teal-600" aria-hidden />
              <p className="mt-4 font-semibold text-slate-900">Под ваш сценарий</p>
              <p className="mt-2 text-sm text-slate-600">
                Учитываем количество устройств и тип сети: от квартиры до командировок.
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
          <h2 className="font-display text-3xl font-semibold">Подключиться</h2>
          <p className="mx-auto mt-3 max-w-xl text-teal-100">
            Выберите тариф или напишите нам — подскажем, какой вариант лучше подойдёт под ваши устройства и задачи.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/cart"
              className="cta-pulse inline-flex rounded-2xl bg-white px-6 py-3.5 text-base font-semibold text-teal-900 hover:bg-teal-50"
            >
              Оформить заказ
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
