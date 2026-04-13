/**
 * Подпись и поля формы Robokassa (сервер).
 * @see https://docs.robokassa.ru/ru/pay-interface
 * @see https://docs.robokassa.ru/ru/notifications-and-redirects
 */

import crypto from "crypto";

export const ROBOKASSA_PAYMENT_URL = "https://auth.robokassa.ru/Merchant/Index.aspx";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v?.trim()) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return v.trim();
}

function hashHex(algorithm: string, raw: string): string {
  const a = algorithm.toLowerCase();
  if (a === "md5") return crypto.createHash("md5").update(raw, "utf8").digest("hex");
  if (a === "sha256") return crypto.createHash("sha256").update(raw, "utf8").digest("hex");
  if (a === "sha512") return crypto.createHash("sha512").update(raw, "utf8").digest("hex");
  throw new Error(`Unsupported ROBOKASSA_HASH_ALGORITHM: ${algorithm}`);
}

export function receiptJsonMinified(obj: Record<string, unknown>): string {
  return JSON.stringify(obj);
}

/** Как в примерах Робокассы: UTF-8 JSON, затем URL-кодирование для поля Receipt и подписи. */
export function receiptUrlEncoded(obj: Record<string, unknown>): string {
  return encodeURIComponent(receiptJsonMinified(obj));
}

function sortedShpParts(shp: Record<string, string> | undefined): string[] {
  if (!shp || Object.keys(shp).length === 0) return [];
  const entries = Object.entries(shp).filter(([k]) => k.toLowerCase().startsWith("shp_"));
  entries.sort(([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase()));
  return entries.map(([k, v]) => `${k}=${v}`);
}

export function buildPaymentSignatureBase(params: {
  merchantLogin: string;
  outSum: string;
  invId: string;
  password1: string;
  receiptUrlEncoded?: string | null;
  shp?: Record<string, string>;
}): string {
  const parts = [params.merchantLogin, params.outSum, params.invId];
  if (params.receiptUrlEncoded != null && params.receiptUrlEncoded !== "") {
    parts.push(params.receiptUrlEncoded);
  }
  parts.push(params.password1);
  let base = parts.join(":");
  const shpParts = sortedShpParts(params.shp);
  if (shpParts.length) base += ":" + shpParts.join(":");
  return base;
}

export function signPaymentRequest(params: {
  merchantLogin: string;
  outSum: string;
  invId: string;
  password1: string;
  receiptUrlEncoded?: string | null;
  shp?: Record<string, string>;
  algorithm: string;
}): string {
  const base = buildPaymentSignatureBase(params);
  return hashHex(params.algorithm, base);
}

export function buildResultSignatureBase(params: {
  outSum: string;
  invId: string;
  password2: string;
  shp?: Record<string, string>;
}): string {
  let base = `${params.outSum}:${params.invId}:${params.password2}`;
  const shpParts = sortedShpParts(params.shp);
  if (shpParts.length) base += ":" + shpParts.join(":");
  return base;
}

export function verifyResultSignature(params: {
  outSum: string;
  invId: string;
  password2: string;
  receivedSignature: string;
  shp?: Record<string, string>;
  algorithm: string;
}): boolean {
  const base = buildResultSignatureBase({
    outSum: params.outSum,
    invId: params.invId,
    password2: params.password2,
    shp: params.shp,
  });
  const expected = hashHex(params.algorithm, base).toLowerCase();
  const got = (params.receivedSignature || "").trim().toLowerCase();
  return got === expected;
}

export function extractShpFromParams(flat: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, val] of Object.entries(flat)) {
    if (key.toLowerCase().startsWith("shp_")) {
      out[key] = val;
    }
  }
  return out;
}

export function parseRobokassaFlatParams(
  searchParams: URLSearchParams,
): Record<string, string> {
  const out: Record<string, string> = {};
  searchParams.forEach((v, k) => {
    out[k] = v;
  });
  return out;
}

