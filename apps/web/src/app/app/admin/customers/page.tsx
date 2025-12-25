import Link from "next/link";

import { prisma } from "@/server/db/prisma";

import { AdminPageHeader, AdminStatCard, EmptyState, SectionCard } from "@/app/app/admin/_components";
import { requireAdmin } from "@/app/app/admin/_state/require-admin";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(date);
}

function StatusPill({ status }: { status: string }) {
  const tone = status === "ACTIVE" ? "success" : status === "PROSPECT" ? "info" : "warning";

  const cls =
    tone === "success"
      ? "border-system-success/30 bg-system-success/10 text-system-success"
      : tone === "info"
        ? "border-system-info/30 bg-system-info/10 text-system-info"
        : "border-system-warning/30 bg-system-warning/10 text-system-warning";

  const label = status === "ACTIVE" ? "Aktif" : status === "PROSPECT" ? "Aday" : "Risk";

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${cls}`}>
      {label}
    </span>
  );
}

export default async function AdminCustomersPage() {
  const { session, adminMembership } = await requireAdmin();

  const isSuperAdmin = session.user.isSuperAdmin;
  const organizationId = isSuperAdmin ? null : adminMembership?.organizationId ?? null;

  const where = organizationId ? { organizationId } : undefined;

  const [
    customersTotal,
    customersActive,
    customersProspect,
    customersChurnRisk,
    customers,
  ] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.customer.count({ where: { ...where, status: "ACTIVE" } }),
    prisma.customer.count({ where: { ...where, status: "PROSPECT" } }),
    prisma.customer.count({ where: { ...where, status: "CHURN_RISK" } }),
    prisma.customer.findMany({
      where,
      include: {
        organization: true,
        ownerUser: { select: { id: true, email: true, name: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 25,
    }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Müşteriler"
        description={
          organizationId
            ? "Organizasyon bazlı müşteri listesi (son güncellenenler üstte)."
            : "Tüm organizasyonlardaki müşteriler (son güncellenenler üstte)."
        }
        breadcrumb={[
          { label: "Uygulama", href: "/app/dashboard" },
          { label: "Admin", href: "/app/admin/dashboard" },
          { label: "Müşteriler" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {adminMembership?.organization ? (
              <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-atlas-steel">
                {adminMembership.organization.name}
              </span>
            ) : null}
            <Link
              href="/app/admin/customers/new"
              className="inline-flex items-center justify-center rounded-xl bg-atlas-blue px-4 py-2 text-sm font-semibold text-white outline-none ring-atlas-teal/40 transition hover:bg-atlas-blue/95 focus-visible:ring-4"
            >
              Yeni müşteri
            </Link>
            <Link
              href="/iletisim"
              className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-atlas-blue outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
            >
              Destek
            </Link>
          </div>
        }
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard title="Toplam" value={String(customersTotal)} subtitle="Müşteri" accent="brand" />
        <AdminStatCard title="Aktif" value={String(customersActive)} subtitle="ACTIVE" accent="success" />
        <AdminStatCard title="Aday" value={String(customersProspect)} subtitle="PROSPECT" accent="info" />
        <AdminStatCard title="Risk" value={String(customersChurnRisk)} subtitle="CHURN_RISK" accent="warning" />
      </section>

      <SectionCard
        title="Müşteri Listesi"
        description="Son 25 kayıt."
        actions={
          <span className="text-xs text-atlas-steel">
            Görünen: <span className="font-semibold text-atlas-blue">{customers.length}</span>
          </span>
        }
      >
        {customers.length === 0 ? (
          <EmptyState
            title="Henüz müşteri yok"
            description="Müşteri modülü devreye alındığında kayıtlar burada listelenecek."
            primaryAction={{ label: "İletişime geç", href: "/iletisim" }}
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="grid grid-cols-12 gap-3 bg-linear-to-r from-atlas-blue/10 via-white to-atlas-teal/10 px-4 py-3 text-[11px] font-semibold text-atlas-steel">
              <div className="col-span-5">Müşteri</div>
              <div className="col-span-2">Durum</div>
              <div className="col-span-3">Sahip</div>
              <div className="col-span-2 text-right">Güncelleme</div>
            </div>

            <ul className="divide-y divide-black/5">
              {customers.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/app/admin/customers/${c.id}`}
                    className="grid grid-cols-12 gap-3 px-4 py-4 outline-none transition hover:bg-atlas-cloud focus-visible:bg-atlas-cloud"
                  >
                    <div className="col-span-5 min-w-0">
                      <div className="truncate text-sm font-semibold text-atlas-blue">{c.name}</div>
                      <div className="mt-0.5 truncate text-xs text-atlas-steel">
                        {c.email ? c.email : "E-posta yok"}
                        {organizationId ? null : (
                          <>
                            <span className="mx-2">•</span>
                            <span className="font-medium text-atlas-blue/80">{c.organization.name}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <StatusPill status={c.status} />
                    </div>

                    <div className="col-span-3 min-w-0">
                      <div className="truncate text-sm text-atlas-blue">
                        {c.ownerUser?.name ?? c.ownerUser?.email ?? "—"}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-atlas-steel">
                        {c.phone ? c.phone : "Telefon yok"}
                      </div>
                    </div>

                    <div className="col-span-2 text-right">
                      <div className="text-sm text-atlas-blue">{formatDate(c.updatedAt)}</div>
                      <div className="mt-0.5 text-xs text-atlas-steel">{c.segment ?? ""}</div>
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
