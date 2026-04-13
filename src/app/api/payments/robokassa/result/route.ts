import { NextResponse } from "next/server";
import {
  amountsMatchRobokassa,
  extractShpFromParams,
  getRobokassaConfig,
  normalizeInvId,
  normalizeOutSum,
  normalizeSignatureValue,
  parseRobokassaFlatParams,
  verifyResultSignature,
} from "@/lib/robokassa-client";
import {
  robokassaPendingGet,
  robokassaPendingMarkSucceeded,
} from "@/lib/robokassa-pending-store";
import { getPaymentGateway } from "@/lib/payment-gateway";

function flatFromFormData(fd: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  fd.forEach((val, key) => {
    if (typeof val === "string") out[key] = val;
  });
  return out;
}

/**
 * ResultURL Robokassa. Ответ OK{InvId} в plain text.
 * Настройте в ЛК: https://your-domain/api/payments/robokassa/result
 */
export async function GET(request: Request) {
  return handleResult(request, parseRobokassaFlatParams(new URL(request.url).searchParams));
}

export async function POST(request: Request) {
  const ct = request.headers.get("content-type") || "";
  if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
    const fd = await request.formData();
    return handleResult(request, flatFromFormData(fd));
  }
  return NextResponse.json({ error: "Expected form body" }, { status: 400 });
}

function handleResult(_request: Request, flat: Record<string, string>): NextResponse {
  if (getPaymentGateway() !== "robokassa") {
    return new NextResponse("NOT_CONFIGURED", { status: 404 });
  }

  const invId = normalizeInvId(flat);
  const outSum = normalizeOutSum(flat);
  const sig = normalizeSignatureValue(flat);

  if (!invId || !outSum || !sig) {
    return new NextResponse("BAD_PARAMS", { status: 400 });
  }

  let cfg: ReturnType<typeof getRobokassaConfig>;
  try {
    cfg = getRobokassaConfig();
  } catch {
    return new NextResponse("CONFIG", { status: 503 });
  }

  const shp = extractShpFromParams(flat);
  const shpForSig = Object.keys(shp).length ? shp : undefined;

  const ok = verifyResultSignature({
    outSum,
    invId,
    password2: cfg.password2,
    receivedSignature: sig,
    shp: shpForSig,
    algorithm: cfg.algorithm,
  });

  if (!ok) {
    return new NextResponse("BAD_SIGN", { status: 400 });
  }

  const row = robokassaPendingGet(invId);
  if (!row) {
    return new NextResponse("NO_PAYMENT", { status: 404 });
  }

  if (!amountsMatchRobokassa(row.amount, outSum)) {
    return new NextResponse("BAD_AMOUNT", { status: 400 });
  }

  if (row.status !== "succeeded") {
    robokassaPendingMarkSucceeded(invId);
  }

  return new NextResponse(`OK${invId}`, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
