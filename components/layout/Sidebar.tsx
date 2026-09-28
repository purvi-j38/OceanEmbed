"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useAuthModal } from "@/components/providers/AuthModalProvider";

type NavItem = {
  label: string;
  href: string;
  locked?: boolean;
};

type NavGroup = {
  group: string;
  items: NavItem[];
};

const NAV: NavGroup[] = [
  {
    group: "EXPLORE",
    items: [
      { label: "Explorer", href: "/explore" },
      { label: "Profile Viewer", href: "/profile" },
      { label: "Cross-sections", href: "/cross-sections" },
      { label: "Time–depth", href: "/time-depth" },
      { label: "Compare", href: "/compare" },
    ],
  },
  {
    group: "EVIDENCE",
    items: [
      { label: "Validation", href: "/validation", locked: true },
      { label: "Model Lab", href: "/model-lab", locked: true },
      { label: "Embedding Explorer", href: "/embedding-explorer", locked: true },
    ],
  },
  {
    group: "DATA",
    items: [
      { label: "Data & Pipeline", href: "/data-pipeline", locked: true },
      { label: "Downloads", href: "/downloads", locked: true },
    ],
  },
  {
    group: "MY WORK",
    items: [
      { label: "Dashboard", href: "/dashboard", locked: true },
      { label: "Saved views", href: "/saved-views", locked: true },
      { label: "Alerts", href: "/alerts", locked: true },
    ],
  },
  {
    group: "HELP",
    items: [
      { label: "Docs", href: "/docs" },
      { label: "Contact / Support", href: "/contact", locked: true },
    ],
  },
];

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const { isGuest } = useAuth();
  const { openSignIn } = useAuthModal();

  return (
    <aside
      className={`
        flex flex-col shrink-0 overflow-y-auto overflow-x-hidden
        transition-all duration-200
        hairline-r
        bg-[var(--color-card)]
        dark:bg-[var(--color-card-dark)]
        ${collapsed ? "w-0 md:w-12" : "w-52"}
        ${!collapsed ? "absolute md:relative z-40 h-full" : ""}
      `}
      style={{ height: "calc(100vh - 44px)" }}
    >
      {NAV.map((group) => (
        <div key={group.group} className="mb-4">
          {!collapsed && (
            <div
              className="px-3 pt-4 pb-1 text-[10px] font-semibold tracking-[0.12em] opacity-50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {group.group}
            </div>
          )}
          {group.items.map((item) => {
            const locked = item.locked && isGuest;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return locked ? (
              <button
                key={item.href}
                onClick={openSignIn}
                title={`Sign in to access ${item.label}`}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors duration-100 hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] opacity-50"
              >
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none" className="shrink-0 opacity-60">
                  <rect x="1" y="5" width="8" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M3 5V3.5a2 2 0 014 0V5" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                {!collapsed && <span className="truncate">{item.label}</span>}
                {collapsed && (
                  <span className="text-[10px] font-mono opacity-70">
                    {item.label.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`
                  flex items-center gap-2 px-3 py-1.5 text-sm
                  transition-colors duration-100
                  ${active
                    ? "bg-[var(--color-accent)] text-white font-medium"
                    : "hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)]"
                  }
                `}
              >
                {!collapsed && <span className="truncate">{item.label}</span>}
                {collapsed && (
                  <span className="text-[10px] font-mono opacity-70">
                    {item.label.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
