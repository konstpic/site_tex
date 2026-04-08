import type { ServiceId } from "@/lib/services";
import { getService } from "@/lib/services";

export type CartLineInput = { serviceId: unknown; qty: unknown };

/**
 * Пересчитывает сумму только по позициям с фиксированной ценой (без «индивидуального» тарифа).
 * Используется на сервере при создании платежа — клиент не может подменить цену.
 */
export function buildPricedOrderFromLines(lines: CartLineInput[]):
  | {
      ok: true;
      /** Сумма для API ЮKassa, например "750.00" */
      amountValue: string;
      description: string;
      totalKopecks: number;
    }
  | { ok: false; error: string } {
  if (!Array.isArray(lines) || lines.length === 0) {
    return { ok: false, error: "Корзина пуста" };
  }

  let totalKopecks = 0;
  const parts: string[] = [];

  for (const raw of lines) {
    if (!raw || typeof raw !== "object") continue;
    const sid = (raw as CartLineInput).serviceId;
    const q = (raw as CartLineInput).qty;
    if (typeof sid !== "string") continue;
    const serviceId = sid as ServiceId;
    const qty =
      typeof q === "number" && Number.isFinite(q)
        ? Math.floor(q)
        : typeof q === "string"
          ? Math.floor(Number(q))
          : 0;
    if (qty < 1 || qty > 99) {
      return { ok: false, error: "Некорректное количество" };
    }

    const s = getService(serviceId);
    if (!s) {
      return { ok: false, error: "Неизвестная услуга" };
    }
    if (s.priceRub === null) {
      continue;
    }
    totalKopecks += s.priceRub * 100 * qty;
    parts.push(`${s.title} ×${qty}`);
  }

  if (totalKopecks <= 0) {
    return {
      ok: false,
      error:
        "Нет позиций с фиксированной ценой. Добавьте тариф с ценой или свяжитесь для индивидуальной сметы.",
    };
  }

  const amountValue = (totalKopecks / 100).toFixed(2);
  let description = `Услуги: ${parts.join(", ")}`;
  if (description.length > 128) {
    description = `${description.slice(0, 125)}...`;
  }

  return { ok: true, amountValue, description, totalKopecks };
}
