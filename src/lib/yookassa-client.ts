/**
 * Серверный клиент API ЮKassa (без секретов на клиенте).
 * @see https://yookassa.ru/developers/api
 */

import { getPaymentSuccessReturnUrl } from "@/lib/payment-gateway";

const YOOKASSA_API = "https://api.yookassa.ru/v3";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v?.trim()) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return v.trim();
}

function authHeader(): string {
  const shopId = requireEnv("YOOKASSA_SHOP_ID");
  const secretKey = requireEnv("YOOKASSA_SECRET_KEY");
  const token = Buffer.from(`${shopId}:${secretKey}`, "utf8").toString("base64");
  return `Basic ${token}`;
}

export type YooPaymentStatus =
  | "pending"
  | "waiting_for_capture"
  | "succeeded"
  | "canceled";

export type YooCreatePaymentResult = {
  id: string;
  status: YooPaymentStatus;
  confirmationUrl: string | null;
};

export async function yooKassaCreatePayment(params: {
  amountValue: string;
  description: string;
  returnUrl: string;
  idempotenceKey: string;
  /** До 16 пар ключ–значение, значение до 512 символов (например контакты заказчика). */
  metadata?: Record<string, string>;
}): Promise<YooCreatePaymentResult> {
  const payload: Record<string, unknown> = {
    amount: {
      value: params.amountValue,
      currency: "RUB",
    },
    confirmation: {
      type: "redirect",
      return_url: params.returnUrl,
    },
    capture: true,
    description: params.description,
  };
  if (params.metadata && Object.keys(params.metadata).length > 0) {
    payload.metadata = params.metadata;
  }

  const res = await fetch(`${YOOKASSA_API}/payments`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      "Idempotence-Key": params.idempotenceKey,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = (await res.json()) as {
    id?: string;
    status?: YooPaymentStatus;
    confirmation?: { confirmation_url?: string };
    type?: string;
    description?: string;
    code?: string;
    parameter?: string;
  };

  if (!res.ok) {
    const msg =
      data.description || data.code || data.parameter || res.statusText || "YooKassa error";
    throw new Error(typeof msg === "string" ? msg : "Ошибка создания платежа");
  }

  const id = data.id;
  const status = data.status;
  if (!id || !status) {
    throw new Error("Некорректный ответ ЮKassa");
  }

  const confirmationUrl = data.confirmation?.confirmation_url ?? null;
  return { id, status, confirmationUrl };
}

export async function yooKassaGetPayment(paymentId: string): Promise<{
  id: string;
  status: YooPaymentStatus;
  paid: boolean;
}> {
  const res = await fetch(`${YOOKASSA_API}/payments/${encodeURIComponent(paymentId)}`, {
    headers: {
      Authorization: authHeader(),
    },
    cache: "no-store",
  });

  const data = (await res.json()) as {
    id?: string;
    status?: YooPaymentStatus;
    paid?: boolean;
    description?: string;
  };

  if (!res.ok) {
    const msg = data.description || res.statusText;
    throw new Error(typeof msg === "string" ? msg : "Не удалось получить платёж");
  }

  const id = data.id;
  const status = data.status;
  if (!id || !status) {
    throw new Error("Некорректный ответ ЮKassa");
  }

  return {
    id,
    status,
    paid: Boolean(data.paid),
  };
}

export function getYooKassaReturnUrl(): string {
  return getPaymentSuccessReturnUrl();
}
