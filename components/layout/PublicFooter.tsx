import Link from "next/link";

export function PublicFooter() {
  return (
    <footer
      className="hairline-t bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] mt-0"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs">
        {/* Branding */}
        <div>
          <div className="font-semibold mb-2 text-[var(--color-accent)] dark:text-[var(--color-accent-dark)]">OceanEmbed</div>
          <div className="opacity-60 leading-relaxed">
            INCOIS / MoES<br/>
            Smart India Hackathon 2026<br/>
            Problem Statement SIH26066
          </div>
        </div>

        {/* Scientific links */}
        <div>
          <div className="font-semibold mb-2 opacity-50 uppercase tracking-widest text-[10px]">Science</div>
          <div className="flex flex-col gap-1.5 opacity-70">
            <Link href="/methodology" className="hover:opacity-100 transition-opacity">Methodology</Link>
            <Link href="/data-sources" className="hover:opacity-100 transition-opacity">Data sources</Link>
            <Link href="/limitations" className="hover:opacity-100 transition-opacity">Limitations</Link>
            <Link href="/validation" className="hover:opacity-100 transition-opacity">Validation</Link>
          </div>
        </div>

        {/* Site links */}
        <div>
          <div className="font-semibold mb-2 opacity-50 uppercase tracking-widest text-[10px]">Site</div>
          <div className="flex flex-col gap-1.5 opacity-70">
            <Link href="/terms" className="hover:opacity-100 transition-opacity">Terms</Link>
            <Link href="/privacy" className="hover:opacity-100 transition-opacity">Privacy</Link>
            <Link href="/citation" className="hover:opacity-100 transition-opacity">Citation</Link>
            <Link href="/contact" className="hover:opacity-100 transition-opacity">Contact</Link>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 pb-4 hairline-t pt-4 flex flex-wrap gap-4 items-center justify-between text-[10px] opacity-40">
        <span>© 2026 INCOIS / MoES. Data provided for research and educational use.</span>
        <span>Model v0.1 · Not for operational use without validation.</span>
      </div>
    </footer>
  );
}
