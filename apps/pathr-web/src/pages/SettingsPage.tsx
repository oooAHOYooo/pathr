import { useMemo, useState } from "react";
import { apiBaseUrl } from "../api/client";
import { Button } from "../components/Button";
import { useAuth } from "../auth/AuthProvider";

function validateUsername(raw: string): string | null {
  const v = raw.trim().toLowerCase();
  if (v.length < 3 || v.length > 20) return "Username must be 3–20 characters.";
  if (!/^[a-z0-9_]+$/.test(v)) return "Use lowercase letters, numbers, or underscore only.";
  return null;
}

export function SettingsPage() {
  const { auth, loginWithUsername, logout, isLoading, error } = useAuth();
  const [username, setUsername] = useState("");
  const usernameError = useMemo(() => (username ? validateUsername(username) : null), [username]);
  const apiUrl = apiBaseUrl();
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[34px] bg-white/10 ring-1 ring-white/15 backdrop-blur">
        <div className="p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Settings</div>
          <div className="mt-2 text-sm font-semibold text-white/90">Calm, honest controls</div>
          <div className="mt-2 text-sm text-white/70">Trips are currently saved on this device only.</div>

          <div className="mt-5 rounded-3xl bg-black/25 p-4 ring-1 ring-white/10">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Account (username)</div>
            <div className="mt-2 text-sm text-white/70">
              {auth ? (
                <>
                  Signed in as <span className="font-semibold text-white/90">@{auth.username}</span>
                </>
              ) : (
                <>Create a username to save and sync your driving history across devices.</>
              )}
            </div>

            <div className="mt-3 text-xs text-white/55">API: {apiUrl}</div>

            {!auth ? (
              <div className="mt-4 space-y-3">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 w-full rounded-2xl bg-white/8 px-4 text-sm text-white/90 ring-1 ring-white/10 outline-none placeholder:text-white/40 focus:ring-accent/40"
                  placeholder="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  inputMode="text"
                />
                {usernameError ? <div className="text-sm text-white/70">{usernameError}</div> : null}
                {error ? <div className="text-sm text-white/70">{error}</div> : null}
                <Button
                  variant="primary"
                  className="h-12 w-full rounded-2xl"
                  disabled={Boolean(usernameError) || !username.trim() || isLoading}
                  onClick={async () => {
                    if (usernameError) return;
                    await loginWithUsername(username);
                    setUsername("");
                  }}
                  type="button"
                >
                  {isLoading ? "Signing in…" : "Create username / Sign in"}
                </Button>
                <div className="text-xs text-white/55">
                  No email, no password yet. TODO: email/password upgrade.
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <Button className="h-12 w-full rounded-2xl" onClick={logout} type="button">
                  Log out
                </Button>
              </div>
            )}
          </div>

          <div className="mt-5 rounded-3xl bg-black/25 p-4 ring-1 ring-white/10">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Background tracking</div>
            <div className="mt-2 text-sm text-white/70">
              On mobile browsers, GPS may pause when you leave the app or lock your screen. Pathr will keep your trip and resume when you return.
            </div>
            <div className="mt-3 space-y-2 text-sm text-white/75">
              <div>- Keep Pathr open while recording (most reliable).</div>
              <div>- Turn off Low Power Mode / Battery Saver while recording.</div>
              <div>- If available, allow location “While Using” (iOS) or “Allow” (Android).</div>
            </div>
            <div className="mt-3 text-xs text-white/55">
              TODO: truly reliable always-on background tracking requires a native app.
            </div>
          </div>

          <div className="mt-5 rounded-3xl bg-black/25 p-4 ring-1 ring-white/10">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Coming soon</div>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              <div>- Backend sync</div>
              <div>- Email/password upgrade</div>
              <div>- Public profile pages</div>
              <div>- Heatmap overlays</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

