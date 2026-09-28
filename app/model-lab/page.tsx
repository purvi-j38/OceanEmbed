import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Model Lab — OceanEmbed",
  description: "Training runs, ablation studies and hyperparameter searches for OceanEmbed.",
};

const EXPERIMENTS = [
  // id, name, arch, inputs, rmse100, skill, decision, note
  { id: "EXP-017", name: "Final — ConvLSTM-Attn 6L, all 7 inputs", arch: "ConvLSTM-Attn 6L", inputs: "SST+SLA+SSS+cU+cV+wU+wV", rmse100: 1.08, skill: 0.47, decision: "Keep", note: "Submitted model" },
  { id: "EXP-016", name: "Drop wind V",                              arch: "ConvLSTM-Attn 6L", inputs: "SST+SLA+SSS+cU+cV+wU",   rmse100: 1.14, skill: 0.44, decision: "Drop", note: "Wind V adds curl info" },
  { id: "EXP-015", name: "Drop wind U",                              arch: "ConvLSTM-Attn 6L", inputs: "SST+SLA+SSS+cU+cV+wV",   rmse100: 1.13, skill: 0.44, decision: "Drop", note: "Wind U pairs with V" },
  { id: "EXP-014", name: "Drop current V",                           arch: "ConvLSTM-Attn 6L", inputs: "SST+SLA+SSS+cU+wU+wV",   rmse100: 1.19, skill: 0.42, decision: "Drop", note: "Current V necessary" },
  { id: "EXP-013", name: "Drop current U",                           arch: "ConvLSTM-Attn 6L", inputs: "SST+SLA+SSS+cV+wU+wV",   rmse100: 1.18, skill: 0.42, decision: "Drop", note: "Current U necessary" },
  { id: "EXP-012", name: "Drop SSS",                                 arch: "ConvLSTM-Attn 6L", inputs: "SST+SLA+cU+cV+wU+wV",    rmse100: 1.23, skill: 0.40, decision: "Drop", note: "SSS adds barrier layer signal" },
  { id: "EXP-011", name: "Drop SLA",                                 arch: "ConvLSTM-Attn 6L", inputs: "SST+SSS+cU+cV+wU+wV",    rmse100: 1.34, skill: 0.35, decision: "Drop", note: "SLA critical for thermocline depth" },
  { id: "EXP-010", name: "Drop SST",                                 arch: "ConvLSTM-Attn 6L", inputs: "SLA+SSS+cU+cV+wU+wV",    rmse100: 1.71, skill: 0.17, decision: "Drop", note: "SST is primary signal" },
  { id: "EXP-009", name: "8-layer model",                            arch: "ConvLSTM-Attn 8L", inputs: "All 7",                   rmse100: 1.12, skill: 0.45, decision: "Drop", note: "Over-fits val; 6L sufficient" },
  { id: "EXP-008", name: "4-layer model",                            arch: "ConvLSTM-Attn 4L", inputs: "All 7",                   rmse100: 1.19, skill: 0.42, decision: "Drop", note: "Underfits deep levels" },
  { id: "EXP-007", name: "No attention (pure ConvLSTM)",             arch: "ConvLSTM 6L",      inputs: "All 7",                   rmse100: 1.21, skill: 0.41, decision: "Drop", note: "Attention adds +0.06 skill" },
  { id: "EXP-006", name: "Channels 32 (half width)",                 arch: "ConvLSTM-Attn 6L", inputs: "All 7",                   rmse100: 1.19, skill: 0.42, decision: "Drop", note: "Channels 64 keeps more structure" },
  { id: "EXP-005", name: "Channels 128 (double width)",              arch: "ConvLSTM-Attn 6L", inputs: "All 7",                   rmse100: 1.09, skill: 0.47, decision: "Drop", note: "Same skill, 4× compute" },
  { id: "EXP-004", name: "Residual connections",                     arch: "ResConvLSTM 6L",   inputs: "All 7",                   rmse100: 1.10, skill: 0.46, decision: "Drop", note: "Marginal gain, added complexity" },
  { id: "EXP-003", name: "U-Net decoder",                            arch: "ConvLSTM+UNet",    inputs: "All 7",                   rmse100: 1.11, skill: 0.46, decision: "Drop", note: "Skip connections help surface; neutral deep" },
  { id: "EXP-002", name: "ConvLSTM 6L, first run (SST+SLA only)",   arch: "ConvLSTM 6L",      inputs: "SST+SLA",                 rmse100: 1.38, skill: 0.33, decision: "Drop", note: "Starting point — too few inputs" },
  { id: "EXP-001", name: "Baseline MLP",                             arch: "MLP",              inputs: "SST+SLA",                 rmse100: 2.05, skill: 0.00, decision: "Drop", note: "No spatial context; reference only" },
];

