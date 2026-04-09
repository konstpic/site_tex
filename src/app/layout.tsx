import type { Metadata } from "next";
import { Merriweather, Open_Sans } from "next/font/google";
import { CartFlyProvider } from "@/context/cart-fly-context";
import { CartProvider } from "@/context/cart-context";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE } from "@/lib/site";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-open-sans",
});

const merriweather = Merriweather({
  weight: ["400", "600", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-merriweather",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — удалённая техническая помощь`,
    template: `%s — ${SITE.name}`,
  },
  description:
    "Онлайн-консультации и настройка Windows, macOS, программ и мессенджеров. Без выезда — AnyDesk, Zoom. Быстро и безопасно.",
  themeColor: "#0d9488",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${openSans.variable} ${merriweather.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>
          <CartFlyProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </CartFlyProvider>
        </CartProvider>
      </body>
    </html>
  );
}
