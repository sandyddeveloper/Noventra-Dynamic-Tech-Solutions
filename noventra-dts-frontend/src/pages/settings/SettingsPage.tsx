import React, { useState } from "react";
import {
  User,
  Shield,
  Bell,
  Palette,
  Cpu,
  Link2,
  KeyRound,
  CreditCard,
  Lock,
  ListOrdered
} from "lucide-react";
import ProfileTab from "./tabs/ProfileTab";
import SecurityTab from "./tabs/SecurityTab";
import NotificationTab from "./tabs/NotificationTab";
import ThemeTab from "./tabs/ThemeTab";
import AITab from "./tabs/AITab";
import IntegrationsTab from "./tabs/IntegrationsTab";
import APITab from "./tabs/APITab";
import BillingTab from "./tabs/BillingTab";
import AccessTab from "./tabs/AccessTab";
import AuditTab from "./tabs/AuditTab";


const TABS = [
  { id: "profile", icon: User, label: "Profile" },
  { id: "security", icon: Shield, label: "Security" },
  { id: "notifications", icon: Bell, label: "Notifications" },
  { id: "theme", icon: Palette, label: "Theme & UI" },
  { id: "ai", icon: Cpu, label: "AI Assistant" },
  { id: "integrations", icon: Link2, label: "Integrations" },
  { id: "api", icon: KeyRound, label: "API & Webhooks" },
  { id: "billing", icon: CreditCard, label: "Billing" },
  { id: "access", icon: Lock, label: "Access Control" },
  { id: "audit", icon: ListOrdered, label: "Audit Logs" },
];

const SettingsPage: React.FC = () => {
  const [tab, setTab] = useState("profile");

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div>
        <h1 className="text-lg font-semibold text-slate-50">Settings</h1>
        <p className="text-xs text-slate-400">
          Manage your account, security, access and workspace configuration.
        </p>
      </div>

      {/* TAB BAR */}
      <div className="flex flex-wrap gap-2 text-xs">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 ${
              tab === t.id
                ? "bg-blue-600 text-white"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {tab === "profile" && <ProfileTab />}
      {tab === "security" && <SecurityTab />}
      {tab === "notifications" && <NotificationTab />}
      {tab === "theme" && <ThemeTab />}
      {tab === "ai" && <AITab />}
      {tab === "integrations" && <IntegrationsTab />}
      {tab === "api" && <APITab />}
      {tab === "billing" && <BillingTab />}
      {tab === "access" && <AccessTab />}
      {tab === "audit" && <AuditTab />}
    </div>
  );
};

export default SettingsPage;
