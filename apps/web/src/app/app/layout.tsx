import type { ReactNode } from "react";

import { requireUser } from "@/server/auth/require-user";
import { logoutAction } from "@/server/actions/auth";

export default async function AppLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await requireUser();

  return (
    <div className="min-h-dvh bg-atlas-cloud">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-sm font-semibold text-atlas-blue">AtlasCRM</div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-atlas-steel">{user.email}</div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm text-atlas-blue"
              >
                Çıkış yap
              </button>
            </form>
          </div>
        </div>
      </header>

      <main id="content" className="mx-auto max-w-6xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}
