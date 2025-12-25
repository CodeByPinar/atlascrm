import type { Metadata } from "next";

import { LandingHeader } from "@/app/_components/LandingHeader";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "AtlasCRM; görev, müşteri ve aktivite yönetimini tek bir kurumsal çalışma alanında birleştirir.",
};

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-atlas-cloud text-atlas-blue">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-atlas-teal/15 blur-3xl" />
          <div className="absolute -top-24 right-[-140px] h-[420px] w-[420px] rounded-full bg-atlas-blue/20 blur-3xl" />
        </div>

        <LandingHeader />

        <main id="content" className="relative">
          <section className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid gap-10 md:grid-cols-2 md:items-start">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-atlas-steel">
                  <span className="size-1.5 rounded-full bg-system-info" />
                  Kurumsal CRM + görev çalışma alanı
                </div>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
                  AtlasCRM kimler için?
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-atlas-steel">
                  AtlasCRM; satış, müşteri başarısı ve operasyon ekiplerinin aynı müşteri
                  bağlamında ilerlemesini sağlayan, rol-bilinçli bir çalışma alanıdır.
                  Hedefimiz: icrayı hızlandırmak, görünürlüğü artırmak ve denetlenebilir
                  bir temel sunmak.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    { k: "Rol bazlı erişim", v: "Temelden" },
                    { k: "Tek kaynak", v: "Müşteri bağlamı" },
                    { k: "Hazır altyapı", v: "Üretim" },
                  ].map((stat) => (
                    <div
                      key={stat.k}
                      className="rounded-2xl border border-black/10 bg-white p-4"
                    >
                      <div className="text-xs text-atlas-steel">{stat.k}</div>
                      <div className="mt-2 text-sm font-semibold text-atlas-blue">
                        {stat.v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-8 md:p-10">
                <h2 className="text-xl font-semibold">Yaklaşımımız</h2>
                <p className="mt-3 text-sm leading-7 text-atlas-steel">
                  Ürün kararlarımızı; performans, güvenlik, ölçeklenebilir mimari ve net
                  sahiplik prensipleri yönlendirir. Karmaşıklığı azaltır, izlenebilirliği
                  artırırız.
                </p>

                <div className="mt-6 grid gap-3">
                  {[
                    {
                      t: "Bağlam odaklı",
                      d: "Görevler ve aktiviteler müşteri kaydıyla birlikte yaşar.",
                    },
                    {
                      t: "Operasyonel",
                      d: "Durumlar, öncelikler ve sahiplik net; raporlama tutarlı.",
                    },
                    {
                      t: "Güvenli",
                      d: "Oturum tabanlı kimlik doğrulama ve denetlenebilir veri modeli.",
                    },
                  ].map((row) => (
                    <div
                      key={row.t}
                      className="rounded-xl border border-black/10 bg-atlas-cloud p-4"
                    >
                      <div className="text-sm font-semibold">{row.t}</div>
                      <div className="mt-1 text-sm text-atlas-steel">{row.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                k: "Güvenlik & denetim",
                v: "Oturum tabanlı giriş, rol bazlı yapı ve izlenebilir veri modeli.",
              },
              {
                k: "Ekip hizalaması",
                v: "Satış + operasyon + müşteri başarısı aynı dil ve aynı metriklerle ilerler.",
              },
              {
                k: "Hızlı icra",
                v: "Günlük operasyonları sadeleştiren, net durum ve öncelik sistemi.",
              },
            ].map((card) => (
              <div
                key={card.k}
                className="rounded-2xl border border-black/10 bg-atlas-cloud p-6"
              >
                <div className="text-sm font-semibold text-atlas-blue">{card.k}</div>
                <div className="mt-2 text-sm text-atlas-steel">{card.v}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-linear-to-br from-atlas-blue to-atlas-teal p-px">
            <div className="rounded-2xl bg-white p-8 md:p-10">
              <div className="grid gap-6 md:grid-cols-2 md:items-center">
                <div>
                  <h3 className="text-2xl font-semibold">Bir demo planlayalım</h3>
                  <p className="mt-3 text-sm leading-7 text-atlas-steel">
                    AtlasCRM&apos;nin ekibinizin iş akışına nasıl oturacağını birlikte değerlendirelim.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <a
                    className="inline-flex items-center justify-center rounded-md border border-black/10 bg-white px-5 py-2.5 text-sm"
                    href="/iletisim"
                  >
                    İletişime geç
                  </a>
                  <a
                    className="inline-flex items-center justify-center rounded-md bg-atlas-teal px-5 py-2.5 text-sm font-medium text-white"
                    href="mailto:demo@atlascrm.com?subject=AtlasCRM%20Demo%20Talebi"
                  >
                    Demo iste
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
