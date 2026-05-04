"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/Button";
import type { FeatureCollection, LineString } from "geojson";
import { tripsToFeatureCollection } from "@/lib/map/geojson";
import { getStoredTripById, loadStoredTrips } from "@/lib/storage/trips";
import {
  avgSpeedMph,
  formatDistanceMiles,
  formatDurationSeconds,
  formatSpeedMph
} from "@pathr/shared";

const MapView = dynamic(() => import("@/lib/map/MapView").then((mod) => mod.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/30">
      Loading map...
    </div>
  )
});

export default function TripDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : undefined;
  const stored = id ? getStoredTripById(id) : undefined;
  const trip = stored?.trip;

  const visited = useMemo(() => tripsToFeatureCollection(loadStoredTrips()), []);
  const empty: FeatureCollection<LineString> = useMemo(() => ({ type: "FeatureCollection", features: [] }), []);

  const avg = useMemo(() => {
    if (!trip) return 0;
    return avgSpeedMph(trip.distanceMeters ?? 0, trip.durationSeconds ?? 0);
  }, [trip]);

  if (!trip) {
    return (
      <div className="space-y-4">
        <div className="overflow-hidden rounded-[34px] bg-white/10 ring-1 ring-white/15 backdrop-blur">
          <div className="p-5">
            <div className="text-sm font-semibold text-white/90">Trip not found</div>
            <div className="mt-2 text-sm text-white/70">That trip doesn’t exist on this device.</div>
            <div className="mt-4">
              <Link href="/app/trips" className="text-sm font-semibold text-white/85 underline underline-offset-4 hover:text-white">
                Back to trips
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white/90">{trip.name}</div>
          <div className="mt-1 text-xs text-white/60">Trip detail</div>
        </div>

        <Button disabled title="Account saving comes next." type="button">
          Save to Account
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-[34px] bg-white/10 ring-1 ring-white/15 backdrop-blur">
        <div className="relative h-[min(520px,calc(100dvh-320px))] min-h-[320px] w-full">
          <MapView className="absolute inset-0 h-full w-full" visited={visited} active={empty} highlightTripId={trip.id} />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(11,23,38,0.20) 0%, rgba(11,23,38,0.35) 45%, rgba(11,23,38,0.55) 100%)"
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-[28px] bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Distance</div>
          <div className="mt-2 text-sm font-semibold text-white/90">
            {formatDistanceMiles(trip.distanceMeters ?? 0)}
          </div>
        </div>

        <div className="rounded-[28px] bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Duration</div>
          <div className="mt-2 text-sm font-semibold text-white/90">
            {formatDurationSeconds(trip.durationSeconds ?? 0)}
          </div>
        </div>

        <div className="rounded-[28px] bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Avg speed</div>
          <div className="mt-2 text-sm font-semibold text-white/90">{formatSpeedMph(avg)}</div>
        </div>
      </div>
    </div>
  );
}
