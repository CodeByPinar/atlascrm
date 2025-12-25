"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { registerAction, type RegisterActionState } from "@/server/actions/auth";

const initialState: RegisterActionState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-atlas-teal px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-teal focus-visible:ring-offset-2"
    >
      {pending ? "Hesap oluşturuluyor…" : "Kayıt ol"}
    </button>
  );
}

export function RegisterForm() {
  const [state, action] = useFormState(registerAction, initialState);

  return (
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
          autoComplete="new-password"
          required
          minLength={8}
          className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none focus:border-atlas-teal focus-visible:ring-2 focus-visible:ring-atlas-teal/40"
          placeholder="En az 8 karakter"
        />
        <div className="mt-2 rounded-xl border border-black/10 bg-atlas-cloud px-4 py-3 text-xs text-atlas-steel">
          Şifre kuralları: en az 8 karakter, en az 1 harf ve 1 rakam.
        </div>
      </div>

      {state.ok === false && state.message ? (
        <p className="text-sm text-system-error" role="alert">
          {state.message}
        </p>
      ) : null}

      <SubmitButton />

      <div className="text-sm text-atlas-steel">
        Zaten hesabın var mı?{" "}
        <Link className="text-atlas-blue hover:underline" href="/login">
          Giriş yap
        </Link>
      </div>
    </form>
  );
}
