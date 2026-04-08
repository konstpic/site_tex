"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ShoppingCartIcon } from "@/components/icons";
import { useCartFly } from "@/context/cart-fly-context";
import { cartItemCount, useCart } from "@/context/cart-context";
import { SITE, NAV } from "@/lib/site";

/**
 * Иконку рисуем только после mount: так SSR и первая гидратация совпадают
 * (плейсхолдер того же размера), даже если dev-сервер отдаёт устаревший чанк иконки.
 */
function CartToolbarIcon({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);
  if (!mounted) {
    return <span className={className} aria-hidden />;
  }
  return <ShoppingCartIcon className={className} />;
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors duration-200 hover:text-teal-700 ${
        active ? "text-teal-700" : "text-slate-600"
      }`}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const { lines } = useCart();
  const n = cartItemCount(lines);
  const { setCartTarget } = useCartFly();
  const prevN = useRef(n);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (n > prevN.current) {
      const el = badgeRef.current;
      if (el) {
        el.classList.remove("cart-badge-animate");
        void el.offsetWidth;
        el.classList.add("cart-badge-animate");
      }
    }
    prevN.current = n;
  }, [n]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-shadow duration-300 hover:shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex shrink-0 flex-col leading-tight">
          <span className="font-semibold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-teal-800">
            {SITE.name}
          </span>
          <span className="hidden text-xs text-slate-500 transition-colors group-hover:text-slate-600 sm:block">
            консультации и настройка техники онлайн
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Основное меню">
          {NAV.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            ref={setCartTarget}
            href="/cart"
            className="cart-order-btn relative inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-teal-700 hover:shadow-md hover:shadow-teal-600/25 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 sm:px-4"
          >
            <CartToolbarIcon className="h-5 w-5 shrink-0" />
            <span>Заказ</span>
            {n > 0 && (
              <span
                ref={badgeRef}
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-bold text-slate-900 ring-2 ring-white"
              >
                {n}
              </span>
            )}
          </Link>
        </div>
      </div>
      <nav
        className="flex gap-4 overflow-x-auto border-t border-slate-100 px-4 py-2 md:hidden"
        aria-label="Мобильное меню"
      >
        {NAV.map((item) => (
          <NavLink key={item.href} href={item.href} label={item.label} />
        ))}
      </nav>
    </header>
  );
}
