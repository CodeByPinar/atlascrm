import Link from "next/link";

import { AdminPageHeader, SectionCard } from "@/app/app/admin/_components";
import { requireAdmin } from "@/app/app/admin/_state/require-admin";

import BillingActivationForm from "@/app/app/admin/billing/BillingActivationForm";

export default async function AdminBillingPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Satış / Aktivasyon"
        description="Manuel satış onayı sonrası PAID aktivasyon kodu üretin."
        breadcrumb={[
          { label: "Uygulama", href: "/app/dashboard" },
          { label: "Admin", href: "/app/admin/dashboard" },
          { label: "Satış / Aktivasyon" },
        ]}
        actions={
          <Link
            href="/app/admin/dashboard"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-atlas-blue outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
          >
            Admin paneline dön
          </Link>
        }
      />

      <SectionCard
        title="Satış onayla → kod üret"
        description="PAID kodu alan kullanıcı admin paneline yönlendirilir. DEMO kodları user (misafir) paneline yönlendirilir."
      >
        <BillingActivationForm />
      </SectionCard>
    </div>
  );
}
