"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getCurrentSessionUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

export type CustomerActionState =
  | { ok: true }
  | { ok: false; message: string };

const customerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  segment: z.string().trim().optional().or(z.literal("")),
  industry: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "PROSPECT", "CHURN_RISK"]).default("ACTIVE"),
});

async function requireAdminAndGetContext(): Promise<{
  userId: string;
  isSuperAdmin: boolean;
  organizationId: string | null;
}> {
  const session = await getCurrentSessionUser();
  if (!session) redirect("/login");

  if (session.user.isSuperAdmin) {
    return { userId: session.user.id, isSuperAdmin: true, organizationId: null };
  }

  const membership = await prisma.membership.findFirst({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
      role: { in: ["ADMIN", "MANAGER"] },
    },
  });

  if (!membership) redirect("/app/dashboard");
  return { userId: session.user.id, isSuperAdmin: false, organizationId: membership.organizationId };
}

export async function createCustomerAction(
  _prev: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const parsed = customerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    segment: formData.get("segment"),
    industry: formData.get("industry"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Lütfen müşteri bilgilerini kontrol edin." };
  }

  const { userId, organizationId } = await requireAdminAndGetContext();
  const resolvedOrganizationId = organizationId ?? "atlascrm-default";

  const customer = await prisma.customer.create({
    data: {
      organizationId: resolvedOrganizationId,
      name: parsed.data.name,
      email: parsed.data.email ? parsed.data.email : null,
      phone: parsed.data.phone ? parsed.data.phone : null,
      segment: parsed.data.segment ? parsed.data.segment : null,
      industry: parsed.data.industry ? parsed.data.industry : null,
      status: parsed.data.status,
      ownerUserId: userId,
    },
  });

  await prisma.activity.create({
    data: {
      organizationId: customer.organizationId,
      actorUserId: userId,
      action: "Customer created",
      entityType: "Customer",
      entityId: customer.id,
      metadata: { name: customer.name },
    },
  });

  redirect(`/app/admin/customers/${customer.id}`);
}

export async function updateCustomerAction(
  customerId: string,
  _prev: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const parsed = customerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    segment: formData.get("segment"),
    industry: formData.get("industry"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Lütfen müşteri bilgilerini kontrol edin." };
  }

  const { userId, isSuperAdmin, organizationId } = await requireAdminAndGetContext();

  const existing = await prisma.customer.findFirst({
    where: isSuperAdmin
      ? { id: customerId }
      : { id: customerId, organizationId: organizationId ?? "" },
    select: { id: true },
  });

  if (!existing) {
    return { ok: false, message: "Müşteri bulunamadı." };
  }

  const customer = await prisma.customer.update({
    where: { id: customerId },
    data: {
      name: parsed.data.name,
      email: parsed.data.email ? parsed.data.email : null,
      phone: parsed.data.phone ? parsed.data.phone : null,
      segment: parsed.data.segment ? parsed.data.segment : null,
      industry: parsed.data.industry ? parsed.data.industry : null,
      status: parsed.data.status,
    },
  });

  await prisma.activity.create({
    data: {
      organizationId: customer.organizationId,
      actorUserId: userId,
      action: "Customer updated",
      entityType: "Customer",
      entityId: customer.id,
      metadata: { name: customer.name },
    },
  });

  redirect(`/app/admin/customers/${customer.id}`);
}

export async function deleteCustomerAction(customerId: string): Promise<void> {
  const { userId, isSuperAdmin, organizationId } = await requireAdminAndGetContext();

  const existing = await prisma.customer.findFirst({
    where: isSuperAdmin
      ? { id: customerId }
      : { id: customerId, organizationId: organizationId ?? "" },
    select: { id: true, organizationId: true },
  });

  if (!existing) {
    redirect("/app/admin/customers");
  }

  await prisma.customer.delete({ where: { id: customerId } });

  await prisma.activity.create({
    data: {
      organizationId: existing.organizationId,
      actorUserId: userId,
      action: "Customer deleted",
      entityType: "Customer",
      entityId: customerId,
    },
  });

  redirect("/app/admin/customers");
}
