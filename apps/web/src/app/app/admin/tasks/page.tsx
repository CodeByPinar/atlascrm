import Link from "next/link";

import { prisma } from "@/server/db/prisma";

import { AdminPageHeader, AdminStatCard, EmptyState, SectionCard } from "@/app/app/admin/_components";
import { requireAdmin } from "@/app/app/admin/_state/require-admin";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(date);
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "DONE" ? "success" : status === "BLOCKED" ? "danger" : status === "IN_PROGRESS" ? "info" : "warning";

  const cls =
    tone === "success"
      ? "border-system-success/30 bg-system-success/10 text-system-success"
      : tone === "info"
        ? "border-system-info/30 bg-system-info/10 text-system-info"
        : tone === "danger"
          ? "border-system-error/30 bg-system-error/10 text-system-error"
          : "border-system-warning/30 bg-system-warning/10 text-system-warning";

  const label =
    status === "DONE" ? "Tamam" : status === "BLOCKED" ? "Engelli" : status === "IN_PROGRESS" ? "Devam" : "Açık";

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${cls}`}>
      {label}
    </span>
  );
}

export default async function AdminTasksPage() {
  const { session, adminMembership } = await requireAdmin();

  const isSuperAdmin = session.user.isSuperAdmin;
  const organizationId = isSuperAdmin ? null : adminMembership?.organizationId ?? null;
  const where = organizationId ? { organizationId } : {};

  const [total, openCount, inProgressCount, blockedCount, doneCount, tasks] = await Promise.all([
    prisma.task.count({ where }),
    prisma.task.count({ where: { ...where, status: "OPEN" } }),
    prisma.task.count({ where: { ...where, status: "IN_PROGRESS" } }),
    prisma.task.count({ where: { ...where, status: "BLOCKED" } }),
    prisma.task.count({ where: { ...where, status: "DONE" } }),
    prisma.task.findMany({
      where,
      include: { customer: { select: { id: true, name: true } } },
      orderBy: { updatedAt: "desc" },
      take: 25,
    }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Görevler"
        description={organizationId ? "Organizasyon bazlı görev listesi." : "Tüm organizasyon görevleri."}
        breadcrumb={[
          { label: "Uygulama", href: "/app/dashboard" },
          { label: "Admin", href: "/app/admin/dashboard" },
          { label: "Görevler" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/app/admin/tasks/new"
              className="inline-flex items-center justify-center rounded-xl bg-atlas-blue px-4 py-2 text-sm font-semibold text-white outline-none ring-atlas-teal/40 transition hover:bg-atlas-blue/95 focus-visible:ring-4"
            >
              Yeni görev
            </Link>
          </div>
        }
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <AdminStatCard title="Toplam" value={String(total)} subtitle="Görev" accent="brand" />
        <AdminStatCard title="Açık" value={String(openCount)} subtitle="OPEN" accent="warning" />
        <AdminStatCard title="Devam" value={String(inProgressCount)} subtitle="IN_PROGRESS" accent="info" />
        <AdminStatCard title="Engelli" value={String(blockedCount)} subtitle="BLOCKED" accent="danger" />
        <AdminStatCard title="Tamam" value={String(doneCount)} subtitle="DONE" accent="success" />
      </section>

      <SectionCard
        title="Görev Listesi"
        description="Son 25 kayıt."
        actions={
          <span className="text-xs text-atlas-steel">
            Görünen: <span className="font-semibold text-atlas-blue">{tasks.length}</span>
          </span>
        }
      >
        {tasks.length === 0 ? (
          <EmptyState
            title="Henüz görev yok"
            description="Yeni görev eklediğinizde burada listelenecek."
            primaryAction={{ label: "Yeni görev", href: "/app/admin/tasks/new" }}
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="grid grid-cols-12 gap-3 bg-linear-to-r from-atlas-blue/10 via-white to-atlas-teal/10 px-4 py-3 text-[11px] font-semibold text-atlas-steel">
              <div className="col-span-6">Görev</div>
              <div className="col-span-2">Durum</div>
              <div className="col-span-2">Müşteri</div>
              <div className="col-span-2 text-right">Güncelleme</div>
            </div>

            <ul className="divide-y divide-black/5">
              {tasks.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/app/admin/tasks/${t.id}`}
                    className="grid grid-cols-12 gap-3 px-4 py-4 outline-none transition hover:bg-atlas-cloud focus-visible:bg-atlas-cloud"
                  >
                    <div className="col-span-6 min-w-0">
                      <div className="truncate text-sm font-semibold text-atlas-blue">{t.title}</div>
                      <div className="mt-0.5 truncate text-xs text-atlas-steel">{t.priority}</div>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <StatusPill status={t.status} />
                    </div>
                    <div className="col-span-2 min-w-0">
                      <div className="truncate text-sm text-atlas-blue">{t.customer?.name ?? "—"}</div>
                    </div>
                    <div className="col-span-2 text-right">
                      <div className="text-sm text-atlas-blue">{formatDate(t.updatedAt)}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
