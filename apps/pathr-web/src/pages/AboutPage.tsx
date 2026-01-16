import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[34px] bg-white/10 ring-1 ring-white/15 backdrop-blur">
        <div className="p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">About</div>
          <div className="mt-2 text-lg font-semibold text-white/90">Little Market, LLC</div>
          <div className="mt-2 text-sm leading-relaxed text-white/75">
            We’re a homemade company based in <span className="font-semibold text-white/90">New Haven, CT</span> — a random husband
            and wife who make apps (and sometimes strawberry jam).
          </div>

          <div className="mt-4 rounded-3xl bg-black/25 p-4 ring-1 ring-white/10">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">What is Pathr?</div>
            <div className="mt-2 text-sm text-white/75">
              Pathr is “Strava for driving” — record trips, build your personal map, and keep a simple driving journal.
            </div>
          </div>

          <div className="mt-5">
            <Link to="/app" className="text-sm font-semibold text-white/85 underline underline-offset-4 hover:text-white">
              Back to app
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

