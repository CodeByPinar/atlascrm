import Link from "next/link";

import { createCustomerAction } from "@/server/actions/admin/customers";

import { AdminPageHeader, SectionCard } from "@/app/app/admin/_components";
import { requireAdmin } from "@/app/app/admin/_state/require-admin";
import CustomerForm from "@/app/app/admin/customers/_components/CustomerForm";

export default async function AdminCustomerNewPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Yeni Müşteri"
        description="Yeni müşteri kaydı oluşturun."
        breadcrumb={[
          { label: "Uygulama", href: "/app/dashboard" },
          { label: "Admin", href: "/app/admin/dashboard" },
          { label: "Müşteriler", href: "/app/admin/customers" },
          { label: "Yeni" },
        ]}
        actions={
          <Link
            href="/app/admin/customers"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-atlas-blue outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
          >
            Listeye dön
          </Link>
        }
      />

      <SectionCard title="Müşteri Bilgileri" description="Zorunlu alan: müşteri adı.">
        <CustomerForm action={createCustomerAction} submitLabel="Müşteri oluştur" />
      </SectionCard>
    </div>
  );
}
