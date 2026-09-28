"use client";
import Link from "next/link";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuth } from "@/lib/hooks/useAuth";

export function LandingNav() {
  const { theme, toggle } = useTheme();
  const { isGuest } = useAuth();

  return (
    <header className="sticky top-0 z-50 hairline-b bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] transition-colors">
      <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline shrink-0">
          <span style={{ color: "var(--color-accent)" }}>
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
              <path d="M2 14 Q6 6 11 10 Q16 14 20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M2 18 Q6 12 11 14 Q16 16 20 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5"/>
            </svg>
          </span>
          <span className="text-sm font-semibold tracking-tight hidden sm:inline">OceanEmbed</span>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link href="/how-it-works" className="opacity-70 hover:opacity-100 transition-opacity hidden sm:block">How it works</Link>
          <Link href="/validation"   className="opacity-70 hover:opacity-100 transition-opacity hidden sm:block">Validation</Link>
          <Link href="/docs"         className="opacity-70 hover:opacity-100 transition-opacity hidden sm:block">Docs</Link>

          {/* Theme toggle */}
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

          {isGuest ? (
            <>
              <Link href="/sign-in" className="opacity-70 hover:opacity-100 transition-opacity text-sm">Sign in</Link>
              <Link
                href="/sign-up"
                className="px-3 py-1 text-xs font-medium text-white rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
                style={{ background: "var(--color-accent)" }}
              >
                Create account
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="px-3 py-1 text-xs font-medium text-white rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
              style={{ background: "var(--color-accent)" }}
            >
              Dashboard
            </Link>
          )}

          <Link
            href="/explore"
            className="px-3 py-1 text-xs font-medium rounded-[var(--radius-sm)] hover:opacity-80 transition-opacity hairline"
          >
            Open Explorer
          </Link>
        </nav>
      </div>
    </header>
  );
}
