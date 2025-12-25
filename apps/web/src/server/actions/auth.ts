"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createHash, randomBytes } from "node:crypto";

import { hashPassword, verifyPassword } from "@/server/auth/password";
import { createSession, deleteCurrentSession } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

const PASSWORD_MIN_LENGTH = 8;
const RESET_TOKEN_TTL_MINUTES = 30;
const DEMO_CODE_MAX_LENGTH = 64;

async function getPostAuthRedirectForUserId(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isSuperAdmin: true },
  });

  if (!user) return "/app/dashboard";
  if (user.isSuperAdmin) return "/app/admin/dashboard";

  const adminMembership = await prisma.membership.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      role: { in: ["ADMIN", "MANAGER"] },
    },
    select: { id: true },
  });

  return adminMembership ? "/app/admin/dashboard" : "/app/dashboard";
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function getResetTokenExpiry(): Date {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + RESET_TOKEN_TTL_MINUTES);
  return expiresAt;
}

function isPasswordStrongEnough(password: string): boolean {
  if (password.length < PASSWORD_MIN_LENGTH) return false;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasLetter && hasNumber;
}

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(PASSWORD_MIN_LENGTH),
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().email(),
});

const resetPasswordSchema = z
  .object({
    token: z.string().min(10),
    newPassword: z.string().min(PASSWORD_MIN_LENGTH),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirmPassword"],
  });

export type LoginActionState =
  | { ok: true }
  | { ok: false; message: string };

export type RegisterActionState =
  | { ok: true }
  | { ok: false; message: string };

export type ForgotPasswordActionState = {
  ok: true;
  message: string;
};

export type ResetPasswordActionState =
  | { ok: true }
  | { ok: false; message: string };

export type RedeemDemoCodeActionState =
  | { ok: true }
  | { ok: false; message: string };

const redeemDemoCodeSchema = z.object({
  code: z.string().trim().min(8).max(DEMO_CODE_MAX_LENGTH),
});

function normalizeActivationCode(code: string): string {
  return code.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Geçerli bir e-posta ve şifre girin." };
  }

  const email = normalizeEmail(parsed.data.email);
  const { password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: false, message: "E-posta veya şifre hatalı." };

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return { ok: false, message: "E-posta veya şifre hatalı." };

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await createSession(user.id);
  redirect(await getPostAuthRedirectForUserId(user.id));
}

export async function redeemDemoActivationCodeAction(
  _prevState: RedeemDemoCodeActionState,
  formData: FormData,
): Promise<RedeemDemoCodeActionState> {
  const parsed = redeemDemoCodeSchema.safeParse({
    code: formData.get("code"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Geçerli bir aktivasyon kodu girin." };
  }

  const normalizedCode = normalizeActivationCode(parsed.data.code);
  const codeHash = sha256(normalizedCode);
  const now = new Date();

  const record = await prisma.demoActivationCode.findFirst({
    where: {
      codeHash,
      redeemedAt: null,
      expiresAt: { gt: now },
    },
    select: { id: true, email: true, organizationId: true, kind: true },
  });

  if (!record) {
    return {
      ok: false,
      message: "Kod geçersiz, kullanılmış veya süresi dolmuş olabilir.",
    };
  }

  const email = normalizeEmail(record.email);

  const passwordHash = await hashPassword(randomBytes(32).toString("base64url"));

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email },
      update: { lastLoginAt: now },
      create: { email, passwordHash, lastLoginAt: now },
      select: { id: true },
    });

    const roleToGrant = record.kind === "PAID" ? "ADMIN" : "USER";

    await tx.membership.upsert({
      where: {
        organizationId_userId: {
          organizationId: record.organizationId,
          userId: user.id,
        },
      },
      update: { status: "ACTIVE", role: roleToGrant },
      create: {
        organizationId: record.organizationId,
        userId: user.id,
        status: "ACTIVE",
        role: roleToGrant,
      },
    });

    await tx.demoActivationCode.update({
      where: { id: record.id },
      data: { redeemedAt: now, redeemedByUserId: user.id },
    });
  });

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) {
    return { ok: false, message: "Oturum başlatılamadı. Lütfen tekrar deneyin." };
  }

  await createSession(user.id);
  redirect(await getPostAuthRedirectForUserId(user.id));
}

export async function registerAction(
  _prev: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Geçerli bir e-posta ve güçlü bir şifre girin." };
  }

  const email = normalizeEmail(parsed.data.email);
  const { password } = parsed.data;

  if (!isPasswordStrongEnough(password)) {
    return {
      ok: false,
      message: "Şifre en az 8 karakter olmalı ve en az 1 harf + 1 rakam içermelidir.",
    };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, message: "Bu e-posta zaten kayıtlı." };
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  const organization = await prisma.organization.upsert({
    where: { id: "atlascrm-default" },
    update: { name: "AtlasCRM" },
    create: { id: "atlascrm-default", name: "AtlasCRM" },
  });

  await prisma.membership.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: user.id,
      },
    },
    update: { status: "ACTIVE" },
    create: {
      organizationId: organization.id,
      userId: user.id,
      status: "ACTIVE",
      role: "USER",
    },
  });

  // Auto-login
  await createSession(user.id);
  redirect(await getPostAuthRedirectForUserId(user.id));
}

export async function requestPasswordResetAction(
  _prev: ForgotPasswordActionState,
  formData: FormData,
): Promise<ForgotPasswordActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  const genericMessage =
    "Eğer bu e-posta sistemimizde kayıtlıysa, şifre yenileme bağlantısı gönderildi.";

  if (!parsed.success) {
    return { ok: true, message: genericMessage };
  }

  const email = normalizeEmail(parsed.data.email);
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { ok: true, message: genericMessage };
  }

  const token = randomBytes(32).toString("base64url");
  const tokenHash = sha256(token);
  const expiresAt = getResetTokenExpiry();

  // Ensure only the latest token is valid.
  await prisma.$transaction([
    prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    }),
    prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    }),
  ]);

  // Email sending is Phase 2. (In development you can manually visit /reset-password?token=...)
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log(`[AtlasCRM] Password reset token for ${email}: /reset-password?token=${token}`);
  }

  return { ok: true, message: genericMessage };
}

export async function resetPasswordAction(
  _prev: ResetPasswordActionState,
  formData: FormData,
): Promise<ResetPasswordActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Lütfen şifre alanlarını kontrol edin." };
  }

  const { token, newPassword } = parsed.data;

  if (!isPasswordStrongEnough(newPassword)) {
    return {
      ok: false,
      message: "Şifre en az 8 karakter olmalı ve en az 1 harf + 1 rakam içermelidir.",
    };
  }

  const tokenHash = sha256(token);
  const now = new Date();

  const record = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: now },
    },
    select: { id: true, userId: true },
  });

  if (!record) {
    return {
      ok: false,
      message: "Bu bağlantı geçersiz veya süresi dolmuş. Lütfen yeniden talep edin.",
    };
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: now },
    }),
    prisma.session.deleteMany({
      where: { userId: record.userId },
    }),
  ]);

  redirect("/login");
}

export async function logoutAction(): Promise<void> {
  await deleteCurrentSession();
  redirect("/login");
}
