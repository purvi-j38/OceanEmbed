"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

const ROLES = ["Student / intern", "Researcher / scientist", "Forecaster", "Industry / private sector", "Other"];

export function SignUpClient() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [org, setOrg]         = useState("");
  const [role, setRole]       = useState(ROLES[1]);
  const [showPw, setShowPw]   = useState(false);
  const [agreed, setAgreed]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const strength = (pw: string) => {
    if (pw.length < 6) return 0;
    let s = 1;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const pw_strength = strength(password);
  const strColors = ["", "#9B2226", "#E67E22", "#F1C40F", "#2D6A4F", "#1B4F72"];
  const strLabels = ["", "Weak", "Fair", "Good", "Strong", "Very strong"];

  const handleStep1 = () => {
    if (!name || !email || !password) { setError("Please fill all fields."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email."); return; }
    if (pw_strength < 2) { setError("Password is too weak."); return; }
    setError("");
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!agreed) { setError("Please agree to the terms to continue."); return; }
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 800));
    signIn({ name, email, role: `${role} · ${org || "Independent"}` });
    router.push("/welcome");
  };

  const demoSignIn = () => {
    signIn({ name: "Dr. Ananya Rao", email: "ananya.rao@incois.gov.in", role: "Researcher · INCOIS" });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-surface)]" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Left: ocean figure */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden" style={{ background: "#0F2230" }}>
        <div className="absolute inset-0">
          <svg viewBox="0 0 600 800" style={{ width: "100%", height: "100%", opacity: 0.7 }}>
            {Array.from({ length: 15 }).map((_, di) => {
              const depths = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000];
              const d = depths[di];
              const t = 29 * Math.exp(-d / 200) + 5;
              const y = 50 + (di / 14) * 700;
              const g = Math.round(50 + (t / 30) * 150);
              const b = Math.round(80 + (t / 30) * 100);
              return (
                <g key={d}>
                  <line x1={60} y1={y} x2={540} y2={y} stroke={`rgb(30,${g},${b})`} strokeWidth={di < 4 ? 3 : 2} opacity={0.6 + (14 - di) * 0.02} />
                  <text x={52} y={y + 4} textAnchor="end" style={{ fontFamily: "monospace", fontSize: 9, fill: "rgba(255,255,255,0.4)" }}>{d}m</text>
                  <text x={548} y={y + 4} style={{ fontFamily: "monospace", fontSize: 9, fill: `rgb(30,${g},${b})`, opacity: 0.8 }}>{t.toFixed(1)}°C</text>
                </g>
              );
            })}
            <text x={300} y={30} textAnchor="middle" style={{ fontFamily: "monospace", fontSize: 10, fill: "rgba(255,255,255,0.4)" }}>OCEAN TEMPERATURE PROFILE · BAY OF BENGAL</text>
          </svg>
        </div>
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <div className="text-xs font-mono opacity-40 mb-2 uppercase tracking-widest">OceanEmbed</div>
          <div className="text-xl leading-tight" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>
            "OceanEmbed fills the gap between what satellites see and what lies below."
          </div>
          <div className="text-xs opacity-40 mt-3 font-mono">Bay of Bengal · 14°N, 88°E · Temperature profile, 0–1000 m</div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-md mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none" style={{ color: "var(--color-accent)" }}>
            <path d="M2 14 Q6 6 11 10 Q16 14 20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M2 18 Q6 12 11 14 Q16 16 20 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5"/>
          </svg>
          <span className="text-sm font-semibold">OceanEmbed</span>
        </Link>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-semibold ${step >= s ? "text-white" : "opacity-30 hairline"}`} style={{ background: step >= s ? "var(--color-accent)" : "transparent" }}>
                {s < step ? "✓" : s}
              </div>
              {s < 2 && <div className={`w-8 h-px ${step > s ? "" : "opacity-20"}`} style={{ background: "var(--color-accent)" }} />}
            </div>
          ))}
          <span className="text-xs font-mono opacity-50 ml-2">{step === 1 ? "Account details" : "About you"}</span>
        </div>

        <div className="w-full">
          <h1 className="text-2xl font-semibold mb-1">{step === 1 ? "Create your account" : "A bit about you"}</h1>
          <p className="text-sm opacity-60 mb-6">{step === 1 ? "Free. No payment details needed." : "Helps us tailor the interface for you."}</p>

          {error && (
            <div className="mb-4 px-3 py-2 rounded hairline text-sm" style={{ background: "var(--color-error-bg)", color: "var(--color-error)" }}>
              {error}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono opacity-60 mb-1">Full name</label>
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Dr. Ananya Rao"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm hairline rounded-[var(--radius-sm)] bg-transparent focus:bg-[var(--color-hairline)] outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-mono opacity-60 mb-1">Email address</label>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@institution.ac.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm hairline rounded-[var(--radius-sm)] bg-transparent focus:bg-[var(--color-hairline)] outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-mono opacity-60 mb-1">Password</label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 text-sm hairline rounded-[var(--radius-sm)] bg-transparent focus:bg-[var(--color-hairline)] outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-50 hover:opacity-100 px-1"
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-1.5">
                    <div className="flex gap-0.5 mb-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="h-1 flex-1 rounded-full transition-colors" style={{ background: i <= pw_strength ? strColors[pw_strength] : "var(--color-hairline)" }} />
                      ))}
                    </div>
                    <div className="text-[10px] font-mono" style={{ color: strColors[pw_strength] }}>{strLabels[pw_strength]}</div>
                  </div>
                )}
              </div>
              <button
                id="signup-next"
                onClick={handleStep1}
                className="w-full py-2.5 text-sm font-medium text-white rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
                style={{ background: "var(--color-accent)" }}
              >
                Continue →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono opacity-60 mb-1">Organisation (optional)</label>
                <input
                  id="signup-org"
                  type="text"
                  placeholder="INCOIS, IIT, IITM, NRSC…"
                  value={org}
                  onChange={e => setOrg(e.target.value)}
                  className="w-full px-3 py-2 text-sm hairline rounded-[var(--radius-sm)] bg-transparent focus:bg-[var(--color-hairline)] outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-mono opacity-60 mb-1">Role</label>
                <div className="flex flex-wrap gap-1.5">
                  {ROLES.map(r => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`text-xs px-2.5 py-1 rounded-full hairline transition-colors ${role === r ? "text-white border-transparent" : "hover:bg-[var(--color-hairline)]"}`}
                      style={role === r ? { background: "var(--color-accent)" } : {}}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <input
                  id="signup-agree"
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="mt-0.5"
                />
                <label htmlFor="signup-agree" className="text-xs opacity-70">
                  I agree to the <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>. Data is used for research only.
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 text-sm hairline rounded-[var(--radius-sm)] hover:bg-[var(--color-hairline)] transition-colors"
                >
                  ← Back
                </button>
                <button
                  id="signup-submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-2.5 text-sm font-medium text-white rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ background: "var(--color-accent)" }}
                >
                  {loading ? "Creating…" : "Create account"}
                </button>
              </div>
            </div>
          )}

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 hairline-b" />
            <span className="text-xs opacity-40">or</span>
            <div className="flex-1 hairline-b" />
          </div>

          <button
            id="signup-demo"
            onClick={demoSignIn}
            className="w-full py-2.5 text-sm hairline rounded-[var(--radius-sm)] hover:bg-[var(--color-hairline)] transition-colors"
          >
            Continue with demo account
          </button>

          <p className="text-xs text-center mt-4 opacity-60">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline" style={{ color: "var(--color-accent)" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
