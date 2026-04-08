import { NextResponse } from "next/server";

/** ИНН для подвала (клиент) — читается из env на каждый запрос. */
export function GET() {
  const inn = process.env.INN?.trim() || null;
  return NextResponse.json({ inn });
}
