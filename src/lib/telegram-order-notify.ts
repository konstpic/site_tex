import type { CustomerContact } from "@/lib/customer-contact";
import type { CartLineInput } from "@/lib/payment-order";
import { getService } from "@/lib/services";
import type { ServiceId } from "@/lib/services";

const MAX_MESSAGE_LEN = 3900;

function summarizeLines(lines: CartLineInput[]): string {
  const parts: string[] = [];
  for (const raw of lines) {
    if (!raw || typeof raw !== "object") continue;
    const sid = raw.serviceId;
    const q = raw.qty;
    if (typeof sid !== "string") continue;
    const s = getService(sid as ServiceId);
    const qty =
      typeof q === "number" && Number.isFinite(q)
        ? Math.floor(q)
        : typeof q === "string"
          ? Math.floor(Number(q))
          : 0;
    if (!s || qty < 1) continue;
    const sub =
      s.priceRub != null ? ` — ${(s.priceRub * qty).toLocaleString("ru-RU")} ₽` : "";
    parts.push(`• ${s.title} ×${qty}${sub}`);
  }
  return parts.length > 0 ? parts.join("\n") : "— (позиции не распознаны)";
}

/**
 * Уведомление в Telegram о заявке перед оплатой.
 * Если не заданы TELEGRAM_BOT_TOKEN и TELEGRAM_ORDERS_CHAT_ID — ничего не делает.
 * Сбои сети не пробрасываются наружу (оплата не блокируется).
 */
export async function notifyOrderLeadToTelegram(params: {
  customer: CustomerContact;
  amountValue: string;
  description: string;
  lines: CartLineInput[];
  gateway: "yookassa" | "robokassa";
}): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_ORDERS_CHAT_ID?.trim();
  if (!token || !chatId) return;

  const linesBlock = summarizeLines(params.lines);
  const gwLabel = params.gateway === "robokassa" ? "Robokassa" : "ЮKassa";

  let text = [
    "Новая заявка с сайта (переход к оплате)",
    "",
    "Клиент:",
    params.customer.name,
    params.customer.phone,
    params.customer.email,
    "",
    "Заказ:",
    linesBlock,
    "",
    `Сумма: ${params.amountValue} ₽`,
    `Кратко: ${params.description}`,
    `Оплата: ${gwLabel}`,
  ].join("\n");

  if (text.length > MAX_MESSAGE_LEN) {
    text = text.slice(0, MAX_MESSAGE_LEN - 20) + "\n…(обрезано)";
  }

  const url = `https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(
        "[telegram-order-notify] sendMessage failed",
        res.status,
        body.slice(0, 500),
      );
    }
  } catch (e) {
    console.error("[telegram-order-notify]", e);
  }
}
