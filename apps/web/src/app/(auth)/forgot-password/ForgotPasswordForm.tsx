"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import {
  requestPasswordResetAction,
  type ForgotPasswordActionState,
} from "@/server/actions/auth";

const initialState: ForgotPasswordActionState = {
  ok: true,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-atlas-teal px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-teal focus-visible:ring-offset-2"
    >
      {pending ? "Gönderiliyor…" : "Şifre sıfırlama bağlantısı iste"}
    </button>
  );
}

export function ForgotPasswordForm() {
  const [state, action] = useFormState(requestPasswordResetAction, initialState);

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

      <div className="rounded-xl border border-black/10 bg-atlas-cloud px-4 py-3 text-xs text-atlas-steel">
        Güvenlik için, e-postanın kayıtlı olup olmadığına dair bilgi paylaşmayız.
      </div>

      {state.message ? (
        <div
          className="rounded-xl border border-black/10 bg-atlas-cloud px-4 py-3 text-sm text-atlas-blue"
          role="status"
        >
          {state.message}
        </div>
      ) : null}

      <SubmitButton />

      <div className="rounded-xl border border-black/10 bg-atlas-cloud px-4 py-3 text-sm">
        <Link className="text-atlas-blue hover:underline" href="/login">
          Giriş sayfasına dön
        </Link>
      </div>
    </form>
  );
}
