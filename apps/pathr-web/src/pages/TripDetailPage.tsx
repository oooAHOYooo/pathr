import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import type { FeatureCollection, LineString } from "geojson";
import { MapView } from "../map/MapView";
import { tripsToFeatureCollection } from "../map/geojson";
import { getStoredTripById, loadStoredTrips } from "../storage/trips";
import {
  avgSpeedMph,
  formatDistanceMiles,
  formatDurationSeconds,
  formatSpeedMph
} from "@pathr/shared";

export function TripDetailPage() {
  const params = useParams();
  const stored = params.id ? getStoredTripById(params.id) : undefined;
  const trip = stored?.trip;

  const visited = useMemo(() => tripsToFeatureCollection(loadStoredTrips()), []);
  const empty: FeatureCollection<LineString> = useMemo(() => ({ type: "FeatureCollection", features: [] }), []);

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
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pt-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{trip.name}</div>
          <div className="mt-1 text-xs text-ink/60">Trip detail</div>
        </div>

        <Button disabled title="Account saving comes next." type="button">
          Save to Account
        </Button>
      </div>

      <div className="h-[52dvh] overflow-hidden rounded-xl border bg-surface">
        <MapView
          className="h-full w-full"
          visited={visited}
          active={empty}
          highlightTripId={trip.id}
        />
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

