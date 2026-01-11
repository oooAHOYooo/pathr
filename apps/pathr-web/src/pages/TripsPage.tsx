import { MOCK_TRIPS } from "../data/mockTrips";
import { TripCard } from "../components/TripCard";

export function TripsPage() {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <div className="text-sm font-medium">Trips</div>
          <div className="mt-1 text-xs text-ink/60">{MOCK_TRIPS.length} saved trips</div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {MOCK_TRIPS.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
}

