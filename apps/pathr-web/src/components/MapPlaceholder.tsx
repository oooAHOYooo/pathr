type Props = {
  label?: string;
};

export function MapPlaceholder({ label = "Map" }: Props) {
  return (
    <section
      aria-label={label}
      className="relative h-full w-full overflow-hidden rounded-xl border bg-surface"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative flex h-full w-full items-center justify-center">
        <div className="rounded-xl border bg-paper px-4 py-3 text-center shadow-soft">
          <div className="text-xs font-medium text-ink">{label} (placeholder)</div>
          <div className="mt-1 text-xs text-ink/60">No backend yet — mock UI only</div>
        </div>
      </div>
    </section>
  );
}

