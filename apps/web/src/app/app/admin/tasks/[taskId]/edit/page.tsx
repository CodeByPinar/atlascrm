import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/server/db/prisma";
import { updateTaskAction } from "@/server/actions/admin/tasks";

import { AdminPageHeader, SectionCard } from "@/app/app/admin/_components";
import { requireAdmin } from "@/app/app/admin/_state/require-admin";
import TaskForm from "@/app/app/admin/tasks/_components/TaskForm";

function formatDateValue(date: Date | null): string {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function AdminTaskEditPage({
  params,
}: {
  params: { taskId: string };
}) {
  const { session, adminMembership } = await requireAdmin();

  const isSuperAdmin = session.user.isSuperAdmin;
  const organizationId = isSuperAdmin ? null : adminMembership?.organizationId ?? null;

  const task = await prisma.task.findFirst({
    where: isSuperAdmin ? { id: params.taskId } : { id: params.taskId, organizationId: organizationId ?? "" },
  });

  if (!task) notFound();

  const customers = await prisma.customer.findMany({
    where: organizationId ? { organizationId } : undefined,
    orderBy: { name: "asc" },
    take: 50,
    select: { id: true, name: true },
  });

  const action = updateTaskAction.bind(null, task.id);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Görev Düzenle"
        description={task.title}
        breadcrumb={[
          { label: "Uygulama", href: "/app/dashboard" },
          { label: "Admin", href: "/app/admin/dashboard" },
          { label: "Görevler", href: "/app/admin/tasks" },
          { label: "Detay", href: `/app/admin/tasks/${task.id}` },
          { label: "Düzenle" },
        ]}
        actions={
          <Link
            href={`/app/admin/tasks/${task.id}`}
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-atlas-blue outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
          >
            Detaya dön
          </Link>
        }
      />

      <SectionCard title="Görev Bilgileri" description="Değişiklikleri kaydedin.">
        <TaskForm
          action={action}
          submitLabel="Kaydet"
          customerOptions={customers}
          initial={{
            title: task.title,
            status: task.status,
            priority: task.priority,
            dueDate: formatDateValue(task.dueDate),
            customerId: task.customerId ?? "",
          }}
        />
      </SectionCard>
    </div>
  );
}
