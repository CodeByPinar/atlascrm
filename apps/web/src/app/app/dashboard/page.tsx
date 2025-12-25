import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentSessionUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

import { DashboardActionCard } from "@/app/app/dashboard/_components/DashboardActionCard";

function formatRelativeDate(date: Date): string {
  const deltaMs = Date.now() - date.getTime();
  const minutes = Math.floor(deltaMs / 60_000);
  if (minutes < 1) return "az önce";
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} sa önce`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün önce`;
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(date);
}

function getActionTone(action: string): {
  dotClass: string;
  pillClass: string;
  label: string;
} {
  const a = action.toLowerCase();

  if (a.includes("created") || a.includes("oluştur") || a.includes("create")) {
    return {
      dotClass: "bg-system-success",
      pillClass: "border-system-success/30 bg-system-success/10 text-system-success",
      label: "Oluşturma",
    };
  }

  if (a.includes("updated") || a.includes("güncell") || a.includes("update")) {
    return {
      dotClass: "bg-system-info",
      pillClass: "border-system-info/30 bg-system-info/10 text-system-info",
      label: "Güncelleme",
    };
  }

  if (a.includes("deleted") || a.includes("sil") || a.includes("delete")) {
    return {
      dotClass: "bg-system-error",
      pillClass: "border-system-error/30 bg-system-error/10 text-system-error",
      label: "Silme",
    };
  }

  return {
    dotClass: "bg-atlas-teal",
    pillClass: "border-atlas-teal/30 bg-atlas-teal/10 text-atlas-teal",
    label: "Hareket",
  };
}

