"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";

import {
  loginAction,
  redeemDemoActivationCodeAction,
  type LoginActionState,
  type RedeemDemoCodeActionState,
} from "@/server/actions/auth";

const initialState: LoginActionState = { ok: false, message: "" };
const initialDemoState: RedeemDemoCodeActionState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-atlas-teal px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-teal focus-visible:ring-offset-2"
    >
      {pending ? "Giriş yapılıyor…" : "Giriş yap"}
    </button>
  );
}

function DemoSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-atlas-blue px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-teal/60 focus-visible:ring-offset-2"
    >
      {pending ? "Kod doğrulanıyor…" : "Kodu kullan"}
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useFormState(loginAction, initialState);
  const [demoState, demoAction] = useFormState(redeemDemoActivationCodeAction, initialDemoState);
  const searchParams = useSearchParams();
  const demoCode = searchParams.get("demoCode") ?? "";

  return (
    <div className="space-y-4">
      <form action={action} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-atlas-blue">
            E-posta
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none focus:border-atlas-teal focus-visible:ring-2 focus-visible:ring-atlas-teal/40"
            placeholder="ornek@firma.com"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-atlas-blue">
            Şifre
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none focus:border-atlas-teal focus-visible:ring-2 focus-visible:ring-atlas-teal/40"
            placeholder="••••••••"
          />
        </div>

        {state.ok === false && state.message ? (
          <p className="text-sm text-system-error" role="alert">
            {state.message}
          </p>
        ) : null}

        <SubmitButton />

        <div className="rounded-xl border border-black/10 bg-atlas-cloud px-4 py-3 text-sm text-atlas-steel">
          <div className="flex items-center justify-between">
            <Link className="text-atlas-blue hover:underline" href="/register">
              Kayıt ol
            </Link>
            <Link className="text-atlas-blue hover:underline" href="/forgot-password">
              Şifremi unuttum
            </Link>
          </div>
        </div>
      </form>

      <div className="relative py-2">
        <div className="absolute inset-x-0 top-1/2 h-px bg-black/10" />
        <div className="relative mx-auto w-fit rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-atlas-steel">
          veya
        </div>
      </div>

      <form action={demoAction} className="space-y-3">
        <div className="rounded-xl border border-black/10 bg-linear-to-br from-atlas-blue/10 via-white to-atlas-teal/10 px-4 py-3">
          <div className="text-sm font-semibold text-atlas-blue">Aktivasyon Kodu</div>
          <div className="mt-1 text-xs text-atlas-steel">
            Kodunuz varsa şifre girmeden giriş yapabilirsiniz. Satın alma sonrası verilen kodlar admin paneline yönlendirir.
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="demoCode" className="text-sm font-medium text-atlas-blue">
            Aktivasyon kodu
          </label>
          <input
            id="demoCode"
            name="code"
            defaultValue={demoCode || undefined}
            className="w-full rounded-md border border-black/10 bg-white px-3 py-2 font-mono text-sm text-atlas-blue outline-none focus:border-atlas-teal focus-visible:ring-2 focus-visible:ring-atlas-teal/40"
            placeholder="ABCD-EFGH-IJKL-MNPQ"
          />
        </div>

        {demoState.ok === false && demoState.message ? (
          <p className="text-sm text-system-error" role="alert">
            {demoState.message}
          </p>
        ) : null}

        <DemoSubmitButton />

        <div className="text-xs text-atlas-steel">
          Kodunuz yok mu? <Link className="text-atlas-blue hover:underline" href="/iletisim?mode=demo">Demo iste</Link>
        </div>
      </form>
    </div>
  );
}
