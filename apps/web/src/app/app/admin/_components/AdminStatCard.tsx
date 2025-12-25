export default function AdminStatCard(props: {
  title: string;
  value: string;
  subtitle?: string;
  accent?: "brand" | "info" | "success" | "warning" | "danger";
  icon?: React.ReactNode;
}) {
  const accent = props.accent ?? "brand";

  const accentClass =
    accent === "info"
      ? "from-system-info/25 via-white to-atlas-teal/15"
      : accent === "success"
        ? "from-system-success/25 via-white to-atlas-teal/15"
        : accent === "warning"
          ? "from-system-warning/25 via-white to-atlas-teal/15"
          : accent === "danger"
            ? "from-system-error/25 via-white to-atlas-teal/15"
            : "from-atlas-blue/25 via-white to-atlas-teal/20";

  const iconClass =
    accent === "info"
      ? "text-system-info"
      : accent === "success"
        ? "text-system-success"
        : accent === "warning"
          ? "text-system-warning"
          : accent === "danger"
            ? "text-system-error"
            : "text-atlas-blue";

  return (
    <div className={`rounded-2xl bg-linear-to-br ${accentClass} p-px`}>
      <div className="rounded-2xl border border-black/10 bg-white/85 p-5 backdrop-blur transition-shadow hover:shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-atlas-steel">{props.title}</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-atlas-blue">
              {props.value}
            </div>
            {props.subtitle ? (
              <div className="mt-1 text-xs text-atlas-steel">{props.subtitle}</div>
            ) : null}
          </div>

          {props.icon ? (
            <div className={`rounded-xl border border-black/10 bg-white p-2 ${iconClass}`}>
              {props.icon}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
