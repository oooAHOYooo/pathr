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
        "block rounded-[28px] bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur",
        "hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0"
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white/90">{trip.name}</div>
          <div className="mt-1 text-xs text-white/60">{formatShortDate(trip.startedAt)}</div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-xs font-semibold text-white/90">{formatDistanceMiles(distanceMeters)}</div>
          <div className="mt-1 text-xs text-white/60">{formatDurationSeconds(durationSeconds)}</div>
        </div>
      </div>
    </Link>
  );
}

