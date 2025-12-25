import Link from "next/link";

export default function EmptyState(props: {
  title: string;
  description?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}) {
  return (
    <div className="rounded-2xl bg-linear-to-br from-atlas-blue/15 via-white to-atlas-teal/10 p-px">
      <div className="rounded-2xl border border-black/10 bg-white/85 p-6 backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-xl border border-black/10 bg-white p-2 text-atlas-blue">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 8v4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 16h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="min-w-0">
            <div className="text-sm font-semibold text-atlas-blue">{props.title}</div>
            {props.description ? (
              <p className="mt-1 text-sm text-atlas-steel">{props.description}</p>
            ) : null}

            {(props.primaryAction || props.secondaryAction) ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {props.primaryAction ? (
                  <Link
                    href={props.primaryAction.href}
                    className="inline-flex items-center justify-center rounded-xl bg-atlas-blue px-4 py-2 text-sm font-semibold text-white outline-none ring-atlas-teal/40 transition hover:bg-atlas-blue/95 focus-visible:ring-4"
                  >
                    {props.primaryAction.label}
                  </Link>
                ) : null}
                {props.secondaryAction ? (
                  <Link
                    href={props.secondaryAction.href}
                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-atlas-blue outline-none ring-atlas-teal/40 transition hover:bg-atlas-cloud focus-visible:ring-4"
                  >
                    {props.secondaryAction.label}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
