import { NextResponse } from "next/server";
import { parseContactLeadPayload } from "@/lib/contact-lead";
import { notifyContactFormToTelegram } from "@/lib/telegram-order-notify";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const lead = parseContactLeadPayload(body);
  if (!lead) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await notifyContactFormToTelegram(lead);

  return NextResponse.json({ ok: true });
}
