import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0B1726] text-white">
      <div className="mx-auto flex min-h-[100dvh] max-w-[420px] flex-col justify-center px-5">
        <div className="overflow-hidden rounded-[34px] bg-white/10 ring-1 ring-white/15 backdrop-blur">
          <div className="p-5">
            <div className="text-sm font-semibold text-white/90">Page not found</div>
            <div className="mt-2 text-sm text-white/70">The page you’re looking for doesn’t exist.</div>
            <div className="mt-5">
              <Link to="/" className="text-sm font-semibold text-white/85 underline underline-offset-4 hover:text-white">
                Go to Pathr
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

