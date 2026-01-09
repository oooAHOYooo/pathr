/**
 * Distance calculation utilities
 * Haversine formula for great-circle distance
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Calculate distance between two points using Haversine formula
 * @returns Distance in meters
 */
export function haversineDistance(
  point1: { latitude: number; longitude: number },
  point2: { latitude: number; longitude: number }
): number {
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) *
      Math.cos(toRadians(point2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = EARTH_RADIUS_KM * c;

  return distanceKm * 1000; // Convert to meters
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate speed between two points
 * @returns Speed in km/h
 */
export function calculateSpeed(
  point1: { latitude: number; longitude: number; timestamp: number },
  point2: { latitude: number; longitude: number; timestamp: number }
): number {
  const distance = haversineDistance(point1, point2);
  const timeSeconds = (point2.timestamp - point1.timestamp) / 1000;

  if (timeSeconds <= 0) return 0;

  const speedMs = distance / timeSeconds;
  return speedMs * 3.6; // Convert m/s to km/h
}

