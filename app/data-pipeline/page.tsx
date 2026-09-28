import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Data & Pipeline — OceanEmbed",
  description: "Architecture of the OceanEmbed data pipeline, from raw satellite downloads to model-ready inputs.",
};

const PIPELINE_STEPS = [
  {
    id: "01", name: "Satellite ingestion",
    desc: "Daily CMEMS L4 SST (OSTIA, 0.05°) and AVISO+ DUACS SSH (0.25°) are downloaded via FTP/API.",
    sources: ["CMEMS L4 SST", "AVISO+ DUACS SSH"],
    format: "NetCDF-4",
    resolution: "0.05° / 0.25°",
    latency: "T+1 day",
  },
  {
    id: "02", name: "Regridding & QC",
    desc: "Both fields are bilinearly interpolated to the 0.25° NIO grid (5–30°N, 45–105°E, 101×241 cells). Land-masked cells are set to NaN.",
    sources: ["Grid: 0.25° NIO"],
    format: "NumPy .npy",
    resolution: "0.25°",
    latency: "T+1.5 day",
  },
  {
    id: "03", name: "Normalisation",
    desc: "Per-pixel z-score normalisation using statistics computed from the 2011–2019 training period only (to prevent data leakage).",
    sources: ["Training stats"],
    format: "Zarr array",
    resolution: "0.25°",
    latency: "T+1.5 day",
  },
  {
    id: "04", name: "Model inference",
    desc: "OceanEmbed ConvLSTM-Attention (EXP-007) ingests the normalised (SST, SSH) pair and outputs 15 temperature layers at depths 0–1000m.",
    sources: ["OceanEmbed v1.0"],
    format: "Float32 tensor",
    resolution: "0.25° × 15 depths",
    latency: "T+2 day",
  },
  {
    id: "05", name: "Post-processing & storage",
    desc: "Output is de-normalised, land-masked, and written to Zarr (for internal use) and NetCDF-4 (for download). Statistics and QC flags are computed.",
    sources: ["GLORYS comparison"],
    format: "Zarr + NetCDF-4",
    resolution: "0.25° × 15 depths",
    latency: "T+2 day",
  },
];

const DATA_SOURCES = [
  { name: "CMEMS L4 SST",    full: "Copernicus Marine Service OSTIA L4 Fusion SST",    res: "0.05° daily", period: "2011–present" },
  { name: "AVISO+ DUACS SSH", full: "DUACS Delayed-Time L4 Sea Level Anomaly",           res: "0.25° daily", period: "1993–present" },
  { name: "GLORYS12",         full: "Global Ocean Physics Reanalysis (Mercator Ocean)",  res: "0.083° daily", period: "1993–2022" },
  { name: "ARGO",             full: "Argo float temperature profiles",                   res: "Point measurements", period: "2000–present" },
];

export default function DataPipelinePage() {
  return (
    <AppShell>
      <div className="p-6 overflow-auto min-h-full bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]">
        <div className="mb-6">
          <h1 className="text-2xl" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>Data & Pipeline</h1>
          <p className="text-sm opacity-60 mt-1">
            Complete data lineage from raw satellite downloads to the 3-D temperature fields served by OceanEmbed.
          </p>
        </div>

        {/* Info strip */}
        <div className="hairline rounded px-4 py-2 mb-6 text-xs bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] opacity-80">
          <strong>What am I looking at?</strong> This is the full data pipeline that transforms raw satellite observations into the daily 3-D temperature fields you see in the Explorer.
          Only two surface fields (SST and SSH) are used as model inputs — no in-situ or subsurface observations are provided during inference.
        </div>

        {/* Pipeline diagram */}
        <div className="mb-8">
          <div className="text-xs font-semibold mb-3 opacity-60 uppercase tracking-wide">Pipeline steps</div>
          <div className="space-y-2">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={step.id} className="flex gap-4">
                {/* Step number and connector */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-semibold text-white shrink-0" style={{ background: "var(--color-accent)" }}>
                    {step.id}
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ background: "var(--color-hairline)", minHeight: 12 }} />}
                </div>

                <div className="hairline rounded-[var(--radius-md)] p-4 flex-1 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] mb-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-sm">{step.name}</div>
                    <span className="text-[9px] font-mono opacity-50">{step.latency}</span>
                  </div>
                  <p className="text-xs opacity-70 mb-3">{step.desc}</p>
                  <div className="flex gap-4 text-[10px] font-mono">
                    <span><span className="opacity-50">Format:</span> {step.format}</span>
                    <span><span className="opacity-50">Res:</span> {step.resolution}</span>
                    {step.sources.map(s => (
                      <span key={s} className="px-1.5 py-0.5 rounded" style={{ background: "var(--color-accent-light)" + "20", color: "var(--color-accent)" }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data sources table */}
        <div className="mb-6">
          <div className="text-xs font-semibold mb-3 opacity-60 uppercase tracking-wide">Data sources</div>
          <div className="hairline rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
            <table className="w-full text-xs" style={{ fontFamily: "var(--font-mono)" }}>
              <thead>
                <tr className="hairline-b bg-[var(--color-hairline)] dark:bg-[var(--color-hairline-dark)]">
                  {["Short name", "Full name", "Resolution", "Period"].map(h => (
                    <th key={h} className="text-left px-3 py-2 font-semibold opacity-70">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DATA_SOURCES.map(ds => (
                  <tr key={ds.name} className="hairline-b last:border-0 hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors">
                    <td className="px-3 py-2 font-semibold">{ds.name}</td>
                    <td className="px-3 py-2 opacity-70">{ds.full}</td>
                    <td className="px-3 py-2 opacity-60">{ds.res}</td>
                    <td className="px-3 py-2 opacity-60">{ds.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-[10px] font-mono opacity-40">
          All source data are used under their respective open-access licences (CMEMS, AVISO+, Argo GDAC). GLORYS is used as target variable for training; it is not used during inference.
        </div>
      </div>
    </AppShell>
  );
}
