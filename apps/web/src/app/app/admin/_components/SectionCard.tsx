export default function SectionCard(props: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="flex items-start justify-between gap-4 bg-linear-to-r from-atlas-blue/10 via-white to-atlas-teal/10 px-6 py-4">
        <div className="flex items-start gap-3">
          {props.icon ? (
            <div className="mt-0.5 rounded-xl border border-black/10 bg-white p-2 text-atlas-blue">
              {props.icon}
            </div>
          ) : null}
          <div>
            <h2 className="text-sm font-semibold text-atlas-blue">{props.title}</h2>
          {props.description ? (
            <p className="mt-1 text-xs text-atlas-steel">{props.description}</p>
          ) : null}
          </div>
        </div>
        {props.actions ? <div className="shrink-0">{props.actions}</div> : null}
      </div>

      <div className="px-6 py-4">{props.children}</div>
    </section>
  );
}
