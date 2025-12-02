// src/pages/system/NotFound.tsx
import { Link } from "react-router-dom";
import { Compass, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[100vh] items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-500/40 dark:bg-blue-950/40 dark:text-blue-200">
          <Compass size={14} />
          <span>Route not found</span>
        </div>

        {/* Icon + code */}
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg shadow-blue-500/30">
          <SearchX size={32} />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
          404 — Page not found
        </h1>

        <p className="mt-3 max-w-md text-sm text-slate-600 dark:text-slate-300">
          The page you’re looking for doesn’t exist, was moved, or is
          temporarily unavailable. Let’s guide you back into the{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-300">
            NOVENTRA Dynamic Workspace
          </span>
          .
        </p>

        {/* Suggestion box */}
        <div className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-xs text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 sm:text-sm">
          <p className="font-semibold text-slate-700 dark:text-slate-100">
            Quick suggestions:
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            <li>Check the URL for typos or extra slashes.</li>
            <li>Use the dashboard search to find employees or projects.</li>
            <li>
              If you followed a link from inside the app, it may be outdated.
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            <Home size={16} />
            Go to Dashboard
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
