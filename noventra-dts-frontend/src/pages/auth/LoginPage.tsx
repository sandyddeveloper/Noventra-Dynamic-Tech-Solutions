// src/pages/auth/LoginPage.tsx
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Moon, SunMedium } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  const [form, setForm] = useState<LoginFormState>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  // keep theme consistent with rest of app
  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleChange = (field: keyof LoginFormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return "Please enter a valid email address";
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

    // fake login for now – plug into your API later
    try {
      setIsSubmitting(true);

      // simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // if rememberMe: you can persist email/token here
      if (form.rememberMe) {
        localStorage.setItem("lastLoginEmail", form.email);
      } else {
        localStorage.removeItem("lastLoginEmail");
      }

      navigate("/"); // redirect to dashboard
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 lg:px-20">
      {/* Decorative background grid */}
      <div className="pointer-events-none fixed inset-0 opacity-40 mix-blend-soft-light">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.15),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(148,163,184,0.18)_1px,_transparent_1px),linear-gradient(to_bottom,_rgba(148,163,184,0.18)_1px,_transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col px-4 py-4 sm:px-6 md:px-10">
        {/* Top bar with brand + theme toggle */}
        <header className="mb-6 flex items-center justify-between sm:mb-10">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-lg font-black text-white shadow-lg shadow-blue-500/40">
              N
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide text-slate-50">
                NOVENTRA
              </span>
              <span className="text-[11px] uppercase tracking-[0.15em] text-slate-400">
                Dynamic Tech Solutions
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 text-xs font-medium text-slate-200 shadow-sm backdrop-blur hover:border-blue-500 hover:text-blue-100"
          >
            {theme === "dark" ? (
              <>
                <SunMedium size={16} />
                <span className="hidden sm:inline">Light mode</span>
              </>
            ) : (
              <>
                <Moon size={16} />
                <span className="hidden sm:inline">Dark mode</span>
              </>
            )}
          </button>
        </header>

        {/* Main layout: stacked on mobile, split on md+ */}
        <main className="flex flex-1 flex-col items-center justify-center gap-10 pb-6 pt-2 md:flex-row md:items-center md:justify-between md:pb-10 md:pt-0">
          {/* Left: marketing / hero copy (hidden on very small if needed) */}
          <section className="hidden max-w-xl flex-1 flex-col gap-4 md:flex">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/70 px-3 py-1 text-[11px] font-medium text-slate-300 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Realtime Company Command Center
            </div>

            <h1 className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl lg:text-5xl">
              Sign in to{" "}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Noventra Command Center
              </span>
            </h1>

            <p className="max-w-md text-sm text-slate-300/90 sm:text-base">
              Track employees, projects, timelines and payments in a single
              futuristic dashboard — optimized for Super Admins, HR, Team Leads
              and employees.
            </p>

            <dl className="mt-3 grid max-w-md grid-cols-2 gap-3 text-xs text-slate-300/90">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                  Realtime Insights
                </dt>
                <dd className="mt-1 font-semibold">Live activity timeline</dd>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                  Secure Access
                </dt>
                <dd className="mt-1 font-semibold">Role-based permissions</dd>
              </div>
            </dl>
          </section>

          {/* Right: login card */}
          <section className="flex w-full max-w-md flex-1 items-center justify-center">
            <div className="w-full rounded-3xl border border-slate-700/60 bg-slate-950/60 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.75)] backdrop-blur-md sm:p-6">
              {/* Small brand & subtitle for mobile */}
              <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold text-slate-50">
                    Welcome back, Harini
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Login with your Noventra admin credentials
                  </p>
                </div>
                <div className="hidden h-9 items-center rounded-full border border-slate-700/80 bg-slate-950/50 px-3 text-[11px] text-slate-300 sm:inline-flex">
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  System status:{" "}
                  <span className="ml-1 font-medium text-emerald-300">Healthy</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-medium uppercase tracking-wide text-slate-300"
                  >
                    Work email
                  </label>
                  <div className="relative flex items-center">
                    <span className="pointer-events-none absolute left-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-slate-400">
                      <Mail size={16} />
                    </span>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950/70 pl-11 pr-3 text-sm text-slate-50 outline-none ring-offset-slate-950 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-0"
                      placeholder="you@noventra.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium uppercase tracking-wide text-slate-300"
                  >
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <span className="pointer-events-none absolute left-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-slate-400">
                      <Lock size={16} />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950/70 pl-11 pr-10 text-sm text-slate-50 outline-none ring-offset-slate-950 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-0"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={form.rememberMe}
                      onChange={(e) =>
                        handleChange("rememberMe", e.target.checked)
                      }
                      className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-950 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-950"
                    />
                    <span>Remember this device</span>
                  </label>
                </div>

                {/* Error state */}
                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/5 px-3 py-2 text-xs text-red-200">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-red-400" />
                    <p>{error}</p>
                  </div>
                )}

                {/* Login button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing you in…
                    </>
                  ) : (
                    <>
                      Continue to dashboard
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="h-px flex-1 bg-slate-700" />
                  <span>or quick access</span>
                  <span className="h-px flex-1 bg-slate-700" />
                </div>

                {/* (Optional) social / role quick buttons */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-200 hover:border-blue-500 hover:bg-slate-900"
                    onClick={() => {
                      // dev helper: auto-fill Super Admin creds
                      setForm((prev) => ({
                        ...prev,
                        email: "superadmin@noventra.com",
                        password: "Admin@123",
                      }));
                    }}
                  >
                    Super Admin demo
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-200 hover:border-blue-500 hover:bg-slate-900"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        email: "employee@noventra.com",
                        password: "Employee@123",
                      }));
                    }}
                  >
                    Employee demo
                  </button>
                </div>

                {/* Footer hint */}
                <p className="pt-1 text-[10px] text-slate-500 ml-14">
                  By continuing you agree to Noventra&apos;s{" "}
                  <button
                    type="button"
                    className="text-blue-300 hover:text-blue-200"
                  >
                    Terms
                  </button>{" "}
                  &{" "}
                  <button
                    type="button"
                    className="text-blue-300 hover:text-blue-200"
                  >
                    Security Policy
                  </button>
                  .
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
