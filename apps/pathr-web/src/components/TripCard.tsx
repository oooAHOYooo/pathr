import { Link } from "react-router-dom";
import type { Trip } from "@pathr/shared";
import { formatDistanceMiles, formatDurationSeconds, formatShortDate } from "@pathr/shared";

type Props = {
  trip: Trip;
};

export function TripCard({ trip }: Props) {
  const distanceMeters = trip.distanceMeters ?? 0;
  const durationSeconds = trip.durationSeconds ?? 0;
  return (
    <Link
      to={`/app/trips/${trip.id}`}
      className={[
        "block rounded-xl border bg-white p-4 shadow-soft",
        "hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-ink">{trip.name}</div>
          <div className="mt-1 text-xs text-ink/60">{formatShortDate(trip.startedAt)}</div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-xs font-medium text-ink">{formatDistanceMiles(distanceMeters)}</div>
          <div className="mt-1 text-xs text-ink/60">{formatDurationSeconds(durationSeconds)}</div>
        </div>
      </div>
    </Link>
  );
}

