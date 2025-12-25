"use client";

import { useFormState, useFormStatus } from "react-dom";

import type { CustomerActionState } from "@/server/actions/admin/customers";

type CustomerFormValues = {
  name: string;
  email: string;
  phone: string;
  segment: string;
  industry: string;
  status: "ACTIVE" | "PROSPECT" | "CHURN_RISK";
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

export default function CustomerForm(props: {
  action: (prev: CustomerActionState, formData: FormData) => Promise<CustomerActionState>;
  submitLabel: string;
  initial?: Partial<CustomerFormValues>;
}) {
  const [state, formAction] = useFormState<CustomerActionState, FormData>(props.action, { ok: true });

  const initial: CustomerFormValues = {
    name: props.initial?.name ?? "",
    email: props.initial?.email ?? "",
    phone: props.initial?.phone ?? "",
    segment: props.initial?.segment ?? "",
    industry: props.initial?.industry ?? "",
    status: props.initial?.status ?? "ACTIVE",
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
          <div className="text-xs font-medium text-atlas-steel">Müşteri adı</div>
          <input
            name="name"
            defaultValue={initial.name}
            required
            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none ring-atlas-teal/40 focus-visible:ring-4"
            placeholder="Örn. Atlas Ltd."
          />
        </label>

        <label className="block">
          <div className="text-xs font-medium text-atlas-steel">Durum</div>
          <select
            name="status"
            defaultValue={initial.status}
            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none ring-atlas-teal/40 focus-visible:ring-4"
          >
            <option value="ACTIVE">Aktif</option>
            <option value="PROSPECT">Aday</option>
            <option value="CHURN_RISK">Risk</option>
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
          <div className="text-xs font-medium text-atlas-steel">Segment</div>
          <input
            name="segment"
            defaultValue={initial.segment}
            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none ring-atlas-teal/40 focus-visible:ring-4"
            placeholder="Örn. SMB"
          />
        </label>

        <label className="block">
          <div className="text-xs font-medium text-atlas-steel">Sektör</div>
          <input
            name="industry"
            defaultValue={initial.industry}
            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none ring-atlas-teal/40 focus-visible:ring-4"
            placeholder="Örn. SaaS"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <SubmitButton label={props.submitLabel} />
      </div>
    </form>
  );
}
