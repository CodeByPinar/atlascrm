"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  description: string;
};

const NAV: NavItem[] = [
  {
    href: "/app/admin/dashboard",
    label: "Dashboard",
    description: "Genel görünüm ve metrikler",
  },
  {
    href: "/app/admin/leads",
    label: "Leads",
    description: "Potansiyel müşteri akışı",
  },
  {
    href: "/app/admin/organizations",
    label: "Organizasyonlar",
    description: "Tenant yönetimi ve yapı",
  },
  {
    href: "/app/admin/customers",
    label: "Müşteriler",
    description: "Kayıtlar, segmentler, takip",
  },
  {
    href: "/app/admin/tasks",
    label: "Görevler",
    description: "Takım iş akışı ve durumlar",
  },
  {
    href: "/app/admin/users",
    label: "Kullanıcılar",
    description: "Üyeler, roller, davet",
  },
  {
    href: "/app/admin/activities",
    label: "Aktiviteler",
    description: "Olaylar ve audit log",
  },
  {
    href: "/app/admin/reports",
    label: "Reports",
    description: "Raporlar ve analiz",
  },
  {
    href: "/app/admin/billing",
    label: "Satış / Aktivasyon",
    description: "PAID kod üretim ekranı",
  },
  {
    href: "/app/admin/settings",
    label: "Ayarlar",
    description: "Genel ayarlar ve güvenlik",
  },
  {
    href: "/app/admin/profile",
    label: "Profil",
    description: "Kullanıcı bilgileri",
  },
];

function isActivePath(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href === "/app/admin/dashboard") return false;
  return pathname.startsWith(href);
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="rounded-3xl bg-linear-to-br from-atlas-blue/25 via-white to-atlas-teal/20 p-px">
      <div className="rounded-3xl border border-black/10 bg-white/85 p-4 backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-atlas-steel">Admin</div>
            <div className="mt-1 text-sm font-semibold tracking-tight text-atlas-blue">
              Yönetim Paneli
            </div>
          </div>
          <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-2 py-1 text-[11px] text-atlas-steel">
            v1
          </span>
        </div>

        <div className="mt-4 space-y-2">
          {NAV.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "block rounded-2xl border border-atlas-teal/25 bg-linear-to-r from-atlas-blue/10 via-white to-atlas-teal/10 px-3 py-3 outline-none ring-atlas-teal/40 transition focus-visible:ring-4"
                    : "block rounded-2xl border border-black/10 bg-white px-3 py-3 outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
                }
                aria-current={active ? "page" : undefined}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-atlas-blue">{item.label}</div>
                    <div className="mt-0.5 text-xs text-atlas-steel">{item.description}</div>
                  </div>
                  <span
                    className={
                      active
                        ? "mt-0.5 inline-flex h-2 w-2 shrink-0 rounded-full bg-atlas-teal"
                        : "mt-0.5 inline-flex h-2 w-2 shrink-0 rounded-full bg-black/15"
                    }
                    aria-hidden="true"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-black/10 bg-atlas-cloud px-3 py-3">
          <div className="text-xs font-semibold text-atlas-blue">İpucu</div>
          <div className="mt-1 text-xs text-atlas-steel">
            DEMO kodları misafir panele, PAID kodları admin panele yönlendirir.
          </div>
        </div>
      </div>
    </div>
  );
}
