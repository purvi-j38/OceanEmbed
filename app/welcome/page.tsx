"use client";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";

export default function WelcomePage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6 p-8"
      style={{ background: "var(--color-surface)", fontFamily: "var(--font-sans)" }}
    >
      {/* Logo */}
      <div style={{ color: "var(--color-accent)" }}>
        <svg width="40" height="40" viewBox="0 0 22 22" fill="none">
          <path d="M2 14 Q6 6 11 10 Q16 14 20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <path d="M2 18 Q6 12 11 14 Q16 16 20 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5"/>
        </svg>
      </div>

      <div className="text-center max-w-sm">
        <h1 className="text-3xl mb-2" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>
          Welcome, {firstName}.
        </h1>
        <p className="text-sm opacity-60 leading-relaxed">
          Your account is ready. Start exploring subsurface ocean temperature,
          or head to your dashboard to see the seeded views and alerts.
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xs">
        <Link
          href="/explore?date=2022-07-12&depth=30&layer=OceanEmbed&region=North+Indian+Ocean"
          className="w-full py-2.5 text-sm font-medium text-white text-center rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
          style={{ background: "var(--color-accent)" }}
        >
          Open Explorer →
        </Link>
        <Link
          href="/dashboard"
          className="w-full py-2.5 text-sm text-center hairline rounded-[var(--radius-sm)] hover:bg-[var(--color-hairline)] transition-colors"
        >
          Go to dashboard
        </Link>
      </div>

      <div className="text-[11px] font-mono opacity-30 mt-4">
        OceanEmbed prototype · INCOIS · Ministry of Earth Sciences
      </div>
    </div>
  );
}
