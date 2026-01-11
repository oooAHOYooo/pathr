import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      <div className="mx-auto flex min-h-[100dvh] max-w-3xl items-center px-4">
        <div className="w-full py-16">
          <div className="text-sm font-medium">Page not found</div>
          <div className="mt-2 text-sm text-ink/70">
            The page you’re looking for doesn’t exist.
          </div>
          <div className="mt-6">
            <Link to="/" className="text-sm underline underline-offset-4 hover:text-ink/80">
              Go to Pathr
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

