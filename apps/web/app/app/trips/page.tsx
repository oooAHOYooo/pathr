"use client";

import { useMemo } from "react";
import { TripCard } from "@/components/TripCard";
import { useAuth } from "@/lib/auth/AuthProvider";
import { type ApiTrip } from "@/lib/api/client";
import { loadStoredTrips } from "@/lib/storage/trips";
import { useTrips } from "@/lib/api/hooks/useApi";

export default function TripsPage() {
  const { auth } = useAuth();
  const local = useMemo(() => loadStoredTrips(), []);
  const { data: remoteTrips, isLoading } = useTrips();

  const trips = auth ? remoteTrips ?? [] : local;

  if (auth && isLoading) {
    return (
      <div className="rounded-[34px] bg-white/10 p-10 text-center ring-1 ring-white/15 backdrop-blur">
        <div className="text-sm text-white/70">Loading your journal...</div>
      </div>
    );
  }

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
          <div className="rounded-[34px] bg-white/10 p-10 text-center ring-1 ring-white/15 backdrop-blur">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/5 text-white/20 ring-1 ring-white/10">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                />
              </svg>
            </div>
            <div className="mt-5 text-sm font-semibold text-white/90">No trips yet</div>
            <div className="mt-2 text-xs leading-relaxed text-white/60">
              Your driving journal is empty. Tap <span className="font-semibold text-white/80">Start Trip</span> on the home screen to begin recording your first route.
            </div>
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
