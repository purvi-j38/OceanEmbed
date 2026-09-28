"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getTrueTemperature, LAT_MIN, LAT_MAX, LON_MIN, LON_MAX } from "@/lib/mock/engine";

// ── cmocean "thermal" palette (accurate 15-stop) ─────────────────────────────
const THERMAL_STOPS: [number, [number, number, number]][] = [
  [0.00, [4,   35,  51]],
  [0.07, [23,  51,  122]],
  [0.14, [85,  59,  157]],
  [0.21, [129, 55,  161]],
  [0.28, [170, 56,  140]],
  [0.35, [201, 68,  109]],
  [0.43, [221, 89,  80]],
  [0.50, [232, 114, 56]],
  [0.57, [236, 141, 43]],
  [0.64, [234, 169, 42]],
  [0.71, [227, 199, 53]],
  [0.78, [216, 229, 75]],
  [0.85, [202, 254, 110]],
  [0.92, [228, 255, 168]],
  [1.00, [255, 255, 228]],
];

// ── cmocean "balance" diverging palette for error ─────────────────────────────
const BALANCE_STOPS: [number, [number, number, number]][] = [
  [0.00, [43,  93, 138]],
  [0.25, [146, 196, 222]],
  [0.50, [244, 241, 234]],
  [0.75, [224, 138, 124]],
  [1.00, [155, 34,  38]],
];

function interpolate(stops: [number, [number, number, number]][], frac: number): [number, number, number] {
  frac = Math.max(0, Math.min(1, frac));
  for (let i = 1; i < stops.length; i++) {
    const [f0, c0] = stops[i - 1];
    const [f1, c1] = stops[i];
    if (frac <= f1) {
      const α = (f1 === f0) ? 0 : (frac - f0) / (f1 - f0);
      return [
        Math.round(c0[0] + α * (c1[0] - c0[0])),
        Math.round(c0[1] + α * (c1[1] - c0[1])),
        Math.round(c0[2] + α * (c1[2] - c0[2])),
      ];
    }
  }
  return stops[stops.length - 1][1];
}

function getColor(t: number, layer: string, tmin: number, tmax: number): [number, number, number] {
  if (layer === "Error") {
    const frac = (t - (-3)) / 6; // -3 to +3
    return interpolate(BALANCE_STOPS, frac);
  }
  const frac = (t - tmin) / (tmax - tmin);
  return interpolate(THERMAL_STOPS, frac);
}

// Simulated ARGO float positions in the NIO domain (physically plausible)
function getArgoFloats(dateStr: string) {
  const seed = new Date(dateStr).getDate() + new Date(dateStr).getMonth() * 31;
  const base = [
    [8.2,  62.5], [12.4, 72.8], [18.7, 66.3], [6.5,  80.1],
    [22.1, 58.4], [14.9, 87.6], [10.3, 94.2], [25.0, 70.0],
    [3.8,  55.1], [16.6, 78.9], [9.0,  68.0], [20.5, 60.0],
    [7.5,  90.0], [15.0, 75.0], [11.0, 83.0],
  ];
  // Drift floats slightly based on date
  return base.map(([lat, lon]) => [
    lat + ((seed % 7) - 3) * 0.15,
    lon + ((seed % 5) - 2) * 0.2,
  ]);
}

interface OceanMapProps {
  date:   string;
  depth:  number;
  layer:  string;
  onHover: (v: { lat: number; lon: number; temp: number } | null) => void;
  onPin:   (v: { lat: number; lon: number }) => void;
}

export default function OceanMap({ date, depth, layer, onHover, onPin }: OceanMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);
  const layerRef     = useRef<L.LayerGroup | null>(null);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [14, 76],
      zoom: 5,
      zoomControl: true,
      attributionControl: false,
      preferCanvas: true,
    });

    // Desaturated OSM basemap
    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { subdomains: "abc", maxZoom: 9, opacity: 0.3 }
    ).addTo(map);

    const tilePaneEl = map.getPane("tilePane");
    if (tilePaneEl) {
      (tilePaneEl as HTMLElement).style.filter = "grayscale(1) brightness(0.85) contrast(0.9)";
    }

    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Redraw grid when props change
  useEffect(() => {
    const map   = mapRef.current;
    const group = layerRef.current;
    if (!map || !group) return;

    group.clearLayers();

    const STEP = 0.5; // 0.5° for canvas performance; real engine uses 0.25°
    const tmin = depth <= 50 ? 22 : depth <= 150 ? 14 : 6;
    const tmax = depth <= 50 ? 32 : depth <= 150 ? 28 : 18;

    for (let lat = LAT_MIN; lat < LAT_MAX; lat += STEP) {
      for (let lon = LON_MIN; lon < LON_MAX; lon += STEP) {
        const truT  = getTrueTemperature(lat, lon, depth, date);
        // Add deterministic small error for OceanEmbed layer
        const hash  = Math.sin(lat * 12.9898 + lon * 78.233 + depth * 0.1) * 43758.5453;
        const err   = (hash - Math.floor(hash) - 0.5) * (depth > 30 && depth < 200 ? 2.0 : 0.6);
        const oeT   = truT + err;

        let displayT = oeT;
        if (layer === "GLORYS") displayT = truT;
        if (layer === "ARGO")   displayT = truT + (Math.sin(lat + lon) - 0.5) * 0.3;
        if (layer === "Error")  displayT = err; // OE - GLORYS

        const [r, g, b] = getColor(displayT, layer, tmin, tmax);

        L.rectangle(
          [[lat, lon], [lat + STEP, lon + STEP]],
          {
            color: "none",
            fillColor: `rgb(${r},${g},${b})`,
            fillOpacity: 0.85,
            weight: 0,
          }
        )
        .on("mouseover", () => onHover({ lat: lat + STEP / 2, lon: lon + STEP / 2, temp: displayT }))
        .on("mouseout",  () => onHover(null))
        .on("click",     () => onPin({ lat: lat + STEP / 2, lon: lon + STEP / 2 }))
        .addTo(group);
      }
    }

    // ARGO float markers (always visible, but larger on ARGO layer)
    if (layer !== "Error" && layer !== "GLORYS") {
      const floats = getArgoFloats(date);
      floats.forEach(([fLat, fLon]) => {
        const fTemp = getTrueTemperature(fLat, fLon, depth, date);
        L.circleMarker([fLat, fLon], {
          radius: layer === "ARGO" ? 6 : 3,
          color: "#fff",
          fillColor: "#C8452B",
          fillOpacity: 0.9,
          weight: 1.5,
        })
        .bindTooltip(
          `ARGO · ${fLat.toFixed(1)}°N ${fLon.toFixed(1)}°E<br/><b>${fTemp.toFixed(2)} °C</b> at ${depth} m`,
          { direction: "top" }
        )
        .on("click", () => onPin({ lat: fLat, lon: fLon }))
        .addTo(group);
      });
    }
  }, [date, depth, layer, onHover, onPin]);

  return (
    <div
      ref={containerRef}
      id="ocean-map"
      className="w-full h-full"
      aria-label={`Ocean ${layer} temperature at ${depth} m on ${date}`}
    />
  );
}
