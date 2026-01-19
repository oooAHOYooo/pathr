import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiMe, apiSignup, type ApiAuth } from "../api/client";

export type AuthState = {
  userId: string;
  username: string;
  token: string;
} | null;

type AuthContextValue = {
  auth: AuthState;
  isLoading: boolean;
  error: string | null;
  loginWithUsername: (username: string) => Promise<void>;
  logout: () => void;
};

const KEY = "pathr.auth.v1";

function loadAuth(): AuthState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as any;
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.userId !== "string" || typeof parsed.username !== "string" || typeof parsed.token !== "string") return null;
    return { userId: parsed.userId, username: parsed.username, token: parsed.token };
  } catch {
    return null;
  }
}

function saveAuth(auth: AuthState) {
  try {
    if (!auth) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, JSON.stringify(auth));
  } catch {
    // ignore
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => loadAuth());
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(auth));
  const [error, setError] = useState<string | null>(null);

  // Validate stored token on boot. If it fails, clear it.
  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!auth?.token) return;
      setIsLoading(true);
      try {
        const me = await apiMe(auth.token);
        if (cancelled) return;
        setAuth({ ...auth, userId: me.userId, username: me.username });
        setError(null);
      } catch (e: any) {
        if (cancelled) return;
        setAuth(null);
        setError(e?.message ?? "Session expired");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    saveAuth(auth);
  }, [auth]);

  const loginWithUsername = async (username: string) => {
    setIsLoading(true);
    try {
      const next: ApiAuth = await apiSignup(username);
      setAuth(next);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Login failed");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => setAuth(null);

  const value: AuthContextValue = useMemo(
    () => ({
      auth,
      isLoading,
      error,
      loginWithUsername,
      logout
    }),
    [auth, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

