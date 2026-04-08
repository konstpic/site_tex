"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/cart-context";

/** Очищает корзину один раз после успешной оплаты (по данным ЮKassa). */
export function ClearCartOnPaymentSuccess({ shouldClear }: { shouldClear: boolean }) {
  const { clear } = useCart();
  const done = useRef(false);

  useEffect(() => {
    if (!shouldClear || done.current) return;
    done.current = true;
    clear();
  }, [shouldClear, clear]);

  return null;
}
