import Link from "next/link";

import { createLeadAction } from "@/server/actions/admin/leads";

import { AdminPageHeader, SectionCard } from "@/app/app/admin/_components";
import { requireAdmin } from "@/app/app/admin/_state/require-admin";
import LeadForm from "@/app/app/admin/leads/_components/LeadForm";

export default async function AdminLeadNewPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Yeni Lead"
        description="Yeni potansiyel müşteri kaydı oluşturun."
        breadcrumb={[
          { label: "Uygulama", href: "/app/dashboard" },
          { label: "Admin", href: "/app/admin/dashboard" },
          { label: "Leads", href: "/app/admin/leads" },
          { label: "Yeni" },
        ]}
        actions={
          <Link
            href="/app/admin/leads"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-atlas-blue outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
          >
            Listeye dön
          </Link>
        }
      />

      <SectionCard title="Lead Bilgileri" description="Zorunlu alan: lead adı.">
        <LeadForm action={createLeadAction} submitLabel="Lead oluştur" />
      </SectionCard>
    </div>
  );
}
