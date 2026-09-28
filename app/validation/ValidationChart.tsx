"use client";
import { useEffect, useRef } from "react";

interface MetricRow {
  depth: number;
  oeRmse: number;
  glorysRmse: number;
  baseRmse: number;
  corr: number;
  skill: number;
}

export default function ValidationChart({ metrics, metricView }: { metrics: MetricRow[]; metricView: "rmse" | "corr" | "skill" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || metrics.length === 0) return;

    import("plotly.js-dist-min").then((Plotly) => {
      const depths = metrics.map(m => m.depth);
      let traces: any[] = [];

      if (metricView === "rmse") {
        traces = [
          { x: metrics.map(m => m.baseRmse),  y: depths, name: "Baseline", type: "scatter", mode: "lines", line: { color: "#8A9BA8", dash: "dashdot", width: 1.5 } },
          { x: metrics.map(m => m.glorysRmse), y: depths, name: "GLORYS (internal)", type: "scatter", mode: "lines", line: { color: "#B7791F", dash: "dot", width: 2 } },
          { x: metrics.map(m => m.oeRmse),     y: depths, name: "OceanEmbed", type: "scatter", mode: "lines+markers", line: { color: "#1B4F72", width: 2.5 }, marker: { size: 5 } },
        ];
      } else if (metricView === "corr") {
        traces = [
          { x: metrics.map(m => m.corr), y: depths, name: "OceanEmbed corr", type: "scatter", mode: "lines+markers", line: { color: "#1B4F72", width: 2.5 }, marker: { size: 5 } },
        ];
      } else {
        traces = [
          { x: metrics.map(m => m.skill), y: depths, name: "Skill score", type: "scatter", mode: "lines+markers", line: { color: "#2D6A4F", width: 2.5 }, marker: { size: 5 } },
          { x: depths.map(() => 0), y: depths, name: "No skill", type: "scatter", mode: "lines", line: { color: "rgba(0,0,0,0.2)", dash: "dot", width: 1 }, hoverinfo: "skip" },
        ];
      }

      const layout: any = {
        margin: { l: 60, r: 30, t: 30, b: 50 },
        xaxis: { title: { text: metricView === "rmse" ? "RMSE (°C)" : metricView === "corr" ? "Correlation (r)" : "Skill (1 − RMSE/RMSE_base)", font: { size: 10, family: "IBM Plex Mono" } }, rangemode: metricView === "rmse" ? "tozero" : undefined },
        yaxis: { title: { text: "Depth (m)", font: { size: 10, family: "IBM Plex Mono" } }, autorange: "reversed", tickvals: [0, 50, 100, 200, 300, 500, 700, 1000] },
        legend: { orientation: "h", y: 1.1, font: { family: "IBM Plex Mono", size: 10 } },
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        font: { family: "IBM Plex Mono", size: 10 },
      };

      Plotly.react(ref.current!, traces, layout, { responsive: true, displayModeBar: false });
    });
  }, [metrics, metricView]);

  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
}
