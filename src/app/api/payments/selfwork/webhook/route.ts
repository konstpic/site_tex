import { NextResponse } from "next/server";
import {
  getClientIpFromRequest,
  getSelfworkMerchantConfig,
  isSelfworkWebhookIpAllowed,
  verifySelfworkWebhookSignature,
} from "@/lib/selfwork-client";
import {
  selfworkPendingGet,
  selfworkPendingMarkSucceeded,
} from "@/lib/selfwork-pending-store";

type WebhookBody = {
  order_id?: string;
  status?: string;
  amount?: string | number;
  signature?: string;
};

/**
 * Callback Сам.Эквайринг (payment.succeeded).
 * Настройте в ЛК: https://<домен>/api/payments/selfwork/webhook
 */
export async function POST(request: Request) {
  const ip = getClientIpFromRequest(request);
  if (!isSelfworkWebhookIpAllowed(ip)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: WebhookBody;
  try {
    body = (await request.json()) as WebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const orderId = typeof body.order_id === "string" ? body.order_id.trim() : "";
  const status = typeof body.status === "string" ? body.status.trim() : "";
  const signature =
    typeof body.signature === "string" ? body.signature.trim() : "";

  if (!orderId || !signature || body.amount === undefined || body.amount === null) {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }

  let secretKey: string;
  try {
    secretKey = getSelfworkMerchantConfig().secretKey;
  } catch {
    return NextResponse.json({ error: "Config" }, { status: 503 });
  }

  if (
    !verifySelfworkWebhookSignature({
      orderId,
      amountRaw: body.amount,
      signature,
      secretKey,
    })
  ) {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  if (status !== "succeeded") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const amountNum =
    typeof body.amount === "number"
      ? body.amount
      : Math.round(Number(String(body.amount).replace(/\s/g, "")));
  if (!Number.isFinite(amountNum)) {
    return NextResponse.json({ error: "Bad amount" }, { status: 400 });
  }

  const row = selfworkPendingGet(orderId);
  if (!row) {
    return NextResponse.json({ error: "Unknown order" }, { status: 404 });
  }
  if (row.amountKopecks !== amountNum) {
    return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
  }

  selfworkPendingMarkSucceeded(orderId);
  return NextResponse.json({ ok: true });
}
