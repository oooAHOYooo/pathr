export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(d);
}

