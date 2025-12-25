"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getCurrentSessionUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { createHash, randomBytes } from "node:crypto";

export type CreatePaidActivationCodeState =
  | { ok: true; activationCode: string; expiresAt: string }
  | { ok: false; message: string };

const createPaidCodeSchema = z.object({
  email: z.string().trim().email().max(254),
  organizationName: z.string().trim().min(2).max(160),
  expiresInHours: z.string().trim().optional().or(z.literal("")),
});

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeActivationCode(code: string): string {
  return code.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

function generateActivationCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(16);
  const chars = Array.from(bytes, (b) => alphabet[b % alphabet.length]);
  const raw = chars.join("");
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}`;
}

async function requireAdminOrSuperAdmin(): Promise<{ userId: string; isSuperAdmin: boolean }> {
  const session = await getCurrentSessionUser();
  if (!session) redirect("/login");

  if (session.user.isSuperAdmin) {
    return { userId: session.user.id, isSuperAdmin: true };
  }

  const membership = await prisma.membership.findFirst({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
      role: { in: ["ADMIN", "MANAGER"] },
    },
    select: { id: true },
  });

  if (!membership) redirect("/app/dashboard");
  return { userId: session.user.id, isSuperAdmin: false };
}

function getExpiry(hoursRaw: string | undefined): Date {
  const hours = Number(hoursRaw);
  const ttl = Number.isFinite(hours) && hours >= 1 && hours <= 720 ? hours : 72;
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + ttl);
  return expiresAt;
}

export async function createPaidActivationCodeAction(
  _prev: CreatePaidActivationCodeState,
  formData: FormData,
): Promise<CreatePaidActivationCodeState> {
  const parsed = createPaidCodeSchema.safeParse({
    email: formData.get("email"),
    organizationName: formData.get("organizationName"),
    expiresInHours: formData.get("expiresInHours"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Lütfen e-posta ve organizasyon adını kontrol edin." };
  }

  await requireAdminOrSuperAdmin();

  const email = normalizeEmail(parsed.data.email);
  const organizationName = parsed.data.organizationName.trim();
  const expiresAt = getExpiry(parsed.data.expiresInHours ?? undefined);

  const activationCode = generateActivationCode();
  const normalizedCode = normalizeActivationCode(activationCode);
  const codeHash = sha256(normalizedCode);

  await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        name: organizationName,
      },
      select: { id: true },
    });

    await tx.demoActivationCode.create({
      data: {
        codeHash,
        kind: "PAID",
        email,
        organizationId: organization.id,
        expiresAt,
      },
    });

    await tx.contactRequest.create({
      data: {
        name: "Satış Onayı",
        email,
        company: organizationName,
        message: [
          "[Sale: approved]",
          `[Org: ${organizationName}]`,
          `[Kind: PAID]`,
          `[ExpiresAt: ${expiresAt.toISOString()}]`,
        ].join("\n"),
      },
    });
  });

  return { ok: true, activationCode, expiresAt: expiresAt.toISOString() };
}
