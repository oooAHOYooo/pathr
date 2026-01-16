import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { formatDistanceMiles, lineDistanceMeters, type StoredTrip, type Trip, type TripPoint } from "@pathr/shared";
import { appendStoredTrip, loadStoredTrips } from "../storage/trips";

type RecordingState = {
  isRecording: boolean;
  isPaused: boolean;
  startedAtMs: number | null;
  points: TripPoint[];
  distanceMeters: number;
};

type RecordingContextValue = {
  state: RecordingState;
  visitedTrips: StoredTrip[];
  lastFinishedTripId: string | null;
  clearLastFinishedTrip: () => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  addPoint: (lngLat: { lng: number; lat: number }) => void;
  statusText: string | null;
};

const RecordingContext = createContext<RecordingContextValue | null>(null);

function nowMs() {
  return Date.now();
}

function formatClock(seconds: number): string {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

function makeTripId() {
  return `t_${Math.random().toString(16).slice(2, 10)}`;
}

export function RecordingProvider({ children }: { children: React.ReactNode }) {
  const [visitedTrips, setVisitedTrips] = useState<StoredTrip[]>(() => loadStoredTrips());
  const [lastFinishedTripId, setLastFinishedTripId] = useState<string | null>(null);
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    startedAtMs: null,
    points: [],
    distanceMeters: 0
  });

  const ticker = useRef<number | null>(null);
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (!state.isRecording || state.isPaused) {
      if (ticker.current) window.clearInterval(ticker.current);
      ticker.current = null;
      return;
    }
    ticker.current = window.setInterval(() => forceTick((n) => n + 1), 500);
    return () => {
      if (ticker.current) window.clearInterval(ticker.current);
      ticker.current = null;
    };
  }, [state.isPaused, state.isRecording]);

  const start = () => {
    setState({
      isRecording: true,
      isPaused: false,
      startedAtMs: nowMs(),
      points: [],
      distanceMeters: 0
    });
  };

  const pause = () => setState((s) => ({ ...s, isPaused: true }));
  const resume = () => setState((s) => ({ ...s, isPaused: false }));

  const addPoint = (lngLat: { lng: number; lat: number }) => {
    setState((s) => {
      if (!s.isRecording || s.isPaused || !s.startedAtMs) return s;

      const p: TripPoint = {
        latitude: lngLat.lat,
        longitude: lngLat.lng,
        timestamp: nowMs()
      };

      const nextPoints = [...s.points, p];
      const coords = nextPoints.map((pt) => [pt.longitude, pt.latitude] as const);
      const distanceMeters = lineDistanceMeters(coords);

      return { ...s, points: nextPoints, distanceMeters };
    });
  };

  const stop = () => {
    setState((s) => {
      if (!s.startedAtMs) return { ...s, isRecording: false, isPaused: false };

      const endedAtMs = nowMs();
      const durationSeconds = Math.max(0, Math.round((endedAtMs - s.startedAtMs) / 1000));

      const trip: Trip = {
        id: makeTripId(),
        userId: "local",
        name: "Trip",
        startedAt: new Date(s.startedAtMs).toISOString(),
        endedAt: new Date(endedAtMs).toISOString(),
        distanceMeters: s.distanceMeters,
        durationSeconds,
        isPrivate: true,
        createdAt: new Date(endedAtMs).toISOString(),
        updatedAt: new Date(endedAtMs).toISOString()
      };

      const stored: StoredTrip = { trip, points: s.points };
      appendStoredTrip(stored);
      setVisitedTrips(loadStoredTrips());
      setLastFinishedTripId(trip.id);

      return { isRecording: false, isPaused: false, startedAtMs: null, points: [], distanceMeters: 0 };
    });
  };

  const statusText = useMemo(() => {
    if (!state.isRecording || !state.startedAtMs) return null;
    const elapsedSeconds = Math.max(0, Math.round((nowMs() - state.startedAtMs) / 1000));
    const miles = formatDistanceMiles(state.distanceMeters);
    const dot = state.isPaused ? "Paused" : "Recording";
    return `${dot} • ${formatClock(elapsedSeconds)} • ${miles}`;
  }, [state.distanceMeters, state.isPaused, state.isRecording, state.startedAtMs]);

  const value: RecordingContextValue = useMemo(
    () => ({
      state,
      visitedTrips,
      lastFinishedTripId,
      clearLastFinishedTrip: () => setLastFinishedTripId(null),
      start,
      pause,
      resume,
      stop,
      addPoint,
      statusText
    }),
    [state, visitedTrips, statusText, lastFinishedTripId]
  );

  return <RecordingContext.Provider value={value}>{children}</RecordingContext.Provider>;
}

export function useRecording() {
  const ctx = useContext(RecordingContext);
  if (!ctx) throw new Error("useRecording must be used within RecordingProvider");
  return ctx;
}

