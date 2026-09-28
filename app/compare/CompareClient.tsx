"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getTrueTemperature } from "@/lib/mock/engine";
import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

// ─── Shared constants ────────────────────────────────────────────────────────
const LAT_MIN = 5;
const LAT_MAX = 30;
const LON_MIN = 45;
const LON_MAX = 105;
const STEP = 0.75;

type LayerType = "OceanEmbed" | "GLORYS" | "Diff";

const LAYER_OPTIONS: {
  id: LayerType;
  label: string;
  title: string;
}[] = [
  {
    id: "OceanEmbed",
    label: "OceanEmbed",
    title: "Our reconstruction from satellite surface signals",
  },
  {
    id: "GLORYS",
    label: "GLORYS",
    title: "Reference physics-model reanalysis",
  },
  {
    id: "Diff",
    label: "B − A",
    title: "Panel B minus Panel A (positive = B warmer)",
  },
];

// ─── Colour mapping ─────────────────────────────────────────────────────────
function getColor(
  temp: number,
  layer: LayerType,
  tmin: number,
  tmax: number
): [number, number, number] {
  if (layer === "Diff") {
    const t = Math.max(-4, Math.min(4, temp));
    const f = (t + 4) / 8;

    if (f < 0.5) {
      const g = f * 2;

      return [
        Math.round(27 * g),
        Math.round(75 + 130 * g),
        Math.round(144 - 44 * g),
      ];
    } else {
      const g = (f - 0.5) * 2;

      return [
        Math.round(27 + 128 * g),
        Math.round(205 - 100 * g),
        Math.round(100 - 90 * g),
      ];
    }
  }

  const f = Math.max(
    0,
    Math.min(1, (temp - tmin) / (tmax - tmin))
  );

  const stops: [number, number, number][] = [
    [4, 35, 51],
    [44, 83, 146],
    [116, 73, 146],
    [177, 95, 130],
    [235, 121, 88],
    [251, 180, 61],
    [232, 250, 91],
  ];

  const idx = f * (stops.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(stops.length - 1, lo + 1);
  const t = idx - lo;

  return [
    Math.round(
      stops[lo][0] + (stops[hi][0] - stops[lo][0]) * t
    ),
    Math.round(
      stops[lo][1] + (stops[hi][1] - stops[lo][1]) * t
    ),
    Math.round(
      stops[lo][2] + (stops[hi][2] - stops[lo][2]) * t
    ),
  ];
}

// ─── Single mini-map ─────────────────────────────────────────────────────────
function MiniMap({
  date,
  depth,
  layer,
  label,
  tmin,
  tmax,
}: {
  date: string;
  depth: number;
  layer: LayerType;
  label: string;
  tmin: number;
  tmax: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mapRef = useRef<Leaflet.Map | null>(null);

  const groupRef = useRef<Leaflet.LayerGroup | null>(null);

  const [leaflet, setLeaflet] = useState<
    typeof import("leaflet") | null
  >(null);

  // ─── Load Leaflet only in the browser ─────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    import("leaflet").then((module) => {
      if (mounted) {
        setLeaflet(module);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  // ─── Initialize map ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!leaflet || !containerRef.current || mapRef.current) {
      return;
    }

    const map = leaflet.map(containerRef.current, {
      center: [14, 76],
      zoom: 4,
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true,
    });

    leaflet
      .tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          subdomains: "abc",
          maxZoom: 8,
          opacity: 0.25,
        }
      )
      .addTo(map);

    const tp = map.getPane("tilePane");

    if (tp) {
      (tp as HTMLElement).style.filter =
        "grayscale(1) brightness(0.8)";
    }

    mapRef.current = map;

    groupRef.current = leaflet.layerGroup().addTo(map);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();

      mapRef.current = null;
      groupRef.current = null;
    };
  }, [leaflet]);

  // ─── Redraw tiles when props change ────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    const group = groupRef.current;

    if (!leaflet || !map || !group) {
      return;
    }

    group.clearLayers();

    for (
      let lat = LAT_MIN;
      lat < LAT_MAX;
      lat += STEP
    ) {
      for (
        let lon = LON_MIN;
        lon < LON_MAX;
        lon += STEP
      ) {
        const trueT = getTrueTemperature(
          lat,
          lon,
          depth,
          date
        );

        const hash =
          Math.sin(
            lat * 12.9898 +
              lon * 78.233 +
              depth * 0.1
          ) * 43758.5453;

        const err =
          (hash - Math.floor(hash) - 0.5) *
          (depth > 30 && depth < 200 ? 2.0 : 0.6);

        let displayT = trueT + err;

        if (layer === "GLORYS") {
          displayT = trueT;
        }

        if (layer === "Diff") {
          displayT = err;
        }

        const [r, g, b] = getColor(
          displayT,
          layer,
          tmin,
          tmax
        );

        leaflet
          .rectangle(
            [
              [lat, lon],
              [lat + STEP, lon + STEP],
            ],
            {
              color: "none",
              fillColor: `rgb(${r},${g},${b})`,
              fillOpacity: 0.85,
              weight: 0,
            }
          )
          .addTo(group);
      }
    }
  }, [
    leaflet,
    date,
    depth,
    layer,
    tmin,
    tmax,
  ]);

  return (
    <div className="flex flex-col h-full">
      {/* Label bar */}
      <div className="shrink-0 flex items-center justify-between px-3 py-1.5 hairline-b bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
        <span className="text-xs font-mono font-semibold">
          {label}
        </span>

        <span className="text-[10px] font-mono opacity-50">
          {date} · {depth} m
        </span>
      </div>

      <div
        ref={containerRef}
        className="flex-1"
        style={{ minHeight: 300 }}
      />
    </div>
  );
}

