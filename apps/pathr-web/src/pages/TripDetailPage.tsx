import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { MapPlaceholder } from "../components/MapPlaceholder";
import { getTripById } from "../data/mockTrips";
import {
  avgSpeedMph,
  formatDistanceMiles,
  formatDurationSeconds,
  formatSpeedMph
} from "@pathr/shared";

export function TripDetailPage() {
  const params = useParams();
  const trip = params.id ? getTripById(params.id) : undefined;

  const avg = useMemo(() => {
    if (!trip) return 0;
    return avgSpeedMph(trip.distanceMeters ?? 0, trip.durationSeconds ?? 0);
  }, [trip]);

  if (!trip) {
    return (
      <div className="rounded-xl border bg-white p-5 shadow-soft">
        <div className="text-sm font-medium">Trip not found</div>
        <div className="mt-2 text-sm text-ink/70">That trip doesn’t exist in the mock data.</div>
        <div className="mt-4">
          <Link to="/app/trips" className="text-sm underline underline-offset-4 hover:text-ink/80">
            Back to trips
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{trip.name}</div>
          <div className="mt-1 text-xs text-ink/60">Trip detail</div>
        </div>

        <Button disabled type="button">
          Share
        </Button>
      </div>

      <div className="h-[52dvh]">
        <MapPlaceholder label="Trip map" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 shadow-soft">
          <div className="text-xs text-ink/60">Distance</div>
          <div className="mt-1 text-sm font-medium">
            {formatDistanceMiles(trip.distanceMeters ?? 0)}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-soft">
          <div className="text-xs text-ink/60">Duration</div>
          <div className="mt-1 text-sm font-medium">
            {formatDurationSeconds(trip.durationSeconds ?? 0)}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-soft">
          <div className="text-xs text-ink/60">Avg speed</div>
          <div className="mt-1 text-sm font-medium">{formatSpeedMph(avg)}</div>
        </div>
      </div>
    </div>
  );
}

