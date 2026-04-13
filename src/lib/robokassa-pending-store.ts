/**
 * In-memory статусы счетов Robokassa (InvId → сумма и статус).
 * Для продакшена с несколькими инстансами нужен общий store (Redis и т.п.).
 */

export type RobokassaPendingRecord = {
  amount: string;
  status: "pending" | "succeeded";
  createdAt: number;
};

const store = new Map<string, RobokassaPendingRecord>();
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

function cleanup(): void {
  const now = Date.now();
  for (const [k, v] of store) {
    if (now - v.createdAt > MAX_AGE_MS) store.delete(k);
  }
}

export function robokassaPendingPut(invId: string, amount: string): void {
  cleanup();
  store.set(invId, { amount, status: "pending", createdAt: Date.now() });
}

export function robokassaPendingGet(invId: string): RobokassaPendingRecord | undefined {
  cleanup();
  return store.get(invId);
}

export function robokassaPendingMarkSucceeded(invId: string): boolean {
  cleanup();
  const r = store.get(invId);
  if (!r) return false;
  r.status = "succeeded";
  return true;
}
