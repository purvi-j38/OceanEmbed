"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type GlossaryContextType = {
  isOpen: boolean;
  openGlossary: () => void;
  closeGlossary: () => void;
};

const GlossaryContext = createContext<GlossaryContextType | undefined>(undefined);

export function GlossaryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <GlossaryContext.Provider value={{ isOpen, openGlossary: () => setIsOpen(true), closeGlossary: () => setIsOpen(false) }}>
      {children}
      {isOpen && <GlossaryDrawer onClose={() => setIsOpen(false)} />}
    </GlossaryContext.Provider>
  );
}

export function useGlossary() {
  const context = useContext(GlossaryContext);
  if (!context) throw new Error("useGlossary must be used within GlossaryProvider");
  return context;
}

const TERMS = [
  { term: "ARGO", def: "A global array of free-drifting profiling floats that measures the temperature and salinity of the upper 2000m of the ocean." },
  { term: "GLORYS", def: "A global ocean reanalysis product by Mercator Ocean (GLORYS12V1). It assimilates satellite and in-situ data into a physical model. We use it as our ground truth." },
  { term: "RMSE", def: "Root Mean Square Error. A standard measure of the difference between values predicted by a model and the values observed." },
  { term: "Skill", def: "A metric comparing the model's RMSE against a baseline. Skill = 1 - (RMSE_model / RMSE_baseline). A score of 1 is perfect, 0 means no better than the baseline." },
  { term: "SSH", def: "Sea Surface Height. Measured by satellite altimeters. One of our two model inputs." },
  { term: "SST", def: "Sea Surface Temperature. Measured by satellite radiometers. Our second model input." },
  { term: "Thermocline", def: "A steep temperature gradient in a body of water, marking the boundary between the warmer surface water and the colder deep water." },
  { term: "UMAP", def: "Uniform Manifold Approximation and Projection. A dimension reduction technique used to visualize high-dimensional data (like our 1024-D embeddings) in 2D." }
];

function GlossaryDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-80 max-w-[80vw] h-full bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between p-4 hairline-b shrink-0">
          <h2 className="text-lg font-semibold">Glossary</h2>
          <button onClick={onClose} className="p-1 hover:bg-[var(--color-hairline)] rounded transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M4 4L12 12M4 12L12 4" />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1 space-y-6">
          {TERMS.map(t => (
            <div key={t.term}>
              <dt className="font-semibold text-[var(--color-accent)] dark:text-[var(--color-accent-dark)]">{t.term}</dt>
              <dd className="text-sm opacity-80 mt-1 leading-relaxed">{t.def}</dd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper component for dotted underlines
export function Glos({ children }: { children: ReactNode }) {
  const { openGlossary } = useGlossary();
  return (
    <span 
      className="cursor-help underline decoration-dotted decoration-[var(--color-accent)] underline-offset-4 hover:text-[var(--color-accent)] transition-colors"
      onClick={openGlossary}
    >
      {children}
    </span>
  );
}
