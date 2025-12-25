import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/server/db/prisma";
import { updateCustomerAction } from "@/server/actions/admin/customers";

import { AdminPageHeader, SectionCard } from "@/app/app/admin/_components";
import { requireAdmin } from "@/app/app/admin/_state/require-admin";
import CustomerForm from "@/app/app/admin/customers/_components/CustomerForm";

export default async function AdminCustomerEditPage({
  params,
}: {
  params: { customerId: string };
}) {
  const { session, adminMembership } = await requireAdmin();
  const isSuperAdmin = session.user.isSuperAdmin;
  const organizationId = isSuperAdmin ? null : adminMembership?.organizationId ?? null;

  const customer = await prisma.customer.findFirst({
    where: isSuperAdmin
      ? { id: params.customerId }
      : { id: params.customerId, organizationId: organizationId ?? "" },
  });

  if (!customer) notFound();

  const action = updateCustomerAction.bind(null, customer.id);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Müşteri Düzenle"
        description={customer.name}
        breadcrumb={[
          { label: "Uygulama", href: "/app/dashboard" },
          { label: "Admin", href: "/app/admin/dashboard" },
          { label: "Müşteriler", href: "/app/admin/customers" },
          { label: customer.name, href: `/app/admin/customers/${customer.id}` },
          { label: "Düzenle" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/app/admin/customers/${customer.id}`}
              className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-atlas-blue outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
            >
              Detaya dön
            </Link>
          </div>
        }
      />

      <SectionCard title="Müşteri Bilgileri" description="Değişiklikleri kaydedin.">
        <CustomerForm
          action={action}
          submitLabel="Kaydet"
          initial={{
            name: customer.name,
            email: customer.email ?? "",
            phone: customer.phone ?? "",
            segment: customer.segment ?? "",
            industry: customer.industry ?? "",
            status: customer.status,
          }}
        />
      </SectionCard>
    </div>
  );
}
