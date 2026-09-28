"use client";
import { useEffect, useRef } from "react";
import { METRICS_TABLE } from "@/lib/mock/engine";

interface ProfileRow {
  depth: number;
  glorys: number;
  oceanEmbed: number;
  baseline: number;
  argo: number;
  error: number;
}

interface Props {
  data: ProfileRow[];
  view: "profiles" | "error" | "rmse";
  pointName: string;
  date: string;
}

export default function CompareChart({ data, view, pointName, date }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    import("plotly.js-dist-min").then((Plotly) => {
      const depths = data.map(d => d.depth);
      let traces: any[] = [];
      let layout: any = {};

      if (view === "profiles") {
        traces = [
          {
            x: data.map(d => d.glorys),
            y: depths,
            name: "GLORYS (reference)",
            type: "scatter", mode: "lines",
            line: { color: "#B7791F", width: 2, dash: "dot" },
            hovertemplate: "GLORYS: %{x:.2f}°C at %{y}m<extra></extra>",
          },
          {
            x: data.map(d => d.baseline),
            y: depths,
            name: "Baseline (clim.)",
            type: "scatter", mode: "lines",
            line: { color: "#8A9BA8", width: 1.5, dash: "dashdot" },
            hovertemplate: "Baseline: %{x:.2f}°C at %{y}m<extra></extra>",
          },
          {
            x: data.map(d => d.oceanEmbed),
            y: depths,
            name: "OceanEmbed",
            type: "scatter", mode: "lines+markers",
            line: { color: "#1B4F72", width: 2.5 },
            marker: { size: 5, color: "#1B4F72" },
            hovertemplate: "OceanEmbed: %{x:.2f}°C at %{y}m<extra></extra>",
          },
        ];
        layout = {
          xaxis: { title: { text: "Temperature (°C)", font: { size: 11 } } },
          yaxis: { title: { text: "Depth (m)", font: { size: 11 } }, autorange: "reversed", tickvals: [0, 50, 100, 200, 300, 500, 700, 1000] },
        };
      }

      if (view === "error") {
        traces = [
          {
            x: data.map(d => d.oceanEmbed - d.glorys),
            y: depths,
            name: "OceanEmbed − GLORYS",
            type: "scatter", mode: "lines+markers",
            line: { color: "#9B2226", width: 2.5 },
            marker: { size: 5, color: "#9B2226" },
            hovertemplate: "Error: %{x:.2f}°C at %{y}m<extra></extra>",
          },
          {
            x: depths.map(() => 0),
            y: depths,
            name: "Zero line",
            type: "scatter", mode: "lines",
            line: { color: "rgba(0,0,0,0.2)", width: 1, dash: "dot" },
            hoverinfo: "skip",
          },
        ];
        layout = {
          xaxis: { title: { text: "Error: OceanEmbed − GLORYS (°C)", font: { size: 11 } } },
          yaxis: { title: { text: "Depth (m)", font: { size: 11 } }, autorange: "reversed", tickvals: [0, 50, 100, 200, 300, 500, 700, 1000] },
        };
      }

      if (view === "rmse") {
        traces = [
          {
            x: METRICS_TABLE.map(r => r.baseRmse),
            y: METRICS_TABLE.map(r => r.depth),
            name: "Baseline RMSE",
            type: "scatter", mode: "lines",
            line: { color: "#8A9BA8", width: 2, dash: "dashdot" },
            hovertemplate: "Baseline RMSE: %{x:.2f}°C at %{y}m<extra></extra>",
          },
          {
            x: METRICS_TABLE.map(r => r.glorysRmse),
            y: METRICS_TABLE.map(r => r.depth),
            name: "GLORYS RMSE (internal)",
            type: "scatter", mode: "lines",
            line: { color: "#B7791F", width: 2, dash: "dot" },
            hovertemplate: "GLORYS RMSE: %{x:.2f}°C at %{y}m<extra></extra>",
          },
          {
            x: METRICS_TABLE.map(r => r.oeRmse),
            y: METRICS_TABLE.map(r => r.depth),
            name: "OceanEmbed RMSE",
            type: "scatter", mode: "lines+markers",
            line: { color: "#1B4F72", width: 2.5 },
            marker: { size: 5, color: "#1B4F72" },
            hovertemplate: "OceanEmbed RMSE: %{x:.2f}°C at %{y}m<extra></extra>",
          },
        ];
        layout = {
          xaxis: { title: { text: "RMSE (°C) — lower is better", font: { size: 11 } }, rangemode: "tozero" },
          yaxis: { title: { text: "Depth (m)", font: { size: 11 } }, autorange: "reversed", tickvals: [0, 50, 100, 200, 300, 500, 700, 1000] },
        };
      }

      const baseLayout: any = {
        margin: { l: 70, r: 80, t: 80, b: 60 },
        title: { text: view === "rmse" ? "RMSE vs Depth — Test period (2022–2023)" : `${pointName} · ${date}`, font: { size: 11, family: "IBM Plex Mono, monospace" }, x: 0.02 },
        legend: { orientation: "h", y: 1.15, font: { family: "IBM Plex Mono, monospace", size: 10 } },
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        font: { family: "IBM Plex Mono, monospace", size: 10 },
        hovermode: "y unified",
        ...layout,
      };

      Plotly.react(containerRef.current!, traces, baseLayout, {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ["select2d", "lasso2d"],
      });
    });
  }, [data, view, pointName, date]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
