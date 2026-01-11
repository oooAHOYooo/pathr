import { TripCard } from "../components/TripCard";
import { loadStoredTrips } from "../storage/trips";

export function TripsPage() {
  const trips = loadStoredTrips();
  return (
    <div className="mx-auto max-w-6xl px-4 pt-4">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <div className="text-sm font-medium">Trips</div>
          <div className="mt-1 text-xs text-ink/60">{trips.length} saved trips</div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {trips.map((t) => (
          <TripCard key={t.trip.id} trip={t.trip} />
        ))}
      </div>
    </div>
  );
}

