import Link from "next/link";

export default function AdminPageHeader(props: {
  title: string;
  description?: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
}) {
  return (
    <header className="rounded-3xl bg-linear-to-br from-atlas-blue/20 via-white to-atlas-teal/15 p-px">
      <div className="rounded-3xl border border-black/10 bg-white/85 px-6 py-6 backdrop-blur">
        {props.breadcrumb && props.breadcrumb.length > 0 ? (
          <nav aria-label="Breadcrumb" className="text-xs text-atlas-steel">
            <ol className="flex flex-wrap items-center gap-1">
              {props.breadcrumb.map((item, idx) => (
                <li key={`${item.label}-${idx}`} className="flex items-center gap-1">
                  {idx > 0 ? <span aria-hidden="true">/</span> : null}
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="rounded-md px-1 py-0.5 outline-none ring-atlas-teal/40 hover:text-atlas-blue focus-visible:ring-4"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="px-1 py-0.5 text-atlas-blue">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-atlas-blue">{props.title}</h1>
            {props.description ? (
              <p className="mt-1 max-w-2xl text-sm text-atlas-steel">{props.description}</p>
            ) : null}
          </div>

          {props.actions ? <div className="shrink-0">{props.actions}</div> : null}
        </div>
      </div>
    </header>
  );
}
