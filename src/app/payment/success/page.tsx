"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ClearCartOnPaymentSuccess } from "@/components/payment-success-clear-cart";
import { YOOKASSA_PENDING_PAYMENT_KEY } from "@/lib/yookassa-storage";

type PaymentState =
  | { phase: "loading" }
  | {
      phase: "done";
      paymentId: string;
      status: string;
      paid: boolean;
      error: string | null;
    };

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<PaymentState>({ phase: "loading" });

  useEffect(() => {
    let paymentId = searchParams.get("payment_id")?.trim();
    if (!paymentId && typeof window !== "undefined") {
      const stored = sessionStorage.getItem(YOOKASSA_PENDING_PAYMENT_KEY);
      if (stored) {
        sessionStorage.removeItem(YOOKASSA_PENDING_PAYMENT_KEY);
        paymentId = stored;
        window.history.replaceState(
          null,
          "",
          `/payment/success?payment_id=${encodeURIComponent(paymentId)}`,
        );
      }
    }

    if (!paymentId) {
      setState({
        phase: "done",
        paymentId: "",
        status: "unknown",
        paid: false,
        error: "Не указан идентификатор платежа. Если вы завершили оплату, сохраните чек и свяжитесь с нами.",
      });
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/payments/yookassa?payment_id=${encodeURIComponent(paymentId)}`,
        );
        const data = (await res.json()) as {
          error?: string;
          status?: string;
          paid?: boolean;
        };
        if (!res.ok) {
          throw new Error(data.error || "Ошибка запроса");
        }
        if (!cancelled) {
          setState({
            phase: "done",
            paymentId,
            status: data.status ?? "unknown",
            paid: Boolean(data.paid),
            error: null,
          });
        }
      } catch (e) {
        if (!cancelled) {
          setState({
            phase: "done",
            paymentId,
            status: "unknown",
            paid: false,
            error: e instanceof Error ? e.message : "Ошибка",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  if (state.phase === "loading") {
    return (
      <div className="mx-auto max-w-lg px-4 py-24">
        <ScrollReveal immediate variant="fade" durationMs={720} className="text-center text-slate-600">
          Проверяем статус оплаты…
        </ScrollReveal>
      </div>
    );
  }

  const { paymentId, status, paid, error } = state;
  const isSuccess = status === "succeeded" || paid;
  const isPending = status === "pending" || status === "waiting_for_capture";

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-24">
      <ClearCartOnPaymentSuccess shouldClear={isSuccess} />

      <ScrollReveal immediate variant="scale" durationMs={820} className="w-full">
        <div
          className={`card-lift rounded-2xl border p-8 text-center ${
            isSuccess
              ? "border-teal-200 bg-teal-50"
              : isPending
                ? "border-amber-200 bg-amber-50"
                : "border-slate-200 bg-slate-50"
          }`}
        >
        {isSuccess && (
          <>
            <p className="text-lg font-semibold text-teal-900">Оплата прошла успешно</p>
            <p className="mt-3 text-sm text-teal-800">
              Заказ принят. Мы свяжемся с вами для назначения времени созвона.
            </p>
          </>
        )}
        {isPending && !isSuccess && (
          <>
            <p className="text-lg font-semibold text-amber-900">Платёж обрабатывается</p>
            <p className="mt-3 text-sm text-amber-800">
              Статус: {status}. Если страница не обновилась, проверьте почту или свяжитесь с нами.
            </p>
          </>
        )}
        {!isSuccess && !isPending && (
          <>
            <p className="text-lg font-semibold text-slate-900">
              {error ? "Не удалось подтвердить оплату" : "Оплата не завершена"}
            </p>
            <p className="mt-3 text-sm text-slate-600">
              {error ||
                (status === "canceled"
                  ? "Платёж отменён. Вы можете оформить заказ снова."
                  : "Проверьте статус в личном кабинете банка или повторите попытку.")}
            </p>
          </>
        )}

        {paymentId ? (
          <p className="mt-6 font-mono text-xs text-slate-500">Платёж: {paymentId}</p>
        ) : null}

        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700"
        >
          На главную
        </Link>
        </div>
      </ScrollReveal>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-24">
          <ScrollReveal immediate variant="blur" durationMs={600} className="text-center text-slate-600">
            Загрузка…
          </ScrollReveal>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
