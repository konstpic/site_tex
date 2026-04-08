"use client";

import { useRef } from "react";
import type { ServiceId } from "@/lib/services";
import { useCartFly } from "@/context/cart-fly-context";
import { useCart } from "@/context/cart-context";

type Props = {
  serviceId: ServiceId;
  label?: string;
  className?: string;
};

export function AddToCartButton({
  serviceId,
  label = "В заказ",
  className = "",
}: Props) {
  const { add } = useCart();
  const { flyFrom } = useCartFly();
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={() => {
        add(serviceId, 1);
        flyFrom(btnRef.current);
      }}
      className={`add-to-cart-btn inline-flex items-center justify-center rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md hover:shadow-teal-600/30 active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${className}`}
    >
      {label}
    </button>
  );
}
