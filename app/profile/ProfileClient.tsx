"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { getProfile, DEPTHS } from "@/lib/mock/engine";

const ProfileChart = dynamic(() => import("./ProfileChart"), { ssr: false });

const PRESETS = [
  { name: "Bay of Bengal",  lat: 12.0, lon: 87.0 },
  { name: "Arabian Sea",    lat: 15.0, lon: 65.0 },
  { name: "Equatorial IO",  lat:  6.0, lon: 75.0 },
  { name: "Somalia Coast",  lat: 10.0, lon: 52.0 },
];

export function ProfileClient() {
  const searchParams = useSearchParams();

  // Initialise from URL params; fall back to Bay of Bengal
  const initLat  = parseFloat(searchParams.get("lat")  ?? "12.0");
  const initLon  = parseFloat(searchParams.get("lon")  ?? "87.0");
  const initDate = searchParams.get("date") ?? "2023-10-15";

  const [lat,  setLat]  = useState(initLat);
  const [lon,  setLon]  = useState(initLon);
  const [date, setDate] = useState(initDate);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(
    PRESETS.findIndex(p => p.lat === initLat && p.lon === initLon) !== -1
      ? PRESETS.findIndex(p => p.lat === initLat && p.lon === initLon)
      : 0
  );

  const [showGlorys,   setShowGlorys]   = useState(true);
  const [showOE,       setShowOE]       = useState(true);
  const [showArgo,     setShowArgo]     = useState(true);
  const [showBaseline, setShowBaseline] = useState(false);

  const profileData = getProfile(lat, lon, date);

  const period = date >= "2022-01-06"
    ? { label: "Test",       color: "#6B2D8B", bg: "#F3E5F5" }
    : date >= "2020-01-06"
    ? { label: "Validation", color: "#1B4F72", bg: "#D6EAF8" }
    : { label: "Train (in-sample)", color: "#2D6A4F", bg: "#D8F3DC" };

  const handlePreset = (idx: number) => {
    setSelectedPreset(idx);
    setLat(PRESETS[idx].lat);
    setLon(PRESETS[idx].lon);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]">

      {/* Info strip */}
      <div className="shrink-0 hairline-b bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] px-4 py-2 text-xs opacity-70 leading-relaxed">
        <strong>Profile Viewer</strong> — temperature from surface (0 m) down to 1000 m at one point.
        {" "}<span className="font-mono" style={{ color: "var(--color-oceanembed)" }}>■ OceanEmbed</span> = satellite estimate.
        {" "}<span className="font-mono" style={{ color: "var(--color-glorys)" }}>■ GLORYS</span> = reference model.
        {" "}<span className="font-mono" style={{ color: "var(--color-argo)" }}>■ ARGO</span> = real float (withheld from training).
        ARGO comparisons are only meaningful in the test period (2022–2023).
      </div>

      {/* Controls */}
      <div className="shrink-0 hairline-b px-4 py-2 flex items-center gap-4 flex-wrap bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">

        {/* Preset location buttons */}
        <div>
          <div className="text-[9px] font-mono opacity-50 mb-1">LOCATION</div>
          <div className="flex gap-1 flex-wrap">
            {PRESETS.map((p, i) => (
              <button
                key={p.name}
                id={`profile-preset-${i}`}
                onClick={() => handlePreset(i)}
                title={`${p.lat}°N, ${p.lon}°E`}
                className={`text-[10px] font-mono px-2 py-1 rounded hairline transition-colors ${
                  selectedPreset === i
                    ? "bg-[var(--color-accent)] text-white border-transparent"
                    : "hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)]"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="opacity-30">|</div>

        {/* Date picker */}
        <div>
          <div className="text-[9px] font-mono opacity-50 mb-1">DATE</div>
          <input
            type="date"
            id="profile-date"
            value={date}
            min="2011-01-01"
            max="2023-12-31"
            onChange={e => setDate(e.target.value)}
            className="text-xs font-mono hairline rounded px-2 py-1 bg-transparent focus:bg-[var(--color-hairline)] outline-none"
          />
        </div>

        <div className="opacity-30">|</div>

        {/* Layer toggles */}
        <div>
          <div className="text-[9px] font-mono opacity-50 mb-1">LAYERS</div>
          <div className="flex items-center gap-2">
            {[
              { id: "oe",       label: "OceanEmbed", color: "var(--color-oceanembed)", on: showOE,       set: setShowOE },
              { id: "glorys",   label: "GLORYS",     color: "var(--color-glorys)",     on: showGlorys,   set: setShowGlorys },
              { id: "argo",     label: "ARGO",       color: "var(--color-argo)",       on: showArgo,     set: setShowArgo },
              { id: "baseline", label: "Baseline",   color: "var(--color-baseline)",   on: showBaseline, set: setShowBaseline },
            ].map(t => (
              <button
                key={t.id}
                id={`profile-toggle-${t.id}`}
                onClick={() => t.set(v => !v)}
                title={t.on ? `Hide ${t.label}` : `Show ${t.label}`}
                className="flex items-center gap-1.5 text-xs px-2 py-1 rounded hairline transition-all"
                style={{
                  background: t.on ? t.color + "20" : "transparent",
                  borderColor: t.on ? t.color : "var(--color-hairline)",
                  color: t.on ? t.color : "var(--color-ink-muted)",
                }}
              >
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: t.on ? t.color : "var(--color-hairline)" }} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location / period badge */}
        <div className="ml-auto flex items-center gap-2 text-xs font-mono">
          <span className="opacity-60">{lat.toFixed(2)}°N, {lon.toFixed(2)}°E</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ background: period.bg, color: period.color }}>
            {period.label}
          </span>
        </div>
      </div>

      {/* Chart + depth table */}
      <div className="flex-1 flex min-h-0">

        {/* Chart */}
        <div className="flex-1 p-4 min-h-0">
          <ProfileChart
            data={profileData}
            showOE={showOE}
            showGlorys={showGlorys}
            showArgo={showArgo}
            showBaseline={showBaseline}
          />
        </div>

        {/* 15-depth table */}
        <div className="w-64 shrink-0 hairline-l overflow-y-auto bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
          <div className="sticky top-0 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] px-3 py-2 hairline-b text-[10px] font-mono opacity-50 uppercase tracking-widest">
            All 15 depths
          </div>
          <table className="w-full text-xs" style={{ fontFamily: "var(--font-mono)" }}>
            <thead>
              <tr className="hairline-b">
                <th className="text-left px-3 py-1.5 opacity-50 font-semibold text-[10px]">Depth</th>
                <th className="text-right px-2 py-1.5 opacity-50 font-semibold text-[10px]" style={{ color: "var(--color-oceanembed)" }}>OE</th>
                <th className="text-right px-2 py-1.5 opacity-50 font-semibold text-[10px]" style={{ color: "var(--color-glorys)" }}>GL</th>
                <th className="text-right px-3 py-1.5 opacity-50 font-semibold text-[10px]">Δ</th>
              </tr>
            </thead>
            <tbody>
              {profileData.map(row => {
                const delta = row.oceanEmbed - row.glorys;
                return (
                  <tr key={row.depth} className="hairline-b last:border-0 hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)]">
                    <td className="px-3 py-1.5 tabnum font-semibold opacity-70">{row.depth} m</td>
                    <td className="px-2 py-1.5 tabnum text-right" style={{ color: "var(--color-oceanembed)" }}>{row.oceanEmbed.toFixed(1)}</td>
                    <td className="px-2 py-1.5 tabnum text-right" style={{ color: "var(--color-glorys)" }}>{row.glorys.toFixed(1)}</td>
                    <td
                      className="px-3 py-1.5 tabnum text-right text-[10px]"
                      style={{ color: delta > 0 ? "#9B2226" : delta < 0 ? "#1B4F72" : "inherit" }}
                    >
                      {delta > 0 ? "+" : ""}{delta.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-3 py-2 hairline-t text-[10px] font-mono opacity-50">
            Δ = OceanEmbed − GLORYS (°C)<br />
            {date >= "2022-01-06" ? "ARGO withheld (test)." : "ARGO comparisons: test period only."}
          </div>
        </div>
      </div>
    </div>
  );
}
