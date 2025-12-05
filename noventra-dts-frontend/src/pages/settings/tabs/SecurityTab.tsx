// src/pages/settings/tabs/SecurityTab.tsx
import React, { useState } from "react";
import {
  Lock,
  ShieldCheck,
  Smartphone,
  LogOut,
  Globe,
  AlertTriangle,
} from "lucide-react";

const SecurityTab: React.FC = () => {
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);
  const [trustedDevices, setTrustedDevices] = useState([
    { id: 1, name: "Chrome · Windows", lastSeen: "Today · 09:12", ip: "103.24.56.10", current: true },
    { id: 2, name: "Edge · Office Desktop", lastSeen: "Yesterday · 19:30", ip: "10.0.0.21", current: false },
  ]);

  const handleResetPassword = () => {
    alert("Password reset link sent (mock).");
  };

  const revokeDevice = (id: number) => {
    setTrustedDevices((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)] text-xs text-slate-200">
      {/* LEFT COLUMN */}
      <div className="space-y-4">
        {/* Password section */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <Lock size={13} />
            Password & 2FA
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleResetPassword}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-[11px] font-medium text-slate-100 hover:bg-slate-800"
            >
              <ShieldCheck size={13} />
              Send password reset link
            </button>

            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
              <div>
                <div className="text-[11px] font-semibold text-slate-200">
                  Two-factor authentication
                </div>
                <div className="text-[11px] text-slate-500">
                  Adds an extra layer using OTP / authenticator app.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTwoFAEnabled((prev) => !prev)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  twoFAEnabled ? "bg-emerald-500/80" : "bg-slate-600"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-slate-950 transition ${
                    twoFAEnabled ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Sessions & devices */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <Smartphone size={13} />
            Active sessions
          </div>

          <div className="space-y-2">
            {trustedDevices.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between rounded-xl bg-slate-900 px-3 py-2"
              >
                <div>
                  <div className="text-xs text-slate-100">{d.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {d.lastSeen} • IP {d.ip} {d.current && "• Current device"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => revokeDevice(d.id)}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 text-[11px] text-red-200 hover:bg-red-900/60"
                >
                  <LogOut size={11} />
                  Revoke
                </button>
              </div>
            ))}
            {trustedDevices.length === 0 && (
              <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-[11px] text-slate-400">
                No active sessions. All devices were revoked.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-4">
        {/* Login security */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <Globe size={13} />
            Geo & IP controls
          </div>

          <div className="space-y-2 text-[11px] text-slate-300">
            <div className="flex items-center justify-between">
              <span>Allowed countries</span>
              <span className="text-slate-400">India, Remote VPN</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Login anomaly alerts</span>
              <span className="text-emerald-300">Enabled</span>
            </div>
          </div>
        </div>

        {/* Risk warning */}
        <div className="rounded-2xl border border-amber-800 bg-slate-950 px-5 py-4">
          <div className="flex items-start gap-2 text-xs text-amber-100">
            <AlertTriangle size={14} className="mt-[2px]" />
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide">
                Security recommendations
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-amber-100/80">
                <li>Rotate passwords every 90 days.</li>
                <li>Keep 2FA enabled on all admin & finance accounts.</li>
                <li>Review active sessions weekly from the Audit tab.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
