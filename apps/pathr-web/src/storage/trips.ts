import type { StoredTrip } from "@pathr/shared";

const KEY = "pathr.trips.v1";

export function loadStoredTrips(): StoredTrip[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredTrip[];
  } catch {
    return [];
  }
}

export function saveStoredTrips(trips: StoredTrip[]) {
  localStorage.setItem(KEY, JSON.stringify(trips));
}

export function appendStoredTrip(trip: StoredTrip) {
  const existing = loadStoredTrips();
  saveStoredTrips([trip, ...existing]);
}

export function getStoredTripById(id: string): StoredTrip | undefined {
  return loadStoredTrips().find((t) => t.trip.id === id);
}

