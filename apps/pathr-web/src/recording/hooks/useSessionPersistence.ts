import { useEffect } from "react";
import { type TripPoint } from "@pathr/shared";

const RECORDING_SESSION_KEY = "pathr.recordingSession.v1";

export type RecordingState = {
  isRecording: boolean;
  isPaused: boolean;
  startedAtMs: number | null;
  points: TripPoint[];
  distanceMeters: number;
};

export function loadRecordingSession(): {
  state: RecordingState;
  carPosition: { lat: number; lng: number } | null;
} | null {
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

export function saveRecordingSession(state: RecordingState, carPosition: { lat: number; lng: number } | null) {
  try {
    localStorage.setItem(RECORDING_SESSION_KEY, JSON.stringify({ state, carPosition, savedAt: new Date().toISOString() }));
  } catch {
    // ignore storage failures
  }
}

export function clearRecordingSession() {
  try {
    localStorage.removeItem(RECORDING_SESSION_KEY);
  } catch {
    // ignore
  }
}

export function useSessionPersistence(state: RecordingState, carPosition: { lat: number; lng: number } | null) {
  useEffect(() => {
    if (state.isRecording && state.startedAtMs) {
      saveRecordingSession(state, carPosition);
    } else {
      clearRecordingSession();
    }
  }, [state, carPosition]);

  useEffect(() => {
    const onHide = () => {
      if (state.isRecording && state.startedAtMs) saveRecordingSession(state, carPosition);
    };
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, [state, carPosition]);
}
