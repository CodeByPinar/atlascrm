import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/server/db/prisma";
import { deleteTaskAction } from "@/server/actions/admin/tasks";

import { AdminPageHeader, EmptyState, SectionCard } from "@/app/app/admin/_components";
import { requireAdmin } from "@/app/app/admin/_state/require-admin";

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default async function AdminTaskDetailPage({
  params,
}: {
  params: { taskId: string };
}) {
  const { session, adminMembership } = await requireAdmin();
  const isSuperAdmin = session.user.isSuperAdmin;
  const organizationId = isSuperAdmin ? null : adminMembership?.organizationId ?? null;

  const task = await prisma.task.findFirst({
    where: isSuperAdmin
      ? { id: params.taskId }
      : { id: params.taskId, organizationId: organizationId ?? "" },
    include: {
      customer: { select: { id: true, name: true } },
      organization: { select: { id: true, name: true } },
    },
  });

  if (!task) notFound();

  const deleteAction = deleteTaskAction.bind(null, task.id);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={task.title}
        description="Görev detay görünümü (özet)."
        breadcrumb={[
          { label: "Uygulama", href: "/app/dashboard" },
          { label: "Admin", href: "/app/admin/dashboard" },
          { label: "Görevler", href: "/app/admin/tasks" },
          { label: "Detay" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-atlas-steel">
              {task.status} • {task.priority}
            </span>
            <Link
              href={`/app/admin/tasks/${task.id}/edit`}
              className="inline-flex items-center justify-center rounded-xl bg-atlas-blue px-4 py-2 text-sm font-semibold text-white outline-none ring-atlas-teal/40 transition hover:bg-atlas-blue/95 focus-visible:ring-4"
            >
              Düzenle
            </Link>
            <form action={deleteAction}>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-system-error outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
              >
                Sil
              </button>
            </form>
          </div>
        }
      />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Bilgiler" description="Görev meta bilgileri.">
          <dl className="grid grid-cols-1 gap-3 text-sm">
            <div className="rounded-xl border border-black/10 bg-white p-4">
              <dt className="text-xs font-medium text-atlas-steel">Organizasyon</dt>
              <dd className="mt-1 font-semibold text-atlas-blue">{task.organization.name}</dd>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-4">
              <dt className="text-xs font-medium text-atlas-steel">Müşteri</dt>
              <dd className="mt-1 font-semibold text-atlas-blue">{task.customer?.name ?? "—"}</dd>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-4">
              <dt className="text-xs font-medium text-atlas-steel">Termin</dt>
              <dd className="mt-1 font-semibold text-atlas-blue">
                {task.dueDate ? formatDateTime(task.dueDate) : "—"}
              </dd>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-4">
              <dt className="text-xs font-medium text-atlas-steel">Son güncelleme</dt>
              <dd className="mt-1 font-semibold text-atlas-blue">{formatDateTime(task.updatedAt)}</dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard title="Aktivite" description="Son hareketler dashboard’da görünür.">
          <EmptyState
            title="Aktivite akışı"
            description="Görev üzerinde değişiklik yaptığınızda Activity log yazılır ve kontrol panelinde görünür."
            primaryAction={{ label: "Görevleri aç", href: "/app/admin/tasks" }}
          />
        </SectionCard>
      </section>
    </div>
  );
}
