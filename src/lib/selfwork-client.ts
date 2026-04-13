/**
 * Сам.Эквайринг (selfwork.ru)
 * @see https://docs.selfwork.ru/api/acquiring
 */

import { createHash, randomBytes } from "crypto";
import type { CartLineInput } from "@/lib/payment-order";
import { getService } from "@/lib/services";
import type { ServiceId } from "@/lib/services";

const MAX_INFO_ITEMS = 6;
const MAX_NAME_LEN = 128;

export const SELFWORK_WEBHOOK_ALLOWED_IPS = [
  "178.205.169.35",
  "81.23.144.157",
] as const;

export type SelfworkInfoItem = {
  name: string;
  quantity: number;
  /** Стоимость одной единицы, копейки */
  amountKopecks: number;
};

export type SelfworkMerchantConfig = {
  merchantId: string;
  secretKey: string;
};

export function getSelfworkApiOrigin(): string {
  return (process.env.SELFWORK_API_ORIGIN || "https://pro.selfwork.ru").replace(
    /\/$/,
    "",
  );
}

export function getSelfworkInitUrl(): string {
  return `${getSelfworkApiOrigin()}/merchant/v1/init`;
}

export function getSelfworkMerchantConfig(): SelfworkMerchantConfig {
  const merchantId = process.env.SELFWORK_MERCHANT_ID?.trim();
  const secretKey = process.env.SELFWORK_SECRET_KEY?.trim();
  if (!merchantId || !secretKey) {
    throw new Error(
      "Missing environment variable: SELFWORK_MERCHANT_ID or SELFWORK_SECRET_KEY",
    );
  }
  return { merchantId, secretKey };
}

export function generateSelfworkOrderId(): string {
  return randomBytes(9).toString("hex");
}

export function sha256HexUtf8(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

/**
 * Позиции для Receipt: до 6 шт.; иначе одна строка на всю сумму.
 */
export function buildSelfworkInfoItems(
  lines: CartLineInput[],
  shortDescription: string,
  totalKopecks: number,
): SelfworkInfoItem[] {
  const rows: SelfworkInfoItem[] = [];
  for (const raw of lines) {
    if (!raw || typeof raw !== "object") continue;
    const sid = raw.serviceId;
    const q = raw.qty;
    if (typeof sid !== "string") continue;
    const qty =
      typeof q === "number" && Number.isFinite(q)
        ? Math.floor(q)
        : typeof q === "string"
          ? Math.floor(Number(q))
          : 0;
    if (qty < 1 || qty > 99) continue;
    const s = getService(sid as ServiceId);
    if (!s || s.priceRub === null) continue;
    rows.push({
      name: s.title.slice(0, MAX_NAME_LEN),
      quantity: qty,
      amountKopecks: s.priceRub * 100,
    });
  }
  if (rows.length === 0) return [];
  if (rows.length <= MAX_INFO_ITEMS) return rows;
  const name = (shortDescription || "Услуги").slice(0, MAX_NAME_LEN);
  return [{ name, quantity: 1, amountKopecks: totalKopecks }];
}

function buildInitSignatureString(params: {
  orderId: string;
  amountKopecks: number;
  items: SelfworkInfoItem[];
  secretKey: string;
}): string {
  let s = params.orderId + String(params.amountKopecks);
  for (const it of params.items) {
    s += it.name + String(it.quantity) + String(it.amountKopecks);
  }
  s += params.secretKey;
  return s;
}

export function buildSelfworkInitFormFields(params: {
  orderId: string;
  amountKopecks: number;
  items: SelfworkInfoItem[];
  secretKey: string;
}): Record<string, string> {
  const signature = sha256HexUtf8(
    buildInitSignatureString({
      orderId: params.orderId,
      amountKopecks: params.amountKopecks,
      items: params.items,
      secretKey: params.secretKey,
    }),
  );
  const out: Record<string, string> = {
    order_id: params.orderId,
    amount: String(params.amountKopecks),
    signature,
  };
  params.items.forEach((it, i) => {
    out[`info[${i}][name]`] = it.name;
    out[`info[${i}][quantity]`] = String(it.quantity);
    out[`info[${i}][amount]`] = String(it.amountKopecks);
  });
  return out;
}

export function verifySelfworkWebhookSignature(params: {
  orderId: string;
  amountRaw: string | number;
  signature: string;
  secretKey: string;
}): boolean {
  const amountStr = String(params.amountRaw);
  const expected = sha256HexUtf8(
    params.orderId + amountStr + params.secretKey,
  );
  const got = params.signature.trim().toLowerCase();
  return expected === got;
}

export async function fetchSelfworkPaymentStatus(orderId: string): Promise<{
  status: string;
  amount: number;
} | null> {
  const { merchantId, secretKey } = getSelfworkMerchantConfig();
  const url = `${getSelfworkApiOrigin()}/merchant/v1/status?order_id=${encodeURIComponent(orderId)}`;
  const token = Buffer.from(
    `${merchantId}:${secretKey}`,
    "utf8",
  ).toString("base64");
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${token}` },
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Selfwork status HTTP ${res.status}: ${t.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    order_id?: string;
    status?: string;
    amount?: number;
  };
  return {
    status: data.status ?? "unknown",
    amount: typeof data.amount === "number" ? data.amount : 0,
  };
}

export function getClientIpFromRequest(request: Request): string | null {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return null;
}

export function isSelfworkWebhookIpAllowed(ip: string | null): boolean {
  if (!ip) return false;
  return (SELFWORK_WEBHOOK_ALLOWED_IPS as readonly string[]).includes(ip);
}
