import type { Metadata } from "next";
import Link from "next/link";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { LandingNav } from "@/components/layout/LandingNav";

export const metadata: Metadata = {
  title: "OceanEmbed — Daily Subsurface Ocean Temperature, 0–1000 m",
  description: "OceanEmbed reconstructs daily 3-D subsurface temperature across the North Indian Ocean from surface satellite data alone.",
};

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] text-[var(--color-ink)] dark:text-[var(--color-ink-dark)]"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <LandingNav />

      {/* 1. Animated Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <div className="text-xs font-mono opacity-50 tracking-widest mb-6 uppercase">
          SIH 2026 · PS SIH26066 · INCOIS / MoES
        </div>
        <h1
          className="text-4xl md:text-5xl leading-tight mb-8 max-w-4xl"
          style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}
        >
          Daily subsurface temperature, 0–1000 m, from surface satellites alone.
        </h1>
        <p className="text-lg opacity-70 leading-relaxed mb-10 max-w-2xl">
          OceanEmbed replaces sparse float interpolations with a deep learning model that infers the full 3-D thermal structure of the North Indian Ocean using only daily surface signals.
        </p>
        
        {/* Animated hero map visual (pure CSS) */}
        <div className="w-full max-w-3xl mb-12 rounded-[var(--radius-md)] overflow-hidden hairline relative bg-[#1B4F72]" style={{ aspectRatio: "21/9" }}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2ECC71]/20 to-transparent w-[200%] animate-[slide_3s_linear_infinite]" style={{ animation: "slide 4s linear infinite" }} />
          <div className="absolute bottom-4 left-4 text-white text-xs font-mono opacity-80">
            Generating 15 depths · 0.25° grid · No ARGO needed
          </div>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes slide { from { transform: translateX(-50%); } to { transform: translateX(0%); } }
          `}} />
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/explore"
            className="px-6 py-3 bg-[var(--color-accent)] text-white text-sm font-medium rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
          >
            Open the Explorer
          </Link>
          <Link
            href="/how-it-works"
            className="px-6 py-3 hairline text-sm font-medium rounded-[var(--radius-sm)] hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors"
          >
            Read the method
          </Link>
        </div>
      </section>

      <div className="hairline-b max-w-6xl mx-auto" />

      {/* 2. Satellite-vs-floats wipe */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl mb-12 text-center" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>
          Bridging the coverage gap
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-xl font-semibold mb-3">Sparse Floats</h3>
            <p className="opacity-70 mb-6 leading-relaxed">
              In any 10-day window, fewer than 500 ARGO floats profile the massive 27 million km² North Indian Ocean. Relying purely on floats leaves huge spatial gaps.
            </p>
            <div className="rounded-[var(--radius-sm)] hairline bg-[#1B2530] relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
              {[...Array(25)].map((_, i) => (
                <div key={i} className="absolute w-2.5 h-2.5 bg-[#C8452B] rounded-full" style={{ left: `${Math.random()*90+5}%`, top: `${Math.random()*90+5}%` }} />
              ))}
              <div className="absolute bottom-2 left-2 text-[9px] font-mono text-white/60">~25 profiles today</div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Dense Satellites</h3>
            <p className="opacity-70 mb-6 leading-relaxed">
              Satellites capture the surface perfectly every day at 0.25° resolution. By embedding these surface fields, we reconstruct the deep ocean at satellite resolution.
            </p>
            <div className="rounded-[var(--radius-sm)] hairline bg-gradient-to-br from-[#1B4F72] to-[#C0392B] relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')]" />
              <div className="absolute bottom-2 left-2 text-[9px] font-mono text-white/80">~7,000 grid cells today</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dark depth descent */}
      <section className="bg-[#0F2230] text-white py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl mb-6" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>
            Valid down to 1000 metres
          </h2>
          <p className="opacity-70 leading-relaxed text-lg mb-10 max-w-2xl mx-auto">
            The model decodes the surface latent vector simultaneously across 15 standard depths. Evaluated against unseen ARGO floats for two full years (2022–2023).
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            {[ {d: 50, r: 1.10}, {d: 100, r: 1.68}, {d: 200, r: 1.62}, {d: 500, r: 0.88} ].map(v => (
              <div key={v.d} className="border border-white/20 rounded p-4 bg-white/5">
                <div className="text-xs font-mono opacity-50 mb-1">{v.d}m Depth</div>
                <div className="text-xl font-semibold">{v.r} °C</div>
                <div className="text-[10px] opacity-40 mt-1 uppercase">RMSE</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Keep/Drop Teaser */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-12 items-center">
          <div>
            <h2 className="text-3xl mb-4" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>
              Transparent Science
            </h2>
            <p className="opacity-70 leading-relaxed mb-6">
              We don't just present the final result. In the Model Lab, you can inspect the full lab notebook of our 17 experiments, complete with input ablation studies and Keep/Drop decisions for every architectural choice.
            </p>
            <Link href="/model-lab" className="text-sm font-semibold text-[var(--color-accent)] hover:underline">
              View the Model Lab →
            </Link>
          </div>
          
          <div className="hairline rounded-[var(--radius-md)] p-4 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] text-xs font-mono">
            <div className="opacity-50 mb-2">EXPERIMENT LOG (EXCERPT)</div>
            <div className="space-y-3">
              <div className="flex justify-between items-center hairline-b pb-2">
                <span>EXP-017 (Submitted)</span>
                <span className="bg-[#D8F3DC] text-[#2D6A4F] px-2 py-0.5 rounded">Keep</span>
              </div>
              <div className="flex justify-between items-center hairline-b pb-2">
                <span className="opacity-60">EXP-016 (Drop wind V)</span>
                <span className="bg-[#FBDDDD] text-[#9B2226] px-2 py-0.5 rounded">Drop</span>
              </div>
              <div className="flex justify-between items-center hairline-b pb-2">
                <span className="opacity-60">EXP-015 (Drop wind U)</span>
                <span className="bg-[#FBDDDD] text-[#9B2226] px-2 py-0.5 rounded">Drop</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="opacity-60">EXP-014 (Drop current V)</span>
                <span className="bg-[#FBDDDD] text-[#9B2226] px-2 py-0.5 rounded">Drop</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
