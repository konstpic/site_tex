"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";

type CartFlyContextValue = {
  setCartTarget: (el: HTMLElement | null) => void;
  flyFrom: (source: HTMLElement | null) => void;
};

const CartFlyContext = createContext<CartFlyContextValue | null>(null);

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function spawnFlyParticle(from: DOMRect, to: DOMRect) {
  const size = 14;
  const sx = from.left + from.width / 2 - size / 2;
  const sy = from.top + from.height / 2 - size / 2;
  const tx = to.left + to.width / 2 - size / 2;
  const ty = to.top + to.height / 2 - size / 2;
  const dx = tx - sx;
  const dy = ty - sy;

  const el = document.createElement("div");
  el.className = "cart-fly-particle";
  el.setAttribute("aria-hidden", "true");
  el.style.left = `${sx}px`;
  el.style.top = `${sy}px`;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  document.body.appendChild(el);

  el.animate(
    [
      {
        transform: "translate(0, 0) scale(1)",
        opacity: 1,
        boxShadow: "0 0 0 0 rgba(13, 148, 136, 0.35)",
      },
      {
        transform: `translate(${dx * 0.45}px, ${dy * 0.45}px) scale(1.15)`,
        opacity: 1,
        boxShadow: "0 0 20px 4px rgba(245, 158, 11, 0.35)",
        offset: 0.45,
      },
      {
        transform: `translate(${dx}px, ${dy}px) scale(0.25)`,
        opacity: 0.9,
        boxShadow: "0 0 0 0 rgba(13, 148, 136, 0)",
      },
    ],
    {
      duration: 620,
      easing: "cubic-bezier(0.25, 0.85, 0.35, 1)",
    },
  ).finished.finally(() => el.remove());

  const trail = document.createElement("div");
  trail.className = "cart-fly-particle cart-fly-particle--trail";
  trail.setAttribute("aria-hidden", "true");
  trail.style.left = `${sx + 3}px`;
  trail.style.top = `${sy + 3}px`;
  trail.style.width = `${8}px`;
  trail.style.height = `${8}px`;
  document.body.appendChild(trail);

  trail
    .animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 0.55 },
        {
          transform: `translate(${dx}px, ${dy}px) scale(0.15)`,
          opacity: 0,
        },
      ],
      { duration: 520, easing: "cubic-bezier(0.33, 1, 0.48, 1)" },
    )
    .finished.finally(() => trail.remove());
}

export function CartFlyProvider({ children }: { children: React.ReactNode }) {
  const cartTargetRef = useRef<HTMLElement | null>(null);

  const setCartTarget = useCallback((el: HTMLElement | null) => {
    cartTargetRef.current = el;
  }, []);

  const flyFrom = useCallback((source: HTMLElement | null) => {
    if (!source || prefersReducedMotion()) return;
    const target = cartTargetRef.current;
    if (!target) return;

    requestAnimationFrame(() => {
      const from = source.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      if (from.width === 0 || to.width === 0) return;
      spawnFlyParticle(from, to);
    });
  }, []);

  const value = useMemo(
    () => ({ setCartTarget, flyFrom }),
    [setCartTarget, flyFrom],
  );

  return (
    <CartFlyContext.Provider value={value}>{children}</CartFlyContext.Provider>
  );
}

export function useCartFly() {
  const ctx = useContext(CartFlyContext);
  if (!ctx) {
    throw new Error("useCartFly must be used within CartFlyProvider");
  }
  return ctx;
}
