"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const REGIONS = ["North Indian Ocean", "Bay of Bengal", "Arabian Sea"] as const;
const DEPTHS  = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000];
const LAYERS  = ["OceanEmbed", "GLORYS", "ARGO", "Error"] as const;

export function ContextBar() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const isWorkspace = ["/explore", "/profile", "/cross-sections", "/time-depth", "/compare"].some(
    (p) => pathname.startsWith(p)
  );
  if (!isWorkspace) return null;

  const date   = searchParams.get("date")   ?? "2023-10-15";
  const depth  = searchParams.get("depth")  ?? "100";
  const layer  = searchParams.get("layer")  ?? "OceanEmbed";
  const region = searchParams.get("region") ?? "North Indian Ocean";

  // Determine which controls are active based on the page
  const isExplorer = pathname.startsWith("/explore");
  const isProfile = pathname.startsWith("/profile");
  const isSections = pathname.startsWith("/cross-sections");
  const isTimeDepth = pathname.startsWith("/time-depth");
  const isCompare = pathname.startsWith("/compare");

  const useRegion = isExplorer || isCompare;
  const useDepth = isExplorer || isCompare || isTimeDepth;
  const useLayer = isExplorer || isCompare; // Profile and Sections have their own toggles
  const useDate = isExplorer || isProfile || isSections || isCompare;

  const update = useCallback(
    (key: string, val: string) => {
      const p = new URLSearchParams(searchParams.toString());
      p.set(key, val);
      router.replace(`${pathname}?${p.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const stepDate = (delta: number) => {
    if (!useDate) return;
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    update("date", d.toISOString().slice(0, 10));
  };

  const wrapTooltip = (content: React.ReactNode, title: string, disabled: boolean) => (
    <div title={disabled ? "Not used on this page." : title} className={disabled ? "opacity-30 cursor-not-allowed" : ""}>
      {content}
    </div>
  );

  return (
    <div className="flex items-center gap-2 text-xs font-mono select-none overflow-x-auto whitespace-nowrap no-scrollbar px-2 max-w-full">
      {/* Date */}
      {wrapTooltip(
        <div className={`flex items-center gap-0.5 ${!useDate ? "pointer-events-none" : ""}`}>
          <button
            onClick={() => stepDate(-1)}
            className="p-1 hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] rounded transition-colors"
            aria-label="Previous day"
          >
            ←
          </button>
          <input
            type="date"
            value={date}
            onChange={(e) => update("date", e.target.value)}
            className="bg-transparent border-0 text-xs font-mono text-center outline-none cursor-pointer hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] rounded px-1 transition-colors"
            aria-label="Date"
          />
          <button
            onClick={() => stepDate(1)}
            className="p-1 hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] rounded transition-colors"
            aria-label="Next day"
          >
            →
          </button>
        </div>,
        "Pick a day between 1 Jan 2011 and 31 Dec 2023.",
        !useDate
      )}

      <span className="opacity-30">|</span>

      {/* Region */}
      {wrapTooltip(
        <select
          value={region}
          onChange={(e) => update("region", e.target.value)}
          disabled={!useRegion}
          className="bg-transparent border-0 text-xs font-mono outline-none cursor-pointer hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] rounded px-1 transition-colors disabled:pointer-events-none"
          aria-label="Region"
        >
          {REGIONS.map((r) => <option key={r}>{r}</option>)}
        </select>,
        "Zoom to the whole Indian Ocean, the Bay of Bengal, or the Arabian Sea.",
        !useRegion
      )}

      <span className="opacity-30">|</span>

      {/* Depth */}
      {wrapTooltip(
        <select
          value={depth}
          onChange={(e) => update("depth", e.target.value)}
          disabled={!useDepth}
          className="bg-transparent border-0 text-xs font-mono outline-none cursor-pointer hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] rounded px-1 transition-colors disabled:pointer-events-none"
          aria-label="Depth (metres)"
        >
          {DEPTHS.map((d) => <option key={d} value={d}>{d} m</option>)}
        </select>,
        "Metres below the sea surface. Choose one of the 15 model levels, from 0 to 1000 m.",
        !useDepth
      )}

      <span className="opacity-30">|</span>

      {/* Layer */}
      {wrapTooltip(
        <select
          value={layer}
          onChange={(e) => update("layer", e.target.value)}
          disabled={!useLayer}
          className="bg-transparent border-0 text-xs font-mono outline-none cursor-pointer hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] rounded px-1 transition-colors disabled:pointer-events-none"
          aria-label="Data layer"
        >
          {LAYERS.map((l) => <option key={l}>{l}</option>)}
        </select>,
        "OceanEmbed: our estimate from surface satellites. GLORYS: the reference dataset the model was trained to match. ARGO: real measurements from floats. Error: OceanEmbed minus GLORYS. Blue means we're too cold, red means too warm.",
        !useLayer
      )}
    </div>
  );
}
