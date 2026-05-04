import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";

export function TopNav() {
  // TopNav now reflects auth state (username login lives in Settings).
  // Keeping it lightweight: tapping the account control routes to Settings.
  const { auth } = useAuth();
  const initial = auth?.username?.[0]?.toUpperCase() ?? "?";
  return (
    <header className="px-5 pt-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/10">
            <div className="h-6 w-6 rounded-xl bg-accent/20 ring-1 ring-accent/30" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Pathr</div>
            <div className="text-sm font-semibold text-white/90">Drive Journal</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/10 hover:bg-white/15"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-white/80">
              <path
                fill="currentColor"
                d="M12 22a2.25 2.25 0 0 0 2.25-2.25h-4.5A2.25 2.25 0 0 0 12 22Zm6-6.25V11a6 6 0 1 0-12 0v4.75L4.5 17a.75.75 0 0 0 .5 1.31h14a.75.75 0 0 0 .5-1.31L18 15.75ZM7.5 11a4.5 4.5 0 1 1 9 0v4.94l.56.56H6.94l.56-.56V11Z"
              />
            </svg>
          </button>

          <Link
            href="/app/settings"
            aria-label={auth ? `Account ${auth.username}` : "Sign in"}
            className={[
              "inline-flex h-10 items-center gap-2 rounded-2xl bg-white/10 px-3 ring-1 ring-white/10",
              "hover:bg-white/15"
            ].join(" ")}
          >
            <div className="grid h-7 w-7 place-items-center rounded-xl bg-black/25 ring-1 ring-white/10">
              <div className="text-xs font-semibold text-white/90">{initial}</div>
            </div>
            <div className="text-xs font-semibold text-white/85">
              {auth ? `@${auth.username}` : "Sign in"}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

