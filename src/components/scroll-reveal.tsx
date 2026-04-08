"use client";

import { useEffect, useRef, useState } from "react";
import type { RevealVariant } from "@/lib/reveal-variants";

export type { RevealVariant } from "@/lib/reveal-variants";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Тип плавного появления (по умолчанию снизу вверх). */
  variant?: RevealVariant;
  /** Показать без ожидания скролла (например, первый экран). */
  immediate?: boolean;
  /** Задержка до начала анимации, мс */
  delayMs?: number;
  /** Длительность перехода, мс */
  durationMs?: number;
};

export function ScrollReveal({
  children,
  className = "",
  variant = "up",
  immediate = false,
  delayMs = 0,
  durationMs,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    if (immediate) return;

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0.02 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [immediate]);

  const variantClass = `scroll-reveal--${variant}`;

  const style: React.CSSProperties = {
    ...(delayMs > 0 ? { ["--reveal-delay" as string]: `${delayMs}ms` } : {}),
    ...(durationMs != null && durationMs > 0
      ? { ["--reveal-duration" as string]: `${durationMs}ms` }
      : {}),
  };

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${variantClass} w-full ${className} ${visible ? "scroll-reveal--visible" : ""}`}
      style={Object.keys(style).length ? style : undefined}
    >
      {children}
    </div>
  );
}
