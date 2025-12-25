"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { resetPasswordAction, type ResetPasswordActionState } from "@/server/actions/auth";

const initialState: ResetPasswordActionState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-atlas-teal px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-teal focus-visible:ring-offset-2"
    >
      {pending ? "Kaydediliyor…" : "Yeni şifreyi kaydet"}
    </button>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action] = useFormState(resetPasswordAction, initialState);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      <div className="space-y-1">
        <label htmlFor="newPassword" className="text-sm font-medium text-atlas-blue">
          Yeni şifre
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none focus:border-atlas-teal focus-visible:ring-2 focus-visible:ring-atlas-teal/40"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-atlas-blue">
          Yeni şifre (tekrar)
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none focus:border-atlas-teal focus-visible:ring-2 focus-visible:ring-atlas-teal/40"
        />
        <p className="mt-2 text-xs text-atlas-steel">
          En az 8 karakter, en az 1 harf + 1 rakam.
        </p>
      </div>

      {state.ok === false && state.message ? (
        <p className="text-sm text-system-error" role="alert">
          {state.message}
        </p>
      ) : null}

      <SubmitButton />

      <div className="text-sm">
        <Link className="text-atlas-blue hover:underline" href="/login">
          Giriş sayfasına dön
        </Link>
      </div>
    </form>
  );
}
