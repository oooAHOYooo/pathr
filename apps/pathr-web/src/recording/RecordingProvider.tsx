import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { formatDistanceMiles, lineDistanceMeters, type StoredTrip, type Trip, type TripPoint } from "@pathr/shared";
import { appendStoredTrip, loadStoredTrips } from "../storage/trips";
import { useAuth } from "../auth/AuthProvider";
import { useWakeLock } from "./hooks/useWakeLock";
import { useGeolocation } from "./hooks/useGeolocation";
import {
  loadRecordingSession,
  clearRecordingSession,
  useSessionPersistence,
  type RecordingState
} from "./hooks/useSessionPersistence";
import { useTripSync } from "./hooks/useTripSync";

type RecordingContextValue = {
  state: RecordingState;
  visitedTrips: StoredTrip[];
  carPosition: { lat: number; lng: number } | null;
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
  const { auth } = useAuth();
  const [visitedTrips, setVisitedTrips] = useState<StoredTrip[]>(() => loadStoredTrips());
  const [lastFinishedTripId, setLastFinishedTripId] = useState<string | null>(null);
  const session = useMemo(() => loadRecordingSession(), []);
  const [carPosition, setCarPosition] = useState<{ lat: number; lng: number } | null>(session?.carPosition ?? null);
  const [state, setState] = useState<RecordingState>(
    session?.state ?? {
      isRecording: false,
      isPaused: false,
      startedAtMs: null,
      points: [],
      distanceMeters: 0
    }
  );

  const ticker = useRef<number | null>(null);
  const [, forceTick] = useState(0);

  // 1. Wake Lock management
  const { requestWakeLock, releaseWakeLock } = useWakeLock(state.isRecording && !state.isPaused);

  // 2. Geolocation management
  const { startGeoWatch, stopGeoWatch } = useGeolocation(
    state.isRecording && !state.isPaused,
    (point) => {
      setCarPosition(point);
      addPoint(point);
    }
  );

  // 3. Persistence management
  useSessionPersistence(state, carPosition);

  // 4. API Sync management
  useTripSync(auth?.token, lastFinishedTripId);

  // Ticker for elapsed time UI
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
    startGeoWatch();
  };

  const pause = () => {
    stopGeoWatch();
    void releaseWakeLock();
    setState((s) => ({ ...s, isPaused: true }));
  };

  const resume = () => {
    setState((s) => ({ ...s, isPaused: false }));
    startGeoWatch();
    void requestWakeLock();
  };

  const addPoint = (lngLat: { lng: number; lat: number }) => {
    setState((s) => {
      if (!s.isRecording || s.isPaused || !s.startedAtMs) return s;

      const p: TripPoint = {
        latitude: lngLat.lat,
        longitude: lngLat.lng,
        timestamp: nowMs()
      };

      const last = s.points[s.points.length - 1];
      if (last) {
        if (Math.abs(last.latitude - p.latitude) < 1e-7 && Math.abs(last.longitude - p.longitude) < 1e-7) return s;
        if (p.timestamp - last.timestamp < 750) return s;
      }

      const nextPoints = [...s.points, p];
      const coords = nextPoints.map((pt) => [pt.longitude, pt.latitude] as const);
      const distanceMeters = lineDistanceMeters(coords);

      return { ...s, points: nextPoints, distanceMeters };
    });
  };

  const stop = () => {
    stopGeoWatch();
    void releaseWakeLock();
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
      clearRecordingSession();

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
      carPosition,
      lastFinishedTripId,
      clearLastFinishedTrip: () => setLastFinishedTripId(null),
      start,
      pause,
      resume,
      stop,
      addPoint,
      statusText
    }),
    [state, visitedTrips, statusText, lastFinishedTripId, carPosition]
  );

  return <RecordingContext.Provider value={value}>{children}</RecordingContext.Provider>;
}

export function useRecording() {
  const ctx = useContext(RecordingContext);
  if (!ctx) throw new Error("useRecording must be used within RecordingProvider");
  return ctx;
}
