"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Preset {
  name: string;
  lat: number;
  lon: number;
  direction: string;
  startLat?: number;
  endLat?: number;
  startLon?: number;
  endLon?: number;
}

export default function TransectMap({ preset, date }: { preset: Preset; date: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const lineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [14, 76],
      zoom: 4,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      subdomains: "abc",
      maxZoom: 8,
      opacity: 0.4,
    }).addTo(map);

    const tilePane = map.getPane("tilePane");
    if (tilePane) (tilePane as HTMLElement).style.filter = "grayscale(1) brightness(0.85)";

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (lineRef.current) { lineRef.current.remove(); lineRef.current = null; }

    let latlngs: L.LatLngTuple[];
    if (preset.direction === "NS") {
      const startLat = preset.startLat ?? 5;
      const endLat   = preset.endLat   ?? 22;
      latlngs = [[startLat, preset.lon], [endLat, preset.lon]];
    } else {
      const startLon = preset.startLon ?? 55;
      const endLon   = preset.endLon   ?? 80;
      latlngs = [[preset.lat, startLon], [preset.lat, endLon]];
    }

    lineRef.current = L.polyline(latlngs, { color: "#C8452B", weight: 3 }).addTo(map);
    map.fitBounds(lineRef.current.getBounds(), { padding: [20, 20] });
  }, [preset]);

  return <div ref={containerRef} className="w-full h-full" style={{ minHeight: 160 }} />;
}
