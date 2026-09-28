"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";

const OceanMap = dynamic(() => import("@/components/explorer/OceanMap"), { ssr: false });

const DEPTHS = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000];

// Correct period boundaries from the spec (Section 2 constants)
const PERIODS = [
  { label: "Train",      start: "2011-01-01", end: "2019-12-31", color: "#D8F3DC", textColor: "#2D6A4F" },
  { label: "Val",        start: "2020-01-06", end: "2021-12-31", color: "#D6EAF8", textColor: "#1B4F72" },
  { label: "Test",       start: "2022-01-06", end: "2023-12-31", color: "#F3E5F5", textColor: "#6B2D8B" },
];

const SCRUBBER_START = "2011-01-01";
const SCRUBBER_END   = "2023-12-31";

function getPeriodForDate(dateStr: string) {
  const d = new Date(dateStr).getTime();
  return PERIODS.find(p => {
    const s = new Date(p.start).getTime();
    const e = new Date(p.end).getTime();
    return d >= s && d <= e;
  }) ?? null;
}

function dateToPercent(dateStr: string) {
  const startMs = new Date(SCRUBBER_START).getTime();
  const endMs   = new Date(SCRUBBER_END).getTime();
  const nowMs   = new Date(dateStr).getTime();
  return Math.min(100, Math.max(0, ((nowMs - startMs) / (endMs - startMs)) * 100));
}

function periodToPercent(dateStr: string) {
  const startMs = new Date(SCRUBBER_START).getTime();
  const endMs   = new Date(SCRUBBER_END).getTime();
  const pMs     = new Date(dateStr).getTime();
  return Math.min(100, Math.max(0, ((pMs - startMs) / (endMs - startMs)) * 100));
}

