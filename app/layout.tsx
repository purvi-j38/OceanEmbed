import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-mono",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OceanEmbed — Daily Subsurface Ocean Temperature",
  description:
    "Daily 3-D subsurface temperature reconstructed from satellite surface data alone. 0–1000 m, 15 depths, 0.25° grid, North Indian Ocean. INCOIS / MoES, SIH 2026.",
};

import { GlossaryProvider } from "@/components/providers/GlossaryProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { AuthModalProvider } from "@/components/providers/AuthModalProvider";
import { WhatIsThis } from "@/components/layout/WhatIsThis";
import { CommandPalette } from "@/components/layout/CommandPalette";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${newsreader.variable}`}
    >
      <body>
        <ThemeProvider>
          <AuthModalProvider>
            <ToastProvider>
              <GlossaryProvider>
                {children}
                <WhatIsThis />
                <CommandPalette />
              </GlossaryProvider>
            </ToastProvider>
          </AuthModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
