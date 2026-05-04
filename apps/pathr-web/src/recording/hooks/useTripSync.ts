import { useEffect } from "react";
import { loadStoredTrips } from "../../storage/trips";
import { getTripDetails } from "../../storage/tripDetails";
import { apiCreateTrip } from "../../api/client";

export function useTripSync(
  token: string | undefined,
  lastFinishedTripId: string | null
) {
  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!token || !lastFinishedTripId) return;
      const stored = loadStoredTrips().find((t) => t.trip.id === lastFinishedTripId);
      if (!stored) return;
      const miles = (stored.trip.distanceMeters ?? 0) / 1609.344;
      const durationMs = (stored.trip.durationSeconds ?? 0) * 1000;
      const path = (stored.points ?? []).map((p) => [p.latitude, p.longitude] as [number, number]);
      const details = getTripDetails(lastFinishedTripId);
      try {
        await apiCreateTrip(token, {
          startedAt: stored.trip.startedAt,
          endedAt: stored.trip.endedAt || new Date().toISOString(),
          durationMs,
          distanceMiles: miles,
          startLabel: "",
          endLabel: "",
          path,
          details: details ?? undefined
        });
      } catch {
        // Ignore sync errors for MVP; trip remains local.
      }
      if (cancelled) return;
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [token, lastFinishedTripId]);
}
