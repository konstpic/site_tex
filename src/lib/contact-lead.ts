import { isEmailPlausible, isPhonePlausible } from "@/lib/customer-contact";

export type ContactLeadPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export function parseContactLeadPayload(raw: unknown): ContactLeadPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const name = typeof o.name === "string" ? o.name.trim() : "";
  const email = typeof o.email === "string" ? o.email.trim() : "";
  const phone = typeof o.phone === "string" ? o.phone.trim() : "";
  const message = typeof o.message === "string" ? o.message.trim() : "";

  if (name.length < 2 || name.length > 200) return null;
  if (!isEmailPlausible(email)) return null;
  if (phone && !isPhonePlausible(phone)) return null;
  if (message.length < 3 || message.length > 4000) return null;

  return { name, email, phone, message };
}
