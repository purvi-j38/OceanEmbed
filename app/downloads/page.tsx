import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Downloads & API — OceanEmbed",
  description: "Download OceanEmbed output files or access the REST API for programmatic access.",
};

const DOWNLOAD_FILES = [
  { name: "NIO_OceanEmbed_2023.nc",  size: "1.2 GB", period: "Jan–Dec 2023", format: "NetCDF-4", desc: "Full year · all 15 depths · daily · 0.25° · Test period" },
  { name: "NIO_OceanEmbed_2022.nc",  size: "1.2 GB", period: "Jan–Dec 2022", format: "NetCDF-4", desc: "Full year · all 15 depths · daily · 0.25° · Test period" },
  { name: "NIO_OceanEmbed_2020-2021.nc", size: "2.4 GB", period: "2020–2021", format: "NetCDF-4", desc: "Validation period · all 15 depths · daily" },
  { name: "NIO_OceanEmbed_2011-2019.zarr.zip", size: "8.6 GB", period: "2011–2019", format: "Zarr", desc: "Full training period · chunked by depth and month" },
];

const API_ENDPOINTS = [
  { method: "GET",  path: "/api/v1/field",   desc: "Single depth layer for a given date and layer (OceanEmbed / GLORYS / Error)" },
  { method: "GET",  path: "/api/v1/profile",  desc: "Full 0–1000m profile at a lat/lon/date" },
  { method: "GET",  path: "/api/v1/section",  desc: "2-D cross-section along a lat–lon transect" },
  { method: "GET",  path: "/api/v1/timeseries", desc: "Time series of temperature at a point and depth" },
  { method: "GET",  path: "/api/v1/metrics",  desc: "Validation metrics table" },
];

export default function DownloadsPage() {
  return (
    <AppShell>
      <div className="p-6 overflow-auto min-h-full bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]">
        <div className="mb-6">
          <h1 className="text-2xl" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>Downloads & API</h1>
          <p className="text-sm opacity-60 mt-1">
            Download NetCDF / Zarr files or use the REST API for programmatic access. Sign in required.
          </p>
        </div>

        {/* Auth banner */}
        <div className="hairline rounded-[var(--radius-md)] px-4 py-3 mb-6 flex items-center justify-between bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
          <div className="flex items-center gap-2 text-sm">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-60">
              <rect x="1" y="6" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <path d="M4 6V4.5a3 3 0 016 0V6" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span>Downloads and API keys require a free account.</span>
          </div>
          <a href="/sign-in" className="text-xs px-3 py-1 rounded hairline hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors" style={{ fontFamily: "var(--font-mono)" }}>
            Sign in →
          </a>
        </div>

        {/* Downloads */}
        <div className="mb-8">
          <div className="text-xs font-semibold mb-3 opacity-60 uppercase tracking-wide">Available files</div>
          <div className="space-y-2">
            {DOWNLOAD_FILES.map(f => (
              <div key={f.name} className="hairline rounded-[var(--radius-md)] p-4 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] flex items-center gap-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 opacity-40">
                  <rect x="3" y="2" width="18" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M7 10h10M7 14h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M14 2v5h5" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm font-semibold truncate">{f.name}</div>
                  <div className="text-xs opacity-60 mt-0.5">{f.desc}</div>
                </div>
                <div className="shrink-0 text-right text-xs font-mono opacity-60">
                  <div>{f.size}</div>
                  <div className="opacity-70">{f.format}</div>
                </div>
                <button
                  disabled
                  title="Sign in to download"
                  className="shrink-0 px-3 py-1.5 text-xs rounded hairline opacity-40 cursor-not-allowed"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* API reference */}
        <div>
          <div className="text-xs font-semibold mb-3 opacity-60 uppercase tracking-wide">REST API reference</div>
          <div className="hairline rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
            <div className="px-4 py-2 hairline-b text-[10px] font-mono opacity-50">Base URL: https://api.oceanembed.in/v1 (not yet live)</div>
            {API_ENDPOINTS.map(ep => (
              <div key={ep.path} className="hairline-b last:border-0 px-4 py-3 flex items-center gap-3">
                <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                  ep.method === "GET" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                }`}>{ep.method}</span>
                <code className="text-xs font-mono flex-1" style={{ color: "var(--color-accent)" }}>{ep.path}</code>
                <span className="text-xs opacity-60">{ep.desc}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[10px] font-mono opacity-40">
            API keys are issued after sign-up. Rate limit: 1000 req/day for free tier, unlimited for registered research institutions.
          </div>
        </div>
      </div>
    </AppShell>
  );
}
