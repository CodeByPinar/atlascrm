"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getCurrentSessionUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

export type LeadActionState =
  | { ok: true }
  | { ok: false; message: string };

const leadSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  company: z.string().trim().optional().or(z.literal("")),
  source: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"]).default("NEW"),
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

export async function createLeadAction(
  _prev: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    source: formData.get("source"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Lütfen lead bilgilerini kontrol edin." };
  }

  const { userId, organizationId } = await requireAdminAndGetContext();
  const resolvedOrganizationId = organizationId ?? "atlascrm-default";

  const lead = await prisma.lead.create({
    data: {
      organizationId: resolvedOrganizationId,
      name: parsed.data.name,
      email: parsed.data.email ? parsed.data.email : null,
      phone: parsed.data.phone ? parsed.data.phone : null,
      company: parsed.data.company ? parsed.data.company : null,
      source: parsed.data.source ? parsed.data.source : null,
      status: parsed.data.status,
      ownerUserId: userId,
      lastActivityAt: new Date(),
    },
  });

  await prisma.activity.create({
    data: {
      organizationId: lead.organizationId,
      actorUserId: userId,
      action: "Lead created",
      entityType: "Lead",
      entityId: lead.id,
      metadata: { name: lead.name, status: lead.status },
    },
  });

  redirect(`/app/admin/leads/${lead.id}`);
}

export async function updateLeadAction(
  leadId: string,
  _prev: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    source: formData.get("source"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Lütfen lead bilgilerini kontrol edin." };
  }

  const { userId, isSuperAdmin, organizationId } = await requireAdminAndGetContext();

  const existing = await prisma.lead.findFirst({
    where: isSuperAdmin
      ? { id: leadId }
      : { id: leadId, organizationId: organizationId ?? "" },
    select: { id: true },
  });

  if (!existing) {
    return { ok: false, message: "Lead bulunamadı." };
  }

  const lead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      name: parsed.data.name,
      email: parsed.data.email ? parsed.data.email : null,
      phone: parsed.data.phone ? parsed.data.phone : null,
      company: parsed.data.company ? parsed.data.company : null,
      source: parsed.data.source ? parsed.data.source : null,
      status: parsed.data.status,
      lastActivityAt: new Date(),
    },
  });

  await prisma.activity.create({
    data: {
      organizationId: lead.organizationId,
      actorUserId: userId,
      action: "Lead updated",
      entityType: "Lead",
      entityId: lead.id,
      metadata: { name: lead.name, status: lead.status },
    },
  });

  redirect(`/app/admin/leads/${lead.id}`);
}

export async function deleteLeadAction(leadId: string): Promise<void> {
  const { userId, isSuperAdmin, organizationId } = await requireAdminAndGetContext();

  const existing = await prisma.lead.findFirst({
    where: isSuperAdmin
      ? { id: leadId }
      : { id: leadId, organizationId: organizationId ?? "" },
    select: { id: true, organizationId: true },
  });

  if (!existing) {
    redirect("/app/admin/leads");
  }

  await prisma.lead.delete({ where: { id: leadId } });

  await prisma.activity.create({
    data: {
      organizationId: existing.organizationId,
      actorUserId: userId,
      action: "Lead deleted",
      entityType: "Lead",
      entityId: leadId,
    },
  });

  redirect("/app/admin/leads");
}
