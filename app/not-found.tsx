import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found — OceanEmbed",
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] text-[var(--color-ink)] dark:text-[var(--color-ink-dark)] flex items-center justify-center"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <div className="text-center max-w-sm px-6">
        {/* A lone profile line */}
        <svg
          className="mx-auto mb-6 opacity-30"
          width="120"
          height="80"
          viewBox="0 0 120 80"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10 10 C20 12 25 30 30 40 C35 50 38 55 40 58 C45 65 55 70 70 72 C85 74 100 73 110 72"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {[10, 30, 40, 58, 72].map((y, i) => (
            <circle key={i} cx={[10, 30, 40, 55, 110][i]} cy={y} r="3" fill="currentColor" opacity="0.5"/>
          ))}
          <text x="115" y="75" textAnchor="start" style={{ fontFamily: "monospace", fontSize: 7, opacity: 0.6 }}>
            404
          </text>
        </svg>

        <div className="text-xs font-mono opacity-50 tracking-widest mb-3 uppercase">Page not found</div>
        <h1 className="text-xl mb-3" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>
          No data at this URL.
        </h1>
        <p className="text-sm opacity-60 mb-6 leading-relaxed">
          The page doesn't exist, or it may have moved.
          The Explorer and all scientific data are still available.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="px-4 py-2 hairline rounded-[var(--radius-sm)] text-sm hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors">
            Landing
          </Link>
          <Link href="/explore" className="px-4 py-2 bg-[var(--color-accent)] text-white text-sm rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity">
            Open Explorer
          </Link>
        </div>
      </div>
    </div>
  );
}
