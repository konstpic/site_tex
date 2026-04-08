export function IconBase({
  className = "h-6 w-6",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </IconBase>
  );
}

export function BoltIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 13.5 10.5 6 8.25 4.5 19.5 13.5 12.75 21 15 22.5 3.75 13.5"
      />
    </IconBase>
  );
}

export function ChatBubbleLeftRightIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V4.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
      />
    </IconBase>
  );
}

export function ClockIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </IconBase>
  );
}

export function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
      />
    </IconBase>
  );
}

export function WrenchScrewdriverIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655-5.653a2.548 2.548 0 0 0-4.162 1.997v.231c0 .562.224 1.102.624 1.498l3.25 3.25m9.303-12.13a2.548 2.548 0 0 0-4.162 1.998v.21a2.55 2.55 0 0 0 .624 1.498l6.437 6.437a2.548 2.548 0 1 0 3.585-3.586l-4.684-4.687Z"
      />
    </IconBase>
  );
}

/**
 * Тележка (корзина): геометрия как у Feather «shopping-cart» (корзина + два колеса),
 * без одного длинного path Heroicons v2 с артефактами и рассинхроном SSR/клиента.
 */
export function ShoppingCartIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 1.95-1.51L23 6H6"
      />
      <circle cx="9" cy="21" r="1.5" />
      <circle cx="20" cy="21" r="1.5" />
    </IconBase>
  );
}
