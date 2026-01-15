'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { saveTrip, calculateTripStats, type SimpleTrip } from '../lib/trip-storage';
import type { TripPoint } from '@pathr/shared';

// Dynamically import map to avoid SSR issues
const Map = dynamic(() => import('../components/TripMap'), { ssr: false });

export default function RecordPage() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [points, setPoints] = useState<TripPoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [stats, setStats] = useState({ distance: 0, duration: 0, avgSpeed: 0, maxSpeed: 0 });

  // Request location permission and get initial location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        setError(`Location error: ${err.message}`);
      }
    );
  }, []);

  // Update stats as points are added
  useEffect(() => {
    if (points.length >= 2) {
      const calculated = calculateTripStats(points);
      setStats(calculated);
    }
  }, [points]);

  const startRecording = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setError(null);
    setPoints([]);
    setIsRecording(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const point: TripPoint = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude ?? undefined,
          accuracy: position.coords.accuracy ?? undefined,
          speed: position.coords.speed ? position.coords.speed * 3.6 : undefined, // Convert m/s to km/h
          heading: position.coords.heading ?? undefined,
          timestamp: Date.now(),
        };

        setPoints((prev) => [...prev, point]);
        setCurrentLocation({ lat: point.latitude, lng: point.longitude });
      },
      (err) => {
        setError(`GPS error: ${err.message}`);
        setIsRecording(false);
      },
      options
    );
  };

  const stopRecording = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsRecording(false);

    if (points.length < 2) {
      setError('Trip too short. Need at least 2 points.');
      return;
    }

    const stats = calculateTripStats(points);
    const trip: SimpleTrip = {
      id: crypto.randomUUID(),
      startedAt: points[0].timestamp,
      endedAt: points[points.length - 1].timestamp,
      points,
      ...stats,
    };

    saveTrip(trip);
    router.push('/trips');
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(2)}km`;
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Map */}
      <div className="flex-1 relative">
        {currentLocation ? (
          <Map points={points} currentLocation={currentLocation} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">Loading map...</p>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="glass-medium rounded-glass-lg p-6 shadow-glass-large backdrop-blur-glass-medium border border-white/20 max-w-2xl mx-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-glass-md text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Stats */}
          {points.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">
                  Distance
                </div>
                <div className="text-lg font-semibold">{formatDistance(stats.distance)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">
                  Duration
                </div>
                <div className="text-lg font-semibold">{formatDuration(stats.duration)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">
                  Avg Speed
                </div>
                <div className="text-lg font-semibold">{Math.round(stats.avgSpeed)} km/h</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">
                  Points
                </div>
                <div className="text-lg font-semibold">{points.length}</div>
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex gap-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex-1 px-8 py-4 rounded-glass-md gradient-accent text-white shadow-glow-accent hover:shadow-glow-primary transition-all duration-300 hover:scale-105 font-medium text-lg"
              >
                Start Trip
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex-1 px-8 py-4 rounded-glass-md bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all duration-300 hover:scale-105 font-medium text-lg"
              >
                Stop & Save
              </button>
            )}
            <button
              onClick={() => router.push('/trips')}
              className="px-6 py-4 rounded-glass-md glass-medium shadow-glass hover:shadow-glass-medium transition-all duration-300 border border-white/20 font-medium"
            >
              My Trips
            </button>
          </div>

          {isRecording && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-red-200">Recording...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
