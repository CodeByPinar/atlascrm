import Link from "next/link";

import { AdminStatCard, SectionCard } from "@/app/app/admin/_components";
import { requireAdmin } from "@/app/app/admin/_state/require-admin";
import { prisma } from "@/server/db/prisma";

function formatRelativeDate(date: Date): string {
  const deltaMs = Date.now() - date.getTime();
  const minutes = Math.floor(deltaMs / 60_000);
  if (minutes < 1) return "az önce";
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} sa önce`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün önce`;
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(date);
}

function getActionBadge(action: string): { label: string; className: string; dotClass: string } {
  const a = action.toLowerCase();

  if (a.includes("created") || a.includes("oluştur") || a.includes("create")) {
    return {
      label: "Oluşturma",
      className: "border-system-success/30 bg-system-success/10 text-system-success",
      dotClass: "bg-system-success",
    };
  }

  if (a.includes("updated") || a.includes("güncell") || a.includes("update")) {
    return {
      label: "Güncelleme",
      className: "border-system-info/30 bg-system-info/10 text-system-info",
      dotClass: "bg-system-info",
    };
  }

  if (a.includes("deleted") || a.includes("sil") || a.includes("delete")) {
    return {
      label: "Silme",
      className: "border-system-error/30 bg-system-error/10 text-system-error",
      dotClass: "bg-system-error",
    };
  }

  return {
    label: "Hareket",
    className: "border-atlas-teal/30 bg-atlas-teal/10 text-atlas-teal",
    dotClass: "bg-atlas-teal",
  };
}