const ABLATION = [
  { input: "SST (OSTIA)",       abbr: "SST", rmseWith: 1.08, rmseWithout: 1.71, delta: "+0.63", essential: true  },
  { input: "SLA (DUACS)",       abbr: "SLA", rmseWith: 1.08, rmseWithout: 1.34, delta: "+0.26", essential: true  },
  { input: "SSS (multi-obs)",   abbr: "SSS", rmseWith: 1.08, rmseWithout: 1.23, delta: "+0.15", essential: true  },
  { input: "Current U (OSCAR)", abbr: "cU",  rmseWith: 1.08, rmseWithout: 1.18, delta: "+0.10", essential: true  },
  { input: "Current V (OSCAR)", abbr: "cV",  rmseWith: 1.08, rmseWithout: 1.19, delta: "+0.11", essential: true  },
  { input: "Wind U (CCMP)",     abbr: "wU",  rmseWith: 1.08, rmseWithout: 1.13, delta: "+0.05", essential: true  },
  { input: "Wind V (CCMP)",     abbr: "wV",  rmseWith: 1.08, rmseWithout: 1.14, delta: "+0.06", essential: true  },
];

const TRAINING_CURVE = [
  [1, 2.4, 2.6], [5, 1.8, 2.1], [10, 1.5, 1.85], [20, 1.3, 1.65],
  [30, 1.18, 1.52], [40, 1.12, 1.45], [50, 1.08, 1.41],
];

function decisionStyle(d: string) {
  return d === "Keep"
    ? { color: "#2D6A4F", bg: "#D8F3DC" }
    : { color: "#9B2226", bg: "#FBDDDD" };
}

