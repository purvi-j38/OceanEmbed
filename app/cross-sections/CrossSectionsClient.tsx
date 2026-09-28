"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { getTrueTemperature, DEPTHS } from "@/lib/mock/engine";

const CrossSectionChart = dynamic(() => import("./CrossSectionChart"), { ssr: false });
const TransectMap = dynamic(() => import("./TransectMap"), { ssr: false });

// Preset transects
const PRESETS = [
  { name: "BoB N–S (87°E)", startLat: 5, endLat: 22, lat: 14, lon: 87, direction: "NS" },
  { name: "AS W–E (15°N)",  startLon: 55, endLon: 78, lat: 15, lon: 66, direction: "EW" },
  { name: "Equatorial IO",  startLon: 45, endLon: 100, lat: 6, lon: 72, direction: "EW" },
  { name: "Somalia Coast",  startLat: 5, endLat: 15, lat: 10, lon: 53, direction: "NS" },
];

export function CrossSectionsClient() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date") ?? "2023-10-15";
  const queryLat = searchParams.get("lat");
  const queryLon = searchParams.get("lon");

  const presets = [...PRESETS];
  if (queryLat && queryLon) {
    const pLat = parseFloat(queryLat);
    const pLon = parseFloat(queryLon);
    if (!isNaN(pLat) && !isNaN(pLon)) {
      presets.unshift(
        { name: `Custom N–S (${pLon.toFixed(2)}°E)`, startLat: 5, endLat: 30, lat: pLat, lon: pLon, direction: "NS" },
        { name: `Custom E–W (${pLat.toFixed(2)}°N)`, startLon: 45, endLon: 105, lat: pLat, lon: pLon, direction: "EW" }
      );
    }
  }

  const [selectedPreset, setSelectedPreset] = useState(0);
  const [layer, setLayer] = useState<"OceanEmbed" | "GLORYS" | "Error">("OceanEmbed");
  const [showContours, setShowContours] = useState(true);

  const preset = presets[selectedPreset];

  // Build section data: either N–S or E–W
  const NPOINTS = 60;
  const sectionData: { pos: number; depth: number; temp: number }[] = [];

  if (preset.direction === "NS") {
    const startLat = preset.startLat ?? 5;
    const endLat   = preset.endLat   ?? 22;
    for (let i = 0; i < NPOINTS; i++) {
      const pLat = startLat + (i / (NPOINTS - 1)) * (endLat - startLat);
      for (const d of DEPTHS) {
        const t = getTrueTemperature(pLat, preset.lon, d, date);
        const hash = Math.sin(pLat * 12.9898 + d * 78.233) * 43758.5453;
        const err  = (hash - Math.floor(hash) - 0.5) * (d > 30 && d < 200 ? 1.5 : 0.5);
        const val  = layer === "GLORYS" ? t : layer === "Error" ? err : t + err;
        sectionData.push({ pos: pLat, depth: d, temp: val });
      }
    }
  } else {
    const startLon = preset.startLon ?? 55;
    const endLon   = preset.endLon   ?? 78;
    for (let i = 0; i < NPOINTS; i++) {
      const pLon = startLon + (i / (NPOINTS - 1)) * (endLon - startLon);
      for (const d of DEPTHS) {
        const t = getTrueTemperature(preset.lat, pLon, d, date);
        const hash = Math.sin(pLon * 12.9898 + d * 78.233) * 43758.5453;
        const err  = (hash - Math.floor(hash) - 0.5) * (d > 30 && d < 200 ? 1.5 : 0.5);
        const val  = layer === "GLORYS" ? t : layer === "Error" ? err : t + err;
        sectionData.push({ pos: pLon, depth: d, temp: val });
      }
    }
  }

  const period = date >= "2022-01-06"
    ? { label: "Test",       color: "#6B2D8B" }
    : date >= "2020-01-06"
    ? { label: "Validation", color: "#1B4F72" }
    : { label: "Train",      color: "#2D6A4F" };

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]">

      {/* Info strip */}
      <div className="shrink-0 hairline-b bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] px-4 py-2 text-xs opacity-70 leading-relaxed">
        <strong>Cross-sections</strong> — a 2-D vertical slice (transect) cut through the ocean along the line shown on the mini-map.
        {" "}The X-axis is latitude or longitude; the Y-axis is depth. Choose a preset transect or draw your own.
        {" "}Watch how the thermocline rises and falls, and how eddies distort isotherms.
      </div>

      {/* Controls */}
      <div className="shrink-0 hairline-b px-4 py-2 flex items-center gap-3 flex-wrap bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
        {/* Preset selector */}
        <div className="flex flex-wrap gap-1">
          {presets.map((p, i) => (
            <button
              key={p.name}
              id={`preset-${i}`}
              onClick={() => setSelectedPreset(i)}
              className={`text-[10px] font-mono px-2 py-1 rounded hairline transition-colors ${
                selectedPreset === i
                  ? "bg-[var(--color-accent)] text-white border-transparent"
                  : "hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)]"
              }`}
              title={`Draw transect: ${p.name}`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="opacity-30">|</div>

        {/* Layer toggle */}
        <div className="flex gap-1">
          {(["OceanEmbed", "GLORYS", "Error"] as const).map(l => (
            <button
              key={l}
              id={`xs-layer-${l.toLowerCase()}`}
              onClick={() => setLayer(l)}
              className={`text-[10px] font-mono px-2 py-1 rounded hairline transition-colors ${
                layer === l
                  ? "bg-[var(--color-accent)] text-white border-transparent"
                  : "hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)]"
              }`}
              title={l === "OceanEmbed" ? "Our estimate from SST+SSH" : l === "GLORYS" ? "Reference physics model" : "Difference (OE − GLORYS)"}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="opacity-30">|</div>

        <button
          onClick={() => setShowContours(v => !v)}
          id="xs-contours-toggle"
          className={`text-[10px] font-mono px-2 py-1 rounded hairline transition-colors ${
            showContours ? "bg-[var(--color-accent)] text-white border-transparent" : "hover:bg-[var(--color-hairline)]"
          }`}
          title="Toggle isotherm contour lines"
        >
          Contours
        </button>

        <div className="ml-auto text-xs font-mono opacity-60 flex items-center gap-2">
          <span>{date}</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ color: period.color, background: period.color + "20" }}>
            {period.label}
          </span>
        </div>
      </div>

      {/* Main content: chart + mini-map */}
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 p-3 min-h-0">
          <CrossSectionChart
            data={sectionData}
            direction={preset.direction as "NS" | "EW"}
            layer={layer}
            showContours={showContours}
            date={date}
            transectName={preset.name}
          />
        </div>

        {/* Mini-map showing transect line */}
        <div className="w-52 shrink-0 hairline-l relative">
          <div className="text-[10px] font-mono opacity-60 p-2 hairline-b">{preset.name}</div>
          <TransectMap preset={preset} date={date} />
        </div>
      </div>
    </div>
  );
}
