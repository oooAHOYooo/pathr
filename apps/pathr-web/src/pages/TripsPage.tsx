import { useEffect, useMemo, useState } from "react";
import { TripCard } from "../components/TripCard";
import { useAuth } from "../auth/AuthProvider";
import { apiListTrips, type ApiTrip } from "../api/client";
import { loadStoredTrips } from "../storage/trips";

export function TripsPage() {
  const { auth } = useAuth();
  const local = useMemo(() => loadStoredTrips(), []);
  const [remoteTrips, setRemoteTrips] = useState<ApiTrip[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!auth?.token) {
        setRemoteTrips(null);
        return;
      }
      try {
        const trips = await apiListTrips(auth.token);
        if (!cancelled) setRemoteTrips(trips);
      } catch {
        if (!cancelled) setRemoteTrips([]);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [auth?.token]);

  const trips = auth ? remoteTrips ?? [] : local;
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[34px] bg-white/10 ring-1 ring-white/15 backdrop-blur">
        <div className="p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Trips</div>
          <div className="mt-2 text-sm font-semibold text-white/90">
            {auth ? `${trips.length} trips in your account` : `${trips.length} trips on this device`}
          </div>
          <div className="mt-2 text-sm text-white/70">
            {auth ? "This is your driving journal, synced to your username." : "This is your driving journal. Create a username to keep it."}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {trips.length === 0 ? (
          <div className="rounded-[28px] bg-white/10 p-5 text-sm text-white/75 ring-1 ring-white/15 backdrop-blur">
            Start a trip to build your driving map.
          </div>
        ) : (
          (auth ? (trips as ApiTrip[]).map((t) => (
            <div key={t.id} className="rounded-[28px] bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white/90">Trip</div>
                  <div className="mt-1 text-xs text-white/60">{new Date(t.startedAt).toLocaleDateString()}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-xs font-semibold text-white/90">{t.distanceMiles.toFixed(1)} mi</div>
                  <div className="mt-1 text-xs text-white/60">{Math.round(t.durationMs / 60000)} min</div>
                </div>
              </div>
            </div>
          )) : (trips as any).map((t: any) => <TripCard key={t.trip.id} trip={t.trip} />))
        )}
      </div>
    </div>
  );
}

