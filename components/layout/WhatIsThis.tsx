"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useGlossary } from "@/components/providers/GlossaryProvider";

const EXPLAINERS: Record<string, string> = {
  "/explore": "The main 3-D viewer. Use the scrubber to travel through time and watch surface eddies propagate downwards. The model takes only sea surface temperature (SST) and sea surface height (SSH) as inputs, and infers the 3-D structure below. GLORYS is the 'ground truth' we trained against.",
  "/profile": "A 1-D vertical slice showing temperature from the surface down to 1000m at a single point. You can compare our model's estimate with the reference data (GLORYS) and, where available, real measurements from ARGO floats.",
  "/cross-sections": "A 2-D slice (transect) through the ocean, drawn along a line you choose. This reveals thermoclines, upwelling zones, and the depth of eddies. You can toggle between our estimate and the reference data.",
  "/time-depth": "A Hovmöller diagram showing how the temperature profile at a single point evolves over time. Time runs along the X-axis, depth down the Y-axis. Useful for tracking seasonal warming and cooling cycles.",
  "/compare": "A side-by-side view comparing OceanEmbed and GLORYS. Drag the slider to reveal differences, or use the Error layer to highlight where the model is too warm (red) or too cold (blue).",
  "/validation": "The raw performance metrics. This shows how well the model reconstructs the ocean during the withheld Test period (2022–2023), compared to independent ARGO floats that were not seen during training.",
  "/model-lab": "Behind the scenes: training runs, hyperparameter searches, and ablation studies. This shows why we chose the final architecture.",
  "/embedding-explorer": "A projection (UMAP) of the learned latent space. Each point is a single location and day. Points that are close together have similar inferred subsurface structures, showing how the model has learned physical relationships.",
  "/data-pipeline": "The architecture of our data flow, from raw satellite downloads to the gridded inputs fed into the model.",
  "/dashboard": "Your personal dashboard for managing saved views and alerts.",
  "/saved-views": "Bookmarks for interesting oceanic events you've discovered.",
  "/alerts": "Set up alerts for when certain thermal conditions are met in the model.",
};

export function WhatIsThis() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { openGlossary } = useGlossary();
  
  // Find best match (some paths might have query strings or nested routes)
  const key = Object.keys(EXPLAINERS).find(k => pathname.startsWith(k)) || "/explore";
  const explainer = EXPLAINERS[key];

  if (pathname === "/") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] hairline-t">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-[var(--color-accent)]">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 12v.01M8 4v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          What am I looking at?
        </div>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transform transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      {open && (
        <div className="px-4 pb-4 pt-1 text-sm opacity-80 max-w-4xl flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1 leading-relaxed">
            {explainer}
          </div>
          <button 
            onClick={openGlossary}
            className="px-3 py-1.5 text-xs font-medium hairline rounded hover:bg-[var(--color-hairline)] transition-colors whitespace-nowrap shrink-0"
          >
            Open Glossary
          </button>
        </div>
      )}
    </div>
  );
}
