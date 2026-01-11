import { metersToMiles } from "./distance";

export function avgSpeedMph(distanceMeters: number, durationSeconds: number): number {
  const hours = durationSeconds / 3600;
  if (hours <= 0) return 0;
  return metersToMiles(distanceMeters) / hours;
}

export function formatSpeedMph(mph: number): string {
  return `${Math.round(mph)} mph`;
}

