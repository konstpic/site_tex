"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ServiceId } from "@/lib/services";
import { parseCustomerContact } from "@/lib/customer-contact";
import { ScrollReveal } from "@/components/scroll-reveal";
import { sectionRevealVariant } from "@/lib/reveal-variants";
import { useCart } from "@/context/cart-context";
import { formatPrice, getService } from "@/lib/services";
import { PENDING_PAYMENT_ID_KEY } from "@/lib/payment-storage";

export default function CartPage() {
  const { lines, setQty, remove } = useCart();
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const { rows, pricedTotal, hasCustom } = useMemo(() => {
    const rows = lines
      .map((line) => {
        const s = getService(line.serviceId);
        if (!s) return null;
        return { line, s };
      })
      .filter(Boolean) as {
      line: { serviceId: ServiceId; qty: number };
      s: NonNullable<ReturnType<typeof getService>>;
    }[];

    let pricedTotal = 0;
    let hasCustom = false;
    for (const { line, s } of rows) {
      if (s.priceRub === null) hasCustom = true;
      else pricedTotal += s.priceRub * line.qty;
    }
    return { rows, pricedTotal, hasCustom };
  }, [lines]);

  const contactsValid = useMemo(
    () => parseCustomerContact({ name, phone, email }) !== null,
    [name, phone, email],
  );

  const canPay = pricedTotal > 0;

  async function handlePay() {
    if (rows.length === 0 || pricedTotal <= 0) return;
    const customer = parseCustomerContact({ name, phone, email });
    if (!customer) return;
    setPayError(null);
    setPaying(true);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          lines: lines.map((l) => ({
            serviceId: l.serviceId,
            qty: l.qty,
          })),
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        confirmationUrl?: string;
        paymentId?: string;
        paymentAction?: string;
        paymentMethod?: string;
        paymentForm?: Record<string, string>;
      };
      if (!res.ok) {
        throw new Error(data.error || "Не удалось создать платёж");
      }
      if (data.paymentId) {
        sessionStorage.setItem(PENDING_PAYMENT_ID_KEY, data.paymentId);
      }
      const payAction = (data.paymentAction || "").trim();
      const payMethod = (data.paymentMethod || "").toUpperCase();
      const form = data.paymentForm;
      if (
        payAction &&
        payMethod === "POST" &&
        form &&
        typeof form === "object" &&
        !Array.isArray(form)
      ) {
        try {
          const u = new URL(payAction);
          if (u.hostname !== "auth.robokassa.ru") {
            throw new Error("bad payment host");
          }
          const el = document.createElement("form");
          el.method = "POST";
          el.action = payAction;
          el.style.display = "none";
          for (const [name, value] of Object.entries(form)) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = name;
            input.value = value;
            el.appendChild(input);
          }
          document.body.appendChild(el);
          el.submit();
        } catch {
          throw new Error("Некорректные данные для перехода к оплате");
        }
        return;
      }
      if (data.confirmationUrl) {
        window.location.assign(data.confirmationUrl);
        return;
      }
      throw new Error("Платёжная система не вернула данные для оплаты");
    } catch (e) {
      setPayError(e instanceof Error ? e.message : "Ошибка оплаты");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <ScrollReveal immediate className="max-w-2xl">
        <h1
          className="font-display text-4xl font-semibold tracking-tight text-slate-900 animate-fade-in-up"
          style={{ animationDelay: "0.04s" }}
        >
          Корзина и оплата
        </h1>
        <p
          className="mt-3 text-slate-600 animate-fade-in-up"
          style={{ animationDelay: "0.12s" }}
        >
          Проверьте состав заказа. Оплата проходит на стороне платёжного шлюза (ЮKassa или Robokassa);
          после оплаты вы вернётесь на сайт.
        </p>
      </ScrollReveal>

      {rows.length === 0 ? (
        <ScrollReveal variant="scale" delayMs={60} durationMs={780} className="mt-10">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <p className="text-slate-600">Корзина пуста.</p>
            <Link
              href="/services"
              className="mt-4 inline-flex rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Выбрать услуги
            </Link>
          </div>
        </ScrollReveal>
      ) : (
        <>
          <ScrollReveal
            variant={sectionRevealVariant(0)}
            delayMs={40}
            durationMs={760}
            className="mt-10"
          >
            <ul className="card-lift divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm">
            {rows.map(({ line, s }) => {
              const lineTotal = s.priceRub === null ? null : s.priceRub * line.qty;
              return (
                <li
                  key={line.serviceId}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{s.title}</p>
                    <p className="text-sm text-slate-500">{formatPrice(s.priceRub)} за ед.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      Кол-во
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={line.qty}
                        onChange={(e) =>
                          setQty(line.serviceId, Number(e.target.value))
                        }
                        className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-slate-900"
                      />
                    </label>
                    <span className="font-semibold text-slate-900">
                      {lineTotal === null ? "—" : formatPrice(lineTotal)}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(line.serviceId)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Удалить
                    </button>
                  </div>
                </li>
              );
            })}
            </ul>
          </ScrollReveal>

          <ScrollReveal
            variant={sectionRevealVariant(1)}
            delayMs={80}
            durationMs={780}
            className="mt-8"
          >
            <div className="card-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Ваши контакты
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Укажите данные, по которым мы сможем связаться после оплаты.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-1">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Имя</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Как к вам обращаться"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Телефон</span>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  placeholder="+7 925 707-18-92"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Электронная почта</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  placeholder="name@example.com"
                />
              </label>
            </div>
            </div>
          </ScrollReveal>

          <ScrollReveal
            variant={sectionRevealVariant(2)}
            delayMs={100}
            durationMs={740}
            className="mt-8"
          >
            <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-5 text-sm text-slate-800">
            <p className="font-semibold text-slate-900">Как вы получите услугу после оплаты</p>
            <p className="mt-3 text-slate-700">
              Мы свяжемся с вами по номеру телефона и на почту, которые вы указали в форме выше, —
              обычно в течение рабочего дня после поступления оплаты.
            </p>
            <p className="mt-3 text-slate-700">
              Согласуем удобное окно для сеанса (дата и время).
            </p>
            <p className="mt-3 text-slate-700">
              Услуга оказывается удалённо: подключение через AnyDesk или созвон в Zoom — вы видите
              экран и контролируете процесс.
            </p>
            <p className="mt-3 text-xs text-slate-600">
              Физической доставки нет: это дистанционные консультации и настройка.
            </p>
            </div>
          </ScrollReveal>

          {payError && (
            <ScrollReveal variant="fade" delayMs={0} durationMs={500} className="mt-6">
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                {payError}
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal
            variant={sectionRevealVariant(3)}
            delayMs={120}
            durationMs={800}
            className="mt-8"
          >
            <div className="card-lift flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-600">
                {hasCustom ? "К оплате сейчас (фиксированные позиции)" : "Итого к оплате"}
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {pricedTotal > 0 ? formatPrice(pricedTotal) : "—"}
              </p>
              {hasCustom && pricedTotal > 0 && (
                <p className="mt-2 text-xs text-slate-600">
                  Позиция «Индивидуальный тариф» оплачивается отдельно по согласованной смете
                  после короткого обсуждения.
                </p>
              )}
              {hasCustom && pricedTotal === 0 && (
                <p className="mt-2 text-sm text-slate-600">
                  В корзине только индивидуальный тариф. Напишите или позвоните — подготовим смету
                  до начала работ.
                </p>
              )}
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:items-end">
              {canPay && contactsValid && (
                <button
                  type="button"
                  disabled={paying}
                  onClick={handlePay}
                  className="rounded-2xl bg-teal-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {paying ? "Переход к оплате…" : "Оплатить"}
                </button>
              )}
              {canPay && !contactsValid && (
                <p className="max-w-xs text-right text-sm text-slate-600 sm:text-right">
                  Заполните имя, телефон и email — после этого появится кнопка оплаты.
                </p>
              )}
              {!canPay && (
                <p
                  className="max-w-xs text-right text-sm text-slate-600"
                  title="Добавьте услугу с фиксированной ценой или свяжитесь для индивидуального расчёта"
                >
                  Нет суммы к оплате онлайн — добавьте тариф с ценой или свяжитесь с нами.
                </p>
              )}
            </div>
            </div>
          </ScrollReveal>
        </>
      )}
    </div>
  );
}
