/**
 * Simple trip storage using localStorage
 * MVP: No backend needed, works offline
 */

import type { Trip, TripPoint } from '@pathr/shared';
import { haversineDistance, calculateSpeed } from '@pathr/shared';

const STORAGE_KEY = 'pathr_trips';

export interface SimpleTrip {
  id: string;
  name?: string;
  startedAt: number;
  endedAt: number;
  points: TripPoint[];
  distance: number; // meters
  duration: number; // seconds
  avgSpeed: number; // km/h
  maxSpeed: number; // km/h
}

/**
 * Save a trip to localStorage
 */
export function saveTrip(trip: SimpleTrip): void {
  const trips = getTrips();
  trips.push(trip);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

/**
 * Get all trips from localStorage
 */
export function getTrips(): SimpleTrip[] {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Get a single trip by ID
 */
export function getTrip(id: string): SimpleTrip | null {
  const trips = getTrips();
  return trips.find(t => t.id === id) || null;
}

/**
 * Delete a trip
 */
export function deleteTrip(id: string): void {
  const trips = getTrips();
  const filtered = trips.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Calculate trip stats from points
 */
export function calculateTripStats(points: TripPoint[]): {
  distance: number;
  duration: number;
  avgSpeed: number;
  maxSpeed: number;
} {
  if (points.length < 2) {
    return { distance: 0, duration: 0, avgSpeed: 0, maxSpeed: 0 };
  }

  let totalDistance = 0;
  let maxSpeed = 0;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    
    const distance = haversineDistance(
      { latitude: prev.latitude, longitude: prev.longitude },
      { latitude: curr.latitude, longitude: curr.longitude }
    );
    totalDistance += distance;

    const speed = calculateSpeed(prev, curr);
    if (speed > maxSpeed) {
      maxSpeed = speed;
    }
  }

  const duration = (points[points.length - 1].timestamp - points[0].timestamp) / 1000; // seconds
  const avgSpeed = duration > 0 ? (totalDistance / 1000) / (duration / 3600) : 0; // km/h

  return {
    distance: totalDistance,
    duration,
    avgSpeed,
    maxSpeed,
  };
}
