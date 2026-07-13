import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Compass size={28} />
      </div>
      <h1 className="mt-6 font-display text-5xl font-extrabold text-slate-900">404</h1>
      <p className="mt-2 text-base font-medium text-slate-600">This page doesn't exist.</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        The page you're looking for may have been moved or removed.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to Home
      </Link>
    </div>
  );
}
