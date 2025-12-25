import Link from "next/link";

import { AdminPageHeader, EmptyState, SectionCard } from "@/app/app/admin/_components";
import { requireAdmin } from "@/app/app/admin/_state/require-admin";

export default async function AdminSettingsPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Ayarlar"
        description="Genel ayarlar, güvenlik ve entegrasyonlar."
        breadcrumb={[
          { label: "Uygulama", href: "/app/dashboard" },
          { label: "Admin", href: "/app/admin/dashboard" },
          { label: "Ayarlar" },
        ]}
        actions={
          <Link
            href="/iletisim?topic=G%C3%BCvenlik%20%2F%20ayarlar%20kurulumu&source=admin"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-atlas-blue outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
          >
            Güvenlik danış
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white px-5 py-4">
          <div className="text-xs text-atlas-steel">Güvenlik</div>
          <div className="mt-1 text-sm font-semibold text-atlas-blue">Oturum & şifre politikası</div>
          <div className="mt-2 text-xs text-atlas-steel">Şifre sıfırlama, oturum süresi, zorunlu kurallar.</div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white px-5 py-4">
          <div className="text-xs text-atlas-steel">Entegrasyon</div>
          <div className="mt-1 text-sm font-semibold text-atlas-blue">E-posta / webhook</div>
          <div className="mt-2 text-xs text-atlas-steel">Bildirimler ve otomatik iş akışları.</div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white px-5 py-4">
          <div className="text-xs text-atlas-steel">Uyumluluk</div>
          <div className="mt-1 text-sm font-semibold text-atlas-blue">KVKK</div>
          <div className="mt-2 text-xs text-atlas-steel">Form ve kayıt metinleri, saklama politikaları.</div>
        </div>
      </div>

      <SectionCard title="Ayarlar Merkezi" description="Konfigürasyon ekranları kademeli olarak eklenecek.">
        <EmptyState
          title="Ayarlar ekranı yakında"
          description="Bu alana organizasyon ayarları, kullanıcı daveti ve entegrasyon yapılandırmaları gelecek."
          primaryAction={{
            label: "Ayarları planla",
            href: "/iletisim?topic=Ayarlar%20planlama&source=admin",
          }}
        />
      </SectionCard>
    </div>
  );
}
