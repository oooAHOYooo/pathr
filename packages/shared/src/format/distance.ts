const METERS_PER_MILE = 1609.344;

export function metersToMiles(meters: number): number {
  return meters / METERS_PER_MILE;
}

export function formatDistanceMiles(distanceMeters: number): string {
  const mi = metersToMiles(distanceMeters);
  const decimals = mi < 10 ? 1 : 0;
  return `${mi.toFixed(decimals)} mi`;
}

