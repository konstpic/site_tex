import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  normalizePhoneDigits,
  parseCustomerContact,
} from "@/lib/customer-contact";
import { buildPricedOrderFromLines } from "@/lib/payment-order";
import {
  getYooKassaReturnUrl,
  yooKassaCreatePayment,
  yooKassaGetPayment,
} from "@/lib/yookassa-client";

/** Проверка статуса платежа (после возврата с ЮKassa). */
export async function GET(request: Request) {
  const paymentId = new URL(request.url).searchParams.get("payment_id");
  if (!paymentId?.trim()) {
    return NextResponse.json({ error: "Не указан payment_id" }, { status: 400 });
  }
  try {
    const p = await yooKassaGetPayment(paymentId.trim());
    return NextResponse.json(p);
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Не удалось получить платёж";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      lines?: unknown;
      customer?: unknown;
    };
    const lines = body.lines;

    const customer = parseCustomerContact(body.customer);
    if (!customer) {
      return NextResponse.json(
        { error: "Укажите имя, телефон и корректный email" },
        { status: 400 },
      );
    }

    const order = buildPricedOrderFromLines(
      Array.isArray(lines) ? lines : [],
    );

    if (!order.ok) {
      return NextResponse.json({ error: order.error }, { status: 400 });
    }

    const returnUrl = getYooKassaReturnUrl();
    const phoneMeta = normalizePhoneDigits(customer.phone).slice(0, 32);

    const { confirmationUrl, id } = await yooKassaCreatePayment({
      amountValue: order.amountValue,
      description: order.description,
      returnUrl,
      idempotenceKey: randomUUID(),
      metadata: {
        customer_name: customer.name.slice(0, 256),
        customer_phone: phoneMeta,
        customer_email: customer.email.slice(0, 256),
      },
    });

    if (!confirmationUrl) {
      return NextResponse.json(
        { error: "ЮKassa не вернула ссылку на оплату" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      paymentId: id,
      confirmationUrl,
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Ошибка при создании платежа";
    const isConfig = message.startsWith("Missing environment variable");
    return NextResponse.json(
      { error: message },
      { status: isConfig ? 503 : 500 },
    );
  }
}
