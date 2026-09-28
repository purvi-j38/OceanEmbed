"use client";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-surface)]" style={{ fontFamily: "var(--font-sans)" }}>
      <div className="w-full max-w-sm">
        <Link href="/sign-in" className="inline-block mb-6 text-sm opacity-60 hover:opacity-100">← Back to sign in</Link>
        <h1 className="text-2xl mb-2" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>Reset password</h1>
        
        {sent ? (
          <div className="p-4 rounded hairline bg-[var(--color-card)] mt-4">
            <p className="text-sm opacity-80 mb-4">We've sent a password reset link to <strong>{email}</strong> if it exists in our system.</p>
            <button onClick={() => setSent(false)} className="text-xs underline opacity-60">Try another email</button>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="mt-4 flex flex-col gap-4">
            <p className="text-sm opacity-60">Enter your email address and we'll send you a link to reset your password.</p>
            <div>
              <label className="block text-xs font-mono opacity-60 mb-1">Email address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm hairline rounded bg-transparent focus:bg-[var(--color-hairline)] outline-none" 
              />
            </div>
            <button type="submit" className="w-full py-2 text-sm font-medium text-white rounded bg-[var(--color-accent)] hover:opacity-90">Send reset link</button>
          </form>
        )}
      </div>
    </div>
  );
}
