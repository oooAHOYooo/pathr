import { useMemo, useState } from "react";
import type { FeatureCollection, LineString } from "geojson";
import { useRecording } from "../recording/RecordingProvider";
import { tripsToFeatureCollection } from "../map/geojson";
import { MapView } from "../map/MapView";
import { useAuth } from "../auth/AuthProvider";
import { useStats } from "../api/hooks/useApi";

type RoutePoint = { latitude: number; longitude: number };

// A deliberately simple test line, not turn-by-turn navigation. It gives the
// route editor an immediate, recognizable local example without claiming live
// traffic, road access, or a routing-provider result.
const UNH_TEST_SUGGESTION: RoutePoint[] = [
  { latitude: 41.3188, longitude: -72.8993 }, // 206 Saint John Street area
  { latitude: 41.3124, longitude: -72.9029 },
  { latitude: 41.3041, longitude: -72.9118 },
  { latitude: 41.2937, longitude: -72.9238 },
  { latitude: 41.2836, longitude: -72.9375 },
  { latitude: 41.2767, longitude: -72.9498 },
  { latitude: 41.2714, longitude: -72.9577 } // University of New Haven area
];

export function AppHomePage() {
  const { state, visitedTrips, addPoint, carPosition } = useRecording();
  const { auth } = useAuth();
  const { data: stats } = useStats();
  const [plannedPoints, setPlannedPoints] = useState<RoutePoint[]>(UNH_TEST_SUGGESTION);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCustomRoute, setIsCustomRoute] = useState(false);

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

  const planned = useMemo((): FeatureCollection<LineString> => ({
    type: "FeatureCollection",
    features: plannedPoints.length >= 2
      ? [{
          type: "Feature",
          properties: { kind: isCustomRoute ? "hand-drawn" : "suggested" },
          geometry: { type: "LineString", coordinates: plannedPoints.map((point) => [point.longitude, point.latitude]) }
        }]
      : []
  }), [isCustomRoute, plannedPoints]);

  const startDrawing = () => {
    setPlannedPoints([]);
    setIsCustomRoute(true);
    setIsDrawing(true);
  };

  const finishDrawing = () => setIsDrawing(false);

  const undoPoint = () => setPlannedPoints((points) => points.slice(0, -1));

  const restoreSuggestion = () => {
    setPlannedPoints(UNH_TEST_SUGGESTION);
    setIsCustomRoute(false);
    setIsDrawing(false);
  };

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

      <section className="rounded-[28px] bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur" aria-labelledby="test-route-title">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div id="test-route-title" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Test route</div>
            <div className="mt-1 text-sm font-semibold text-white/90">206 Saint John St → University of New Haven</div>
            <p className="mt-1 text-xs leading-5 text-white/65">
              Suggested test path only — check a navigation app before driving.
            </p>
          </div>
          <div className="shrink-0 rounded-xl bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-accent ring-1 ring-accent/25">
            {isDrawing ? "Drawing" : isCustomRoute ? "Drawn" : "Suggested"}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {isDrawing ? (
            <>
              <button type="button" onClick={finishDrawing} className="min-h-11 rounded-2xl bg-accent px-4 text-xs font-semibold text-paper shadow-glow-accent">
                Done drawing
              </button>
              <button type="button" onClick={undoPoint} disabled={plannedPoints.length === 0} className="min-h-11 rounded-2xl bg-white/10 px-4 text-xs font-semibold text-white/85 ring-1 ring-white/15 disabled:opacity-40">
                Undo point
              </button>
            </>
          ) : (
            <button type="button" onClick={startDrawing} className="min-h-11 rounded-2xl bg-accent px-4 text-xs font-semibold text-paper shadow-glow-accent">
              Draw my route
            </button>
          )}
          <button type="button" onClick={restoreSuggestion} className="min-h-11 rounded-2xl bg-white/10 px-4 text-xs font-semibold text-white/85 ring-1 ring-white/15">
            Reset suggested
          </button>
        </div>
      </section>

      {/* Map “card” */}
      <div className="relative overflow-hidden rounded-[34px] bg-white/10 ring-1 ring-white/15 backdrop-blur">
        <div className="relative h-[min(520px,calc(100dvh-320px))] min-h-[340px] w-full">
          <MapView
            className="absolute inset-0 h-full w-full"
            visited={visited}
            active={active}
            planned={planned}
            onMapClick={isDrawing ? undefined : addPoint}
            onDrawPoint={isDrawing ? ({ lng, lat }) => setPlannedPoints((points) => [...points, { latitude: lat, longitude: lng }]) : undefined}
            drawMode={isDrawing}
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
            {isDrawing
              ? "Drag one finger across the map to draw your test route."
              : isCustomRoute
                ? "Your hand-drawn test route is in yellow. Reset to bring back the suggestion."
                : "Suggested route in yellow. Tap Draw my route to sketch your own."}
          </div>
        </div>
      </div>
    </div>
  );
}