export function ExplorerClient() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const date   = searchParams.get("date")   ?? "2023-10-15";
  const depth  = parseInt(searchParams.get("depth") ?? "100");
  const layer  = searchParams.get("layer")  ?? "OceanEmbed";

  const [isPlaying, setIsPlaying]   = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [colorAuto, setColorAuto] = useState(true);
  const [hoveredVal, setHoveredVal] = useState<{ lat: number; lon: number; temp: number } | null>(null);
  const [pinnedPoint, setPinnedPoint] = useState<{ lat: number; lon: number } | null>(null);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const period = getPeriodForDate(date);

  const update = useCallback(
    (key: string, val: string) => {
      const p = new URLSearchParams(searchParams.toString());
      p.set(key, val);
      router.replace(`${pathname}?${p.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const stepDate = useCallback((delta: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    const newDate = d.toISOString().slice(0, 10);
    if (newDate >= SCRUBBER_START && newDate <= SCRUBBER_END) {
      update("date", newDate);
    }
  }, [date, update]);

  const stepDepth = useCallback((delta: number) => {
    const idx = DEPTHS.indexOf(depth);
    const nextIdx = Math.max(0, Math.min(DEPTHS.length - 1, idx + delta));
    update("depth", String(DEPTHS[nextIdx]));
  }, [depth, update]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;
      if (e.key === "ArrowLeft")  { stepDate(-1); }
      if (e.key === "ArrowRight") { stepDate(1); }
      if (e.key === "ArrowUp")    { e.preventDefault(); stepDepth(-1); }
      if (e.key === "ArrowDown")  { e.preventDefault(); stepDepth(1); }
      if (e.key === " ")          { e.preventDefault(); setIsPlaying(v => !v); }
      if (e.key === "?")          { setShowShortcuts(v => !v); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [stepDate, stepDepth]);

  // Playback
  useEffect(() => {
    if (isPlaying) {
      playRef.current = setInterval(() => stepDate(1), 900);
    } else {
      if (playRef.current) clearInterval(playRef.current);
    }
    return () => { if (playRef.current) clearInterval(playRef.current); };
  }, [isPlaying, stepDate]);

  // Colour bar config per layer
  const colorBarConfig = layer === "Error"
    ? { gradient: "linear-gradient(to bottom, #9B2226, #D6EAF8, #1B4F72)", min: "-3°C", max: "+3°C", label: "Error (°C)" }
    : { gradient: "linear-gradient(to bottom, #C0392B, #E67E22, #F1C40F, #AED6F1, #1B4F72)", min: "8°C", max: "32°C", label: "Temp (°C)" };

  // ARGO note shown only on ARGO layer
  const isArgoLayer = layer === "ARGO";

  return (
    <div className="relative flex flex-col h-full bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]">

      {/* ── Period badge ────────────────────────────────── */}
      {period && (
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-2 py-0.5 rounded text-[10px] font-mono font-semibold border"
          style={{ background: period.color, color: period.textColor, borderColor: period.textColor + "60" }}
        >
          {period.label === "Train" ? "TRAINING PERIOD — withheld from model" : period.label === "Val" ? "VALIDATION PERIOD — held-out evaluation" : "TEST PERIOD — blind evaluation"}
        </div>
      )}

      {/* ── Map ─────────────────────────────────────────── */}
      <div className="flex-1 relative">
        <OceanMap
          date={date}
          depth={depth}
          layer={layer}
          onHover={setHoveredVal}
          onPin={setPinnedPoint}
        />

        {/* ARGO note */}
        {isArgoLayer && (
          <div className="absolute top-10 left-4 z-20 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] hairline rounded px-3 py-2 text-xs max-w-xs shadow-[var(--shadow-float)]" style={{ fontFamily: "var(--font-mono)" }}>
            <span className="font-semibold" style={{ color: "var(--color-argo)" }}>■</span> ARGO floats are shown as circles.
            Float positions are simulated from the training grid; individual profiles open in Profile Viewer.
          </div>
        )}

        {/* Hover readout */}
        {hoveredVal && (
          <div
            className="absolute bottom-20 left-4 z-30 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] hairline rounded-[var(--radius-md)] px-3 py-2 text-xs shadow-[var(--shadow-float)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span className="opacity-60">{hoveredVal.lat.toFixed(2)}°N  {hoveredVal.lon.toFixed(2)}°E</span>
            <br/>
            <span className="font-semibold text-sm">{hoveredVal.temp.toFixed(2)} °C</span>
            <span className="opacity-60 ml-1">at {depth} m · {date}</span>
            {layer === "OceanEmbed" && <span className="opacity-60 ml-1">· OceanEmbed</span>}
            {layer === "GLORYS" && <span className="opacity-60 ml-1">· GLORYS (reference)</span>}
            {layer === "Error" && <span className="ml-1" style={{ color: hoveredVal.temp > 0 ? "#9B2226" : "#1B4F72" }}>· model too {hoveredVal.temp > 0 ? "warm" : "cold"}</span>}
          </div>
        )}

        {/* Pinned point popup */}
        {pinnedPoint && (
          <div className="absolute bottom-20 right-4 z-30 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] hairline rounded-[var(--radius-md)] p-3 text-xs shadow-[var(--shadow-float)] w-56">
            <div className="flex justify-between items-start mb-3">
              <div style={{ fontFamily: "var(--font-mono)" }} className="font-semibold">
                {pinnedPoint.lat.toFixed(2)}°N, {pinnedPoint.lon.toFixed(2)}°E
              </div>
              <button
                onClick={() => setPinnedPoint(null)}
                className="opacity-40 hover:opacity-100 ml-2 text-base leading-none"
                aria-label="Close"
              >×</button>
            </div>
            <div className="flex flex-col gap-1.5">
              <Link
                href={`/profile?lat=${pinnedPoint.lat}&lon=${pinnedPoint.lon}&date=${date}`}
                className="block w-full text-center text-xs py-1.5 bg-[var(--color-accent)] text-white rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
              >
                Open vertical profile →
              </Link>
              <Link
                href={`/cross-sections?lat=${pinnedPoint.lat}&lon=${pinnedPoint.lon}&date=${date}`}
                className="block w-full text-center text-xs py-1.5 hairline rounded-[var(--radius-sm)] hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors"
              >
                Draw cross-section →
              </Link>
              <Link
                href={`/time-depth?lat=${pinnedPoint.lat}&lon=${pinnedPoint.lon}`}
                className="block w-full text-center text-xs py-1.5 hairline rounded-[var(--radius-sm)] hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors"
              >
                Time–depth at this point →
              </Link>
            </div>
          </div>
        )}

        {/* Colour bar */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1">
          <span className="text-[9px] font-mono opacity-70">{colorBarConfig.max}</span>
          <div
            className="w-3 rounded-[1px] hairline"
            style={{ height: 160, background: colorBarConfig.gradient }}
          />
          <span className="text-[9px] font-mono opacity-70">{colorBarConfig.min}</span>
          <div className="text-[9px] font-mono opacity-50 mt-1 text-center">{colorBarConfig.label}</div>
          <button
            onClick={() => setColorAuto(v => !v)}
            className={`text-[9px] font-mono hairline rounded px-1 py-0.5 mt-1 transition-colors ${colorAuto ? "bg-[var(--color-accent)] text-white border-transparent" : "opacity-60 hover:opacity-100"}`}
            title={colorAuto ? "Colour range: auto-scale to visible depth. Click for fixed range." : "Colour range: fixed 8–32°C. Click for auto-scale."}
          >
            {colorAuto ? "auto" : "fixed"}
          </button>
        </div>

        {/* Layer pills */}
        <div className="absolute top-3 right-14 z-20 flex gap-1">
          {[
            { id: "OceanEmbed", label: "OceanEmbed", title: "Our estimate: inferred from SST + SSH only" },
            { id: "GLORYS", label: "GLORYS", title: "Reference dataset: the physics model we trained against" },
            { id: "ARGO", label: "ARGO", title: "Real float measurements: not seen during training" },
            { id: "Error", label: "Error", title: "OceanEmbed − GLORYS. Red = too warm, blue = too cold" },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => update("layer", l.id)}
              title={l.title}
              className={`text-[10px] font-mono px-2 py-0.5 rounded-[var(--radius-sm)] hairline transition-colors ${
                layer === l.id
                  ? "bg-[var(--color-accent)] text-white border-transparent"
                  : "bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)]"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* No Inspector buttons in map canvas anymore, as they are in the Inspector panel */}
      </div>

      {/* ── Time scrubber ─────────────────────────────────── */}
      <div
        className="shrink-0 hairline-t bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] px-4 py-2 flex items-center gap-3"
        style={{ height: 60 }}
      >
        {/* Play / pause */}
        <button
          onClick={() => setIsPlaying(v => !v)}
          id="explorer-play-btn"
          className="w-8 h-8 flex items-center justify-center hairline rounded-[var(--radius-sm)] hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors shrink-0"
          aria-label={isPlaying ? "Pause" : "Play"}
          title="Space to play / pause. Steps forward one day at a time."
        >
          {isPlaying ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><rect x="2" y="1" width="3" height="10" rx="1"/><rect x="7" y="1" width="3" height="10" rx="1"/></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3 1.5l7 4.5-7 4.5V1.5z"/></svg>
          )}
        </button>

        {/* Period bands — interactive scrubber */}
        <div className="flex-1 relative h-8 flex items-center cursor-pointer group">
          <div className="absolute inset-0 flex rounded-[var(--radius-sm)] overflow-hidden hairline">
            {PERIODS.map((p) => {
              const leftPct  = periodToPercent(p.start);
              const rightPct = 100 - periodToPercent(p.end);
              return (
                <div
                  key={p.label}
                  className="absolute top-0 bottom-0 flex items-center justify-center cursor-pointer hover:brightness-95"
                  style={{ left: `${leftPct}%`, right: `${rightPct}%`, background: p.color, opacity: 0.7 }}
                  title={`Jump to start of ${p.label} period (${p.start})`}
                  onClick={() => update("date", p.start)}
                >
                  <span className="text-[9px] font-mono font-semibold" style={{ color: p.textColor }}>
                    {p.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Clickable scrubber track */}
          <div
            className="absolute inset-0 z-10"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              const startMs = new Date(SCRUBBER_START).getTime();
              const endMs   = new Date(SCRUBBER_END).getTime();
              const newMs   = startMs + pct * (endMs - startMs);
              const newDate = new Date(newMs).toISOString().slice(0, 10);
              update("date", newDate);
            }}
          />

          {/* Current date marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-[var(--color-ink)] dark:bg-[var(--color-ink-dark)] z-20 transition-all duration-200 pointer-events-none"
            style={{ left: `${dateToPercent(date)}%` }}
          />

          {/* Tooltip on the marker */}
          <div
            className="absolute top-full mt-0.5 text-[9px] font-mono bg-[var(--color-ink)] text-[var(--color-surface)] dark:bg-[var(--color-ink-dark)] dark:text-[var(--color-surface-dark)] px-1 py-0.5 rounded z-30 pointer-events-none transition-all"
            style={{ left: `${dateToPercent(date)}%`, transform: "translateX(-50%)" }}
          >
            {date}
          </div>
        </div>

        {/* Period + date display */}
        <div
          className="text-xs font-mono shrink-0 w-24 text-right"
          style={{ color: period?.textColor ?? "inherit" }}
        >
          {date}
          <br/>
          <span className="opacity-50 text-[9px]">{period?.label ?? "—"}</span>
        </div>

        {/* Depth readout */}
        <div className="text-xs font-mono shrink-0 text-right opacity-70">
          {depth} m<br/>
          <span className="opacity-50 text-[9px]">↑↓ depth</span>
        </div>

        {/* Shortcuts btn */}
        <button
          onClick={() => setShowShortcuts(v => !v)}
          className="text-[10px] font-mono opacity-40 hover:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center hairline rounded"
          title="Keyboard shortcuts"
          id="explorer-shortcuts-btn"
        >
          ?
        </button>
      </div>

      {/* Modals removed - inputs and stats are in the right-hand Inspector */}

      {/* ── Shortcuts modal ───────────────────────────────── */}
      {showShortcuts && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] hairline rounded-[var(--radius-md)] p-6 shadow-[var(--shadow-float)] w-72"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold">Keyboard shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)} className="opacity-40 hover:opacity-100 text-lg leading-none">×</button>
            </div>
            <table className="w-full text-xs" style={{ fontFamily: "var(--font-mono)" }}>
              <tbody>
                {[
                  ["← →",      "Step one day back / forward"],
                  ["↑ ↓",      "Step shallower / deeper"],
                  ["Space",    "Play / pause animation"],
                  ["? ",       "Toggle this panel"],
                  ["Ctrl+K",   "Command palette"],
                ].map(([k, v]) => (
                  <tr key={k} className="hairline-b last:border-0">
                    <td className="py-1.5 pr-4 font-semibold opacity-80">{k}</td>
                    <td className="py-1.5 opacity-60">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
