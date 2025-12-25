import Link from "next/link";

import { AdminPageHeader, EmptyState, SectionCard } from "@/app/app/admin/_components";
import { requireAdmin } from "@/app/app/admin/_state/require-admin";

export default async function AdminOrganizationsPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Organizasyonlar"
        description="Çalışma alanı (tenant) ve üyelik yapısını yönetin."
        breadcrumb={[
          { label: "Uygulama", href: "/app/dashboard" },
          { label: "Admin", href: "/app/admin/dashboard" },
          { label: "Organizasyonlar" },
        ]}
        actions={
          <Link
            href="/iletisim?topic=Organizasyon%20yap%C4%B1land%C4%B1rma&source=admin"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-atlas-blue outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
          >
            Yapılandırma desteği
          </Link>
        }
      />

      <SectionCard
        title="Tenant Yönetimi"
        description="Organizasyon bazlı veri izolasyonu ve üyelik rolleri."
      >
        <EmptyState
          title="Organizasyon yönetimi yakında"
          description="Buraya organizasyon listesi, üyeler, roller ve davet akışını ekleyeceğiz."
          primaryAction={{
            label: "Yetki modeli danış",
            href: "/iletisim?topic=Yetki%20modeli%20%2F%20organizasyon%20rolleri&source=admin",
          }}
        />
      </SectionCard>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white px-5 py-4">
          <div className="text-xs text-atlas-steel">Güvenlik</div>
          <div className="mt-1 text-sm font-semibold text-atlas-blue">Rol bazlı erişim</div>
          <div className="mt-2 text-xs text-atlas-steel">ADMIN/MANAGER/USER rol ayrımı ve modül yetkileri.</div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white px-5 py-4">
          <div className="text-xs text-atlas-steel">Operasyon</div>
          <div className="mt-1 text-sm font-semibold text-atlas-blue">Davet akışı</div>
          <div className="mt-2 text-xs text-atlas-steel">E-posta ile kullanıcı daveti ve onboarding adımları.</div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white px-5 py-4">
          <div className="text-xs text-atlas-steel">Denetim</div>
          <div className="mt-1 text-sm font-semibold text-atlas-blue">Audit log</div>
          <div className="mt-2 text-xs text-atlas-steel">Kritik değişikliklerin izlenmesi ve raporlanması.</div>
        </div>
      </div>
    </div>
  );
}
