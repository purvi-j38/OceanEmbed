"use client";
import { useEffect, useRef } from "react";

interface SectionPoint {
  pos: number;
  depth: number;
  temp: number;
}

interface Props {
  data: SectionPoint[];
  direction: "NS" | "EW";
  layer: string;
  showContours: boolean;
  date: string;
  transectName: string;
}

export default function CrossSectionChart({ data, direction, layer, showContours, date, transectName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    import("plotly.js-dist-min").then((Plotly) => {
      const positions = [...new Set(data.map(d => d.pos))].sort((a, b) => a - b);
      const depths    = [...new Set(data.map(d => d.depth))].sort((a, b) => a - b);

      // Build z matrix [depth][position]
      const z: number[][] = depths.map(d =>
        positions.map(p => {
          const found = data.find(row => row.pos === p && row.depth === d);
          return found?.temp ?? 0;
        })
      );

      const isError = layer === "Error";
      const colorscale = isError
        ? [[0, "#2B5D8A"], [0.5, "#F4F1EA"], [1, "#9B2226"]]
        : [
            [0.00, "#042333"], [0.15, "#2C3395"], [0.30, "#744992"],
            [0.45, "#B15F82"], [0.60, "#EB7958"], [0.80, "#FBB43D"], [1.00, "#E8FA5B"],
          ];

      const allTemps = data.map(d => d.temp);
      const zmin = isError ? -3 : Math.min(...allTemps);
      const zmax = isError ?  3 : Math.max(...allTemps);

      const traces: any[] = [{
        type: "heatmap",
        z,
        x: positions,
        y: depths,
        colorscale,
        zmin,
        zmax,
        colorbar: {
          title: { text: isError ? "Error (°C)" : "Temp (°C)", side: "right", font: { size: 10, family: "IBM Plex Mono, monospace" } },
          thickness: 12,
          len: 0.8,
          tickfont: { size: 9, family: "IBM Plex Mono, monospace" },
        },
        hovertemplate: `${direction === "NS" ? "Lat" : "Lon"}: %{x:.1f}°<br>Depth: %{y} m<br>${layer}: %{z:.2f}°C<extra></extra>`,
      }];

      if (showContours) {
        traces.push({
          type: "contour",
          z,
          x: positions,
          y: depths,
          contours: { showlabels: true, labelfont: { size: 8, family: "IBM Plex Mono", color: "rgba(0,0,0,0.5)" }, coloring: "none" },
          line: { color: "rgba(0,0,0,0.25)", width: 1 },
          showscale: false,
          hoverinfo: "skip",
        });
      }

      const layout: any = {
        margin: { l: 60, r: 80, t: 40, b: 50 },
        title: {
          text: `${transectName} · ${date} · ${layer}`,
          font: { size: 11, family: "IBM Plex Mono, monospace" },
          x: 0.02,
        },
        xaxis: {
          title: { text: direction === "NS" ? "Latitude (°N)" : "Longitude (°E)", font: { size: 11, family: "IBM Plex Mono, monospace" } },
          gridcolor: "rgba(0,0,0,0)",
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
      };

      Plotly.react(containerRef.current!, traces, layout, {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ["select2d", "lasso2d"],
      });
    });
  }, [data, direction, layer, showContours, date, transectName]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
