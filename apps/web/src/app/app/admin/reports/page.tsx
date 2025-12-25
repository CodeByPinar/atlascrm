import Link from "next/link";

import { AdminPageHeader, EmptyState, SectionCard } from "@/app/app/admin/_components";
import { requireAdmin } from "@/app/app/admin/_state/require-admin";

export default async function AdminReportsPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reports"
        description="Performans, pipeline ve operasyon raporları."
        breadcrumb={[
          { label: "Uygulama", href: "/app/dashboard" },
          { label: "Admin", href: "/app/admin/dashboard" },
          { label: "Reports" },
        ]}
        actions={
          <Link
            href="/iletisim?topic=Raporlama%20kurulumu&source=admin"
            className="inline-flex items-center justify-center rounded-xl bg-atlas-blue px-4 py-2 text-sm font-semibold text-white outline-none ring-atlas-teal/40 transition hover:bg-atlas-blue/95 focus-visible:ring-4"
          >
            Raporları etkinleştir
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-linear-to-br from-atlas-blue/20 via-white to-atlas-teal/15 p-px">
          <div className="rounded-2xl border border-black/10 bg-white/85 px-5 py-4">
            <div className="text-xs text-atlas-steel">KPI</div>
            <div className="mt-1 text-sm font-semibold text-atlas-blue">Müşteri büyümesi</div>
            <div className="mt-2 text-xs text-atlas-steel">Yeni müşteri, churn ve segment kırılımı.</div>
          </div>
        </div>
        <div className="rounded-2xl bg-linear-to-br from-system-info/25 via-white to-atlas-teal/15 p-px">
          <div className="rounded-2xl border border-black/10 bg-white/85 px-5 py-4">
            <div className="text-xs text-atlas-steel">Operasyon</div>
            <div className="mt-1 text-sm font-semibold text-atlas-blue">Görev sağlığı</div>
            <div className="mt-2 text-xs text-atlas-steel">Açık iş yükü, SLA, ekip performansı.</div>
          </div>
        </div>
        <div className="rounded-2xl bg-linear-to-br from-system-warning/25 via-white to-atlas-teal/15 p-px">
          <div className="rounded-2xl border border-black/10 bg-white/85 px-5 py-4">
            <div className="text-xs text-atlas-steel">Finans</div>
            <div className="mt-1 text-sm font-semibold text-atlas-blue">Aktivasyon / satış</div>
            <div className="mt-2 text-xs text-atlas-steel">PAID kod üretimleri ve dönüşüm izlemesi.</div>
          </div>
        </div>
      </div>

      <SectionCard
        title="Rapor Merkezi"
        description="İleri düzey rapor ekranları bir sonraki adımda eklenecek."
      >
        <EmptyState
          title="Reports modülü yakında"
          description="Bu alanı grafikler, segment filtreleri ve export (CSV) ile genişleteceğiz."
          primaryAction={{
            label: "İhtiyaç analizi iste",
            href: "/iletisim?topic=Raporlama%20ihtiya%C3%A7%20analizi&source=admin",
          }}
        />
      </SectionCard>
    </div>
  );
}
