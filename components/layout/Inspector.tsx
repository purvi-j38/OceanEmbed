"use client";
import { MOCK_INPUTS } from "@/lib/mock/inputs";

export function Inspector({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <div
      className={`
        flex flex-col shrink-0 overflow-y-auto overflow-x-hidden
        hairline-l transition-all duration-200
        bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]
        ${open ? "w-64" : "w-0 md:w-8"}
        ${open ? "absolute right-0 md:relative z-40 h-full" : ""}
      `}
      style={{ height: "calc(100vh - 44px)" }}
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="p-2 hairline-b flex items-center justify-center hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors shrink-0"
        aria-label={open ? "Collapse inspector" : "Expand inspector"}
        title={open ? "Collapse inspector" : "Expand inspector"}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`transition-transform duration-200 ${open ? "" : "rotate-180"}`}
        >
          <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="flex flex-col gap-3 p-3 text-xs">
          <div>
            <div
              className="text-[10px] font-semibold tracking-[0.1em] opacity-50 mb-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              SURFACE INPUTS · 2023-10-15
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {MOCK_INPUTS.map((inp) => (
                <div
                  key={inp.name}
                  className="sample-data-overlay rounded-[var(--radius-sm)] overflow-hidden hairline"
                  style={{ aspectRatio: "1.4/1" }}
                >
                  <div
                    className="w-full h-full flex flex-col items-center justify-center gap-0.5"
                    style={{
                      background: inp.gradient,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    <span className="text-[9px] font-semibold opacity-80 text-white drop-shadow">{inp.abbr}</span>
                    {inp.flag && (
                      <span className="text-[8px] bg-yellow-100 text-yellow-800 px-1 rounded">interp.</span>
                    )}
                  </div>
                  <div className="text-[9px] opacity-70 text-center py-0.5 truncate px-1">{inp.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="hairline-t pt-3">
            <div
              className="text-[10px] font-semibold tracking-[0.1em] opacity-50 mb-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              VIEW STATISTICS
            </div>
            <table className="w-full text-[11px]" style={{ fontFamily: "var(--font-mono)" }}>
              <tbody>
                {[
                  ["Min", "23.4 °C"],
                  ["Max", "30.7 °C"],
                  ["Mean", "27.1 °C"],
                  ["Valid pts", "1,842"],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td className="opacity-60 pr-2 py-0.5">{k}</td>
                    <td className="text-right tabnum">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Provenance */}
          <div className="hairline-t pt-3 text-[10px] opacity-50 leading-relaxed" style={{ fontFamily: "var(--font-mono)" }}>
            Model v0.1<br/>
            OSTIA SST v2.1<br/>
            Processing: 2024-01-10<br/>
            <span className="chip chip-train mt-1 inline-block">Training period</span>
          </div>
        </div>
      )}
    </div>
  );
}
