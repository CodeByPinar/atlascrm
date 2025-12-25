"use client";

import { useFormState, useFormStatus } from "react-dom";

import type { LeadActionState } from "@/server/actions/admin/leads";

type LeadFormValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "WON" | "LOST";
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-xl bg-atlas-blue px-4 py-2 text-sm font-semibold text-white outline-none ring-atlas-teal/40 transition hover:bg-atlas-blue/95 disabled:opacity-70 focus-visible:ring-4"
    >
      {pending ? "Kaydediliyor…" : label}
    </button>
  );
}

export default function LeadForm(props: {
  action: (prev: LeadActionState, formData: FormData) => Promise<LeadActionState>;
  submitLabel: string;
  initial?: Partial<LeadFormValues>;
}) {
  const [state, formAction] = useFormState<LeadActionState, FormData>(props.action, { ok: true });

  const initial: LeadFormValues = {
    name: props.initial?.name ?? "",
    email: props.initial?.email ?? "",
    phone: props.initial?.phone ?? "",
    company: props.initial?.company ?? "",
    source: props.initial?.source ?? "",
    status: props.initial?.status ?? "NEW",
  };

  return (
    <form action={formAction} className="space-y-4">
      {!state.ok ? (
        <div className="rounded-xl border border-system-error/30 bg-system-error/10 px-4 py-3 text-sm text-system-error">
          {state.message}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <div className="text-xs font-medium text-atlas-steel">Lead adı</div>
          <input
            name="name"
            defaultValue={initial.name}
            required
            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none ring-atlas-teal/40 focus-visible:ring-4"
            placeholder="Örn. Ahmet Yılmaz / Atlas Ltd."
          />
        </label>

        <label className="block">
          <div className="text-xs font-medium text-atlas-steel">Durum</div>
          <select
            name="status"
            defaultValue={initial.status}
            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none ring-atlas-teal/40 focus-visible:ring-4"
          >
            <option value="NEW">Yeni</option>
            <option value="CONTACTED">İletişime geçildi</option>
            <option value="QUALIFIED">Nitelikli</option>
            <option value="WON">Kazanıldı</option>
            <option value="LOST">Kaybedildi</option>
          </select>
        </label>

        <label className="block">
          <div className="text-xs font-medium text-atlas-steel">E-posta</div>
          <input
            name="email"
            type="email"
            defaultValue={initial.email}
            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none ring-atlas-teal/40 focus-visible:ring-4"
            placeholder="ornek@firma.com"
          />
        </label>

        <label className="block">
          <div className="text-xs font-medium text-atlas-steel">Telefon</div>
          <input
            name="phone"
            defaultValue={initial.phone}
            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none ring-atlas-teal/40 focus-visible:ring-4"
            placeholder="+90 ..."
          />
        </label>

        <label className="block">
          <div className="text-xs font-medium text-atlas-steel">Şirket</div>
          <input
            name="company"
            defaultValue={initial.company}
            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none ring-atlas-teal/40 focus-visible:ring-4"
            placeholder="Örn. Atlas Ltd."
          />
        </label>

        <label className="block">
          <div className="text-xs font-medium text-atlas-steel">Kaynak</div>
          <input
            name="source"
            defaultValue={initial.source}
            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none ring-atlas-teal/40 focus-visible:ring-4"
            placeholder="Örn. Website form / kampanya / referral"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <SubmitButton label={props.submitLabel} />
      </div>
    </form>
  );
}
