export function SettingsPage() {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[34px] bg-white/10 ring-1 ring-white/15 backdrop-blur">
        <div className="p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Settings</div>
          <div className="mt-2 text-sm font-semibold text-white/90">Calm, honest controls</div>
          <div className="mt-2 text-sm text-white/70">Trips are currently saved on this device only.</div>

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