export default async function AdminDashboardPage() {
  const { session, adminMembership } = await requireAdmin();

  const organization =
    adminMembership?.organization ??
    (await prisma.organization.upsert({
      where: { id: "atlascrm-default" },
      update: { name: "AtlasCRM" },
      create: { id: "atlascrm-default", name: "AtlasCRM" },
    }));

  const organizationId = adminMembership?.organizationId ?? organization.id;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [customersCount, openTasksCount, activeMembersCount, activities7dCount, recentActivities] =
    await Promise.all([
      prisma.customer.count({ where: { organizationId } }),
      prisma.task.count({
        where: {
          organizationId,
          status: { in: ["OPEN", "IN_PROGRESS", "BLOCKED"] },
        },
      }),
      prisma.membership.count({
        where: { organizationId, status: "ACTIVE" },
      }),
      prisma.activity.count({
        where: {
          organizationId,
          timestamp: { gte: sevenDaysAgo },
        },
      }),
      prisma.activity.findMany({
        where: { organizationId },
        orderBy: { timestamp: "desc" },
        take: 8,
        select: {
          id: true,
          action: true,
          entityType: true,
          entityId: true,
          timestamp: true,
          metadata: true,
        },
      }),
    ]);

  const roleLabel = session.user.isSuperAdmin
    ? "Super Admin"
    : adminMembership?.role
      ? adminMembership.role
      : "ADMIN";

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-atlas-blue to-atlas-teal p-px">
        <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />

        <div className="relative rounded-3xl border border-black/10 bg-white/85 px-6 py-6 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-atlas-steel">
                <span className="h-1.5 w-1.5 rounded-full bg-system-success" />
                Admin oturumu açık
                <span className="text-atlas-steel">•</span>
                <span className="font-semibold text-atlas-blue">{organization.name}</span>
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-atlas-blue">
                Admin Paneli
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-atlas-steel">
                Müşteriler, görevler ve organizasyon genel görünümü.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-atlas-steel">
                <span className="h-1.5 w-1.5 rounded-full bg-atlas-teal" />
                Rol: <span className="font-semibold text-atlas-blue">{roleLabel}</span>
              </span>

              <Link
                href="/app/admin/customers"
                className="inline-flex items-center justify-center rounded-full bg-atlas-blue px-3 py-1.5 text-xs font-semibold text-white outline-none ring-atlas-teal/40 transition hover:bg-atlas-blue/95 focus-visible:ring-4"
              >
                Müşteriler
              </Link>
              <Link
                href="/app/admin/tasks"
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-atlas-blue outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
              >
                Görevler
              </Link>
              <Link
                href="/app/admin/billing"
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-atlas-blue outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
              >
                Satış / Aktivasyon
              </Link>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3">
              <div className="text-xs text-atlas-steel">Bugün odak</div>
              <div className="mt-1 text-sm font-semibold text-atlas-blue">Açık işleri kapat, akışı hızlandır</div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3">
              <div className="text-xs text-atlas-steel">Hızlı aksiyon</div>
              <div className="mt-1 text-sm font-semibold text-atlas-blue">Satış onayla → PAID kod üret</div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3">
              <div className="text-xs text-atlas-steel">Son 7 gün</div>
              <div className="mt-1 text-sm font-semibold text-atlas-blue">{activities7dCount} aktivite</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <AdminStatCard
          title="Organizasyon"
          value={organization.name}
          subtitle={roleLabel}
          accent="brand"
        />
        <AdminStatCard
          title="Müşteri"
          value={String(customersCount)}
          subtitle="Toplam kayıt"
          accent="info"
        />
        <AdminStatCard
          title="Açık görev"
          value={String(openTasksCount)}
          subtitle="OPEN / IN_PROGRESS / BLOCKED"
          accent="warning"
        />
        <AdminStatCard
          title="Aktif üye"
          value={String(activeMembersCount)}
          subtitle="Organizasyon üyeleri"
          accent="success"
        />
      </section>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SectionCard
            title="Hızlı İşlemler"
            description="Admin modüllerine hızlı giriş."
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Link
                href="/app/admin/customers/new"
                className="group rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
              >
                <div className="text-xs text-atlas-steel">CRM</div>
                <div className="mt-1 text-sm font-semibold text-atlas-blue">Yeni müşteri ekle</div>
                <div className="mt-2 text-xs text-atlas-steel">Pipeline’ı büyütmek için hızlı kayıt.</div>
                <div className="mt-3 text-xs font-semibold text-atlas-blue group-hover:underline">Aç</div>
              </Link>

              <Link
                href="/app/admin/tasks/new"
                className="group rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
              >
                <div className="text-xs text-atlas-steel">Operasyon</div>
                <div className="mt-1 text-sm font-semibold text-atlas-blue">Yeni görev oluştur</div>
                <div className="mt-2 text-xs text-atlas-steel">Takımın iş akışını netleştir.</div>
                <div className="mt-3 text-xs font-semibold text-atlas-blue group-hover:underline">Aç</div>
              </Link>

              <Link
                href="/app/admin/billing"
                className="group rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
              >
                <div className="text-xs text-atlas-steel">Satış</div>
                <div className="mt-1 text-sm font-semibold text-atlas-blue">PAID kod üret</div>
                <div className="mt-2 text-xs text-atlas-steel">Manuel satış onayı sonrası aktivasyon.</div>
                <div className="mt-3 text-xs font-semibold text-atlas-blue group-hover:underline">Aç</div>
              </Link>

              <Link
                href="/iletisim?topic=Sat%C4%B1n%20alma%20%2F%20aktivasyon&source=admin"
                className="group rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
              >
                <div className="text-xs text-atlas-steel">Destek</div>
                <div className="mt-1 text-sm font-semibold text-atlas-blue">Aktivasyon desteği</div>
                <div className="mt-2 text-xs text-atlas-steel">Sorunları hızlı kapat.</div>
                <div className="mt-3 text-xs font-semibold text-atlas-blue group-hover:underline">Aç</div>
              </Link>
            </div>
          </SectionCard>
        </div>

        <div className="lg:col-span-2">
          <SectionCard
            title="Son Hareketler"
            description="Organizasyondaki güncel aktiviteler."
            actions={
              <span className="text-xs text-atlas-steel">{activities7dCount} / 7 gün</span>
            }
          >
            {recentActivities.length === 0 ? (
              <div className="rounded-xl border border-black/10 bg-atlas-cloud px-4 py-3 text-sm text-atlas-steel">
                Henüz aktivite yok. Müşteri veya görev oluşturduğunuzda burada görünecek.
              </div>
            ) : (
              <div className="space-y-2">
                {recentActivities.map((a) => {
                  const badge = getActionBadge(a.action);
                  const metaTitle =
                    a.metadata && typeof a.metadata === "object" && "title" in a.metadata
                      ? String((a.metadata as Record<string, unknown>).title)
                      : null;

                  return (
                    <div
                      key={a.id}
                      className="rounded-xl border border-black/10 bg-white px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 shrink-0 rounded-full ${badge.dotClass}`} />
                            <div className="truncate text-sm font-semibold text-atlas-blue">
                              {a.entityType} • {a.action}
                            </div>
                          </div>
                          {metaTitle ? (
                            <div className="mt-1 truncate text-xs text-atlas-steel">{metaTitle}</div>
                          ) : null}
                        </div>

                        <div className="shrink-0 text-right">
                          <div className={`inline-flex items-center rounded-full border px-2 py-1 text-[11px] ${badge.className}`}>
                            {badge.label}
                          </div>
                          <div className="mt-1 text-[11px] text-atlas-steel">
                            {formatRelativeDate(a.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