export function normalizeInvId(flat: Record<string, string>): string | null {
  const keys = ["InvId", "InvID", "inv_id", "invId", "invoiceid", "InvoiceID", "InvoiceId"];
  for (const k of keys) {
    const v = flat[k]?.trim();
    if (v && /^\d+$/.test(v)) return v;
  }
  return null;
}

export function normalizeOutSum(flat: Record<string, string>): string | null {
  for (const k of ["OutSum", "out_summ", "OutSumm"]) {
    const v = flat[k]?.trim();
    if (v) return v;
  }
  return null;
}

export function normalizeSignatureValue(flat: Record<string, string>): string | null {
  for (const k of ["SignatureValue", "crc", "CRC"]) {
    const v = flat[k]?.trim();
    if (v) return v;
  }
  return null;
}

export function amountsMatchRobokassa(storedAmount: string, outSum: string, eps = 0.02): boolean {
  const a = parseFloat(storedAmount.replace(",", "."));
  const b = parseFloat(outSum.replace(",", "."));
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  return Math.abs(a - b) <= eps;
}

export function buildRobokassaReceipt(params: {
  amountValue: string;
  description: string;
  customerEmail: string;
}): Record<string, unknown> {
  const tax = (process.env.ROBOKASSA_RECEIPT_ITEM_TAX || "vat20").trim().toLowerCase();
  const allowed = new Set(["none", "vat0", "vat10", "vat20", "vat110", "vat120"]);
  const t = allowed.has(tax) ? tax : "vat20";
  const sum = parseFloat(params.amountValue);
  const name = params.description.replace(/[\r\n]+/g, " ").slice(0, 128);
  const item = {
    name,
    quantity: 1,
    sum: Math.round(sum * 100) / 100,
    payment_method: "full_payment",
    payment_object: "service",
    tax: t,
  };
  const receipt: Record<string, unknown> = { items: [item] };
  const sno = process.env.ROBOKASSA_SNO?.trim();
  if (sno) receipt.sno = sno;
  return receipt;
}

export function getRobokassaConfig() {
  return {
    merchantLogin: requireEnv("ROBOKASSA_MERCHANT_LOGIN"),
    password1: requireEnv("ROBOKASSA_PASSWORD_1"),
    password2: requireEnv("ROBOKASSA_PASSWORD_2"),
    isTest: process.env.ROBOKASSA_IS_TEST === "1" || process.env.ROBOKASSA_IS_TEST === "true",
    algorithm: (process.env.ROBOKASSA_HASH_ALGORITHM || "md5").trim().toLowerCase(),
  };
}

export function buildRobokassaPaymentFormFields(params: {
  amountValue: string;
  invId: string;
  description: string;
  email: string;
  receipt: Record<string, unknown> | null;
}): Record<string, string> {
  const cfg = getRobokassaConfig();
  const outSum = params.amountValue;
  const invId = params.invId;
  const desc = params.description.slice(0, 100);
  const receiptEnc = params.receipt ? receiptUrlEncoded(params.receipt) : null;
  const sig = signPaymentRequest({
    merchantLogin: cfg.merchantLogin,
    outSum,
    invId,
    password1: cfg.password1,
    receiptUrlEncoded: receiptEnc,
    algorithm: cfg.algorithm,
  });
  const fields: Record<string, string> = {
    MerchantLogin: cfg.merchantLogin,
    OutSum: outSum,
    InvId: invId,
    Description: desc,
    SignatureValue: sig,
    Culture: "ru",
  };
  if (params.email.trim()) fields.Email = params.email.trim().slice(0, 100);
  if (receiptEnc != null) fields.Receipt = receiptEnc;
  if (cfg.isTest) fields.IsTest = "1";
  return fields;
}

export function generateRobokassaInvId(): string {
  const n =
    BigInt(Date.now()) * BigInt(10000) + BigInt(crypto.randomInt(0, 10000));
  return n.toString();
}
