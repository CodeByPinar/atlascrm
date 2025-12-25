import { notFound } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/server/db/prisma";
import { deleteCustomerAction } from "@/server/actions/admin/customers";

import { AdminPageHeader, EmptyState, SectionCard } from "@/app/app/admin/_components";
import { requireAdmin } from "@/app/app/admin/_state/require-admin";

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default async function AdminCustomerDetailPage({
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
    include: {
      organization: true,
      ownerUser: { select: { id: true, email: true, name: true } },
      tasks: { take: 5, orderBy: { updatedAt: "desc" } },
    },
  });

  if (!customer) notFound();

  const deleteAction = deleteCustomerAction.bind(null, customer.id);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={customer.name}
        description="Müşteri detay görünümü (özet)."
        breadcrumb={[
          { label: "Uygulama", href: "/app/dashboard" },
          { label: "Admin", href: "/app/admin/dashboard" },
          { label: "Müşteriler", href: "/app/admin/customers" },
          { label: customer.name },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-atlas-steel">
              {customer.status}
            </span>
            <Link
              href={`/app/admin/customers/${customer.id}/edit`}
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
        <SectionCard title="Bilgiler" description="Temel müşteri bilgileri.">
          <dl className="grid grid-cols-1 gap-3 text-sm">
            <div className="rounded-xl border border-black/10 bg-white p-4">
              <dt className="text-xs font-medium text-atlas-steel">Organizasyon</dt>
              <dd className="mt-1 font-semibold text-atlas-blue">{customer.organization.name}</dd>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-4">
              <dt className="text-xs font-medium text-atlas-steel">E-posta</dt>
              <dd className="mt-1 font-semibold text-atlas-blue">{customer.email ?? "—"}</dd>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-4">
              <dt className="text-xs font-medium text-atlas-steel">Telefon</dt>
              <dd className="mt-1 font-semibold text-atlas-blue">{customer.phone ?? "—"}</dd>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-4">
              <dt className="text-xs font-medium text-atlas-steel">Sahip</dt>
              <dd className="mt-1 font-semibold text-atlas-blue">
                {customer.ownerUser?.name ?? customer.ownerUser?.email ?? "—"}
              </dd>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-4">
              <dt className="text-xs font-medium text-atlas-steel">Son güncelleme</dt>
              <dd className="mt-1 font-semibold text-atlas-blue">{formatDateTime(customer.updatedAt)}</dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard title="Son Görevler" description="Bu müşteriye bağlı son 5 görev.">
          {customer.tasks.length > 0 ? (
            <ul className="space-y-3">
              {customer.tasks.map((t) => (
                <li key={t.id} className="rounded-xl border border-black/10 bg-white p-4">
                  <div className="text-sm font-semibold text-atlas-blue">{t.title}</div>
                  <div className="mt-1 text-xs text-atlas-steel">
                    {t.status} • {t.priority}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="Görev bulunamadı"
              description="Bu müşteriyle ilişkili görev kaydı yok."
              primaryAction={{ label: "Müşterilere dön", href: "/app/admin/customers" }}
            />
          )}
        </SectionCard>
      </section>
    </div>
  );
}
