"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getCurrentSessionUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

export type TaskActionState =
  | { ok: true }
  | { ok: false; message: string };

const taskSchema = z.object({
  title: z.string().trim().min(3),
  status: z.enum(["OPEN", "IN_PROGRESS", "DONE", "BLOCKED"]).default("OPEN"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueDate: z.string().trim().optional().or(z.literal("")),
  customerId: z.string().trim().optional().or(z.literal("")),
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

function parseDueDate(value: string | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

export async function createTaskAction(
  _prev: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const parsed = taskSchema.safeParse({
    title: formData.get("title"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate"),
    customerId: formData.get("customerId"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Lütfen görev bilgilerini kontrol edin." };
  }

  const { userId, organizationId } = await requireAdminAndGetContext();
  const resolvedOrganizationId = organizationId ?? "atlascrm-default";

  const task = await prisma.task.create({
    data: {
      organizationId: resolvedOrganizationId,
      title: parsed.data.title,
      status: parsed.data.status,
      priority: parsed.data.priority,
      dueDate: parseDueDate(parsed.data.dueDate ?? undefined),
      customerId: parsed.data.customerId ? parsed.data.customerId : null,
      assigneeUserId: userId,
    },
  });

  await prisma.activity.create({
    data: {
      organizationId: task.organizationId,
      actorUserId: userId,
      action: "Task created",
      entityType: "Task",
      entityId: task.id,
      metadata: { title: task.title },
    },
  });

  redirect(`/app/admin/tasks/${task.id}`);
}

export async function updateTaskAction(
  taskId: string,
  _prev: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const parsed = taskSchema.safeParse({
    title: formData.get("title"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate"),
    customerId: formData.get("customerId"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Lütfen görev bilgilerini kontrol edin." };
  }

  const { userId, isSuperAdmin, organizationId } = await requireAdminAndGetContext();

  const existing = await prisma.task.findFirst({
    where: isSuperAdmin
      ? { id: taskId }
      : { id: taskId, organizationId: organizationId ?? "" },
    select: { id: true },
  });

  if (!existing) {
    return { ok: false, message: "Görev bulunamadı." };
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      title: parsed.data.title,
      status: parsed.data.status,
      priority: parsed.data.priority,
      dueDate: parseDueDate(parsed.data.dueDate ?? undefined),
      customerId: parsed.data.customerId ? parsed.data.customerId : null,
    },
  });

  await prisma.activity.create({
    data: {
      organizationId: task.organizationId,
      actorUserId: userId,
      action: "Task updated",
      entityType: "Task",
      entityId: task.id,
      metadata: { title: task.title },
    },
  });

  redirect(`/app/admin/tasks/${task.id}`);
}

export async function deleteTaskAction(taskId: string): Promise<void> {
  const { userId, isSuperAdmin, organizationId } = await requireAdminAndGetContext();

  const existing = await prisma.task.findFirst({
    where: isSuperAdmin
      ? { id: taskId }
      : { id: taskId, organizationId: organizationId ?? "" },
    select: { id: true, organizationId: true },
  });

  if (!existing) {
    redirect("/app/admin/tasks");
  }

  await prisma.task.delete({ where: { id: taskId } });

  await prisma.activity.create({
    data: {
      organizationId: existing.organizationId,
      actorUserId: userId,
      action: "Task deleted",
      entityType: "Task",
      entityId: taskId,
    },
  });

  redirect("/app/admin/tasks");
}
