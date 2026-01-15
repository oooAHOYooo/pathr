'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTrips, deleteTrip, type SimpleTrip } from '../lib/trip-storage';

export default function TripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<SimpleTrip[]>([]);

  useEffect(() => {
    setTrips(getTrips());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Delete this trip?')) {
      deleteTrip(id);
      setTrips(getTrips());
    }
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(2)}km`;
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins > 60) {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours}h ${remainingMins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-accent-from via-primary-light to-accent-to bg-clip-text text-transparent mb-2">
            My Trips
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {trips.length} {trips.length === 1 ? 'trip' : 'trips'} recorded
          </p>
        </div>

        {/* Trips List */}
        {trips.length === 0 ? (
          <div className="glass-medium rounded-glass-lg p-12 text-center">
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
              No trips yet. Start recording your first trip!
            </p>
            <button
              onClick={() => router.push('/record')}
              className="px-8 py-4 rounded-glass-md gradient-accent text-white shadow-glow-accent hover:shadow-glow-primary transition-all duration-300 hover:scale-105 font-medium"
            >
              Record a Trip
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {trips
              .sort((a, b) => b.startedAt - a.startedAt)
              .map((trip) => (
                <div
                  key={trip.id}
                  className="glass-medium rounded-glass-lg p-6 shadow-glass hover:shadow-glass-medium transition-all border border-white/20 cursor-pointer"
                  onClick={() => router.push(`/trips/${trip.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-xl font-semibold">
                          {trip.name || `Trip ${formatDate(trip.startedAt)}`}
                        </h3>
                        <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          {formatDate(trip.startedAt)}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-text-secondary-light dark:text-text-secondary-dark">
                            Distance
                          </div>
                          <div className="font-semibold">{formatDistance(trip.distance)}</div>
                        </div>
                        <div>
                          <div className="text-text-secondary-light dark:text-text-secondary-dark">
                            Duration
                          </div>
                          <div className="font-semibold">{formatDuration(trip.duration)}</div>
                        </div>
                        <div>
                          <div className="text-text-secondary-light dark:text-text-secondary-dark">
                            Avg Speed
                          </div>
                          <div className="font-semibold">{Math.round(trip.avgSpeed)} km/h</div>
                        </div>
                        <div>
                          <div className="text-text-secondary-light dark:text-text-secondary-dark">
                            Points
                          </div>
                          <div className="font-semibold">{trip.points.length}</div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(trip.id);
                      }}
                      className="ml-4 px-4 py-2 text-red-500 hover:bg-red-500/20 rounded-glass-md transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/record')}
            className="px-8 py-4 rounded-glass-md gradient-accent text-white shadow-glow-accent hover:shadow-glow-primary transition-all duration-300 hover:scale-105 font-medium"
          >
            Record New Trip
          </button>
        </div>
      </div>
    </div>
  );
}
