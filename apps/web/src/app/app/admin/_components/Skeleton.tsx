function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function SkeletonLine(props: { className?: string }) {
  return (
    <div
      className={cx(
        "h-3 w-full animate-pulse rounded-md bg-black/10",
        props.className,
      )}
    />
  );
}

export function SkeletonCard(props: { lines?: number }) {
  const lines = props.lines ?? 3;
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="space-y-2">
        <SkeletonLine className="h-4 w-1/3" />
        {Array.from({ length: lines }).map((_, idx) => (
          <SkeletonLine key={idx} />
        ))}
      </div>
    </div>
  );
}
