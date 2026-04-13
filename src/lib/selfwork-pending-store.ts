/**
 * In-memory статусы заказов Сам.Эквайринг (order_id → сумма в копейках и статус).
 * Для нескольких инстансов нужен общий store (Redis и т.п.).
 */

export type SelfworkPendingRecord = {
  amountKopecks: number;
  status: "pending" | "succeeded";
  createdAt: number;
};

const store = new Map<string, SelfworkPendingRecord>();
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

function cleanup(): void {
  const now = Date.now();
  for (const [k, v] of store) {
    if (now - v.createdAt > MAX_AGE_MS) store.delete(k);
  }
}

export function selfworkPendingPut(orderId: string, amountKopecks: number): void {
  cleanup();
  store.set(orderId, {
    amountKopecks,
    status: "pending",
    createdAt: Date.now(),
  });
}

export function selfworkPendingGet(
  orderId: string,
): SelfworkPendingRecord | undefined {
  cleanup();
  return store.get(orderId);
}

export function selfworkPendingMarkSucceeded(orderId: string): boolean {
  cleanup();
  const r = store.get(orderId);
  if (!r) return false;
  r.status = "succeeded";
  return true;
}
