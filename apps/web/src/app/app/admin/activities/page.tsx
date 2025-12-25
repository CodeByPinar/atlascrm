import Link from "next/link";

import { AdminPageHeader, EmptyState, SectionCard } from "@/app/app/admin/_components";
import { requireAdmin } from "@/app/app/admin/_state/require-admin";

export default async function AdminActivitiesPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Aktiviteler"
        description="Sistem olayları ve kullanıcı hareketleri."
        breadcrumb={[
          { label: "Uygulama", href: "/app/dashboard" },
          { label: "Admin", href: "/app/admin/dashboard" },
          { label: "Aktiviteler" },
        ]}
        actions={
          <Link
            href="/iletisim?topic=Audit%20log%20%2F%20aktiviteler&source=admin"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-atlas-blue outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
          >
            Audit log planla
          </Link>
        }
      />

      <SectionCard
        title="Aktivite Akışı"
        description="Görev, müşteri ve sistem aksiyonlarını tek yerde izleyin."
      >
        <EmptyState
          title="Aktivite merkezi yakında"
          description="Buraya filtrelenebilir aktivite feed’i ve audit log (kim/ne zaman/ne yaptı) ekleyeceğiz."
          primaryAction={{
            label: "Kurulum desteği iste",
            href: "/iletisim?topic=Audit%20log%20kurulumu&source=admin",
          }}
        />
      </SectionCard>
    </div>
  );
}
