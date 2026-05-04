export type ApiAuth = { userId: string; username: string; token: string };

function getApiBaseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL;
  if (fromEnv && typeof fromEnv === "string" && fromEnv.trim()) return fromEnv.trim().replace(/\/+$/, "");
  // Local dev fallback (API service)
  return "http://127.0.0.1:3001";
}

const API_BASE = getApiBaseUrl();

export function apiBaseUrl() {
  return API_BASE;
}

async function jsonFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data as any)?.error ?? `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

export async function apiSignup(username: string): Promise<ApiAuth> {
  const data = await jsonFetch<{ userId: string; username: string; token: string }>("/v1/signup", {
    method: "POST",
    body: JSON.stringify({ username })
  });
  return { userId: data.userId, username: data.username, token: data.token };
}

export async function apiMe(token: string): Promise<{ userId: string; username: string }> {
  return await jsonFetch("/v1/me", {
    headers: { authorization: `Bearer ${token}` }
  });
}

export type ApiTrip = {
  id: string;
  userId: string;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  distanceMiles: number;
  startLabel: string;
  endLabel: string;
  path: Array<[number, number]>;
  details?: Record<string, any> | null;
};

export async function apiListTrips(token: string): Promise<ApiTrip[]> {
  const data = await jsonFetch<{ trips: ApiTrip[] }>("/v1/trips", {
    headers: { authorization: `Bearer ${token}` }
  });
  return data.trips ?? [];
}

export async function apiCreateTrip(
  token: string,
  trip: Omit<ApiTrip, "id" | "userId">
): Promise<{ ok: true; tripId?: string }> {
  return await jsonFetch("/v1/trips", {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
    body: JSON.stringify({ trip })
  });
}

export async function apiStats(token: string): Promise<{
  totalTrips: number;
  totalMiles: number;
  totalDurationMs: number;
  last7dTrips: number;
  last7dMiles: number;
  last7dDurationMs: number;
}> {
  return await jsonFetch("/v1/stats", {
    headers: { authorization: `Bearer ${token}` }
  });
}