function StatCard(props: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: "info" | "success" | "warning" | "brand";
}) {
  const accentClass =
    props.accent === "info"
      ? "from-system-info/25 via-white to-atlas-teal/15"
      : props.accent === "success"
        ? "from-system-success/25 via-white to-atlas-teal/15"
        : props.accent === "warning"
          ? "from-system-warning/25 via-white to-atlas-teal/15"
          : "from-atlas-blue/25 via-white to-atlas-teal/20";

  const iconClass =
    props.accent === "info"
      ? "text-system-info"
      : props.accent === "success"
        ? "text-system-success"
        : props.accent === "warning"
          ? "text-system-warning"
          : "text-atlas-blue";

  return (
    <div className={`rounded-2xl bg-linear-to-br ${accentClass} p-px`}>
      <div className="rounded-2xl border border-black/10 bg-white/85 p-5 backdrop-blur transition-shadow hover:shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-atlas-steel">{props.title}</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-atlas-blue">
              {props.value}
            </div>
            <div className="mt-1 text-xs text-atlas-steel">{props.subtitle}</div>
          </div>

          <div className={`rounded-xl border border-black/10 bg-white p-2 ${iconClass}`}>
            {props.icon}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getCurrentSessionUser();
  if (!session) redirect("/login");

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id, status: "ACTIVE" },
    include: { organization: true },
  });

  if (!membership) {
    const organization = await prisma.organization.upsert({
      where: { id: "atlascrm-default" },
      update: { name: "AtlasCRM" },
      create: { id: "atlascrm-default", name: "AtlasCRM" },
    });

    await prisma.membership.create({
      data: {
        organizationId: organization.id,
        userId: session.user.id,
        status: "ACTIVE",
        role: "USER",
      },
    });

    redirect("/app/dashboard");
  }

  const isAdmin = session.user.isSuperAdmin || membership.role === "ADMIN" || membership.role === "MANAGER";

  if (isAdmin) {
    redirect("/app/admin/dashboard");
  }

  const contactHref = (topic: string) =>
    `/iletisim?plan=${encodeURIComponent("Kurulum")}&topic=${encodeURIComponent(topic)}&source=${encodeURIComponent(
      "dashboard",
    )}`;

  const organizationId = membership.organizationId;
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [customersCount, openTasksCount, activities7dCount, contactRequests7dCount, recentActivities] =
    await Promise.all([
      organizationId
        ? prisma.customer.count({ where: { organizationId } })
        : Promise.resolve(0),
      organizationId
        ? prisma.task.count({
            where: {
              organizationId,
              status: { in: ["OPEN", "IN_PROGRESS", "BLOCKED"] },
            },
          })
        : Promise.resolve(0),
      organizationId
        ? prisma.activity.count({
            where: { organizationId, timestamp: { gte: sevenDaysAgo } },
          })
        : Promise.resolve(0),
      prisma.contactRequest.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      organizationId
        ? prisma.activity.findMany({
            where: { organizationId },
            orderBy: { timestamp: "desc" },
            take: 6,
          })
        : Promise.resolve([]),
    ]);

  const isEmptyForNewOrg =
    Boolean(organizationId) && customersCount === 0 && openTasksCount === 0 && activities7dCount === 0;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-atlas-blue to-atlas-teal p-px">
        <div className="absolute -left-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

        <div className="relative rounded-3xl border border-black/10 bg-white/85 px-6 py-6 backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-atlas-blue">
                Kontrol Paneli
              </h1>
              <p className="mt-1 text-sm text-atlas-steel">
                Hesabınıza ait özet metrikler ve son hareketler.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-atlas-steel">
                <span className="h-1.5 w-1.5 rounded-full bg-system-success" />
                Oturum açık
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-atlas-steel">
                <span className="font-medium text-atlas-blue">{membership.organization.name}</span>
                <span className="text-atlas-steel">•</span>
                {membership.role}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-atlas-steel">
                <span className="h-1.5 w-1.5 rounded-full bg-system-warning" />
                Misafir paneli
              </span>
            </div>
          </div>

          {!isAdmin ? (
            <div className="mt-4 rounded-2xl border border-black/10 bg-linear-to-r from-system-warning/10 via-white to-atlas-teal/10 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-atlas-blue">Modüller için yetki gerekli</div>
                  <div className="mt-1 text-xs text-atlas-steel">
                    Hesabınız şu an <span className="font-semibold text-atlas-blue">{membership.role}</span> rolünde.
                    Müşteri / görev modüllerini açmak için yönetici yetkisi gerekir.
                  </div>
                </div>
                <Link
                  href={contactHref("Yönetici yetkisi / modül aktivasyonu")}
                  className="inline-flex items-center justify-center rounded-xl bg-atlas-blue px-4 py-2 text-sm font-semibold text-white outline-none ring-atlas-teal/40 transition hover:bg-atlas-blue/95 focus-visible:ring-4"
                >
                  Yetki iste
                </Link>
              </div>
            </div>
          ) : null}

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3">
              <div className="text-xs text-atlas-steel">Bugün odak</div>
              <div className="mt-1 text-sm font-semibold text-atlas-blue">
                Açık işleri kapat, akışı hızlandır
              </div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3">
              <div className="text-xs text-atlas-steel">Hızlı ipucu</div>
              <div className="mt-1 text-sm font-semibold text-atlas-blue">
                Aktivite kaydı alışkanlığı edin
              </div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3">
              <div className="text-xs text-atlas-steel">Durum</div>
              <div className="mt-1 text-sm font-semibold text-atlas-blue">
                Sistem stabil • Veriler güncel
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Müşteriler"
          value={String(customersCount)}
          subtitle="Toplam kayıtlı müşteri"
          accent="brand"
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M3 20c0-2.761 2.239-5 5-5h0"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M13 20c0-2.761-2.239-5-5-5s-5 2.239-5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M21 20c0-2.761-2.239-5-5-5h0"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          }
        />

        <StatCard
          title="Açık Görevler"
          value={String(openTasksCount)}
          subtitle="OPEN / IN_PROGRESS / BLOCKED"
          accent="warning"
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M9 11.5l2 2 4-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 3h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          }
        />

        <StatCard
          title="Aktiviteler (7g)"
          value={String(activities7dCount)}
          subtitle="Son 7 gün içindeki hareket"
          accent="info"
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 19V5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M20 19V5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M7 15l3-3 3 3 4-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />

        <StatCard
          title="İletişim (7g)"
          value={String(contactRequests7dCount)}
          subtitle="Son 7 gün form talepleri"
          accent="success"
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 6h16v12H4V6Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M4 7l8 6 8-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
      </section>

      {isEmptyForNewOrg ? (
        <section className="rounded-2xl bg-linear-to-br from-atlas-blue/20 via-white to-atlas-teal/15 p-px">
          <div className="rounded-2xl border border-black/10 bg-white/85 p-6 backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-atlas-blue">
                  Başlarken
                </h2>
                <p className="mt-1 text-sm text-atlas-steel">
                  İlk 5 dakikada paneli “canlı” hale getirelim.
                </p>
              </div>

              <Link
                href={contactHref("Kurulum / onboarding")}
                className="inline-flex items-center justify-center rounded-xl bg-atlas-blue px-4 py-2 text-sm font-semibold text-white outline-none ring-atlas-teal/40 transition hover:bg-atlas-blue/95 focus-visible:ring-4"
              >
                Kurulum desteği al
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-system-info" />
                  <div className="text-xs font-medium text-atlas-steel">Adım 1</div>
                </div>
                <div className="mt-2 text-sm font-semibold text-atlas-blue">İlk müşterini ekle</div>
                {isAdmin ? (
                  <Link
                    href="/app/admin/customers/new"
                    className="mt-1 inline-flex text-xs font-semibold text-atlas-blue underline decoration-atlas-teal/40 underline-offset-4"
                  >
                    Müşteri oluştur
                  </Link>
                ) : (
                  <Link
                    href={contactHref("Müşteri modülü erişimi")}
                    className="mt-1 inline-flex text-xs font-semibold text-atlas-blue underline decoration-atlas-teal/40 underline-offset-4"
                  >
                    Erişim iste / demo planla
                  </Link>
                )}
              </div>
              <div className="rounded-2xl border border-black/10 bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-system-warning" />
                  <div className="text-xs font-medium text-atlas-steel">Adım 2</div>
                </div>
                <div className="mt-2 text-sm font-semibold text-atlas-blue">Görev akışını kur</div>
                {isAdmin ? (
                  <Link
                    href="/app/admin/tasks/new"
                    className="mt-1 inline-flex text-xs font-semibold text-atlas-blue underline decoration-atlas-teal/40 underline-offset-4"
                  >
                    Görev oluştur
                  </Link>
                ) : (
                  <Link
                    href={contactHref("Görev modülü erişimi")}
                    className="mt-1 inline-flex text-xs font-semibold text-atlas-blue underline decoration-atlas-teal/40 underline-offset-4"
                  >
                    Erişim iste / demo planla
                  </Link>
                )}
              </div>
              <div className="rounded-2xl border border-black/10 bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-system-success" />
                  <div className="text-xs font-medium text-atlas-steel">Adım 3</div>
                </div>
                <div className="mt-2 text-sm font-semibold text-atlas-blue">Aktivite kaydı al</div>
                <div className="mt-1 text-xs text-atlas-steel">Son aktiviteler burada görünür</div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white lg:col-span-2">
          <div className="flex items-center justify-between bg-linear-to-r from-atlas-blue/10 via-white to-atlas-teal/10 px-6 py-4">
            <h2 className="text-sm font-semibold text-atlas-blue">Son Aktiviteler</h2>
            <span className="text-xs text-atlas-steel">Güncel akış</span>
          </div>

          <div className="px-6 py-4">
            {recentActivities.length > 0 ? (
                <ul className="space-y-3">
                  {recentActivities.map((a) => (
                    <li
                      key={a.id}
                      className="relative overflow-hidden rounded-xl border border-black/10 bg-white p-4"
                    >
                      {(() => {
                        const tone = getActionTone(a.action);
                        return (
                          <>
                            <div
                              className={`absolute inset-y-0 left-0 w-1 ${tone.dotClass}`}
                              aria-hidden="true"
                            />
                            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${tone.pillClass}`}
                                  >
                                    {tone.label}
                                  </span>
                                  <span className="inline-flex items-center rounded-full border border-black/10 bg-atlas-cloud px-2 py-0.5 text-[11px] font-medium text-atlas-blue">
                                    {a.entityType}
                                  </span>
                                </div>

                                <div className="mt-2 text-sm font-semibold text-atlas-blue">
                                  {a.action}
                                </div>

                                <div className="mt-1 text-xs text-atlas-steel">
                                  <span className="font-mono" title={a.entityId}>
                                    <span className="inline-block max-w-full truncate align-bottom">
                                      {a.entityId}
                                    </span>
                                  </span>
                                </div>
                              </div>

                              <div className="shrink-0 text-xs text-atlas-steel">
                                {formatRelativeDate(a.timestamp)}
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-xl border border-black/10 bg-atlas-cloud p-5">
                  <div className="text-sm font-semibold text-atlas-blue">Henüz aktivite yok</div>
                  <p className="mt-1 text-sm text-atlas-steel">
                    Müşteri ve görev yönetimi eklendikçe burada hareketleri göreceksiniz.
                  </p>
                </div>
              )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
          <div className="bg-linear-to-r from-atlas-blue/10 via-white to-atlas-teal/10 px-6 py-4">
            <h2 className="text-sm font-semibold text-atlas-blue">Hızlı Aksiyonlar</h2>
            <p className="mt-1 text-xs text-atlas-steel">Sık kullanılan işlemler</p>
          </div>

          <div className="space-y-3 px-6 py-4">
            {isAdmin ? (
              <>
                <DashboardActionCard
                  href="/app/admin/customers"
                  title="Müşterileri yönet"
                  subtitle="Admin müşteri listesi"
                  tone="info"
                />
                <DashboardActionCard
                  href="/app/admin/customers/new"
                  title="Yeni müşteri ekle"
                  subtitle="Hızlı kayıt"
                  tone="info"
                />
              </>
            ) : (
              <DashboardActionCard
                href={contactHref("Müşteri modülü erişimi")}
                title="Müşteri ekle"
                subtitle="Bu modül için yetki iste / demo planla"
                tone="info"
              />
            )}

            {isAdmin ? (
              <>
                <DashboardActionCard
                  href="/app/admin/tasks"
                  title="Görevleri yönet"
                  subtitle="Admin görev listesi"
                  tone="warning"
                />
                <DashboardActionCard
                  href="/app/admin/tasks/new"
                  title="Yeni görev oluştur"
                  subtitle="Hızlı görev kaydı"
                  tone="warning"
                />
              </>
            ) : (
              <DashboardActionCard
                href={contactHref("Görev modülü erişimi")}
                title="Görev oluştur"
                subtitle="Bu modül için yetki iste / demo planla"
                tone="warning"
              />
            )}

            <DashboardActionCard
              href={contactHref("Raporlar modülü")}
              title="Raporlar"
              subtitle="Rapor modülünü aktive etmek için iletişime geç"
              tone="success"
            />

            <div className="rounded-xl bg-linear-to-br from-atlas-blue/10 via-white to-atlas-teal/10 p-px">
              <div className="rounded-xl border border-black/10 bg-white p-4">
                <div className="text-sm font-semibold text-atlas-blue">Yardım / Demo</div>
                <p className="mt-1 text-sm text-atlas-steel">
                  Kurulum ve ihtiyaçlar için ekibimizle iletişime geçin.
                </p>
                <Link
                  href="/iletisim"
                  className="mt-3 inline-flex items-center justify-center rounded-xl bg-atlas-blue px-4 py-2 text-sm font-semibold text-white"
                >
                  İletişime geç
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
