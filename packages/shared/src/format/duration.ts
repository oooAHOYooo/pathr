export function formatDurationSeconds(durationSeconds: number): string {
  const totalMin = Math.round(durationSeconds / 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;

  if (h <= 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

