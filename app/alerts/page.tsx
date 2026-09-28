import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Alerts — OceanEmbed",
  description: "Set up email or webhook alerts when OceanEmbed detects anomalous subsurface conditions.",
};

const ALERT_TYPES = [
  { name: "Temperature anomaly",  desc: "Alert when temperature at a point exceeds a threshold vs climatology" },
  { name: "Thermocline depth",    desc: "Alert when the mixed-layer depth is shallower or deeper than expected" },
  { name: "Eddy detection",       desc: "Alert when an SSH-identified eddy enters a defined bounding box" },
];

const DEMO_ALERTS = [
  { name: "SST anomaly > 2°C in BoB", region: "BoB bounding box", threshold: "+2°C vs clim.", delivery: "Email", status: "Active" },
  { name: "Thermocline depth < 60m",  region: "Arabian Sea",       threshold: "< 60 m",        delivery: "Webhook", status: "Inactive" },
];

export default function AlertsPage() {
  return (
    <AppShell>
      <div className="p-6 overflow-auto min-h-full bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>Alerts</h1>
            <p className="text-sm opacity-60 mt-1">Get notified when OceanEmbed detects anomalous subsurface conditions.</p>
          </div>
          <button className="text-xs px-3 py-1.5 rounded hairline hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors" style={{ fontFamily: "var(--font-mono)" }}>
            + New alert
          </button>
        </div>

        {/* Alert types */}
        <div className="mb-6">
          <div className="text-xs font-semibold mb-3 opacity-60 uppercase tracking-wide">Alert types</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {ALERT_TYPES.map(t => (
              <div key={t.name} className="hairline rounded-[var(--radius-md)] p-4 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
                <div className="font-medium text-sm mb-1">{t.name}</div>
                <p className="text-xs opacity-60">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Existing alerts */}
        <div>
          <div className="text-xs font-semibold mb-3 opacity-60 uppercase tracking-wide">Your alerts</div>
          <div className="hairline rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
            <table className="w-full text-xs" style={{ fontFamily: "var(--font-mono)" }}>
              <thead>
                <tr className="hairline-b bg-[var(--color-hairline)] dark:bg-[var(--color-hairline-dark)]">
                  {["Name", "Region", "Threshold", "Delivery", "Status"].map(h => (
                    <th key={h} className="text-left px-3 py-2 font-semibold opacity-70">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEMO_ALERTS.map(a => (
                  <tr key={a.name} className="hairline-b last:border-0 hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors">
                    <td className="px-3 py-2 font-medium">{a.name}</td>
                    <td className="px-3 py-2 opacity-60">{a.region}</td>
                    <td className="px-3 py-2 opacity-60">{a.threshold}</td>
                    <td className="px-3 py-2 opacity-60">{a.delivery}</td>
                    <td className="px-3 py-2">
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                        a.status === "Active" ? "text-green-700 bg-green-100" : "opacity-40 bg-gray-100"
                      }`}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
