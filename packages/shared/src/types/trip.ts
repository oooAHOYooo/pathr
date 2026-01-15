/**
 * Trip-related types
 */

export interface TripPoint {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  timestamp: number;
}

export interface Trip {
  id: string;
  userId: string;
  name?: string;
  startedAt: string;
  endedAt?: string;
  distanceMeters?: number;
  durationSeconds?: number;
  avgSpeedKmh?: number;
  maxSpeedKmh?: number;
  elevationGainMeters?: number;
  scenicScore?: number;
  isPrivate: boolean;
  shareToken?: string;
  polylineSimplified?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface TripStats {
  tripId: string;
  totalPoints: number;
  simplifiedPoints: number;
  boundingBox?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
}

/**
 * Minimal persisted payload for local-first MVPs (e.g. web localStorage).
 * Keeps "business objects" (Trip + points) in shared to avoid divergence.
 */
export interface StoredTrip {
  trip: Trip;
  points: TripPoint[];
}



