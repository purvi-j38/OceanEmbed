import type { Metadata } from "next";
import { PublicFooter } from "@/components/layout/PublicFooter";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Limitations — OceanEmbed",
  description: "Known limitations of the OceanEmbed subsurface temperature reconstruction.",
};

const LIMITS = [
  {
    title: "Skill decreases with depth.",
    body: "The surface satellite observations constrain the ocean near the surface directly. The connection to 500–1000 m depends on learned statistical relationships. RMSE is lowest at 0 m (where SST is observed directly) and peaks near the thermocline (~100–150 m). This is expected and not hidden.",
    action: "What we do: report per-depth RMSE and skill score. The Validation page shows the full error-vs-depth curve.",
  },
  {
    title: "Training data ends in late 2021.",
    body: "The model was trained on 2018–2021. Dates in that range are marked \"in training period\" in every view. Generalisation to future dates and extreme events has not been evaluated beyond the 2023 test year.",
    action: "What we do: show an in-sample badge whenever a training-period date is on screen. The time scrubber colour-codes train / validation / test.",
  },
  {
    title: "ARGO validation uses gridded, not raw, floats.",
    body: "The validation target is a spatially smoothed gridded ARGO product. Individual float profiles are sharper. The gridded product suppresses mesoscale features and may understate skill for eddies and fronts.",
    action: "What we do: note this on the Profile Viewer and Validation pages. Cite the smoothing.",
  },
  {
    title: "Salinity may be interpolated.",
    body: "Multi-observation sea surface salinity has gaps in some regions and seasons. Interpolated input cells are flagged in the surface-input panel of the Inspector.",
    action: "What we do: propagate flags from the pipeline to the Inspector mini-map.",
  },
  {
    title: "No eddy tracking or bathymetric correction.",
    body: "The model learns average statistical relationships. It does not explicitly track eddies or account for bathymetry. Regions with complex topography (for example the Andaman Sea) are less reliable.",
    action: "What we do: acknowledge this in regional documentation. Future work: bathymetry as an auxiliary input.",
  },
  {
    title: "Not intended for operational use without further validation.",
    body: "This is a research prototype developed for SIH 2026. It has not been evaluated against real-time ARGO or validated for fisheries or disaster forecasting decisions.",
    action: "What we do: display this warning prominently in the footer and on the Landing page.",
  },
];

export default function LimitationsPage() {
  return (
    <div
      className="min-h-screen bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] text-[var(--color-ink)] dark:text-[var(--color-ink-dark)]"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <header className="hairline-b bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
        <div className="max-w-3xl mx-auto px-6 h-11 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
              <path d="M2 14 Q6 6 11 10 Q16 14 20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
            OceanEmbed
          </Link>
          <nav className="flex gap-4 text-xs opacity-70">
            <Link href="/methodology" className="hover:opacity-100 transition-opacity">Methodology</Link>
            <Link href="/validation" className="hover:opacity-100 transition-opacity">Validation</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-14">
        <div className="mb-10">
          <div className="text-xs font-mono opacity-50 tracking-widest mb-3 uppercase">Transparency</div>
          <h1 className="text-3xl mb-4" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>Limitations</h1>
          <p className="text-sm opacity-70 leading-relaxed max-w-xl">
            Stating what we do not know reads as confidence, not weakness.
            Each limitation is paired with what the interface does to acknowledge it.
          </p>
        </div>

        <div className="flex flex-col gap-0">
          {LIMITS.map((l, i) => (
            <div key={i} className="hairline-b py-7 last:border-0">
              <h2 className="text-base font-semibold mb-2">{l.title}</h2>
              <p className="text-sm opacity-75 leading-relaxed mb-3 max-w-prose">{l.body}</p>
              <div
                className="text-xs font-mono p-3 rounded-[var(--radius-sm)]"
                style={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-hairline)",
                  color: "var(--color-accent)",
                }}
              >
                <span className="opacity-60 mr-2">▸</span>{l.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
