"use client";
import { useEffect, useRef } from "react";

interface HovRow {
  date: string;
  depth: number;
  temp: number;
}

interface Props {
  data: HovRow[];
  layer: string;
  pointName: string;
  startDate: string;
  endDate: string;
}

export default function HovmollerChart({ data, layer, pointName, startDate, endDate }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    import("plotly.js-dist-min").then((Plotly) => {
      const dates  = [...new Set(data.map(d => d.date))].sort();
      const depths = [...new Set(data.map(d => d.depth))].sort((a, b) => a - b);

      // z[depth_idx][date_idx]
      const z: number[][] = depths.map(dep =>
        dates.map(dt => {
          const found = data.find(r => r.date === dt && r.depth === dep);
          return found?.temp ?? 0;
        })
      );

      const allTemps = data.map(d => d.temp);
      const zmin = Math.min(...allTemps);
      const zmax = Math.max(...allTemps);

      const traces: any[] = [{
        type: "heatmap",
        z,
        x: dates,
        y: depths,
        colorscale: [
          [0.00, "#042333"], [0.15, "#2C3395"], [0.30, "#744992"],
          [0.45, "#B15F82"], [0.60, "#EB7958"], [0.80, "#FBB43D"], [1.00, "#E8FA5B"],
        ],
        zmin,
        zmax,
        colorbar: {
          title: { text: "Temp (°C)", side: "right", font: { size: 10, family: "IBM Plex Mono, monospace" } },
          thickness: 12,
          len: 0.8,
          tickfont: { size: 9, family: "IBM Plex Mono, monospace" },
        },
        hovertemplate: "Date: %{x}<br>Depth: %{y} m<br>" + layer + ": %{z:.2f}°C<extra></extra>",
      }];

      // Period shading — vertical rectangles
      const shapes: any[] = [
        {
          type: "rect", xref: "x", yref: "paper",
          x0: "2011-01-01", x1: "2019-12-31",
          y0: 0, y1: 1,
          fillcolor: "rgba(45,106,79,0.08)", line: { width: 0 },
          layer: "below",
        },
        {
          type: "rect", xref: "x", yref: "paper",
          x0: "2020-01-06", x1: "2021-12-31",
          y0: 0, y1: 1,
          fillcolor: "rgba(27,79,114,0.08)", line: { width: 0 },
          layer: "below",
        },
        {
          type: "rect", xref: "x", yref: "paper",
          x0: "2022-01-06", x1: "2023-12-31",
          y0: 0, y1: 1,
          fillcolor: "rgba(107,45,139,0.08)", line: { width: 0 },
          layer: "below",
        },
      ];

      const annotations: any[] = [
        { x: "2015-07-01", y: 0, xref: "x", yref: "paper", text: "Train", showarrow: false, font: { size: 9, color: "#2D6A4F", family: "IBM Plex Mono" }, yanchor: "bottom" },
        { x: "2021-01-01", y: 0, xref: "x", yref: "paper", text: "Val", showarrow: false, font: { size: 9, color: "#1B4F72", family: "IBM Plex Mono" }, yanchor: "bottom" },
        { x: "2022-07-01", y: 0, xref: "x", yref: "paper", text: "Test", showarrow: false, font: { size: 9, color: "#6B2D8B", family: "IBM Plex Mono" }, yanchor: "bottom" },
      ];

      const layout: any = {
        margin: { l: 60, r: 80, t: 50, b: 60 },
        title: {
          text: `${layer} at ${pointName}`,
          font: { size: 11, family: "IBM Plex Mono, monospace" },
          x: 0.02,
        },
        xaxis: {
          title: { text: "Date", font: { size: 11, family: "IBM Plex Mono, monospace" } },
          gridcolor: "rgba(0,0,0,0)",
          type: "category",
          nticks: 12,
        },
        yaxis: {
          title: { text: "Depth (m)", font: { size: 11, family: "IBM Plex Mono, monospace" } },
          autorange: "reversed",
          gridcolor: "rgba(0,0,0,0.06)",
          tickvals: [0, 50, 100, 200, 300, 500, 700, 1000],
        },
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        font: { family: "IBM Plex Mono, monospace", size: 10 },
        shapes,
        annotations,
      };

      Plotly.react(containerRef.current!, traces, layout, {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ["select2d", "lasso2d"],
      });
    });
  }, [data, layer, pointName, startDate, endDate]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