export default function ModelLabPage() {
  const maxSkill = 0.5;

  return (
    <AppShell>
      <div className="p-6 overflow-auto min-h-full bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>Model Lab</h1>
          <p className="text-sm opacity-60 mt-1">
            Lab notebook — 17 experiments showing every architectural and input decision. All runs use the same train/val/test split.
          </p>
        </div>

        {/* Interpretation */}
        <div className="hairline rounded-[var(--radius-md)] px-4 py-2 mb-6 text-xs bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] opacity-80 leading-relaxed">
          <strong>Reading the table:</strong> &quot;Keep&quot; = decision folded into the next run. &quot;Drop&quot; = change reverted.
          Skill&nbsp;=&nbsp;1&nbsp;−&nbsp;RMSE(model)&nbsp;/&nbsp;RMSE(MLP baseline) at 100 m. Higher is better.
          EXP-017 is the submitted model. EXP-010 through EXP-016 are input ablations — each drops one of the seven inputs.
        </div>

        {/* Summary charts: skill bar + training curve */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">

          {/* Skill bar chart */}
          <div className="hairline rounded-[var(--radius-md)] p-4 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
            <div className="text-[10px] font-mono opacity-50 mb-3 uppercase tracking-wide">Skill score @ 100m — all experiments</div>
            <div className="space-y-1.5">
              {EXPERIMENTS.map(e => {
                const sc = decisionStyle(e.decision);
                return (
                  <div key={e.id} className="flex items-center gap-2">
                    <div className="text-[9px] font-mono opacity-50 w-14 shrink-0">{e.id}</div>
                    <div className="flex-1 flex items-center gap-1">
                      <div
                        className="h-3 rounded-[2px] min-w-[2px] transition-all"
                        style={{ width: `${(e.skill / maxSkill) * 100}%`, background: sc.color, opacity: e.decision === "Keep" ? 1 : 0.5 }}
                      />
                      <span className="text-[9px] font-mono tabnum" style={{ color: sc.color }}>{e.skill.toFixed(2)}</span>
                    </div>
                    <span className="text-[8px] font-mono px-1 py-0.5 rounded shrink-0" style={{ color: sc.color, background: sc.bg }}>
                      {e.decision}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Training curve EXP-017 */}
          <div className="hairline rounded-[var(--radius-md)] p-4 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
            <div className="text-[10px] font-mono opacity-50 mb-3 uppercase tracking-wide">Training curve — RMSE vs epoch · EXP-017</div>
            <svg viewBox="0 0 300 160" style={{ width: "100%", height: 140 }}>
              {[1.0, 1.5, 2.0, 2.5].map(v => (
                <g key={v}>
                  <line x1={30} y1={(2.6 - v) / 1.6 * 140} x2={290} y2={(2.6 - v) / 1.6 * 140} stroke="currentColor" strokeOpacity={0.07} strokeWidth={1} />
                  <text x={25} y={(2.6 - v) / 1.6 * 140 + 3} textAnchor="end" style={{ fontFamily: "var(--font-mono)", fontSize: 7, opacity: 0.5 }}>{v}</text>
                </g>
              ))}
              <polyline
                points={TRAINING_CURVE.map(([e, tr]) => `${30 + (e / 50) * 260},${(2.6 - tr) / 1.6 * 140}`).join(" ")}
                fill="none" stroke="#1B4F72" strokeWidth={2}
              />
              <polyline
                points={TRAINING_CURVE.map(([e, , vl]) => `${30 + (e / 50) * 260},${(2.6 - vl) / 1.6 * 140}`).join(" ")}
                fill="none" stroke="#B7791F" strokeWidth={1.5} strokeDasharray="5 3"
              />
              <text x={260} y={(2.6 - 1.08) / 1.6 * 140 - 4} style={{ fontFamily: "var(--font-mono)", fontSize: 7, fill: "#1B4F72" }}>Train</text>
              <text x={260} y={(2.6 - 1.41) / 1.6 * 140 - 4} style={{ fontFamily: "var(--font-mono)", fontSize: 7, fill: "#B7791F" }}>Val</text>
              <text x={160} y={155} textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 7, opacity: 0.5 }}>Epoch</text>
            </svg>
          </div>
        </div>

        {/* Input ablation table */}
        <div className="hairline rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] mb-8">
          <div className="p-3 hairline-b text-[10px] font-mono opacity-50 uppercase tracking-widest">
            Input ablation — RMSE @ 100m when each input is dropped (EXP-010 to EXP-016)
          </div>
          <table className="w-full text-xs" style={{ fontFamily: "var(--font-mono)" }}>
            <thead>
              <tr className="hairline-b bg-[var(--color-hairline)] dark:bg-[var(--color-hairline-dark)]">
                {["Input", "Abbr.", "RMSE with", "RMSE without", "Δ RMSE", "Essential?"].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-semibold opacity-70">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ABLATION.map(r => (
                <tr key={r.abbr} className="hairline-b last:border-0 hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors">
                  <td className="px-3 py-2">{r.input}</td>
                  <td className="px-3 py-2 font-semibold">{r.abbr}</td>
                  <td className="px-3 py-2 tabnum" style={{ color: "var(--color-success)" }}>{r.rmseWith} °C</td>
                  <td className="px-3 py-2 tabnum" style={{ color: "var(--color-error)" }}>{r.rmseWithout} °C</td>
                  <td className="px-3 py-2 tabnum font-semibold" style={{ color: "var(--color-error)" }}>{r.delta}</td>
                  <td className="px-3 py-2">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ color: "#2D6A4F", background: "#D8F3DC" }}>
                      Yes
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Full experiment log */}
        <div className="hairline rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
          <div className="p-3 hairline-b text-[10px] font-mono opacity-50 uppercase tracking-widest">Full experiment log — 17 runs</div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[800px]" style={{ fontFamily: "var(--font-mono)" }}>
              <thead>
                <tr className="hairline-b bg-[var(--color-hairline)] dark:bg-[var(--color-hairline-dark)]">
                  {["ID", "Description", "Architecture", "Inputs", "RMSE @ 100m", "Skill", "Decision", "Note"].map(h => (
                    <th key={h} className="text-left px-3 py-2 font-semibold opacity-70 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EXPERIMENTS.map(e => {
                  const dc = decisionStyle(e.decision);
                  const isBest = e.id === "EXP-017";
                  return (
                    <tr
                      key={e.id}
                      className={`hairline-b last:border-0 transition-colors ${isBest ? "bg-[#D8F3DC] dark:bg-[#0a2210]" : "hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)]"}`}
                    >
                      <td className="px-3 py-2 font-semibold opacity-70 whitespace-nowrap">{e.id}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{e.name}</td>
                      <td className="px-3 py-2 opacity-60 whitespace-nowrap">{e.arch}</td>
                      <td className="px-3 py-2 opacity-60 text-[9px] whitespace-nowrap">{e.inputs}</td>
                      <td className="px-3 py-2 tabnum whitespace-nowrap" style={{ color: "var(--color-oceanembed)" }}>{e.rmse100} °C</td>
                      <td className="px-3 py-2 tabnum whitespace-nowrap" style={{ color: e.skill > 0.3 ? "var(--color-success)" : "var(--color-warning)" }}>{e.skill.toFixed(2)}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ color: dc.color, background: dc.bg }}>
                          {e.decision}
                        </span>
                      </td>
                      <td className="px-3 py-2 opacity-60 text-[10px]">{e.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-[10px] font-mono opacity-40 mt-3">
          All runs: Train 2011–2019, Val 2020–2021, Test 2022–2023. RMSE at 100 m vs withheld gridded ARGO.
          Skill = 1 − RMSE(model) / RMSE(EXP-001 MLP baseline).
        </div>
      </div>
    </AppShell>
  );
}
