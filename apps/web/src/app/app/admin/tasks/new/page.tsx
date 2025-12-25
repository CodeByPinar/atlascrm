import Link from "next/link";

import { prisma } from "@/server/db/prisma";
import { createTaskAction } from "@/server/actions/admin/tasks";

import { AdminPageHeader, SectionCard } from "@/app/app/admin/_components";
import { requireAdmin } from "@/app/app/admin/_state/require-admin";
import TaskForm from "@/app/app/admin/tasks/_components/TaskForm";

export default async function AdminTaskNewPage() {
  const { session, adminMembership } = await requireAdmin();

  const isSuperAdmin = session.user.isSuperAdmin;
  const organizationId = isSuperAdmin ? null : adminMembership?.organizationId ?? null;

  const customers = await prisma.customer.findMany({
    where: organizationId ? { organizationId } : undefined,
    orderBy: { name: "asc" },
    take: 50,
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Yeni Görev"
        description="Yeni görev oluşturun."
        breadcrumb={[
          { label: "Uygulama", href: "/app/dashboard" },
          { label: "Admin", href: "/app/admin/dashboard" },
          { label: "Görevler", href: "/app/admin/tasks" },
          { label: "Yeni" },
        ]}
        actions={
          <Link
            href="/app/admin/tasks"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-atlas-blue outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
          >
            Listeye dön
          </Link>
        }
      />

      <SectionCard title="Görev Bilgileri" description="Zorunlu alan: başlık.">
        <TaskForm action={createTaskAction} submitLabel="Görev oluştur" customerOptions={customers} />
      </SectionCard>
    </div>
  );
}
