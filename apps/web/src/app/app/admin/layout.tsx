import type { ReactNode } from "react";

import { requireAdmin } from "@/app/app/admin/_state/require-admin";
import AdminSidebar from "@/app/app/admin/_components/AdminSidebar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  await requireAdmin();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <aside className="lg:col-span-3">
        <AdminSidebar />
      </aside>
      <section className="lg:col-span-9">{children}</section>
    </div>
  );
}
