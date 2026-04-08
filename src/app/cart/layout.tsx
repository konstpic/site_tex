import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Заказ и оплата",
  description: "Корзина услуг и оплата банковской картой (демонстрация сценария).",
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
