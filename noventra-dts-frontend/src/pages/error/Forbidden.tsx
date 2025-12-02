// src/pages/system/Forbidden.tsx
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, LockKeyhole } from "lucide-react";

export default function Forbidden() {
  return (
    <main className="flex min-h-[100vh] items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-200">
          <ShieldAlert size={14} />
          <span>Access restricted</span>
        </div>

        {/* Icon + heading */}
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 via-rose-500 to-orange-400 text-white shadow-lg shadow-red-500/30">
          <LockKeyhole size={32} />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
          403 — Forbidden
        </h1>
        <p className="mt-3 max-w-md text-sm text-slate-600 dark:text-slate-300">
          You don’t have permission to access this area of{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-300">
            NOVENTRA Command Center
          </span>
          . If you think this is a mistake, contact your administrator or HR.
        </p>

        {/* Helper info */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-xs text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 sm:text-sm">
          <p className="font-semibold text-slate-700 dark:text-slate-100">
            Possible reasons:
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            <li>Your role doesn’t have access to this module.</li>
            <li>Your session changed (new role / team assignment).</li>
            <li>The link you used points to an admin-only route.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            Switch Account
          </Link>
        </div>
      </div>
    </main>
  );
}
