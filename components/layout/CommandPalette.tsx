"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ROUTES = [
  { name: "Explorer", path: "/explore" },
  { name: "Profile Viewer", path: "/profile" },
  { name: "Cross-sections", path: "/cross-sections" },
  { name: "Time-depth (Hovmöller)", path: "/time-depth" },
  { name: "Compare Models", path: "/compare" },
  { name: "Validation Metrics", path: "/validation" },
  { name: "Model Lab", path: "/model-lab" },
  { name: "Embedding Explorer", path: "/embedding-explorer" },
  { name: "Data & Pipeline", path: "/data-pipeline" },
  { name: "Downloads & API", path: "/downloads" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Saved Views", path: "/saved-views" },
  { name: "Alerts", path: "/alerts" },
  { name: "Docs & Guides", path: "/docs" },
  { name: "Contact & Support", path: "/contact" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  const filtered = ROUTES.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex pt-20 justify-center">
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] shadow-2xl rounded-xl overflow-hidden border border-[var(--color-hairline)] dark:border-[var(--color-hairline-dark)] flex flex-col animate-in fade-in zoom-in-95 duration-100">
        <div className="p-3 hairline-b flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-50">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input 
            type="text" 
            autoFocus 
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:opacity-50"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono rounded bg-[var(--color-hairline)] dark:bg-[var(--color-hairline-dark)] opacity-60">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-sm opacity-50">No results found.</div>
          ) : (
            filtered.map((route, i) => (
              <button
                key={route.path}
                onClick={() => {
                  router.push(route.path);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm rounded hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] flex justify-between items-center transition-colors"
              >
                <span>{route.name}</span>
                <span className="text-xs font-mono opacity-40">{route.path}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
