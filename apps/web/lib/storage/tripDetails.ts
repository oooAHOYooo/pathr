export type TripRating = 1 | 2 | 3 | 4 | 5;

export type TripDetails = {
  title: string;
  driveRating: TripRating | null; // 1–5 "how was it?"
  trafficRating: TripRating | null; // 1–5
  tags: string[]; // simple, toggleable chips
  note: string;
  updatedAt: string; // ISO
};

const KEY = "pathr.tripDetails.v1";

function loadAll(): Record<string, TripDetails> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, TripDetails>;
  } catch {
    return {};
  }
}

function saveAll(map: Record<string, TripDetails>) {
  localStorage.setItem(KEY, JSON.stringify(map));
}

export function getTripDetails(tripId: string): TripDetails | null {
  const all = loadAll();
  return all[tripId] ?? null;
}

export function upsertTripDetails(tripId: string, details: TripDetails) {
  const all = loadAll();
  all[tripId] = details;
  saveAll(all);
}

