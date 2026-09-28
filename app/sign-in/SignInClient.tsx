"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

export function SignInClient({ isModal, onSuccess }: { isModal?: boolean; onSuccess?: () => void }) {
  const [showPw, setShowPw] = useState(false);
  const { signIn, signInAsAdmin } = useAuth();
  const router = useRouter();
  
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    signIn();
    if (onSuccess) onSuccess();
    else router.push("/dashboard");
  };

  const handleDemoSignIn = () => {
    signIn();
    if (onSuccess) onSuccess();
    else router.push("/dashboard");
  };

  const handleAdminSignIn = () => {
    signInAsAdmin();
    if (onSuccess) onSuccess();
    else router.push("/dashboard");
  };


  const formContent = (
    <div className="flex-1 flex flex-col justify-center px-8 md:px-16 w-full max-w-md mx-auto py-12">
      {!isModal && (
        <Link
          href="/"
          className="mb-10 text-sm font-semibold flex items-center gap-2 transition-opacity"
          style={{ opacity: 0.7 }}
        >
          ← OceanEmbed
        </Link>
      )}

      <h1
        className="text-2xl mb-1"
        style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}
      >
        Sign in
      </h1>
      <p className="text-sm mb-8" style={{ opacity: 0.6 }}>
        Or{" "}
        <Link
          href="/explore"
          className="hover:underline"
          style={{ color: "var(--color-accent)" }}
          onClick={() => { if (onSuccess) onSuccess(); }}
        >
          continue as guest
        </Link>{" "}
        — all scientific pages are open without an account.
      </p>

      <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
        {/* Email */}
        <div>
          <label
            htmlFor="sign-in-email"
            className="block text-xs mb-1.5"
            style={{ fontFamily: "var(--font-mono)", opacity: 0.6 }}
          >
            Email address
          </label>
          <input
            id="sign-in-email"
            type="email"
            autoComplete="email"
            className="w-full px-3 py-2 text-sm hairline rounded-[var(--radius-sm)] bg-transparent focus:bg-[var(--color-hairline)] dark:focus:bg-[var(--color-hairline-dark)] transition-colors"
            style={{ outline: "none" }}
            placeholder="you@organisation.in"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between mb-1.5">
            <label
              htmlFor="sign-in-password"
              className="text-xs"
              style={{ fontFamily: "var(--font-mono)", opacity: 0.6 }}
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs hover:underline"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="sign-in-password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              className="w-full px-3 py-2 pr-12 text-sm hairline rounded-[var(--radius-sm)] bg-transparent focus:bg-[var(--color-hairline)] dark:focus:bg-[var(--color-hairline-dark)] transition-colors"
              style={{ outline: "none" }}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] transition-opacity"
              style={{ fontFamily: "var(--font-mono)", opacity: 0.5 }}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? "hide" : "show"}
            </button>
          </div>
        </div>

        {/* Remember */}
        <div className="flex items-center gap-2">
          <input id="sign-in-remember" type="checkbox" className="w-3.5 h-3.5" />
          <label
            htmlFor="sign-in-remember"
            className="text-xs"
            style={{ opacity: 0.6 }}
          >
            Remember me for 30 days
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2.5 text-sm font-medium rounded-[var(--radius-sm)] transition-opacity hover:opacity-90 mt-2"
          style={{ background: "var(--color-accent)", color: "#fff" }}
        >
          Sign in
        </button>

        <div className="hairline-t pt-4 mt-2 flex flex-col gap-2">
          <button
            type="button"
            id="signin-demo"
            onClick={handleDemoSignIn}
            className="w-full py-2.5 text-sm hairline rounded-[var(--radius-sm)] hover:bg-[var(--color-hairline)] transition-colors"
          >
            Continue with demo account
          </button>
          <button
            type="button"
            id="signin-admin"
            onClick={handleAdminSignIn}
            className="w-full py-2 text-xs hairline rounded-[var(--radius-sm)] hover:bg-[var(--color-hairline)] transition-colors opacity-60"
          >
            Sign in as Admin
          </button>
        </div>

        <div className="text-sm text-center mt-3" style={{ opacity: 0.6 }}>
          No account?{" "}
          <Link
            href="/sign-up"
            onClick={() => { if (isModal && onSuccess) onSuccess(); }}
            className="hover:underline"
            style={{ color: "var(--color-accent)" }}
          >
            Create one free
          </Link>
        </div>
      </form>
    </div>
  );

  if (isModal) {
    return formContent;
  }

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "var(--color-surface)",
        color: "var(--color-ink)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {formContent}

      {/* ── Right: annotated figure (desktop only) ─────────── */}
      <div
        className="hidden lg:flex flex-1 hairline-l flex-col justify-center p-12"
        style={{ background: "var(--color-card)" }}
      >
        <div
          className="hairline rounded-[var(--radius-md)] overflow-hidden mb-4"
          style={{
            aspectRatio: "4/3",
            background:
              "linear-gradient(180deg, #1B4F72 0%, #2E86C1 35%, #AED6F1 65%, #D6EAF8 85%, #EBF5FB 100%)",
          }}
        >
          <div className="w-full h-full relative">
            <div
              className="absolute top-6 left-1/2 -translate-x-1/2 text-center"
              style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#fff" }}
            >
              <span
                className="inline-block px-2 py-1 rounded hairline"
                style={{ background: "rgba(0,0,0,0.25)" }}
              >
                Warm-core eddy · Bay of Bengal · 100 m
              </span>
            </div>
            <div
              className="absolute bottom-3 left-3"
              style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}
            >
              OceanEmbed · Temperature at 100 m · 15 Oct 2023
            </div>
          </div>
        </div>
        <p
          className="leading-relaxed max-w-xs"
          style={{ fontFamily: "var(--font-mono)", fontSize: 11, opacity: 0.4 }}
        >
          Accounts add saved views, alerts, and bulk downloads.
          The scientific data is always open to guests.
        </p>
      </div>
    </div>
  );
}
