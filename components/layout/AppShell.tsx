"use client";
import { useState, useEffect } from "react";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { Inspector } from "./Inspector";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(true);

  // Auto-collapse sidebar and inspector on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true);
      setInspectorOpen(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-[100dvh] bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] pb-[36px]">
      <TopBar onToggleSidebar={() => setSidebarCollapsed((v) => !v)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 overflow-auto relative min-w-0">{children}</main>
        <Inspector open={inspectorOpen} onToggle={() => setInspectorOpen((v) => !v)} />
      </div>
    </div>
  );
}
