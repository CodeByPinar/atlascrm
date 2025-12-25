import { AdminPageHeader, SkeletonCard, SkeletonLine } from "@/app/app/admin/_components";

export default function Loading() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Admin Kontrol Paneli"
        description="Yükleniyor..."
        breadcrumb={[{ label: "Uygulama", href: "/app/dashboard" }, { label: "Admin" }]}
        actions={
          <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-atlas-steel">
            <SkeletonLine className="h-3 w-20" />
          </span>
        }
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SkeletonCard lines={3} />
        <SkeletonCard lines={3} />
        <SkeletonCard lines={3} />
        <SkeletonCard lines={3} />
        <SkeletonCard lines={3} />
        <SkeletonCard lines={3} />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SkeletonCard lines={6} />
        </div>
        <SkeletonCard lines={6} />
      </section>
    </div>
  );
}
