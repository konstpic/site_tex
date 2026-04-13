import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Заказ и оплата",
  description:
    "Оформление тарифов доступа к защищённой сети и оплата картой через ЮKassa или Сам.Эквайринг.",
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
