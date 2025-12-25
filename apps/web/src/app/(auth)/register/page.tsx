import type { Metadata } from "next";

import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "Kayıt ol",
};

export default function RegisterPage() {
  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-atlas-cloud px-3 py-1 text-xs text-atlas-steel">
        <span className="size-1.5 rounded-full bg-system-info" />
        Yeni hesap
      </div>
      <h1 className="mt-4 text-2xl font-semibold text-atlas-blue">Kayıt ol</h1>
      <p className="mt-2 text-sm leading-7 text-atlas-steel">
        Hesabınızı oluşturun. Giriş yaptıktan sonra kontrol paneline yönlendirileceksiniz.
      </p>

      <div className="mt-8">
        <RegisterForm />
      </div>
    </div>
  );
}
