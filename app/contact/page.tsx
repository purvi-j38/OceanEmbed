"use client";
import { AppShell } from "@/components/layout/AppShell";

export default function ContactPage() {
  return (
    <AppShell>
      <div className="p-6 overflow-auto min-h-full bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]">
        <div className="max-w-lg">
          <h1 className="text-2xl mb-1" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>Contact & Support</h1>
          <p className="text-sm opacity-60 mb-8">Get in touch with the OceanEmbed team or report a bug.</p>

          <div className="space-y-6">
            {[
              { heading: "Research enquiries", detail: "For collaboration, data sharing, or methodology questions, contact the INCOIS team via the SIH 2026 portal.", contact: null },
              { heading: "Technical support",  detail: "For bugs or issues with this prototype, raise an issue on the project repository.", contact: null },
              { heading: "Press & outreach",   detail: "For media enquiries and press materials, contact MoES communications.", contact: null },
            ].map(c => (
              <div key={c.heading} className="hairline rounded-[var(--radius-md)] p-4 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
                <div className="font-semibold text-sm mb-0.5">{c.heading}</div>
                <div className="text-xs opacity-60">{c.detail}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 hairline rounded-[var(--radius-md)] p-5 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)]">
            <div className="font-semibold text-sm mb-3">Send a message</div>
            <form onSubmit={e => { e.preventDefault(); alert("Message sent (not connected to backend)."); }} className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono opacity-60 mb-1">Your email</label>
                <input type="email" placeholder="you@example.com" className="w-full px-3 py-2 text-xs hairline rounded-[var(--radius-sm)] bg-transparent focus:bg-[var(--color-hairline)] dark:focus:bg-[var(--color-hairline-dark)] transition-colors" style={{ outline: "none" }} />
              </div>
              <div>
                <label className="block text-[10px] font-mono opacity-60 mb-1">Subject</label>
                <input type="text" placeholder="Bug report, feature request, collaboration..." className="w-full px-3 py-2 text-xs hairline rounded-[var(--radius-sm)] bg-transparent focus:bg-[var(--color-hairline)] dark:focus:bg-[var(--color-hairline-dark)] transition-colors" style={{ outline: "none" }} />
              </div>
              <div>
                <label className="block text-[10px] font-mono opacity-60 mb-1">Message</label>
                <textarea rows={4} placeholder="Describe your question or issue…" className="w-full px-3 py-2 text-xs hairline rounded-[var(--radius-sm)] bg-transparent focus:bg-[var(--color-hairline)] dark:focus:bg-[var(--color-hairline-dark)] transition-colors resize-none" style={{ outline: "none" }} />
              </div>
              <button type="submit" className="px-4 py-2 text-xs rounded-[var(--radius-sm)] text-white hover:opacity-90 transition-opacity" style={{ background: "var(--color-accent)", fontFamily: "var(--font-mono)" }}>
                Send message
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
