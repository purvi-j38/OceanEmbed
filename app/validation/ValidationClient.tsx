"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { getValidation, METRICS_TABLE } from "@/lib/mock/engine";

const ValidationChart = dynamic(() => import("./ValidationChart"), { ssr: false });

const BASINS   = ["All NIO", "Bay of Bengal", "Arabian Sea"];
const SEASONS  = ["Annual", "SW monsoon", "NE monsoon", "Inter-monsoon"];
const D_RANGES = ["All depths", "Surface (0–30m)", "Thermocline (30–200m)", "Deep (200–1000m)"];

export function ValidationClient() {
  const [basin,   setBasin]   = useState("All NIO");
  const [season,  setSeason]  = useState("Annual");
  const [dRange,  setDRange]  = useState("All depths");
  const [metricView, setMetricView] = useState<"rmse" | "corr" | "skill">("rmse");

  const metrics = getValidation({ basin, season, depthRange: dRange });

  const filteredMetrics = metrics.filter(m => {
    if (dRange === "Surface (0–30m)")       return m.depth <= 30;
    if (dRange === "Thermocline (30–200m)") return m.depth > 30 && m.depth <= 200;
    if (dRange === "Deep (200–1000m)")      return m.depth > 200;
    return true;
  });

  return (
    <div className="flex flex-col h-full overflow-auto bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]">

      {/* Header */}
      <div className="shrink-0 hairline-b bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Validation Metrics</h1>
            <p className="text-xs opacity-60 mt-0.5">
              OceanEmbed vs withheld gridded ARGO · Test period 2022–2023 · 0.25° NIO grid
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="px-2 py-0.5 rounded border" style={{ color: "#6B2D8B", background: "#F3E5F580", borderColor: "#6B2D8B60" }}>
              Test period · blind evaluation
            </span>
          </div>
        </div>
      </div>

      {/* Info strip */}
      <div className="shrink-0 hairline-b px-6 py-2 text-xs opacity-70 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
        <strong>What am I looking at?</strong> These are the headline performance numbers from the blind evaluation on the Test set (Jan 2022 – Dec 2023).
        The model never saw Test data during training. Reference is withheld gridded ARGO floats.
        Lower RMSE and higher Skill are better. Skill = 1 − RMSE(model)/RMSE(baseline).
      </div>

      {/* Filters */}
      <div className="shrink-0 hairline-b px-6 py-3 flex items-center gap-4 flex-wrap bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
        {[
          { label: "Basin",       options: BASINS,   val: basin,  set: setBasin  },
          { label: "Season",      options: SEASONS,  val: season, set: setSeason },
          { label: "Depth range", options: D_RANGES, val: dRange, set: setDRange },
        ].map(f => (
          <div key={f.label} className="flex items-center gap-2">
            <span className="text-[10px] font-mono opacity-50">{f.label.toUpperCase()}</span>
            <div className="flex gap-1">
              {f.options.map(o => (
                <button
                  key={o}
                  id={`val-filter-${o.toLowerCase().replace(/\s/g, "-")}`}
                  onClick={() => f.set(o)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded hairline transition-colors ${
                    f.val === o
                      ? "bg-[var(--color-accent)] text-white border-transparent"
                      : "hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)]"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="ml-auto flex gap-1">
          {(["rmse", "corr", "skill"] as const).map(v => (
            <button
              key={v}
              id={`val-metric-${v}`}
              onClick={() => setMetricView(v)}
              className={`text-[10px] font-mono px-2 py-0.5 rounded hairline transition-colors uppercase ${
                metricView === v
                  ? "bg-[var(--color-accent)] text-white border-transparent"
                  : "hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)]"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="shrink-0 px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Surface RMSE (0 m)",   val: `${filteredMetrics.find(m=>m.depth===0)?.oeRmse ?? 0.41} °C`,  sub: "OceanEmbed", color: "var(--color-oceanembed)" },
          { label: "Thermocline RMSE (100m)", val: `${filteredMetrics.find(m=>m.depth===100)?.oeRmse ?? 1.08} °C`, sub: "OceanEmbed", color: "var(--color-oceanembed)" },
          { label: "Skill score (100m)",    val: `${filteredMetrics.find(m=>m.depth===100)?.skill ?? 0.47}`,    sub: "vs climatology", color: "var(--color-success)" },
          { label: "Correlation (100m)",    val: `${filteredMetrics.find(m=>m.depth===100)?.corr ?? 0.84}`,     sub: "r-value", color: "var(--color-accent)" },
        ].map(c => (
          <div key={c.label} className="hairline rounded-[var(--radius-md)] p-3 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
            <div className="text-xs opacity-60 mb-1">{c.label}</div>
            <div className="text-2xl font-semibold" style={{ color: c.color, fontFamily: "var(--font-mono)" }}>{c.val}</div>
            <div className="text-[10px] opacity-50 mt-0.5">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="shrink-0 px-6" style={{ height: 320 }}>
        <ValidationChart metrics={filteredMetrics} metricView={metricView} />
      </div>

      {/* Full table */}
      <div className="px-6 pb-6 mt-4">
        <div className="text-xs font-semibold mb-2 opacity-60">Full metrics table — Test period · {basin} · {season}</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs hairline rounded-[var(--radius-md)] overflow-hidden" style={{ fontFamily: "var(--font-mono)" }}>
            <thead>
              <tr className="bg-[var(--color-hairline)] dark:bg-[var(--color-hairline-dark)]">
                {["Depth (m)", "OE RMSE", "GLORYS RMSE", "Baseline RMSE", "MAE", "Skill", "Corr"].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-semibold opacity-70">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredMetrics.map(row => (
                <tr key={row.depth} className="hairline-b hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors">
                  <td className="px-3 py-1.5 font-semibold">{row.depth}</td>
                  <td className="px-3 py-1.5" style={{ color: "var(--color-oceanembed)" }}>{row.oeRmse}</td>
                  <td className="px-3 py-1.5" style={{ color: "var(--color-glorys)" }}>{row.glorysRmse}</td>
                  <td className="px-3 py-1.5 opacity-60">{row.baseRmse}</td>
                  <td className="px-3 py-1.5">{row.mae}</td>
                  <td className="px-3 py-1.5" style={{ color: row.skill > 0.4 ? "var(--color-success)" : row.skill > 0.2 ? "var(--color-warning)" : "var(--color-error)" }}>
                    {row.skill.toFixed(2)}
                  </td>
                  <td className="px-3 py-1.5">{row.corr.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-[10px] font-mono opacity-40 mt-2">
          RMSE and MAE in °C. Skill = 1 − RMSE(OceanEmbed) / RMSE(baseline). Reference: withheld gridded ARGO. Test period: Jan 2022 – Dec 2023.
        </div>
      </div>
    </div>
  );
}
