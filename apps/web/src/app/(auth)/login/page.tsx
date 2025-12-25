import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Giriş yap",
};

export default function LoginPage() {
  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm text-atlas-blue shadow-sm transition hover:bg-atlas-cloud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-teal/60"
      >
        <span aria-hidden="true" className="inline-flex size-5 items-center justify-center rounded-full bg-atlas-cloud">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3.5 w-3.5"
          >
            <path
              fillRule="evenodd"
              d="M11.78 4.22a.75.75 0 0 1 0 1.06L8.06 9H16a.75.75 0 0 1 0 1.5H8.06l3.72 3.72a.75.75 0 1 1-1.06 1.06l-5-5a.75.75 0 0 1 0-1.06l5-5a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <span>Anasayfaya geri dön</span>
      </Link>

      <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-atlas-cloud px-3 py-1 text-xs text-atlas-steel">
        <span className="size-1.5 rounded-full bg-system-success" />
        Güvenli oturum
      </div>
      <h1 className="mt-4 text-2xl font-semibold text-atlas-blue">Giriş yap</h1>
      <p className="mt-2 text-sm leading-7 text-atlas-steel">
        AtlasCRM çalışma alanınıza erişin. Giriş yaptıktan sonra doğrudan kontrol paneline yönlendirileceksiniz.
      </p>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-atlas-steel">
              Yükleniyor…
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
