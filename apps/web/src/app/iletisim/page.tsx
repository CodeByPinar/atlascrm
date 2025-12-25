import type { Metadata } from "next";
import { Suspense } from "react";

import { LandingHeader } from "@/app/_components/LandingHeader";

import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "İletişim",
  description: "AtlasCRM demo, satış ve destek iletişimi.",
};

export default function ContactPage() {
  return (
    <div className="min-h-dvh bg-atlas-cloud text-atlas-blue">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-atlas-teal/15 blur-3xl" />
          <div className="absolute -top-24 -right-35 h-105 w-105 rounded-full bg-atlas-blue/20 blur-3xl" />
        </div>

        <LandingHeader />

        <main id="content" className="relative">
          <section className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid gap-6 md:grid-cols-2 md:items-start">
              <div className="rounded-2xl border border-black/10 bg-white p-8">
                <h1 className="text-3xl font-semibold tracking-tight">İletişim</h1>
                <p className="mt-4 text-sm leading-7 text-atlas-steel">
                  Demo talebi, fiyatlandırma soruları veya entegrasyon ihtiyaçlarınız için bize ulaşın.
                </p>

                <div className="mt-8 grid gap-3 text-sm">
                  {[
                    {
                      k: "Demo",
                      href: "mailto:demo@atlascrm.com?subject=AtlasCRM%20Demo%20Talebi",
                      v: "demo@atlascrm.com",
                    },
                    {
                      k: "Satış",
                      href: "mailto:sales@atlascrm.com?subject=AtlasCRM%20Fiyatlandırma",
                      v: "sales@atlascrm.com",
                    },
                    {
                      k: "Destek",
                      href: "mailto:support@atlascrm.com?subject=AtlasCRM%20Destek",
                      v: "support@atlascrm.com",
                    },
                  ].map((row) => (
                    <div
                      key={row.k}
                      className="rounded-xl border border-black/10 bg-atlas-cloud p-4"
                    >
                      <div className="text-xs text-atlas-steel">{row.k}</div>
                      <a
                        href={row.href}
                        className="mt-1 inline-flex font-medium text-atlas-blue hover:underline"
                      >
                        {row.v}
                      </a>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-linear-to-br from-atlas-blue to-atlas-teal p-px">
                  <div className="rounded-2xl bg-white p-6">
                    <div className="text-sm font-semibold">Hızlı demo talebi</div>
                    <p className="mt-2 text-sm text-atlas-steel">
                      E-postanıza hazır bir demo talep metni oluşturduk.
                    </p>
                    <div className="mt-4 grid gap-3">
                      <a
                        className="inline-flex items-center justify-center rounded-md bg-atlas-teal px-5 py-2.5 text-sm font-medium text-white"
                        href="/iletisim?mode=demo"
                      >
                        Demo akışını başlat
                      </a>
                    </div>
                  </div>
                </div>
              </div>

                <Suspense
                  fallback={
                    <div className="rounded-2xl border border-black/10 bg-white p-8">
                      <div className="h-6 w-40 rounded bg-atlas-cloud" />
                      <div className="mt-4 h-4 w-64 rounded bg-atlas-cloud" />
                      <div className="mt-8 grid gap-3">
                        <div className="h-10 w-full rounded bg-atlas-cloud" />
                        <div className="h-10 w-full rounded bg-atlas-cloud" />
                        <div className="h-10 w-full rounded bg-atlas-cloud" />
                        <div className="h-28 w-full rounded bg-atlas-cloud" />
                        <div className="mt-2 h-10 w-32 rounded bg-atlas-cloud" />
                      </div>
                    </div>
                  }
                >
                  <ContactForm />
                </Suspense>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
