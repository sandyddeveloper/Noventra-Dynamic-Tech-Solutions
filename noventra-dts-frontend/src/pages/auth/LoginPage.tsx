// src/pages/LoginPage.tsx
import React, { useMemo, useState } from "react";
import { Mail, Lock, Eye, EyeOff, Moon, SunMedium, Bug } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type LoginFormState = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const initialForm: LoginFormState = {
  email: "",
  password: "",
  rememberMe: true,
};


export function LoginPage() {
  const navigate = useNavigate();
  const { login, refreshUser } = useAuth();

  const [form, setForm] = useState<LoginFormState>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  const debugEnabled = useMemo(() => {
    try {
      return (
        import.meta.env.VITE_DEBUG === "1" ||
        import.meta.env.MODE === "development" ||
        localStorage.getItem("noventra_debug") === "1"
      );
    } catch {
      return import.meta.env.MODE === "development";
    }
  }, []);

  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(debugEnabled);

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof LoginFormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Please enter a valid email address";
    if (!form.password.trim()) return "Password is required";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      // include a short device string (helps server-side session tracking)
      const device = `${navigator.platform || "web"} ${navigator.userAgent?.split(" ").slice(0,4).join(" ") || ""}`.slice(0,200);

      // login() returns boolean (true = success)
      const ok = await login(form.email.trim(), form.password, device);

      if (!ok) {
        // present a helpful message. Backend may return JSON {detail: "..."} but login() returns false on error.
        setError("Invalid credentials or account not active.");
        setSubmitting(false);
        return;
      }

      // remember-me hint in sessionStorage (actual persistence is server-driven by refresh cookie lifetime)
      try {
        if (form.rememberMe) sessionStorage.setItem("noventra_remember", "1");
        else sessionStorage.removeItem("noventra_remember");
      } catch {}

      // if backend did not return user payload inside login, try to re-fetch profile
      try {
        await refreshUser();
      } catch { /* ignore */ }

      // navigate to dashboard (replace so login is not in history)
      navigate("/", { replace: true });
    } catch (err: any) {
      // if axios error and backend provides message, show it
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Login failed. Please try again.";
      setError(String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 lg:px-20">
      <div className="relative z-10 flex min-h-screen flex-col px-4 py-4 sm:px-6 md:px-10">
        <header className="mb-6 flex items-center justify-between sm:mb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-lg font-black text-white shadow-lg shadow-blue-500/40 ring-1 ring-white/10">
              <img src="/icons/logo-512.png" alt="Noventra logo" className="h-10 w-10 object-contain" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-semibold tracking-[0.22em] text-slate-300">NOVENTRA</span>
              <span className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Dynamic Tech Solutions</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-pressed={theme === "dark"}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 text-xs font-medium text-slate-200 shadow-sm"
            >
              {theme === "dark" ? <SunMedium size={16} /> : <Moon size={16} />}
            </button>

            <button
              type="button"
              onClick={() => {
                try {
                  const next = showDebugPanel ? "0" : "1";
                  localStorage.setItem("noventra_debug", next);
                } catch { }
                setShowDebugPanel((s) => !s);
              }}
              title={showDebugPanel ? "Hide debug panel" : "Show debug panel"}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 text-xs font-medium text-slate-200 shadow-sm"
            >
              <Bug size={14} />
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center gap-10 pb-6 pt-2 md:flex-row md:items-center md:justify-between md:pb-10 md:pt-0">
          <section className="hidden max-w-xl flex-1 flex-col gap-4 md:flex">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/70 px-3 py-1 text-[11px] font-medium text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Realtime Company Command Center
            </div>

            <h1 className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl lg:text-5xl">
              Sign in to{" "}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Noventra Command Center</span>
            </h1>

            <p className="max-w-md text-sm text-slate-300/90 sm:text-base">
              Track employees, projects, timelines and payments in a single futuristic dashboard — optimized for Super Admins, HR, Team Leads and employees.
            </p>
          </section>

          <section className="flex w-full max-w-md flex-1 items-center justify-center">
            <div className="w-full rounded-3xl border border-slate-700/60 bg-slate-950/60 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.75)] backdrop-blur-md sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold text-slate-50">Welcome back</h2>
                  <p className="text-[11px] text-slate-400">Login with your Noventra admin credentials</p>
                </div>
                <div className="hidden h-9 items-center rounded-full border border-slate-700/80 bg-slate-950/50 px-3 text-[11px] text-slate-300 sm:inline-flex">
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  System status: <span className="ml-1 font-medium text-emerald-300">Healthy</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-slate-300">Work email</label>
                  <div className="relative flex items-center">
                    <span className="pointer-events-none absolute left-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-slate-400"><Mail size={16} /></span>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950/70 pl-11 pr-3 text-sm text-slate-50 outline-none"
                      placeholder="you@noventra.com"
                      data-testid="email-input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-xs font-medium uppercase tracking-wide text-slate-300">Password</label>
                  <div className="relative flex items-center">
                    <span className="pointer-events-none absolute left-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-slate-400"><Lock size={16} /></span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950/70 pl-11 pr-10 text-sm text-slate-50 outline-none"
                      placeholder="••••••••"
                      data-testid="password-input"
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-slate-100" aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 text-xs">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-slate-300">
                    <input type="checkbox" checked={form.rememberMe} onChange={(e) => handleChange("rememberMe", e.target.checked)} className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-950" />
                    <span>Remember this device</span>
                  </label>
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/5 px-3 py-2 text-xs text-red-200" role="alert" aria-live="assertive" data-testid="login-error">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-red-400" />
                    <p>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
                  data-testid="login-submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      <span className="h-3 w-3 rounded-full border-2 border-transparent" />
                      Sign In
                    </>
                  )}
                </button>

                <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="h-px flex-1 bg-slate-700" />
                  <span>or quick access</span>
                  <span className="h-px flex-1 bg-slate-700" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button type="button" className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2" onClick={() => setForm((prev) => ({ ...prev, email: "superadmin@noventra.com", password: "Admin@123" }))}>Super Admin demo</button>
                  <button type="button" className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2" onClick={() => setForm((prev) => ({ ...prev, email: "employee@noventra.com", password: "Employee@123" }))}>Employee demo</button>
                </div>

                <p className="pt-1 text-[10px] text-slate-500 ml-14">
                  By continuing you agree to Noventra&apos;s{" "}
                  <button type="button" className="text-blue-300 hover:text-blue-200">Terms</button>{" "}
                  &{" "}
                  <button type="button" className="text-blue-300 hover:text-blue-200">Security Policy</button>.
                </p>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default LoginPage;
