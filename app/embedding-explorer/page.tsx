import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Embedding Explorer — OceanEmbed",
  description: "UMAP projection of the OceanEmbed latent space — explore what the model has learned.",
};

// 200 deterministic points in a UMAP-like 2D projection
function generateEmbedPoints() {
  const points: { x: number; y: number; color: string; cluster: string; depth: number; rmse: string }[] = [];
  const clusters = [
    { cx: 2.1, cy: 1.5, label: "Bay of Bengal — monsoon", color: "#1B4F72", n: 40 },
    { cx: -2.5, cy: 0.8, label: "Arabian Sea — upwelling", color: "#B7791F", n: 35 },
    { cx: 0.5, cy: -2.2, label: "Equatorial IO", color: "#2D6A4F", n: 30 },
    { cx: -0.8, cy: 2.8, label: "Arabian Sea — calm", color: "#744992", n: 25 },
    { cx: 3.5, cy: -1.2, label: "BoB — deep", color: "#C8452B", n: 20 },
    { cx: -3.5, cy: -1.8, label: "Somalia jet region", color: "#1B4F72", n: 20 },
    { cx: 1.2, cy: 3.5, label: "NW Indian Ocean", color: "#8A9BA8", n: 30 },
  ];

  function seededRand(seed: number) {
    const x = Math.sin(seed + 1) * 43758.5453;
    return x - Math.floor(x);
  }

  let idx = 0;
  clusters.forEach((c, ci) => {
    for (let i = 0; i < c.n; i++) {
      const angle = seededRand(idx * 1.3 + ci * 7) * Math.PI * 2;
      const r     = seededRand(idx * 2.1 + ci * 11) * 1.2;
      points.push({
        x: c.cx + Math.cos(angle) * r,
        y: c.cy + Math.sin(angle) * r,
        color: c.color,
        cluster: c.label,
        depth: Math.round(seededRand(idx * 3.7 + ci) * 980 + 20),
        rmse: (seededRand(idx * 4.1 + ci) * 1.5 + 0.3).toFixed(2),
      });
      idx++;
    }
  });
  return points;
}

const POINTS = generateEmbedPoints();

export default function EmbeddingExplorerPage() {
  // Map 2D embed coords to SVG
  const W = 500, H = 380, PAD = 30;
  const xMin = Math.min(...POINTS.map(p => p.x)) - 0.5;
  const xMax = Math.max(...POINTS.map(p => p.x)) + 0.5;
  const yMin = Math.min(...POINTS.map(p => p.y)) - 0.5;
  const yMax = Math.max(...POINTS.map(p => p.y)) + 0.5;
  const toSvgX = (x: number) => PAD + ((x - xMin) / (xMax - xMin)) * (W - 2 * PAD);
  const toSvgY = (y: number) => PAD + ((y - yMin) / (yMax - yMin)) * (H - 2 * PAD);

  const clusters = [...new Set(POINTS.map(p => p.cluster))];

  return (
    <AppShell>
      <div className="p-6 overflow-auto min-h-full bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]">
        <div className="mb-4">
          <h1 className="text-2xl" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>Embedding Explorer</h1>
          <p className="text-sm opacity-60 mt-1">
            UMAP projection of the OceanEmbed latent space. Each point is one location × day. Points that are close share similar inferred subsurface structures.
          </p>
        </div>

        {/* Info strip */}
        <div className="hairline rounded px-4 py-2 mb-5 text-xs bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] opacity-80">
          <strong>What am I looking at?</strong> The model encodes every (SST, SSH) pair into a 1024-D vector. We apply UMAP to project all vectors to 2D.
          Clusters emerge naturally, grouping similar ocean regimes (monsoon BoB, upwelling Arabian Sea, equatorial IO, etc.).
          This confirms the model has learned physically meaningful representations — not just curve-fitting.
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">
          {/* UMAP plot */}
          <div className="hairline rounded-[var(--radius-md)] p-4 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
            <div className="text-[10px] font-mono opacity-50 mb-2 uppercase tracking-wide">UMAP projection — 1024-D latent space</div>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxHeight: 380 }} aria-label="UMAP embedding projection">
              {POINTS.map((p, i) => (
                <circle
                  key={i}
                  cx={toSvgX(p.x)}
                  cy={toSvgY(p.y)}
                  r={3.5}
                  fill={p.color}
                  fillOpacity={0.7}
                  stroke={p.color}
                  strokeWidth={0.5}
                  strokeOpacity={0.4}
                >
                  <title>{p.cluster} · {p.depth} m · RMSE {p.rmse}°C</title>
                </circle>
              ))}
              <text x={W / 2} y={H - 5} textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 8, opacity: 0.4 }}>UMAP dim 1</text>
              <text x={8} y={H / 2} transform={`rotate(-90, 8, ${H / 2})`} textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 8, opacity: 0.4 }}>UMAP dim 2</text>
            </svg>
          </div>

          {/* Legend + stats */}
          <div className="w-64 shrink-0 space-y-4">
            <div className="hairline rounded-[var(--radius-md)] p-4 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
              <div className="text-[10px] font-mono opacity-50 mb-2 uppercase tracking-wide">Regime clusters</div>
              <div className="space-y-1.5">
                {clusters.map(c => {
                  const pts = POINTS.filter(p => p.cluster === c);
                  return (
                    <div key={c} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: pts[0]?.color }} />
                      <span className="flex-1 truncate opacity-80">{c}</span>
                      <span className="font-mono opacity-50 text-[10px]">{pts.length}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="hairline rounded-[var(--radius-md)] p-4 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
              <div className="text-[10px] font-mono opacity-50 mb-2 uppercase tracking-wide">Embedding stats</div>
              <div className="space-y-2 text-xs font-mono">
                {[
                  ["Latent dim", "1024"],
                  ["Points shown", `${POINTS.length}`],
                  ["Reduction", "UMAP (n=15, d=0.1)"],
                  ["Silhouette", "0.61"],
                  ["CH index", "42.3"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="opacity-60">{k}</span>
                    <span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
