import { haversineDistance } from "./distance";

export type LngLat = readonly [lng: number, lat: number];

/**
 * Total distance along a LineString-style coordinate list.
 * Coordinates are [lng, lat] in degrees.
 * @returns distance in meters
 */
export function lineDistanceMeters(coords: readonly LngLat[]): number {
  if (coords.length < 2) return 0;

  let total = 0;
  for (let i = 1; i < coords.length; i += 1) {
    const [lng1, lat1] = coords[i - 1]!;
    const [lng2, lat2] = coords[i]!;
    total += haversineDistance({ latitude: lat1, longitude: lng1 }, { latitude: lat2, longitude: lng2 });
  }
  return total;
}

