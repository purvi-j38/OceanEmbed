"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { getTrueTemperature, DEPTHS } from "@/lib/mock/engine";

const HovmollerChart = dynamic(() => import("./HovmollerChart"), { ssr: false });

const POINT_PRESETS = [
  { name: "Bay of Bengal (12°N, 87°E)",  lat: 12.0, lon: 87.0 },
  { name: "Arabian Sea (15°N, 65°E)",     lat: 15.0, lon: 65.0 },
  { name: "Equatorial IO (6°N, 75°E)",    lat:  6.0, lon: 75.0 },
  { name: "Somalia Coast (10°N, 52°E)",   lat: 10.0, lon: 52.0 },
];

const DATE_RANGE_PRESETS = [
  { name: "Full record (2011–2023)", start: "2011-01-01", end: "2023-12-31" },
  { name: "2018–2020 (straddles gap)", start: "2018-01-01", end: "2020-12-31" },
  { name: "Test period (2022–2023)", start: "2022-01-01", end: "2023-12-31" },
];

// Generate time-depth data for ~3 years monthly (for performance)
function buildHovmollerData(lat: number, lon: number, startDate: string, endDate: string) {
  const data: { date: string; depth: number; temp: number }[] = [];
  const start = new Date(startDate);
  const end   = new Date(endDate);

  // Monthly steps for performance
  let cur = new Date(start);
  while (cur <= end) {
    const dateStr = cur.toISOString().slice(0, 10);
    for (const d of DEPTHS) {
      const t = getTrueTemperature(lat, lon, d, dateStr);
      data.push({ date: dateStr, depth: d, temp: t });
    }
    cur.setMonth(cur.getMonth() + 1);
  }
  return data;
}

export function TimeDepthClient() {
  const searchParams = useSearchParams();
  
  const queryLat = searchParams.get("lat");
  const queryLon = searchParams.get("lon");

  // Re-build presets, prepending custom if provided
  const points = [...POINT_PRESETS];
  if (queryLat && queryLon) {
    const lat = parseFloat(queryLat);
    const lon = parseFloat(queryLon);
    if (!isNaN(lat) && !isNaN(lon)) {
      points.unshift({ name: `Custom (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`, lat, lon });
    }
  }

  const [selectedPoint, setSelectedPoint] = useState(0);
  const [selectedRange, setSelectedRange] = useState(0);
  const [layer, setLayer] = useState<"OceanEmbed" | "GLORYS">("OceanEmbed");

  const point = points[selectedPoint];
  const range = DATE_RANGE_PRESETS[selectedRange];
  const hovData = buildHovmollerData(point.lat, point.lon, range.start, range.end);

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]">

      {/* Info strip */}
      <div className="shrink-0 hairline-b bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] px-4 py-2 text-xs opacity-70 leading-relaxed">
        <strong>Time–depth (Hovmöller)</strong> — time runs along the X-axis; depth runs down the Y-axis.
        {" "}Each vertical strip is one month's temperature profile at the chosen point.
        {" "}Seasonal warming appears as periodic bright bands near the surface. Deep isotherms show multi-year variability.
      </div>

      {/* Controls */}
      <div className="shrink-0 hairline-b px-4 py-2 flex items-center gap-3 flex-wrap bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
        {/* Point selector */}
        <div>
          <div className="text-[9px] font-mono opacity-50 mb-1">POINT</div>
          <div className="flex gap-1">
            {points.map((p, i) => (
              <button
                key={p.name}
                id={`td-point-${i}`}
                onClick={() => setSelectedPoint(i)}
                className={`text-[10px] font-mono px-2 py-1 rounded hairline transition-colors ${
                  selectedPoint === i
                    ? "bg-[var(--color-accent)] text-white border-transparent"
                    : "hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)]"
                }`}
                title={`${p.lat}°N, ${p.lon}°E`}
              >
                {p.name.split("(")[0].trim()}
              </button>
            ))}
          </div>
        </div>

        <div className="opacity-30">|</div>

        {/* Date range */}
        <div>
          <div className="text-[9px] font-mono opacity-50 mb-1">RANGE</div>
          <div className="flex gap-1">
            {DATE_RANGE_PRESETS.map((r, i) => (
              <button
                key={r.name}
                id={`td-range-${i}`}
                onClick={() => setSelectedRange(i)}
                className={`text-[10px] font-mono px-2 py-1 rounded hairline transition-colors ${
                  selectedRange === i
                    ? "bg-[var(--color-accent)] text-white border-transparent"
                    : "hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)]"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        <div className="opacity-30">|</div>

        {/* Layer */}
        <div>
          <div className="text-[9px] font-mono opacity-50 mb-1">LAYER</div>
          <div className="flex gap-1">
            {(["OceanEmbed", "GLORYS"] as const).map(l => (
              <button
                key={l}
                id={`td-layer-${l.toLowerCase()}`}
                onClick={() => setLayer(l)}
                className={`text-[10px] font-mono px-2 py-1 rounded hairline transition-colors ${
                  layer === l
                    ? "bg-[var(--color-accent)] text-white border-transparent"
                    : "hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)]"
                }`}
                title={l === "OceanEmbed" ? "Our estimate" : "Reference reanalysis"}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="ml-auto text-xs font-mono opacity-50">
          {point.lat}°N, {point.lon}°E · monthly steps
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 p-4 min-h-0">
        <HovmollerChart
          data={hovData}
          layer={layer}
          pointName={point.name}
          startDate={range.start}
          endDate={range.end}
        />
      </div>
    </div>
  );
}