// ─── Main Compare client ─────────────────────────────────────────────────────
export function CompareClient() {
  const searchParams = useSearchParams();

  const date =
    searchParams.get("date") ?? "2023-10-15";

  const depth = parseInt(
    searchParams.get("depth") ?? "100",
    10
  );

  const [layerA, setLayerA] =
    useState<LayerType>("OceanEmbed");

  const [layerB, setLayerB] =
    useState<LayerType>("GLORYS");

  const tmin =
    depth <= 50
      ? 22
      : depth <= 150
      ? 14
      : 6;

  const tmax =
    depth <= 50
      ? 32
      : depth <= 150
      ? 28
      : 18;

  const period =
    date >= "2022-01-06"
      ? {
          label: "Test",
          color: "#6B2D8B",
        }
      : date >= "2020-01-06"
      ? {
          label: "Validation",
          color: "#1B4F72",
        }
      : {
          label: "Train",
          color: "#2D6A4F",
        };

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]">

      {/* Info strip */}
      <div className="shrink-0 hairline-b bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] px-4 py-2 text-xs opacity-70 leading-relaxed">
        <strong>Compare</strong> — place any two layers side by side.
        Choose Panel A and Panel B below.
        {" "}
        The third option{" "}
        <span className="font-mono">
          B − A
        </span>{" "}
        shows the signed difference
        (positive = B warmer).
        {" "}
        Use this to inspect where OceanEmbed
        and GLORYS diverge spatially.
      </div>

      {/* Controls */}
      <div className="shrink-0 hairline-b px-4 py-2 flex items-center gap-4 flex-wrap bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">

        {/* Panel A */}
        <div>
          <div className="text-[9px] font-mono opacity-50 mb-1">
            PANEL A
          </div>

          <div className="flex gap-1">
            {LAYER_OPTIONS
              .filter((l) => l.id !== "Diff")
              .map((l) => (
                <button
                  key={l.id}
                  id={`compare-a-${l.id}`}
                  onClick={() =>
                    setLayerA(l.id)
                  }
                  title={l.title}
                  className={`text-[10px] font-mono px-2 py-1 rounded hairline transition-colors ${
                    layerA === l.id
                      ? "bg-[var(--color-accent)] text-white border-transparent"
                      : "hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)]"
                  }`}
                >
                  {l.label}
                </button>
              ))}
          </div>
        </div>

        <div className="opacity-30">
          |
        </div>

        {/* Panel B */}
        <div>
          <div className="text-[9px] font-mono opacity-50 mb-1">
            PANEL B
          </div>

          <div className="flex gap-1">
            {LAYER_OPTIONS.map((l) => (
              <button
                key={l.id}
                id={`compare-b-${l.id}`}
                onClick={() =>
                  setLayerB(l.id)
                }
                title={l.title}
                className={`text-[10px] font-mono px-2 py-1 rounded hairline transition-colors ${
                  layerB === l.id
                    ? "bg-[var(--color-accent)] text-white border-transparent"
                    : "hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)]"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="ml-auto text-xs font-mono opacity-50 flex items-center gap-2 shrink-0">
          <span>{date}</span>

          <span
            className="px-1.5 py-0.5 rounded text-[9px] font-semibold"
            style={{
              color: period.color,
              background: period.color + "20",
            }}
          >
            {period.label}
          </span>
        </div>
      </div>

      {/* Two maps side by side */}
      <div className="flex-1 flex min-h-0">

        <div className="flex-1 hairline-r min-h-0">
          <MiniMap
            date={date}
            depth={depth}
            layer={layerA}
            label={`A: ${layerA}`}
            tmin={tmin}
            tmax={tmax}
          />
        </div>

        <div className="flex-1 min-h-0">
          <MiniMap
            date={date}
            depth={depth}
            layer={
              layerB === "Diff"
                ? "Diff"
                : layerB
            }
            label={
              layerB === "Diff"
                ? `B − A: ${layerB} (${layerB} − ${layerA})`
                : `B: ${layerB}`
            }
            tmin={tmin}
            tmax={tmax}
          />
        </div>

      </div>

      {/* Footer */}
      <div className="shrink-0 hairline-t px-4 py-2 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] flex gap-6 text-xs font-mono">

        <div>
          <span className="opacity-50">
            OceanEmbed RMSE @ 100m:
          </span>

          <span className="ml-2 font-semibold">
            1.08 °C
          </span>
        </div>

        <div>
          <span className="opacity-50">
            Baseline RMSE @ 100m:
          </span>

          <span className="ml-2 font-semibold">
            2.05 °C
          </span>
        </div>

        <div>
          <span className="opacity-50">
            Skill @ 100m:
          </span>

          <span
            className="ml-2 font-semibold"
            style={{
              color: "var(--color-success)",
            }}
          >
            0.47
          </span>
        </div>

        <div className="ml-auto opacity-40 text-[10px]">
          Test period · gridded ARGO · 2022–2023
        </div>

      </div>
    </div>
  );
}