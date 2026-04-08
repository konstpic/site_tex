const DEFAULT_PHONE = "+79257071892";
const DEFAULT_PHONE_DISPLAY = "+7 925 707-18-92";
const DEFAULT_EMAIL = "i@aramanovich.ru";

export const SITE = {
  name: "ТехПомощь Онлайн",
  tagline: "Удалённая помощь с техникой за 15 минут",
  phone: process.env.NEXT_PUBLIC_SITE_PHONE?.trim() || DEFAULT_PHONE,
  phoneDisplay:
    process.env.NEXT_PUBLIC_SITE_PHONE_DISPLAY?.trim() || DEFAULT_PHONE_DISPLAY,
  email: process.env.NEXT_PUBLIC_SITE_EMAIL?.trim() || DEFAULT_EMAIL,
  legalName:
    "Исполнитель — индивидуальный специалист, оказывающий услуги дистанционно",
} as const;

export const NAV = [
  { href: "/", label: "Главная" },
  { href: "/services", label: "Услуги" },
  { href: "/cart", label: "Заказ" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
] as const;
