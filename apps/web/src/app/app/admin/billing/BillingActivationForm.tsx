"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import {
  createPaidActivationCodeAction,
  type CreatePaidActivationCodeState,
} from "@/server/actions/admin/billing";

const initialState: CreatePaidActivationCodeState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-xl bg-atlas-blue px-4 py-2 text-sm font-semibold text-white outline-none ring-atlas-teal/40 transition hover:bg-atlas-blue/95 focus-visible:ring-4 disabled:opacity-60"
    >
      {pending ? "Kod üretiliyor…" : "Satış onayla → kod üret"}
    </button>
  );
}

export default function BillingActivationForm() {
  const [state, action] = useFormState(createPaidActivationCodeAction, initialState);

  return (
    <div className="space-y-4">
      <form action={action} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="md:col-span-1">
            <label htmlFor="email" className="text-sm font-medium text-atlas-blue">
              Müşteri e‑postası
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none focus:border-atlas-teal focus-visible:ring-2 focus-visible:ring-atlas-teal/40"
              placeholder="musteri@firma.com"
            />
          </div>

          <div className="md:col-span-1">
            <label htmlFor="organizationName" className="text-sm font-medium text-atlas-blue">
              Organizasyon adı
            </label>
            <input
              id="organizationName"
              name="organizationName"
              required
              className="mt-1 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none focus:border-atlas-teal focus-visible:ring-2 focus-visible:ring-atlas-teal/40"
              placeholder="Firma A.Ş."
            />
          </div>

          <div className="md:col-span-1">
            <label htmlFor="expiresInHours" className="text-sm font-medium text-atlas-blue">
              Kod geçerlilik (saat)
            </label>
            <input
              id="expiresInHours"
              name="expiresInHours"
              inputMode="numeric"
              className="mt-1 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none focus:border-atlas-teal focus-visible:ring-2 focus-visible:ring-atlas-teal/40"
              placeholder="72"
            />
            <div className="mt-1 text-xs text-atlas-steel">Boş bırakılırsa 72 saat.</div>
          </div>
        </div>

        {state.ok === false && state.message ? (
          <p className="text-sm text-system-error" role="alert">
            {state.message}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton />
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-atlas-blue outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
          >
            Login sayfası
          </Link>
        </div>
      </form>

      {state.ok ? (
        <div className="rounded-2xl border border-black/10 bg-linear-to-br from-system-success/10 via-white to-atlas-teal/10 p-4">
          <div className="text-sm font-semibold text-atlas-blue">PAID aktivasyon kodu üretildi</div>
          <div className="mt-2 rounded-xl border border-black/10 bg-white px-4 py-3 font-mono text-lg text-atlas-blue">
            {state.activationCode}
          </div>
          <div className="mt-2 text-xs text-atlas-steel">
            Geçerlilik: {new Date(state.expiresAt).toLocaleString("tr-TR")}
          </div>
          <div className="mt-3 text-sm">
            <Link
              href={`/login?demoCode=${encodeURIComponent(state.activationCode)}`}
              className="text-atlas-blue hover:underline"
            >
              Bu kodla giriş linki
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
