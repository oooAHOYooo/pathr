"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import type { FeatureCollection, LineString } from "geojson";
import { useRecording } from "@/lib/recording/RecordingProvider";
import { tripsToFeatureCollection } from "@/lib/map/geojson";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useStats } from "@/lib/api/hooks/useApi";

// Leaflet and MapView must be client-side only
const MapView = dynamic(() => import("@/lib/map/MapView").then((mod) => mod.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/30">
      Loading map...
    </div>
  )
});

export default function AppHomePage() {
  const { state, visitedTrips, addPoint, carPosition } = useRecording();
  const { auth } = useAuth();
  const { data: stats } = useStats();

  const visited = useMemo(() => tripsToFeatureCollection(visitedTrips), [visitedTrips]);
  const active = useMemo((): FeatureCollection<LineString> => {
    return {
      type: "FeatureCollection",
      features:
        state.points.length >= 2
          ? [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: state.points.map((p) => [p.longitude, p.latitude])
                }
              }
            ]
          : []
    };
  }, [state.points]);

  return (
    <div className="space-y-4">
      {/* Mini “stats” row */}
      <div className="flex items-center gap-3">
        <div className="flex-1 rounded-3xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
            {auth ? "Your account" : "This device"}
          </div>
          <div className="mt-1 text-lg font-semibold text-white/90">
            {auth ? `${stats?.totalTrips ?? 0} trips` : `${visitedTrips.length} trips`}
          </div>
          {auth ? (
            <div className="mt-1 text-xs text-white/60">
              {Math.round(stats?.last7dMiles ?? 0)} mi in the last 7 days
            </div>
          ) : null}
        </div>
        <div className="w-[44%] rounded-3xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Status</div>
          <div className="mt-1 text-sm font-semibold text-white/90">
            {state.isRecording ? (state.isPaused ? "Paused" : "Recording") : "Ready"}
          </div>
        </div>
      </div>

      {visitedTrips.length === 0 && !state.isRecording && (
        <div className="rounded-[28px] bg-accent/15 p-4 ring-1 ring-accent/25 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-paper shadow-glow-accent">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
                <path
                  fill="currentColor"
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-white/90">Welcome to Pathr</div>
              <div className="mt-0.5 text-xs text-white/65">Tap Start below to begin your first journey.</div>
            </div>
          </div>
        </div>
      )}

      {/* Map “card” */}
      <div className="relative overflow-hidden rounded-[34px] bg-white/10 ring-1 ring-white/15 backdrop-blur">
        <div className="relative h-[min(520px,calc(100dvh-320px))] min-h-[340px] w-full">
          <MapView
            className="absolute inset-0 h-full w-full"
            visited={visited}
            active={active}
            onMapClick={addPoint}
            carPosition={carPosition}
          />
          {/* Tint so it feels like part of the dark sports UI */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(11,23,38,0.25) 0%, rgba(11,23,38,0.35) 40%, rgba(11,23,38,0.55) 100%)"
            }}
          />
        </div>

        <div className="pointer-events-none absolute left-0 right-0 top-0 p-4">
          <div className="inline-flex items-center rounded-2xl bg-black/30 px-3 py-2 text-xs text-white/85 ring-1 ring-white/10 backdrop-blur">
            Tap <span className="mx-1 font-semibold text-white">Start</span> then click the map to add points.
          </div>
        </div>
      </div>
    </div>
  );
}
