import Link from "next/link";

import { AdminPageHeader, SectionCard } from "@/app/app/admin/_components";
import { requireAdmin } from "@/app/app/admin/_state/require-admin";

export default async function AdminProfilePage() {
  const { session } = await requireAdmin();

  const user = session.user;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Profil"
        description="Hesap ve oturum bilgileri."
        breadcrumb={[
          { label: "Uygulama", href: "/app/dashboard" },
          { label: "Admin", href: "/app/admin/dashboard" },
          { label: "Profil" },
        ]}
      />

      <SectionCard title="Hesap" description="Temel kullanıcı bilgileri.">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-black/10 bg-white px-4 py-3">
            <div className="text-xs text-atlas-steel">E-posta</div>
            <div className="mt-1 text-sm font-semibold text-atlas-blue">{user.email}</div>
          </div>
          <div className="rounded-xl border border-black/10 bg-white px-4 py-3">
            <div className="text-xs text-atlas-steel">Kullanıcı ID</div>
            <div className="mt-1 truncate font-mono text-xs text-atlas-blue">{user.id}</div>
          </div>
          <div className="rounded-xl border border-black/10 bg-white px-4 py-3">
            <div className="text-xs text-atlas-steel">Yetki</div>
            <div className="mt-1 text-sm font-semibold text-atlas-blue">
              {user.isSuperAdmin ? "Super Admin" : "Admin"}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-black/10 bg-atlas-cloud px-4 py-3 text-xs text-atlas-steel">
          Profil düzenleme alanını (isim, avatar, 2FA, API keys) bir sonraki adımda ekleyebiliriz.
        </div>

        <div className="mt-4">
          <Link
            href="/app/admin/settings"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-atlas-blue outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
          >
            Ayarlara git
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}
