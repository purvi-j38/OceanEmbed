import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard — OceanEmbed",
  description: "Your personal OceanEmbed dashboard — saved views, alerts, and recent activity.",
};

const RECENT_VIEWS = [
  { name: "BoB 100m – Oct 2023", url: "/explore?lat=12&lon=87&depth=100&date=2023-10-15", date: "2 hours ago" },
  { name: "Arabian Sea upwelling", url: "/explore?lat=15&lon=60&depth=50&date=2023-07-10&layer=Error", date: "Yesterday" },
  { name: "Monsoon thermocline", url: "/cross-sections?date=2023-07-01", date: "3 days ago" },
];

const ALERTS = [
  { name: "SST anomaly > 2°C in BoB", status: "Active", lastFired: "2 days ago" },
  { name: "Thermocline depth < 60m", status: "Inactive", lastFired: "Never" },
];

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="p-6 overflow-auto min-h-full bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]">
        <div className="mb-6">
          <h1 className="text-2xl" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>Dashboard</h1>
          <p className="text-sm opacity-60 mt-1">Welcome back. Your saved views and active alerts are below.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent views */}
          <div className="hairline rounded-[var(--radius-md)] bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
            <div className="p-4 hairline-b flex items-center justify-between">
              <div className="font-semibold text-sm">Recent views</div>
              <Link href="/saved-views" className="text-xs opacity-60 hover:opacity-100" style={{ color: "var(--color-accent)" }}>See all →</Link>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--color-hairline)" }}>
              {RECENT_VIEWS.map(v => (
                <Link key={v.name} href={v.url} className="flex items-center justify-between px-4 py-3 hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors">
                  <div>
                    <div className="text-sm">{v.name}</div>
                    <div className="text-[10px] font-mono opacity-50 mt-0.5">{v.url.slice(0, 40)}…</div>
                  </div>
                  <div className="text-[10px] font-mono opacity-40 shrink-0 ml-4">{v.date}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="hairline rounded-[var(--radius-md)] bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
            <div className="p-4 hairline-b flex items-center justify-between">
              <div className="font-semibold text-sm">Alerts</div>
              <Link href="/alerts" className="text-xs opacity-60 hover:opacity-100" style={{ color: "var(--color-accent)" }}>Manage →</Link>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--color-hairline)" }}>
              {ALERTS.map(a => (
                <div key={a.name} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="text-sm">{a.name}</div>
                    <div className="text-[10px] font-mono opacity-50 mt-0.5">Last fired: {a.lastFired}</div>
                  </div>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                    a.status === "Active" ? "text-green-700 bg-green-100" : "opacity-40 bg-gray-100"
                  }`}>{a.status}</span>
                </div>
              ))}
              <div className="px-4 py-3">
                <Link href="/alerts" className="text-xs" style={{ color: "var(--color-accent)" }}>+ New alert</Link>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="hairline rounded-[var(--radius-md)] bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] p-4">
            <div className="font-semibold text-sm mb-3">Quick start</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Open Explorer",    href: "/explore" },
                { label: "View validation",  href: "/validation" },
                { label: "Cross-sections",   href: "/cross-sections" },
                { label: "Downloads",        href: "/downloads" },
              ].map(l => (
                <Link key={l.href} href={l.href} className="text-xs px-3 py-2 rounded hairline hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-40">
                    <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
