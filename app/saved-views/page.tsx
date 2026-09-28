import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Saved Views — OceanEmbed",
  description: "Your bookmarked Explorer states and saved map views.",
};

const DEMO_VIEWS = [
  { name: "Bay of Bengal 100m — Oct 2023",      url: "/explore?lat=12&lon=87&depth=100&date=2023-10-15",             tags: ["Explorer", "Test"] },
  { name: "Arabian Sea upwelling — Jul 2023",   url: "/explore?lat=15&lon=60&depth=50&date=2023-07-10&layer=Error", tags: ["Explorer", "Error layer"] },
  { name: "Monsoon thermocline cross-section",  url: "/cross-sections?date=2023-07-01",                              tags: ["Cross-section"] },
  { name: "BoB time–depth full record",         url: "/time-depth?lat=12&lon=87",                                    tags: ["Hovmöller"] },
];

export default function SavedViewsPage() {
  return (
    <AppShell>
      <div className="p-6 overflow-auto min-h-full bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>Saved Views</h1>
            <p className="text-sm opacity-60 mt-1">Bookmarked Explorer states. Click to reopen.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DEMO_VIEWS.map(v => (
            <Link
              key={v.name}
              href={v.url}
              className="hairline rounded-[var(--radius-md)] p-4 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors block"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-medium text-sm">{v.name}</div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mt-0.5 opacity-40 shrink-0">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-[10px] font-mono opacity-50 truncate mb-2">{v.url}</div>
              <div className="flex gap-1 flex-wrap">
                {v.tags.map(t => (
                  <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded hairline opacity-60">{t}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <p className="text-[10px] font-mono opacity-40 mt-6">
          Views are saved in your account. Use the bookmark icon (⌘+S) in any page to save the current state.
        </p>
      </div>
    </AppShell>
  );
}
