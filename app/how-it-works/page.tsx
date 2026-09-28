import type { Metadata } from "next";
import { PublicFooter } from "@/components/layout/PublicFooter";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works — OceanEmbed",
  description: "How OceanEmbed reconstructs daily 3-D ocean temperature from satellite surface data.",
};

const STEPS = [
  {
    n: "01",
    title: "The problem",
    body: "The ocean below the surface is almost invisible from space. ARGO floats profile fewer than 500 locations in the North Indian Ocean on any given day — yet forecasters need the full 3-D thermal structure every day, everywhere.",
    svg: (
      <div className="flex gap-0">
        <div className="flex-1 p-3 hairline-r">
          <div className="text-[9px] font-mono opacity-50 mb-1">ARGO float coverage — sparse</div>
          <svg viewBox="0 0 200 100" style={{ width: "100%", height: 80 }}>
            <rect x="0" y="0" width="200" height="100" fill="#D6EAF8" opacity="0.3" />
            {[[20,30],[50,60],[80,20],[110,70],[140,40],[170,55],[35,75],[95,45],[155,25],[60,85]].map(([x,y],i)=>(
              <circle key={i} cx={x} cy={y} r={3} fill="#C8452B" opacity="0.8" />
            ))}
            <text x="100" y="95" textAnchor="middle" style={{fontFamily:"monospace",fontSize:7,opacity:0.5}}>~500 profiles/day · NIO</text>
          </svg>
        </div>
        <div className="flex-1 p-3">
          <div className="text-[9px] font-mono opacity-50 mb-1">Satellite SST — complete coverage</div>
          <svg viewBox="0 0 200 100" style={{ width: "100%", height: 80 }}>
            {Array.from({length:10}).map((_,row)=>Array.from({length:20}).map((_,col)=>{
              const t = 0.4+Math.sin(col*0.4+row*0.6)*0.3+Math.cos(row*0.5)*0.2;
              const r=Math.round(27+t*200);const g=Math.round(80+t*100);const b=Math.round(114+t*50);
              return <rect key={`${row}-${col}`} x={col*10} y={row*10} width={10} height={10} fill={`rgb(${r},${g},${b})`} />;
            }))}
            <text x="100" y="98" textAnchor="middle" style={{fontFamily:"monospace",fontSize:7,fill:"#fff",opacity:0.8}}>SST · 0.05° · daily · global</text>
          </svg>
        </div>
      </div>
    ),
  },
  {
    n: "02",
    title: "Satellite inputs",
    body: "Two daily surface fields are used: CMEMS OSTIA SST and AVISO+ DUACS SSH. Each carries information about the subsurface state through physical linkages — warm eddies depress the thermocline; upwelling brings cold water to the surface.",
    svg: (
      <div className="flex gap-0">
        {[
          { label: "SST (OSTIA)", colors: ["#1B4F72","#2E86C1","#F1C40F","#C0392B"] },
          { label: "SSH (DUACS)", colors: ["#2B5D8A","#D6EAF8","#9B2226"] },
        ].map(f => (
          <div key={f.label} className="flex-1 p-3 hairline-r last:border-0">
            <div className="text-[9px] font-mono opacity-50 mb-1">{f.label}</div>
            <div className="rounded-sm overflow-hidden" style={{ height: 70, background: `linear-gradient(135deg, ${f.colors.join(",")})`, opacity: 0.85 }} />
          </div>
        ))}
      </div>
    ),
  },
  {
    n: "03",
    title: "Harmonisation",
    body: "Both products arrive on different native grids. Both are bilinearly interpolated to the common 0.25° NIO grid (5–30°N, 45–105°E, 101×241 cells). Land cells are masked. Training-period statistics are used for z-score normalisation.",
    svg: (
      <div className="p-4 flex items-center gap-3">
        {[["OSTIA\n0.05°","#1B4F72"], ["DUACS\n0.25°","#B7791F"]].map(([label,color])=>(
          <div key={label as string} className="flex-1 text-center">
            <div className="hairline rounded p-2 text-[9px] font-mono" style={{ color: color as string }}>{(label as string).split("\n").map((l,i)=><div key={i}>{l}</div>)}</div>
          </div>
        ))}
        <div className="text-opacity-40 font-mono text-sm">→</div>
        <div className="flex-1 text-center">
          <div className="hairline rounded p-2 text-[9px] font-mono" style={{ color:"var(--color-accent)", background:"var(--color-accent)20" }}>
            <div>0.25° NIO</div>
            <div className="opacity-60">101×241</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    n: "04",
    title: "Embedding",
    body: "A ConvLSTM encoder with multi-head attention (6 layers, 1024-D latent) compresses each day's surface state. Spatial context — a warm-core eddy signature in SST — is captured by the convolutional receptive field and helps estimate thermocline depth.",
    svg: (
      <div className="p-4">
        <svg viewBox="0 0 460 70" style={{ width: "100%", height: 60 }}>
          {/* Input */}
          <rect x={5} y={10} width={60} height={50} rx={3} fill="none" stroke="#1B4F72" strokeWidth={1.2} opacity={0.7} />
          <text x={35} y={32} textAnchor="middle" style={{fontFamily:"monospace",fontSize:8,fill:"#1B4F72"}}>SST+SSH</text>
          <text x={35} y={44} textAnchor="middle" style={{fontFamily:"monospace",fontSize:7,opacity:0.5}}>2 ch</text>
          <path d="M65 35 H95" stroke="currentColor" strokeWidth={1} opacity={0.4} />
          {/* ConvLSTM blocks */}
          {[100,155,210,265,320,375].map((x,i)=>(
            <g key={x}>
              <rect x={x} y={15} width={50} height={40} rx={3} fill="#1B4F720A" stroke="#1B4F72" strokeWidth={1} opacity={0.6} />
              <text x={x+25} y={33} textAnchor="middle" style={{fontFamily:"monospace",fontSize:7,fill:"#1B4F72"}}>ConvLSTM</text>
              <text x={x+25} y={45} textAnchor="middle" style={{fontFamily:"monospace",fontSize:7,opacity:0.4}}>L{i+1}</text>
              {i<5 && <path d={`M${x+50} 35 H${x+55}`} stroke="currentColor" strokeWidth={1} opacity={0.4} />}
            </g>
          ))}
          <path d="M425 35 H435" stroke="currentColor" strokeWidth={1} opacity={0.4} />
          {/* Latent */}
          <rect x={435} y={18} width={22} height={34} rx={3} fill="#2D6A4F20" stroke="#2D6A4F" strokeWidth={1.2} />
          <text x={446} y={35} textAnchor="middle" style={{fontFamily:"monospace",fontSize:7,fill:"#2D6A4F"}}>z</text>
          <text x={446} y={46} textAnchor="middle" style={{fontFamily:"monospace",fontSize:6,opacity:0.5}}>1024</text>
        </svg>
      </div>
    ),
  },
  {
    n: "05",
    title: "Reconstruction",
    body: "A convolutional decoder maps the 1024-D latent vector to 15 temperature maps simultaneously, one per depth level (0–1000 m). A physics-informed loss penalises statically unstable profiles (where temperature increases with depth).",
    svg: (
      <div className="p-4 flex items-center gap-4">
        <div className="text-center">
          <div className="text-[9px] font-mono opacity-50 mb-1">Latent z</div>
          <div className="w-8 hairline rounded" style={{ height: 60, background: "linear-gradient(to bottom,#2D6A4F,#1B4F72)" }} />
        </div>
        <div className="text-opacity-40 font-mono text-sm">→</div>
        <div className="flex gap-1">
          {[0,50,100,200,500].map(d=>(
            <div key={d} className="text-center">
              <div className="text-[8px] font-mono opacity-40 mb-1">{d}m</div>
              <div className="w-8 rounded-sm" style={{ height: 60, background: `linear-gradient(to bottom, #C0392B${Math.round(100+d/10).toString(16)}, #1B4F72)`, opacity: 0.7+d*0.0003 }} />
            </div>
          ))}
          <div className="text-[9px] font-mono opacity-40 self-center ml-1">…15 levels</div>
        </div>
      </div>
    ),
  },
  {
    n: "06",
    title: "Validation",
    body: "The test set is held-out gridded ARGO (2022–2023). This data was not used in training or model selection. GLORYS12 serves as a reference reanalysis. Skill decreases with depth as expected — OceanEmbed outperforms the climatological baseline at all depth levels.",
    svg: (
      <div className="p-4">
        <div className="text-[9px] font-mono opacity-50 mb-2">RMSE vs depth · Test period · OceanEmbed vs baseline</div>
        <svg viewBox="0 0 380 90" style={{ width: "100%", height: 80 }}>
          {/* Grid lines */}
          {[0,1,2,3].map(v=>(
            <line key={v} x1={40+v*80} y1={0} x2={40+v*80} y2={75} stroke="currentColor" strokeOpacity={0.07} strokeWidth={1} />
          ))}
          {/* Curves — simplified RMSE profile */}
          <polyline points="40,5 80,8 120,18 160,35 200,45 240,48 300,44 360,40" fill="none" stroke="#8A9BA8" strokeWidth={1.5} opacity={0.6} />
          <polyline points="40,2 80,4 120,10 160,22 200,30 240,32 300,28 360,25" fill="none" stroke="#1B4F72" strokeWidth={2.2} />
          <text x={365} y={27} style={{fontFamily:"monospace",fontSize:8,fill:"#1B4F72"}}>OE</text>
          <text x={365} y={42} style={{fontFamily:"monospace",fontSize:8,opacity:0.5}}>Base</text>
          <text x={20} y={5} style={{fontFamily:"monospace",fontSize:7,opacity:0.5,writingMode:"vertical-lr",transform:"rotate(180deg)"}}>0m</text>
          <text x={20} y={70} style={{fontFamily:"monospace",fontSize:7,opacity:0.5}}>1000m</text>
          <text x={200} y={87} textAnchor="middle" style={{fontFamily:"monospace",fontSize:7,opacity:0.5}}>RMSE (°C)</text>
        </svg>
      </div>
    ),
  },
];

export default function HowItWorksPage() {
  return (
    <div
      className="min-h-screen bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] text-[var(--color-ink)] dark:text-[var(--color-ink-dark)]"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Mini nav */}
      <header className="hairline-b bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
        <div className="max-w-5xl mx-auto px-6 h-11 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-tight flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
              <path d="M2 14 Q6 6 11 10 Q16 14 20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
            OceanEmbed
          </Link>
          <Link href="/explore" className="text-xs px-3 py-1 bg-[var(--color-accent)] text-white rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity">
            Open Explorer
          </Link>
        </div>
      </header>

      {/* Article */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="max-w-xl mb-12">
          <div className="text-xs font-mono opacity-50 tracking-widest mb-3 uppercase">Method overview</div>
          <h1 className="text-3xl mb-4" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>
            How OceanEmbed reconstructs the subsurface ocean.
          </h1>
          <p className="text-sm opacity-70 leading-relaxed">
            Six steps, from data ingestion to a validated 3-D temperature field.
            Each step is a link in a chain — a failure at any stage is flagged and propagated to the user interface.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical rail */}
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-[var(--color-hairline)] dark:bg-[var(--color-hairline-dark)]" />

          <div className="flex flex-col gap-12">
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-8 relative">
                {/* Step number */}
                <div
                  className="w-14 h-14 shrink-0 rounded-full bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] hairline flex items-center justify-center z-10"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600 }}
                >
                  {s.n}
                </div>

                {/* Content */}
                <div className="flex-1 pt-3">
                  <h2 className="text-lg mb-2" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>{s.title}</h2>
                  <p className="text-sm opacity-75 leading-relaxed mb-4 max-w-lg">{s.body}</p>

                  {/* Inline figure */}
                  <div
                    className="hairline rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]"
                    style={{ maxWidth: 500 }}
                  >
                    {s.svg}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 hairline-t pt-8 flex items-center gap-4">
          <p className="text-sm opacity-60">Open this method in action on a real date.</p>
          <Link
            href="/explore?date=2023-10-15&depth=100&layer=OceanEmbed&region=North+Indian+Ocean"
            className="px-4 py-2 bg-[var(--color-accent)] text-white text-sm rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
          >
            Open 15 Oct 2023 in Explorer →
          </Link>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
