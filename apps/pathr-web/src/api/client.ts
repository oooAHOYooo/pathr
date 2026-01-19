export type ApiAuth = { userId: string; username: string; token: string };

function getApiBaseUrl() {
  const fromEnv = (import.meta as any)?.env?.VITE_API_URL as string | undefined;
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

