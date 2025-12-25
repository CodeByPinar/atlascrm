import { notFound } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/server/db/prisma";
import { deleteLeadAction } from "@/server/actions/admin/leads";

import { AdminPageHeader, SectionCard } from "@/app/app/admin/_components";
import { requireAdmin } from "@/app/app/admin/_state/require-admin";

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "WON" ? "success" : status === "LOST" ? "warning" : status === "QUALIFIED" ? "info" : "neutral";

  const cls =
    tone === "success"
      ? "border-system-success/30 bg-system-success/10 text-system-success"
      : tone === "warning"
        ? "border-system-warning/30 bg-system-warning/10 text-system-warning"
        : tone === "info"
          ? "border-system-info/30 bg-system-info/10 text-system-info"
          : "border-black/10 bg-white text-atlas-steel";

  const label =
    status === "NEW"
      ? "Yeni"
      : status === "CONTACTED"
        ? "İletişimde"
        : status === "QUALIFIED"
          ? "Nitelikli"
          : status === "WON"
            ? "Kazanıldı"
            : "Kaybedildi";

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${cls}`}>
      {label}
    </span>
  );
}

export default async function AdminLeadDetailPage({ params }: { params: { leadId: string } }) {
  const { session, adminMembership } = await requireAdmin();

  const isSuperAdmin = session.user.isSuperAdmin;
  const organizationId = isSuperAdmin ? null : adminMembership?.organizationId ?? null;

  const lead = await prisma.lead.findFirst({
    where: isSuperAdmin ? { id: params.leadId } : { id: params.leadId, organizationId: organizationId ?? "" },
    include: {
      organization: true,
      ownerUser: { select: { id: true, email: true, name: true } },
    },
  });

  if (!lead) notFound();

  const deleteAction = deleteLeadAction.bind(null, lead.id);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={lead.name}
        description="Lead detay görünümü (özet)."
        breadcrumb={[
          { label: "Uygulama", href: "/app/dashboard" },
          { label: "Admin", href: "/app/admin/dashboard" },
          { label: "Leads", href: "/app/admin/leads" },
          { label: lead.name },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={lead.status} />
            <Link
              href={`/app/admin/leads/${lead.id}/edit`}
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
        <SectionCard title="Bilgiler" description="Temel lead bilgileri.">
          <dl className="grid grid-cols-1 gap-3 text-sm">
            <div className="rounded-xl border border-black/10 bg-white p-4">
              <dt className="text-xs font-medium text-atlas-steel">Organizasyon</dt>
              <dd className="mt-1 font-semibold text-atlas-blue">{lead.organization.name}</dd>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-4">
              <dt className="text-xs font-medium text-atlas-steel">Şirket</dt>
              <dd className="mt-1 font-semibold text-atlas-blue">{lead.company ?? "—"}</dd>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-4">
              <dt className="text-xs font-medium text-atlas-steel">E-posta</dt>
              <dd className="mt-1 font-semibold text-atlas-blue">{lead.email ?? "—"}</dd>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-4">
              <dt className="text-xs font-medium text-atlas-steel">Telefon</dt>
              <dd className="mt-1 font-semibold text-atlas-blue">{lead.phone ?? "—"}</dd>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-4">
              <dt className="text-xs font-medium text-atlas-steel">Kaynak</dt>
              <dd className="mt-1 font-semibold text-atlas-blue">{lead.source ?? "—"}</dd>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-4">
              <dt className="text-xs font-medium text-atlas-steel">Sahip</dt>
              <dd className="mt-1 font-semibold text-atlas-blue">
                {lead.ownerUser?.name ?? lead.ownerUser?.email ?? "—"}
              </dd>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-4">
              <dt className="text-xs font-medium text-atlas-steel">Son güncelleme</dt>
              <dd className="mt-1 font-semibold text-atlas-blue">{formatDateTime(lead.updatedAt)}</dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard title="Notlar" description="Lead notları bir sonraki adımda eklenecek.">
          <div className="rounded-2xl border border-black/10 bg-atlas-cloud px-4 py-3 text-xs text-atlas-steel">
            İstersen buraya görüşme notları, etkinlik geçmişi ve müşteri dönüşüm akışını ekleyebiliriz.
          </div>
        </SectionCard>
      </section>
    </div>
  );
}
