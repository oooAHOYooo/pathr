import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { formatDistanceMiles, lineDistanceMeters, type StoredTrip, type Trip, type TripPoint } from "@pathr/shared";
import { appendStoredTrip, loadStoredTrips } from "../storage/trips";

const RECORDING_SESSION_KEY = "pathr.recordingSession.v1";

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

function loadRecordingSession(): { state: RecordingState; carPosition: { lat: number; lng: number } | null } | null {
  try {
    const raw = localStorage.getItem(RECORDING_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as any;
    if (!parsed || typeof parsed !== "object") return null;
    const s = parsed.state as any;
    if (!s || typeof s !== "object") return null;
    const startedAtMs = typeof s.startedAtMs === "number" ? s.startedAtMs : null;
    const isRecording = Boolean(s.isRecording);
    const isPaused = Boolean(s.isPaused);
    const points = Array.isArray(s.points) ? (s.points as TripPoint[]) : [];
    const distanceMeters = typeof s.distanceMeters === "number" ? s.distanceMeters : 0;

    const cp = parsed.carPosition as any;
    const carPosition =
      cp && typeof cp.lat === "number" && typeof cp.lng === "number" ? ({ lat: cp.lat, lng: cp.lng } as const) : null;

    return {
      state: { isRecording, isPaused, startedAtMs, points, distanceMeters },
      carPosition
    };
  } catch {
    return null;
  }
}

function saveRecordingSession(state: RecordingState, carPosition: { lat: number; lng: number } | null) {
  try {
    localStorage.setItem(RECORDING_SESSION_KEY, JSON.stringify({ state, carPosition, savedAt: new Date().toISOString() }));
  } catch {
    // ignore storage failures
  }
}

function clearRecordingSession() {
  try {
    localStorage.removeItem(RECORDING_SESSION_KEY);
  } catch {
    // ignore
  }
}

export function RecordingProvider({ children }: { children: React.ReactNode }) {
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
  const geoWatchId = useRef<number | null>(null);

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

  const stopGeoWatch = () => {
    if (geoWatchId.current != null && navigator.geolocation?.clearWatch) {
      navigator.geolocation.clearWatch(geoWatchId.current);
    }
    geoWatchId.current = null;
  };

  const startGeoWatch = () => {
    if (!navigator.geolocation?.watchPosition) return;
    stopGeoWatch();
    geoWatchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCarPosition({ lat, lng });
        addPoint({ lat, lng });
      },
      () => {
        // If the user denies or the device can't provide location, we keep recording locally and
        // fall back to manual map taps.
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 12_000 }
    );
  };

  // Persist in-progress recording so it can resume after iOS Safari/app restarts.
  useEffect(() => {
    if (state.isRecording && state.startedAtMs) {
      saveRecordingSession(state, carPosition);
    } else {
      clearRecordingSession();
    }
  }, [state, carPosition]);

  // iOS: stop GPS watch when the page is backgrounded; resume when visible again.
  useEffect(() => {
    const onVis = () => {
      if (!state.isRecording || state.isPaused) return;
      if (document.hidden) stopGeoWatch();
      else startGeoWatch();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [state.isPaused, state.isRecording]);

  // Ensure we flush session to storage on pagehide (mobile Safari).
  useEffect(() => {
    const onHide = () => {
      if (state.isRecording && state.startedAtMs) saveRecordingSession(state, carPosition);
    };
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, [state, carPosition]);

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
    setState((s) => ({ ...s, isPaused: true }));
  };
  const resume = () => {
    setState((s) => ({ ...s, isPaused: false }));
    startGeoWatch();
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
        // Light de-dupe for GPS jitter / rapid callbacks.
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

