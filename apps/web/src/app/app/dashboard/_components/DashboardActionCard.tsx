import Link from "next/link";

type Tone = "info" | "warning" | "success" | "brand";

const toneClasses: Record<Tone, { bg: string; title: string }> = {
  info: {
    bg: "from-system-info/10 via-white to-atlas-teal/10",
    title: "text-atlas-blue",
  },
  warning: {
    bg: "from-system-warning/10 via-white to-atlas-teal/10",
    title: "text-atlas-blue",
  },
  success: {
    bg: "from-system-success/10 via-white to-atlas-teal/10",
    title: "text-atlas-blue",
  },
  brand: {
    bg: "from-atlas-blue/10 via-white to-atlas-teal/10",
    title: "text-atlas-blue",
  },
};

export function DashboardActionCard(props: {
  href: string;
  title: string;
  subtitle: string;
  tone: Tone;
}) {
  const t = toneClasses[props.tone];

  return (
    <Link
      href={props.href}
      className={`block w-full rounded-xl border border-black/10 bg-linear-to-r ${t.bg} px-4 py-3 text-left outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4`}
    >
      <div className={`text-sm font-semibold ${t.title}`}>{props.title}</div>
      <div className="mt-1 text-xs font-normal text-atlas-steel">{props.subtitle}</div>
    </Link>
  );
}
