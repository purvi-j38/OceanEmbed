import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Docs — OceanEmbed",
  description: "Documentation for OceanEmbed: methods, API reference, and data formats.",
};

const SECTIONS = [
  {
    title: "Introduction",
    items: [
      { label: "What is OceanEmbed?", anchor: "#what-is" },
      { label: "Quick start",         anchor: "#quick-start" },
      { label: "Key concepts",        anchor: "#concepts" },
    ],
  },
  {
    title: "Methods",
    items: [
      { label: "Architecture overview",  anchor: "#architecture" },
      { label: "Training procedure",     anchor: "#training" },
      { label: "Validation protocol",    anchor: "#validation" },
      { label: "Known limitations",      anchor: "#limitations" },
    ],
  },
  {
    title: "Data",
    items: [
      { label: "Input fields",          anchor: "#inputs" },
      { label: "Output fields",         anchor: "#outputs" },
      { label: "File formats",          anchor: "#formats" },
      { label: "Depth levels",          anchor: "#depths" },
    ],
  },
  {
    title: "API",
    items: [
      { label: "Authentication",        anchor: "#auth" },
      { label: "Endpoints",             anchor: "#endpoints" },
      { label: "Rate limits",           anchor: "#limits" },
      { label: "Python example",        anchor: "#python" },
    ],
  },
];

export default function DocsPage() {
  return (
    <AppShell>
      <div className="flex min-h-full">
        {/* Docs sidebar */}
        <aside className="w-48 shrink-0 hairline-r p-4 sticky top-0 h-full overflow-y-auto bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]" style={{ maxHeight: "calc(100vh - 44px)" }}>
          {SECTIONS.map(s => (
            <div key={s.title} className="mb-4">
              <div className="text-[9px] font-mono font-semibold opacity-40 uppercase tracking-[0.12em] mb-1">{s.title}</div>
              {s.items.map(item => (
                <a key={item.anchor} href={item.anchor} className="block text-xs py-1 px-2 rounded hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors opacity-80 hover:opacity-100">
                  {item.label}
                </a>
              ))}
            </div>
          ))}
        </aside>

        {/* Docs content */}
        <div className="flex-1 p-8 overflow-auto max-w-2xl" style={{ color: "var(--color-ink)" }}>
          <h1 id="what-is" className="text-3xl mb-1" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>OceanEmbed Documentation</h1>
          <p className="text-sm opacity-60 mb-8">v1.0 · Last updated September 2026</p>

          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-3">What is OceanEmbed?</h2>
            <p className="text-sm leading-relaxed opacity-80 mb-3">
              OceanEmbed is a deep-learning system that reconstructs daily 3-D subsurface ocean temperature fields (0–1000 m, 15 depth levels, 0.25° resolution) for the North Indian Ocean from surface-only satellite observations.
            </p>
            <p className="text-sm leading-relaxed opacity-80">
              The model takes two inputs: Sea Surface Temperature (SST) from CMEMS OSTIA and Sea Surface Height (SSH) from AVISO+ DUACS. It is trained against GLORYS12 reanalysis and validated against withheld ARGO float profiles.
            </p>
          </section>

          <section className="mb-10" id="quick-start">
            <h2 className="text-lg font-semibold mb-3">Quick start</h2>
            <div className="hairline rounded-[var(--radius-md)] p-4 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] text-xs font-mono whitespace-pre overflow-x-auto">{`import requests

# Get temperature profile at (12°N, 87°E) on 2023-10-15
resp = requests.get(
    "https://api.oceanembed.in/v1/profile",
    params={"lat": 12.0, "lon": 87.0, "date": "2023-10-15"},
    headers={"X-API-Key": "YOUR_KEY_HERE"},
)
data = resp.json()
# data["depths"]  → [0, 5, 10, 20, 30, 50, 75, 100, ...]
# data["temps"]   → [29.2, 29.1, 28.9, ...]`}
            </div>
          </section>

          <section className="mb-10" id="concepts">
            <h2 className="text-lg font-semibold mb-3">Key concepts</h2>
            <div className="space-y-3">
              {[
                { term: "Train / Val / Test split", def: "Data is split strictly by time: 2011–2019 training, 2020–2021 validation, 2022–2023 test. The model never sees Test data during training or hyperparameter tuning." },
                { term: "Skill score",              def: "Skill = 1 − RMSE(model)/RMSE(baseline). Positive skill means the model beats a climatological baseline. Zero = no improvement. Negative = worse than climatology." },
                { term: "Reference: GLORYS",        def: "GLORYS12 (Mercator Ocean) is the assimilative physics reanalysis used as training target. It is not used during inference." },
                { term: "Validation: ARGO",         def: "Withheld gridded Argo float profiles provide an independent ground-truth for test-period evaluation. Argo data is never seen by the model." },
              ].map(c => (
                <div key={c.term} className="hairline-l pl-4">
                  <div className="text-sm font-semibold mb-0.5">{c.term}</div>
                  <p className="text-xs opacity-70 leading-relaxed">{c.def}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="architecture" className="mb-10">
            <h2 className="text-lg font-semibold mb-3">Architecture</h2>
            <p className="text-sm opacity-80 leading-relaxed mb-3">
              OceanEmbed uses a 6-layer ConvLSTM with multi-head attention (EXP-007). The encoder ingests a (SST, SSH) pair on the 0.25° NIO grid and produces a 1024-D latent vector. A convolutional decoder then expands this to 15 temperature maps at standard depths.
            </p>
            <div className="hairline rounded-[var(--radius-md)] overflow-hidden">
              <table className="w-full text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                <tbody>
                  {[
                    ["Input channels", "2 (SST, SSH)"],
                    ["Output channels", "15 depths"],
                    ["Architecture", "ConvLSTM + Attention, 6 layers"],
                    ["Latent dim", "1024"],
                    ["Parameters", "12.4 M"],
                    ["Training epochs", "50"],
                    ["Batch size", "16"],
                    ["Optimiser", "AdamW, lr=3e-4"],
                  ].map(([k, v]) => (
                    <tr key={k} className="hairline-b last:border-0">
                      <td className="px-3 py-2 opacity-60">{k}</td>
                      <td className="px-3 py-2 font-semibold">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="limitations" className="mb-10">
            <h2 className="text-lg font-semibold mb-3">Known limitations</h2>
            <ul className="text-sm opacity-80 space-y-2 list-disc pl-5 leading-relaxed">
              <li>Performance degrades below 500m where SSH no longer carries information about thermohaline circulation.</li>
              <li>Rapid mesoscale events (eddies with &lt;5 day lifetime) may be smoothed out.</li>
              <li>Coverage is limited to the North Indian Ocean (5–30°N, 45–105°E).</li>
              <li>The model is trained against GLORYS; biases in GLORYS propagate to OceanEmbed predictions.</li>
            </ul>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
