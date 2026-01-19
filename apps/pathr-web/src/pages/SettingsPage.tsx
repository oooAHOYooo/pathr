export function SettingsPage() {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[34px] bg-white/10 ring-1 ring-white/15 backdrop-blur">
        <div className="p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Settings</div>
          <div className="mt-2 text-sm font-semibold text-white/90">Calm, honest controls</div>
          <div className="mt-2 text-sm text-white/70">Trips are currently saved on this device only.</div>

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

