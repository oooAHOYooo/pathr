import { TripCard } from "../components/TripCard";
import { loadStoredTrips } from "../storage/trips";

export function TripsPage() {
  const trips = loadStoredTrips();
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[34px] bg-white/10 ring-1 ring-white/15 backdrop-blur">
        <div className="p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Trips</div>
          <div className="mt-2 text-sm font-semibold text-white/90">{trips.length} trips on this device</div>
          <div className="mt-2 text-sm text-white/70">
            This is your driving journal. Create a username later to keep it.
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {trips.length === 0 ? (
          <div className="rounded-[28px] bg-white/10 p-5 text-sm text-white/75 ring-1 ring-white/15 backdrop-blur">
            Start a trip to build your driving map.
          </div>
        ) : (
          trips.map((t) => <TripCard key={t.trip.id} trip={t.trip} />)
        )}
      </div>
    </div>
  );
}

