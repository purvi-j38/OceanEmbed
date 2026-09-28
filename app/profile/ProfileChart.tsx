"use client";
import { useEffect, useRef } from "react";

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
  showOE: boolean;
  showGlorys: boolean;
  showArgo: boolean;
  showBaseline: boolean;
}

export default function ProfileChart({ data, showOE, showGlorys, showArgo, showBaseline }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    import("plotly.js-dist-min").then((Plotly) => {
      const depths = data.map(d => d.depth);
      const traces: any[] = [];

      if (showGlorys) {
        traces.push({
          x: data.map(d => d.glorys),
          y: depths,
          name: "GLORYS",
          type: "scatter",
          mode: "lines",
          line: { color: "#B7791F", width: 2, dash: "dot" },
          hovertemplate: "GLORYS: %{x:.2f}°C at %{y}m<extra></extra>",
        });
      }

      if (showBaseline) {
        traces.push({
          x: data.map(d => d.baseline),
          y: depths,
          name: "Baseline",
          type: "scatter",
          mode: "lines",
          line: { color: "#8A9BA8", width: 1.5, dash: "dashdot" },
          hovertemplate: "Baseline: %{x:.2f}°C at %{y}m<extra></extra>",
        });
      }

      if (showOE) {
        traces.push({
          x: data.map(d => d.oceanEmbed),
          y: depths,
          name: "OceanEmbed",
          type: "scatter",
          mode: "lines+markers",
          line: { color: "#1B4F72", width: 2.5 },
          marker: { size: 4, color: "#1B4F72" },
          hovertemplate: "OceanEmbed: %{x:.2f}°C at %{y}m<extra></extra>",
        });
      }

      if (showArgo) {
        traces.push({
          x: data.map(d => d.argo),
          y: depths,
          name: "ARGO",
          type: "scatter",
          mode: "markers",
          marker: { size: 8, color: "#C8452B", symbol: "circle-open", line: { width: 2 } },
          hovertemplate: "ARGO: %{x:.2f}°C at %{y}m<extra></extra>",
        });
      }

      const layout: any = {
        margin: { l: 60, r: 20, t: 20, b: 50 },
        xaxis: {
          title: { text: "Temperature (°C)", font: { family: "IBM Plex Mono, monospace", size: 11 } },
          gridcolor: "rgba(0,0,0,0.06)",
          zeroline: false,
        },
        yaxis: {
          title: { text: "Depth (m)", font: { family: "IBM Plex Mono, monospace", size: 11 } },
          autorange: "reversed",
          gridcolor: "rgba(0,0,0,0.06)",
          zeroline: false,
          tickvals: [0, 50, 100, 200, 300, 500, 700, 1000],
        },
        legend: {
          orientation: "h",
          x: 0,
          y: 1.08,
          font: { family: "IBM Plex Mono, monospace", size: 10 },
        },
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        font: { family: "IBM Plex Mono, monospace", size: 11 },
        hovermode: "y unified",
        // Mixed-layer depth annotation
        shapes: [{
          type: "line",
          x0: 0,
          x1: 1,
          xref: "paper",
          y0: 50,
          y1: 50,
          line: { color: "rgba(180,180,180,0.4)", width: 1, dash: "dot" },
        }],
        annotations: [{
          x: 1,
          y: 50,
          xref: "paper",
          yref: "y",
          text: "MLD",
          showarrow: false,
          font: { size: 9, color: "#888", family: "IBM Plex Mono, monospace" },
          xanchor: "right",
          yanchor: "bottom",
        }],
      };

      Plotly.react(containerRef.current!, traces, layout, {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ["select2d", "lasso2d"],
      });
    });
  }, [data, showOE, showGlorys, showArgo, showBaseline]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
