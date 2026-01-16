import { useMemo } from "react";
import type { FeatureCollection, LineString } from "geojson";
import { useRecording } from "../recording/RecordingProvider";
import { tripsToFeatureCollection } from "../map/geojson";
import { MapView } from "../map/MapView";

export function AppHomePage() {
  const { state, visitedTrips, addPoint } = useRecording();

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
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">This device</div>
          <div className="mt-1 text-lg font-semibold text-white/90">{visitedTrips.length} trips</div>
        </div>
        <div className="w-[44%] rounded-3xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Status</div>
          <div className="mt-1 text-sm font-semibold text-white/90">
            {state.isRecording ? (state.isPaused ? "Paused" : "Recording") : "Ready"}
          </div>
        </div>
      </div>

      {/* Map “card” */}
      <div className="relative overflow-hidden rounded-[34px] bg-white/10 ring-1 ring-white/15 backdrop-blur">
        <div className="relative h-[min(520px,calc(100dvh-320px))] min-h-[340px] w-full">
          <MapView className="absolute inset-0 h-full w-full" visited={visited} active={active} onMapClick={addPoint} />
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

