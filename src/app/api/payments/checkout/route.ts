import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  normalizePhoneDigits,
  parseCustomerContact,
} from "@/lib/customer-contact";
import { buildPricedOrderFromLines } from "@/lib/payment-order";
import { getPaymentGateway, getPaymentSuccessReturnUrl } from "@/lib/payment-gateway";
import {
  buildRobokassaPaymentFormFields,
  buildRobokassaReceipt,
  generateRobokassaInvId,
  ROBOKASSA_PAYMENT_URL,
} from "@/lib/robokassa-client";
import { robokassaPendingGet, robokassaPendingPut } from "@/lib/robokassa-pending-store";
import { notifyOrderLeadToTelegram } from "@/lib/telegram-order-notify";
import {
  yooKassaCreatePayment,
  yooKassaGetPayment,
} from "@/lib/yookassa-client";
import type { CartLineInput } from "@/lib/payment-order";

/** Статус после возврата с оплаты (ЮKassa API или локальный store Robokassa). */
export async function GET(request: Request) {
  const paymentId = new URL(request.url).searchParams.get("payment_id");
  if (!paymentId?.trim()) {
    return NextResponse.json({ error: "Не указан payment_id" }, { status: 400 });
  }
  const id = paymentId.trim();

  try {
    const gw = getPaymentGateway();
    if (gw === "robokassa") {
      const row = robokassaPendingGet(id);
      if (!row) {
        return NextResponse.json({ error: "Платёж не найден или истёк" }, { status: 404 });
      }
      const succeeded = row.status === "succeeded";
      return NextResponse.json({
        id,
        status: succeeded ? "succeeded" : "pending",
        paid: succeeded,
      });
    }

    const p = await yooKassaGetPayment(id);
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

    const gw = getPaymentGateway();
    const lineInputs = (Array.isArray(lines) ? lines : []) as CartLineInput[];
    await notifyOrderLeadToTelegram({
      customer,
      amountValue: order.amountValue,
      description: order.description,
      lines: lineInputs,
      gateway: gw,
    });

    if (gw === "robokassa") {
      const invId = generateRobokassaInvId();
      robokassaPendingPut(invId, order.amountValue);
      const receipt = buildRobokassaReceipt({
        amountValue: order.amountValue,
        description: order.description,
        customerEmail: customer.email,
      });
      const form = buildRobokassaPaymentFormFields({
        amountValue: order.amountValue,
        invId,
        description: order.description,
        email: customer.email,
        receipt,
      });
      return NextResponse.json({
        paymentId: invId,
        paymentProvider: "robokassa",
        paymentAction: ROBOKASSA_PAYMENT_URL,
        paymentMethod: "POST",
        paymentForm: form,
      });
    }

    const returnUrl = getPaymentSuccessReturnUrl();
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
      paymentProvider: "yookassa",
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
