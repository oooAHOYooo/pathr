'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getTrip, deleteTrip, type SimpleTrip } from '../../lib/trip-storage';

const TripDetailMap = dynamic(() => import('../../components/TripDetailMap'), { ssr: false });

export default function TripDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [trip, setTrip] = useState<SimpleTrip | null>(null);

  useEffect(() => {
    const tripId = params.id as string;
    const found = getTrip(tripId);
    setTrip(found);
  }, [params.id]);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
            Trip not found
          </p>
          <button
            onClick={() => router.push('/trips')}
            className="px-6 py-3 rounded-glass-md glass-medium shadow-glass hover:shadow-glass-medium transition-all border border-white/20 font-medium"
          >
            Back to Trips
          </button>
        </div>
      </div>
    );
  }

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

  const handleDelete = () => {
    if (confirm('Delete this trip?')) {
      deleteTrip(trip.id);
      router.push('/trips');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Map */}
      <div className="flex-1 relative">
        <TripDetailMap points={trip.points} />
      </div>

      {/* Details Panel */}
      <div className="glass-medium rounded-t-3xl p-6 shadow-glass-large backdrop-blur-glass-medium border-t border-white/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {trip.name || `Trip ${formatDate(trip.startedAt)}`}
              </h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                {formatDate(trip.startedAt)}
              </p>
            </div>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-red-500 hover:bg-red-500/20 rounded-glass-md transition-all"
            >
              Delete
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 glass rounded-glass-md">
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
                Distance
              </div>
              <div className="text-2xl font-bold">{formatDistance(trip.distance)}</div>
            </div>
            <div className="text-center p-4 glass rounded-glass-md">
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
                Duration
              </div>
              <div className="text-2xl font-bold">{formatDuration(trip.duration)}</div>
            </div>
            <div className="text-center p-4 glass rounded-glass-md">
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
                Avg Speed
              </div>
              <div className="text-2xl font-bold">{Math.round(trip.avgSpeed)} km/h</div>
            </div>
            <div className="text-center p-4 glass rounded-glass-md">
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
                Max Speed
              </div>
              <div className="text-2xl font-bold">{Math.round(trip.maxSpeed)} km/h</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push('/trips')}
              className="px-6 py-3 rounded-glass-md glass-medium shadow-glass hover:shadow-glass-medium transition-all border border-white/20 font-medium"
            >
              Back to Trips
            </button>
            <button
              onClick={() => router.push('/record')}
              className="px-6 py-3 rounded-glass-md gradient-accent text-white shadow-glow-accent hover:shadow-glow-primary transition-all duration-300 hover:scale-105 font-medium"
            >
              Record New Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
