import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/server/db/prisma";
import { updateLeadAction } from "@/server/actions/admin/leads";

import { AdminPageHeader, SectionCard } from "@/app/app/admin/_components";
import { requireAdmin } from "@/app/app/admin/_state/require-admin";
import LeadForm from "@/app/app/admin/leads/_components/LeadForm";

export default async function AdminLeadEditPage({ params }: { params: { leadId: string } }) {
  const { session, adminMembership } = await requireAdmin();

  const isSuperAdmin = session.user.isSuperAdmin;
  const organizationId = isSuperAdmin ? null : adminMembership?.organizationId ?? null;

  const lead = await prisma.lead.findFirst({
    where: isSuperAdmin ? { id: params.leadId } : { id: params.leadId, organizationId: organizationId ?? "" },
  });

  if (!lead) notFound();

  const action = updateLeadAction.bind(null, lead.id);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Lead Düzenle"
        description={lead.name}
        breadcrumb={[
          { label: "Uygulama", href: "/app/dashboard" },
          { label: "Admin", href: "/app/admin/dashboard" },
          { label: "Leads", href: "/app/admin/leads" },
          { label: lead.name, href: `/app/admin/leads/${lead.id}` },
          { label: "Düzenle" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/app/admin/leads/${lead.id}`}
              className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-atlas-blue outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
            >
              Detaya dön
            </Link>
          </div>
        }
      />

      <SectionCard title="Lead Bilgileri" description="Değişiklikleri kaydedin.">
        <LeadForm
          action={action}
          submitLabel="Kaydet"
          initial={{
            name: lead.name,
            email: lead.email ?? "",
            phone: lead.phone ?? "",
            company: lead.company ?? "",
            source: lead.source ?? "",
            status: lead.status,
          }}
        />
      </SectionCard>
    </div>
  );
}
