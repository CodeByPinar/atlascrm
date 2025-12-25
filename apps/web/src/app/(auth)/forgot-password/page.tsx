import type { Metadata } from "next";

import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Şifre sıfırlama",
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-atlas-cloud px-3 py-1 text-xs text-atlas-steel">
        <span className="size-1.5 rounded-full bg-system-warning" />
        Şifre yenileme
      </div>
      <h1 className="mt-4 text-2xl font-semibold text-atlas-blue">Şifre sıfırlama</h1>
      <p className="mt-2 text-sm leading-7 text-atlas-steel">
        E-posta adresinizi girin. Eğer sistemimizde kayıtlıysa, şifre yenileme bağlantısı gönderildiğini belirten
        bir mesaj göreceksiniz.
      </p>

      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
