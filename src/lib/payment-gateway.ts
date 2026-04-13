/**
 * Какой шлюз использовать на сервере (секреты только здесь / в route handlers).
 */
export type PaymentGateway = "yookassa" | "robokassa";

export function getPaymentGateway(): PaymentGateway {
  const g = (process.env.PAYMENT_GATEWAY || "yookassa").trim().toLowerCase();
  return g === "robokassa" ? "robokassa" : "yookassa";
}

/** URL страницы успеха после оплаты (Robokassa SuccessURL и возврат ЮKassa). */
export function getPaymentSuccessReturnUrl(): string {
  const v =
    process.env.PAYMENT_SUCCESS_URL?.trim() ||
    process.env.YOOKASSA_RETURN_URL?.trim();
  if (!v) {
    throw new Error("Missing environment variable: YOOKASSA_RETURN_URL or PAYMENT_SUCCESS_URL");
  }
  return v;
}
