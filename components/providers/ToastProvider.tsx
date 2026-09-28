"use client";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

type ToastContextType = {
  showToast: (msg: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-12 right-4 z-[100] animate-in slide-in-from-bottom-2 fade-in">
          <div className="bg-[var(--color-ink)] text-[var(--color-surface)] dark:bg-[var(--color-ink-dark)] dark:text-[var(--color-surface-dark)] px-4 py-2 rounded shadow-lg text-sm font-medium flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 15A7 7 0 108 1a7 7 0 000 14z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11.5 6L7 10.5 4.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {toast}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
