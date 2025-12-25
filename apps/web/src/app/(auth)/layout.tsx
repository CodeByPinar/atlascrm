import type { ReactNode } from "react";

import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-dvh bg-atlas-cloud text-atlas-blue">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-atlas-teal/15 blur-3xl" />
          <div className="absolute -top-24 -right-35 h-105 w-105 rounded-full bg-atlas-blue/20 blur-3xl" />
        </div>

        <div className="relative mx-auto grid min-h-dvh max-w-6xl grid-cols-1 items-stretch gap-8 px-6 py-10 md:grid-cols-2 md:gap-10 md:py-14">
          <aside className="hidden flex-col justify-between rounded-3xl border border-black/10 bg-white/70 p-10 backdrop-blur md:flex">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-atlas-blue text-sm font-semibold text-white">
                  A
                </div>
                <div>
                  <div className="text-sm font-semibold text-atlas-blue">AtlasCRM</div>
                  <div className="text-xs text-atlas-steel">Güvenli kurumsal çalışma alanı</div>
                </div>
              </Link>

              <h2 className="mt-10 text-2xl font-semibold tracking-tight">
                Ekipleri, müşterileri ve icrayı aynı zeminde toplayın.
              </h2>
              <p className="mt-4 text-sm leading-7 text-atlas-steel">
                Session tabanlı kimlik doğrulama, rol bazlı deneyim ve denetlenebilir altyapı ile AtlasCRM;
                ekibinizin günlük operasyonlarını güvenli şekilde hızlandırır.
              </p>

              <div className="mt-8 grid gap-3">
                {[
                  {
                    k: "Oturum tabanlı güvenlik",
                    v: "HttpOnly cookie + sunucu tarafı doğrulama",
                  },
                  {
                    k: "Rol bazlı erişim",
                    v: "Admin / Manager / User sorumluluk ayrımı",
                  },
                  {
                    k: "Şifre sıfırlama",
                    v: "Tek kullanımlık, süreli ve hash’li token",
                  },
                ].map((row) => (
                  <div key={row.k} className="rounded-2xl border border-black/10 bg-atlas-cloud p-5">
                    <div className="text-sm font-semibold text-atlas-blue">{row.k}</div>
                    <div className="mt-2 text-sm text-atlas-steel">{row.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-black/10 pt-6 text-xs text-atlas-steel">
              <span>Kurumsal kullanım için tasarlandı</span>
              <Link href="/iletisim" className="text-atlas-blue hover:underline">
                İletişim
              </Link>
            </div>
          </aside>

          <main id="content" className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
                {children}
              </div>
              <div className="mt-4 text-center text-xs text-atlas-steel">
                © {new Date().getFullYear()} AtlasCRM
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
