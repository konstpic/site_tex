import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  normalizePhoneDigits,
  parseCustomerContact,
} from "@/lib/customer-contact";
import { buildPricedOrderFromLines } from "@/lib/payment-order";
import { getPaymentGateway, getPaymentSuccessReturnUrl } from "@/lib/payment-gateway";
import {
  selfworkPendingGet,
  selfworkPendingMarkSucceeded,
  selfworkPendingPut,
} from "@/lib/selfwork-pending-store";
import {
  buildSelfworkInfoItems,
  buildSelfworkInitFormFields,
  fetchSelfworkPaymentStatus,
  generateSelfworkOrderId,
  getSelfworkInitUrl,
  getSelfworkMerchantConfig,
} from "@/lib/selfwork-client";
import { notifyOrderLeadToTelegram } from "@/lib/telegram-order-notify";
import {
  yooKassaCreatePayment,
  yooKassaGetPayment,
} from "@/lib/yookassa-client";
import type { CartLineInput } from "@/lib/payment-order";

/** Статус после возврата с оплаты (ЮKassa API или локальный store Сам.Эквайринг). */
export async function GET(request: Request) {
  const paymentId = new URL(request.url).searchParams.get("payment_id");
  if (!paymentId?.trim()) {
    return NextResponse.json({ error: "Не указан payment_id" }, { status: 400 });
  }
  const id = paymentId.trim();

  try {
    const gw = getPaymentGateway();
    if (gw === "selfwork") {
      const row = selfworkPendingGet(id);
      if (row?.status === "succeeded") {
        return NextResponse.json({
          id,
          status: "succeeded",
          paid: true,
        });
      }
      if (!row) {
        return NextResponse.json(
          { error: "Платёж не найден или истёк" },
          { status: 404 },
        );
      }
      try {
        const remote = await fetchSelfworkPaymentStatus(id);
        if (remote?.status === "succeeded" && remote.amount === row.amountKopecks) {
          selfworkPendingMarkSucceeded(id);
          return NextResponse.json({
            id,
            status: "succeeded",
            paid: true,
          });
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : "status error";
        return NextResponse.json(
          { error: message },
          { status: 502 },
        );
      }
      return NextResponse.json({
        id,
        status: "pending",
        paid: false,
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

    if (gw === "selfwork") {
      const { secretKey } = getSelfworkMerchantConfig();
      const infoItems = buildSelfworkInfoItems(
        lineInputs,
        order.description,
        order.totalKopecks,
      );
      if (infoItems.length === 0) {
        return NextResponse.json(
          { error: "Не удалось сформировать позиции чека" },
          { status: 400 },
        );
      }
      const orderId = generateSelfworkOrderId();
      selfworkPendingPut(orderId, order.totalKopecks);
      const paymentForm = buildSelfworkInitFormFields({
        orderId,
        amountKopecks: order.totalKopecks,
        items: infoItems,
        secretKey,
      });
      return NextResponse.json({
        paymentId: orderId,
        paymentProvider: "selfwork",
        paymentAction: getSelfworkInitUrl(),
        paymentMethod: "POST",
        paymentForm,
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
