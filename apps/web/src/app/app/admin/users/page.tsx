import Link from "next/link";

import { AdminPageHeader, EmptyState, SectionCard } from "@/app/app/admin/_components";
import { requireAdmin } from "@/app/app/admin/_state/require-admin";

export default async function AdminUsersPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Kullanıcılar"
        description="Üye yönetimi, roller ve davet akışı."
        breadcrumb={[
          { label: "Uygulama", href: "/app/dashboard" },
          { label: "Admin", href: "/app/admin/dashboard" },
          { label: "Kullanıcılar" },
        ]}
        actions={
          <Link
            href="/iletisim?topic=Kullan%C4%B1c%C4%B1%20y%C3%B6netimi%20%2F%20davet%20ak%C4%B1%C5%9F%C4%B1&source=admin"
            className="inline-flex items-center justify-center rounded-xl bg-atlas-blue px-4 py-2 text-sm font-semibold text-white outline-none ring-atlas-teal/40 transition hover:bg-atlas-blue/95 focus-visible:ring-4"
          >
            Davet akışını kur
          </Link>
        }
      />

      <SectionCard
        title="Üyeler"
        description="Organizasyon üyelerini rol bazlı yönetin."
      >
        <EmptyState
          title="Kullanıcı yönetimi yakında"
          description="Bu alana kullanıcı listesi, rol düzenleme, davet gönderme ve erişim denetimi ekleyeceğiz."
          primaryAction={{
            label: "Davet akışı planla",
            href: "/iletisim?topic=Kullan%C4%B1c%C4%B1%20davet%20ak%C4%B1%C5%9F%C4%B1%20planlama&source=admin",
          }}
          secondaryAction={{
            label: "Organizasyonlar",
            href: "/app/admin/organizations",
          }}
        />
      </SectionCard>
    </div>
  );
}
