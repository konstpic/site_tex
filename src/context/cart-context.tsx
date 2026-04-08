"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { ServiceId } from "@/lib/services";
import { getService } from "@/lib/services";

export type CartLine = { serviceId: ServiceId; qty: number };

const STORAGE_KEY = "tp_online_cart_v1";

/** Одна ссылка на пустую корзину для useSyncExternalStore (нельзя возвращать `[]` из getServerSnapshot каждый раз). */
const EMPTY_CART: CartLine[] = [];

function readCartFromStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x): x is CartLine =>
          x &&
          typeof x === "object" &&
          "serviceId" in x &&
          "qty" in x &&
          typeof (x as CartLine).qty === "number" &&
          (x as CartLine).qty > 0,
      )
      .map((x) => ({
        serviceId: x.serviceId as ServiceId,
        qty: Math.min(99, Math.floor(x.qty)),
      }))
      .filter((x) => getService(x.serviceId));
  } catch {
    return [];
  }
}

function writeCart(lines: CartLine[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* ignore */
  }
}

function mergeCustomLines(lines: CartLine[]): CartLine[] {
  const customs = lines.filter((l) => l.serviceId === "custom");
  if (customs.length <= 1) return lines;
  const rest = lines.filter((l) => l.serviceId !== "custom");
  const qty = Math.min(99, customs.reduce((a, c) => a + c.qty, 0));
  return [...rest, { serviceId: "custom" as const, qty }];
}

let clientStorageLoaded = false;
let linesState: CartLine[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): CartLine[] {
  if (typeof window === "undefined") return EMPTY_CART;
  if (!clientStorageLoaded) {
    clientStorageLoaded = true;
    linesState = mergeCustomLines(readCartFromStorage());
  }
  return linesState;
}

function getServerSnapshot(): CartLine[] {
  return EMPTY_CART;
}

function setLinesState(next: CartLine[]) {
  linesState = mergeCustomLines(next);
  writeCart(linesState);
  emit();
}

type CartContextValue = {
  lines: CartLine[];
  add: (serviceId: ServiceId, qty?: number) => void;
  setQty: (serviceId: ServiceId, qty: number) => void;
  remove: (serviceId: ServiceId) => void;
  clear: () => void;
  totalRub: number | null;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const totalRub = useMemo(() => {
    let sum = 0;
    let hasNull = false;
    for (const line of lines) {
      const s = getService(line.serviceId);
      if (!s) continue;
      if (s.priceRub === null) {
        hasNull = true;
        continue;
      }
      sum += s.priceRub * line.qty;
    }
    if (hasNull) return null;
    return sum;
  }, [lines]);

  const add = useCallback((serviceId: ServiceId, qty = 1) => {
    const prev = getSnapshot();
    const next = [...prev];
    const i = next.findIndex((l) => l.serviceId === serviceId);
    const addQty = Math.max(1, Math.floor(qty));
    if (i >= 0)
      next[i] = { ...next[i], qty: Math.min(99, next[i].qty + addQty) };
    else next.push({ serviceId, qty: addQty });
    setLinesState(next);
  }, []);

  const setQty = useCallback((serviceId: ServiceId, qty: number) => {
    const q = Math.max(0, Math.min(99, Math.floor(qty)));
    const prev = getSnapshot();
    const rest = prev.filter((l) => l.serviceId !== serviceId);
    const next = q > 0 ? [...rest, { serviceId, qty: q }] : rest;
    setLinesState(next);
  }, []);

  const remove = useCallback((serviceId: ServiceId) => {
    const prev = getSnapshot();
    setLinesState(prev.filter((l) => l.serviceId !== serviceId));
  }, []);

  const clear = useCallback(() => setLinesState([]), []);

  const value = useMemo(
    () => ({ lines, add, setQty, remove, clear, totalRub }),
    [lines, add, setQty, remove, clear, totalRub],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((a, l) => a + l.qty, 0);
}
