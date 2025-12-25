import Link from "next/link";

import { prisma } from "@/server/db/prisma";

import { AdminPageHeader, AdminStatCard, EmptyState, SectionCard } from "@/app/app/admin/_components";
import { requireAdmin } from "@/app/app/admin/_state/require-admin";

export default async function AdminLeadsPage() {
  const { session, adminMembership } = await requireAdmin();

  const isSuperAdmin = session.user.isSuperAdmin;
  const organizationId = isSuperAdmin ? null : adminMembership?.organizationId ?? null;
  const where = organizationId ? { organizationId } : undefined;

  const [
    leadsTotal,
    leadsNew,
    leadsContacted,
    leadsQualified,
    leads,
  ] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.count({ where: { ...where, status: "NEW" } }),
    prisma.lead.count({ where: { ...where, status: "CONTACTED" } }),
    prisma.lead.count({ where: { ...where, status: "QUALIFIED" } }),
    prisma.lead.findMany({
      where,
      include: {
        organization: true,
        ownerUser: { select: { id: true, email: true, name: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 25,
    }),
  ]);

  function statusLabel(status: string): string {
    if (status === "NEW") return "Yeni";
    if (status === "CONTACTED") return "İletişimde";
    if (status === "QUALIFIED") return "Nitelikli";
    if (status === "WON") return "Kazanıldı";
    return "Kaybedildi";
  }

  function statusTone(status: string): "success" | "info" | "warning" | "neutral" {
    if (status === "WON") return "success";
    if (status === "QUALIFIED" || status === "CONTACTED") return "info";
    if (status === "LOST") return "warning";
    return "neutral";
  }

  function StatusPill({ status }: { status: string }) {
    const tone = statusTone(status);

    const cls =
      tone === "success"
        ? "border-system-success/30 bg-system-success/10 text-system-success"
        : tone === "info"
          ? "border-system-info/30 bg-system-info/10 text-system-info"
          : tone === "warning"
            ? "border-system-warning/30 bg-system-warning/10 text-system-warning"
            : "border-black/10 bg-white text-atlas-steel";

    return (
      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${cls}`}>
        {statusLabel(status)}
      </span>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Leads"
        description={
          organizationId
            ? "Organizasyon bazlı lead listesi (son güncellenenler üstte)."
            : "Tüm organizasyonlardaki lead’ler (son güncellenenler üstte)."
        }
        breadcrumb={[
          { label: "Uygulama", href: "/app/dashboard" },
          { label: "Admin", href: "/app/admin/dashboard" },
          { label: "Leads" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {adminMembership?.organization ? (
              <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-atlas-steel">
                {adminMembership.organization.name}
              </span>
            ) : null}
            <Link
              href="/app/admin/leads/new"
              className="inline-flex items-center justify-center rounded-xl bg-atlas-blue px-4 py-2 text-sm font-semibold text-white outline-none ring-atlas-teal/40 transition hover:bg-atlas-blue/95 focus-visible:ring-4"
            >
              Yeni lead
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
        <AdminStatCard title="Toplam" value={String(leadsTotal)} subtitle="Lead" accent="brand" />
        <AdminStatCard title="Yeni" value={String(leadsNew)} subtitle="NEW" accent="info" />
        <AdminStatCard title="İletişimde" value={String(leadsContacted)} subtitle="CONTACTED" accent="info" />
        <AdminStatCard title="Nitelikli" value={String(leadsQualified)} subtitle="QUALIFIED" accent="success" />
      </section>

      <SectionCard
        title="Lead Listesi"
        description="Son 25 kayıt."
        actions={
          <span className="text-xs text-atlas-steel">
            Görünen: <span className="font-semibold text-atlas-blue">{leads.length}</span>
          </span>
        }
      >
        {leads.length === 0 ? (
          <EmptyState
            title="Henüz lead yok"
            description="İlk lead kaydınızı oluşturduğunuzda burada listelenecek."
            primaryAction={{ label: "Yeni lead", href: "/app/admin/leads/new" }}
            secondaryAction={{ label: "Destek", href: "/iletisim" }}
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="grid grid-cols-12 gap-3 bg-linear-to-r from-atlas-blue/10 via-white to-atlas-teal/10 px-4 py-3 text-[11px] font-semibold text-atlas-steel">
              <div className="col-span-5">Lead</div>
              <div className="col-span-2">Durum</div>
              <div className="col-span-3">Sahip</div>
              <div className="col-span-2 text-right">Güncelleme</div>
            </div>

            <ul className="divide-y divide-black/5">
              {leads.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/app/admin/leads/${l.id}`}
                    className="grid grid-cols-12 gap-3 px-4 py-4 outline-none transition hover:bg-atlas-cloud focus-visible:bg-atlas-cloud"
                  >
                    <div className="col-span-5 min-w-0">
                      <div className="truncate text-sm font-semibold text-atlas-blue">{l.name}</div>
                      <div className="mt-0.5 truncate text-xs text-atlas-steel">
                        {l.email ? l.email : l.phone ? l.phone : "İletişim yok"}
                        {organizationId ? null : (
                          <>
                            <span className="mx-2">•</span>
                            <span className="font-medium text-atlas-blue/80">{l.organization.name}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <StatusPill status={l.status} />
                    </div>

                    <div className="col-span-3 min-w-0">
                      <div className="truncate text-sm text-atlas-blue">
                        {l.ownerUser?.name ?? l.ownerUser?.email ?? "—"}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-atlas-steel">
                        {l.company ?? l.source ?? "—"}
                      </div>
                    </div>

                    <div className="col-span-2 text-right">
                      <div className="text-sm text-atlas-blue">
                        {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(l.updatedAt)}
                      </div>
                      <div className="mt-0.5 text-xs text-atlas-steel">{statusLabel(l.status)}</div>
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
