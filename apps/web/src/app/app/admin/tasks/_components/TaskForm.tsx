"use client";

import { useFormState, useFormStatus } from "react-dom";

import type { TaskActionState } from "@/server/actions/admin/tasks";

type TaskFormValues = {
  title: string;
  status: "OPEN" | "IN_PROGRESS" | "DONE" | "BLOCKED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: string;
  customerId: string;
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

export default function TaskForm(props: {
  action: (prev: TaskActionState, formData: FormData) => Promise<TaskActionState>;
  submitLabel: string;
  customerOptions: Array<{ id: string; name: string }>;
  initial?: Partial<TaskFormValues>;
}) {
  const [state, formAction] = useFormState<TaskActionState, FormData>(props.action, { ok: true });

  const initial: TaskFormValues = {
    title: props.initial?.title ?? "",
    status: props.initial?.status ?? "OPEN",
    priority: props.initial?.priority ?? "MEDIUM",
    dueDate: props.initial?.dueDate ?? "",
    customerId: props.initial?.customerId ?? "",
  };

  return (
    <form action={formAction} className="space-y-4">
      {!state.ok ? (
        <div className="rounded-xl border border-system-error/30 bg-system-error/10 px-4 py-3 text-sm text-system-error">
          {state.message}
        </div>
      ) : null}

      <label className="block">
        <div className="text-xs font-medium text-atlas-steel">Başlık</div>
        <input
          name="title"
          defaultValue={initial.title}
          required
          className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none ring-atlas-teal/40 focus-visible:ring-4"
          placeholder="Örn. Teklif görüşmesi planla"
        />
      </label>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <div className="text-xs font-medium text-atlas-steel">Durum</div>
          <select
            name="status"
            defaultValue={initial.status}
            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none ring-atlas-teal/40 focus-visible:ring-4"
          >
            <option value="OPEN">Açık</option>
            <option value="IN_PROGRESS">Devam ediyor</option>
            <option value="DONE">Tamamlandı</option>
            <option value="BLOCKED">Engelli</option>
          </select>
        </label>

        <label className="block">
          <div className="text-xs font-medium text-atlas-steel">Öncelik</div>
          <select
            name="priority"
            defaultValue={initial.priority}
            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none ring-atlas-teal/40 focus-visible:ring-4"
          >
            <option value="LOW">Düşük</option>
            <option value="MEDIUM">Orta</option>
            <option value="HIGH">Yüksek</option>
            <option value="URGENT">Acil</option>
          </select>
        </label>

        <label className="block">
          <div className="text-xs font-medium text-atlas-steel">Termin</div>
          <input
            name="dueDate"
            type="date"
            defaultValue={initial.dueDate}
            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none ring-atlas-teal/40 focus-visible:ring-4"
          />
        </label>

        <label className="block">
          <div className="text-xs font-medium text-atlas-steel">Müşteri (opsiyonel)</div>
          <select
            name="customerId"
            defaultValue={initial.customerId}
            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-atlas-blue outline-none ring-atlas-teal/40 focus-visible:ring-4"
          >
            <option value="">Seçilmedi</option>
            {props.customerOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <SubmitButton label={props.submitLabel} />
      </div>
    </form>
  );
}
