import type { Trip } from "@pathr/shared";

export const MOCK_TRIPS: Trip[] = [
  {
    id: "t_001",
    userId: "u_mock",
    name: "Morning loop",
    startedAt: "2026-01-11T08:12:00-08:00",
    distanceMeters: 14.6 * 1609.344,
    durationSeconds: 32 * 60,
    isPrivate: true,
    createdAt: "2026-01-11T09:00:00-08:00",
    updatedAt: "2026-01-11T09:00:00-08:00"
  },
  {
    id: "t_002",
    userId: "u_mock",
    name: "Airport run",
    startedAt: "2026-01-09T17:48:00-08:00",
    distanceMeters: 22.1 * 1609.344,
    durationSeconds: 41 * 60,
    isPrivate: true,
    createdAt: "2026-01-09T18:40:00-08:00",
    updatedAt: "2026-01-09T18:40:00-08:00"
  },
  {
    id: "t_003",
    userId: "u_mock",
    name: "Late-night groceries",
    startedAt: "2026-01-07T21:04:00-08:00",
    distanceMeters: 6.3 * 1609.344,
    durationSeconds: 16 * 60,
    isPrivate: true,
    createdAt: "2026-01-07T21:30:00-08:00",
    updatedAt: "2026-01-07T21:30:00-08:00"
  },
  {
    id: "t_004",
    userId: "u_mock",
    name: "Coastal drive",
    startedAt: "2026-01-05T10:22:00-08:00",
    distanceMeters: 38.9 * 1609.344,
    durationSeconds: 78 * 60,
    isPrivate: true,
    createdAt: "2026-01-05T11:50:00-08:00",
    updatedAt: "2026-01-05T11:50:00-08:00"
  }
];

export function getTripById(id: string): Trip | undefined {
  return MOCK_TRIPS.find((t) => t.id === id);
}

