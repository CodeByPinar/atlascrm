"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createHash, randomBytes } from "node:crypto";

import { prisma } from "@/server/db/prisma";

const DEMO_CODE_TTL_HOURS = 24;

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(4000),
  plan: z.string().trim().max(64).optional().or(z.literal("")),
  topic: z.string().trim().max(120).optional().or(z.literal("")),
  source: z.string().trim().max(60).optional().or(z.literal("")),
  mode: z.string().trim().max(40).optional().or(z.literal("")),
  organizationName: z.string().trim().max(160).optional().or(z.literal("")),
  userCount: z.string().trim().max(16).optional().or(z.literal("")),
  acceptTerms: z.string().optional().or(z.literal("")),
  acceptKvkk: z.string().optional().or(z.literal("")),
  website: z.string().optional(), // honeypot
});

export type ContactActionState =
  | { status: "idle" }
  | { status: "success"; activationCode?: string; activationExpiresAt?: string }
  | { status: "error"; message: string };

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeCode(code: string): string {
  return code.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

function generateActivationCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(16);
  const chars = Array.from(bytes, (b) => alphabet[b % alphabet.length]);
  const raw = chars.join("");
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}`;
}

function getDemoCodeExpiry(): Date {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + DEMO_CODE_TTL_HOURS);
  return expiresAt;
}

export async function submitContactAction(
  _prev: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    message: formData.get("message"),
    plan: formData.get("plan"),
    topic: formData.get("topic"),
    source: formData.get("source"),
    mode: formData.get("mode"),
    organizationName: formData.get("organizationName"),
    userCount: formData.get("userCount"),
    acceptTerms: formData.get("acceptTerms"),
    acceptKvkk: formData.get("acceptKvkk"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Lütfen geçerli bir ad, e‑posta ve mesaj girin.",
    };
  }

  // Simple bot mitigation: if honeypot filled, pretend success.
  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    return { status: "success" };
  }

  const hdrs = await headers();
  const userAgent = hdrs.get("user-agent") ?? undefined;
  const forwardedFor = hdrs.get("x-forwarded-for") ?? "";
  const ip = forwardedFor.split(",")[0]?.trim();
  const ipHash = ip ? sha256(ip) : undefined;

  const mode = parsed.data.mode?.trim().toLowerCase();
  const email = normalizeEmail(parsed.data.email);

  const planRaw = parsed.data.plan?.trim().toLowerCase();
  const planLabel =
    planRaw === "isletme"
      ? "İşletme"
      : planRaw === "kurumsal"
        ? "Kurumsal"
        : planRaw === "takim" || planRaw === "takım"
          ? "Takım"
          : undefined;

  const topic = parsed.data.topic?.trim();
  const source = parsed.data.source?.trim();

  const prefixLines = [
    planLabel ? `[Plan: ${planLabel}]` : null,
    topic && topic.length > 0 ? `[Topic: ${topic}]` : null,
    source && source.length > 0 ? `[Source: ${source}]` : null,
  ].filter(Boolean) as string[];

  let storedMessage =
    prefixLines.length > 0
      ? `${prefixLines.join("\n")}\n\n${parsed.data.message}`
      : parsed.data.message;

  if (mode === "demo") {
    const acceptTerms = (parsed.data.acceptTerms ?? "").toLowerCase() === "on";
    const acceptKvkk = (parsed.data.acceptKvkk ?? "").toLowerCase() === "on";

    const orgNameRaw = (parsed.data.organizationName ?? "").trim();
    const userCountRaw = (parsed.data.userCount ?? "").trim();
    const userCount = userCountRaw.length > 0 ? Number(userCountRaw) : NaN;

    if (!acceptTerms || !acceptKvkk) {
      return {
        status: "error",
        message: "Demo aktivasyonu için kullanım şartları ve KVKK onayı gereklidir.",
      };
    }

    if (orgNameRaw.length < 2) {
      return {
        status: "error",
        message: "Lütfen demo için organizasyon adını girin.",
      };
    }

    if (!Number.isInteger(userCount) || userCount < 1 || userCount > 10000) {
      return {
        status: "error",
        message: "Lütfen geçerli bir kullanıcı sayısı girin.",
      };
    }

    const activationCode = generateActivationCode();
    const normalizedCode = normalizeCode(activationCode);
    const codeHash = sha256(normalizedCode);
    const expiresAt = getDemoCodeExpiry();

    const demoPrefix = [
      "[Demo Request]",
      `[Org: ${orgNameRaw}]`,
      `[UserCount: ${String(userCount)}]`,
      "[Terms: accepted]",
      "[KVKK: accepted]",
    ].join("\n");

    storedMessage = `${demoPrefix}\n\n${storedMessage}`;

    const demoOrgName = `Demo - ${orgNameRaw}`;

    await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: { name: demoOrgName },
        select: { id: true },
      });

      await tx.demoActivationCode.create({
        data: {
          codeHash,
          kind: "DEMO",
          email,
          organizationId: organization.id,
          expiresAt,
        },
      });

      await tx.contactRequest.create({
        data: {
          name: parsed.data.name,
          email,
          company:
            parsed.data.company && parsed.data.company.trim().length > 0
              ? parsed.data.company.trim()
              : null,
          message: storedMessage,
          ipHash,
          userAgent,
        },
      });
    });

    return {
      status: "success",
      activationCode,
      activationExpiresAt: expiresAt.toISOString(),
    };
  }

  await prisma.contactRequest.create({
    data: {
      name: parsed.data.name,
      email,
      company:
        parsed.data.company && parsed.data.company.trim().length > 0
          ? parsed.data.company.trim()
          : null,
      message: storedMessage,
      ipHash,
      userAgent,
    },
  });

  return { status: "success" };
}
