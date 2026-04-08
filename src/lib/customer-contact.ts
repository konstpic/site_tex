/**
 * Контакты клиента при оформлении заказа (корзина → оплата).
 * Валидация общая для клиента и API.
 */

export type CustomerContact = {
  name: string;
  phone: string;
  email: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

/** Российский мобильный: 10 цифр (9…) или 11 (7… / 8…). */
export function isPhonePlausible(phone: string): boolean {
  const d = digitsOnly(phone);
  if (d.length === 10 && d.startsWith("9")) return true;
  if (d.length === 11 && (d.startsWith("7") || d.startsWith("8"))) return true;
  return false;
}

export function isEmailPlausible(email: string): boolean {
  const t = email.trim();
  return t.length <= 254 && EMAIL_RE.test(t);
}

export function parseCustomerContact(raw: unknown): CustomerContact | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const name = typeof o.name === "string" ? o.name.trim() : "";
  const phone = typeof o.phone === "string" ? o.phone.trim() : "";
  const email = typeof o.email === "string" ? o.email.trim() : "";

  if (name.length < 2 || name.length > 200) return null;
  if (!isPhonePlausible(phone)) return null;
  if (!isEmailPlausible(email)) return null;

  return { name, phone, email };
}

/** Для отображения / метаданных: нормализованные цифры телефона (11, с 7). */
export function normalizePhoneDigits(phone: string): string {
  const d = digitsOnly(phone);
  if (d.length === 10 && d.startsWith("9")) return `7${d}`;
  if (d.length === 11 && d.startsWith("8")) return `7${d.slice(1)}`;
  return d;
}
