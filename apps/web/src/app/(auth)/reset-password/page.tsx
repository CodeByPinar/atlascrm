import type { Metadata } from "next";

import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Yeni şifre belirle",
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token?.trim() ?? "";

  return (
    <main id="content" className="min-h-dvh bg-atlas-cloud px-6 py-16">
      <div className="mx-auto w-full max-w-md rounded-xl border border-black/10 bg-white p-8">
        <h1 className="text-2xl font-semibold text-atlas-blue">Yeni şifre belirle</h1>
        <p className="mt-2 text-sm text-atlas-steel">
          Yeni şifrenizi belirleyin. Bağlantı geçersizse yeniden talep etmeniz gerekir.
        </p>

        <div className="mt-8">
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <div className="rounded-xl border border-black/10 bg-atlas-cloud px-4 py-3 text-sm text-atlas-blue">
              Token eksik. Lütfen e-postadaki bağlantıyı kontrol edin.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
