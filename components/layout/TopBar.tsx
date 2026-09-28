"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuth } from "@/lib/hooks/useAuth";
import { ContextBar } from "./ContextBar";

export function TopBar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { theme, toggle } = useTheme();
  const { user, isGuest, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <header
      className="flex items-center gap-2 px-3 hairline-b shrink-0 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]"
      style={{ height: 44 }}
    >
      {/* Left: logo + toggle */}
      <button
        onClick={onToggleSidebar}
        className="p-1.5 rounded hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors shrink-0"
        aria-label="Toggle sidebar"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect y="2" width="16" height="1.5" rx="0.75" fill="currentColor" />
          <rect y="7" width="16" height="1.5" rx="0.75" fill="currentColor" />
          <rect y="12" width="16" height="1.5" rx="0.75" fill="currentColor" />
        </svg>
      </button>

      <Link href="/" className="flex items-center gap-1.5 no-underline shrink-0">
        <span className="text-[var(--color-accent)]">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
            <path d="M2 14 Q6 6 11 10 Q16 14 20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M2 18 Q6 12 11 14 Q16 16 20 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5"/>
          </svg>
        </span>
        <span className="text-sm font-semibold tracking-tight hidden sm:inline" style={{ fontFamily: "var(--font-sans)" }}>
          OceanEmbed
        </span>
      </Link>

      {/* Centre: context bar — Suspense required for useSearchParams */}
      <div className="flex-1 flex justify-start sm:justify-center min-w-0 overflow-hidden">
        <Suspense fallback={<div />}>
          <ContextBar />
        </Suspense>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1 shrink-0">        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="p-1.5 rounded hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors"
          aria-label="Toggle theme"
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.2 3.2l1.1 1.1M11.7 11.7l1.1 1.1M11.7 3.2l-1.1 1.1M4.3 11.7l-1.1 1.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M13 8.5A5 5 0 117.5 3a3.5 3.5 0 005.5 5.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        {/* Help */}
        <Link
          href="/docs"
          className="p-1.5 rounded hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors"
          title="Documentation & glossary"
          aria-label="Help"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M6.3 6c0-1 .77-1.7 1.7-1.7s1.7.7 1.7 1.7c0 .8-.5 1.3-1 1.6-.5.3-.7.6-.7 1v.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <circle cx="8" cy="11.5" r="0.7" fill="currentColor"/>
          </svg>
        </Link>

        {/* Auth */}
        {isGuest ? (
          <>
            <Link
              href="/sign-in"
              className="px-2.5 py-1 text-xs font-medium hairline rounded-[var(--radius-sm)] hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="px-2.5 py-1 text-xs font-medium text-white rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
              style={{ background: "var(--color-accent)" }}
            >
              Create account
            </Link>
          </>
        ) : (
          <div className="relative group">
            <button
              className="w-7 h-7 rounded-full text-white text-xs font-semibold flex items-center justify-center"
              style={{ background: "var(--color-accent)" }}
              aria-label="Account menu"
            >
              {user?.name?.[0]?.toUpperCase() ?? "A"}
            </button>
            <div className="absolute right-0 top-full mt-1 w-48 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] hairline rounded-[var(--radius-md)] shadow-[var(--shadow-menu)] hidden group-focus-within:block z-[200]">
              <div className="p-3 hairline-b">
                <div className="text-xs font-semibold truncate">{user?.name}</div>
                <div className="text-[11px] opacity-60 truncate font-mono">{user?.email}</div>
              </div>
              <Link href="/dashboard"   className="block px-3 py-1.5 text-xs hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)]">Dashboard</Link>
              <Link href="/saved-views" className="block px-3 py-1.5 text-xs hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)]">Saved views</Link>
              <Link href="/alerts"      className="block px-3 py-1.5 text-xs hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)]">Alerts</Link>
              <button onClick={signOut} className="w-full text-left px-3 py-1.5 text-xs hairline-t hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] mt-1">Sign out</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
