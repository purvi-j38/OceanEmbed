import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { ExplorerClient } from "./ExplorerClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Explorer — OceanEmbed",
  description: "Interactive map of daily subsurface temperature, 0–1000 m, North Indian Ocean.",
};

export default function ExplorePage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="flex-1 skeleton" style={{ minHeight: "calc(100vh - 44px)" }} />}>
        <ExplorerClient />
      </Suspense>
    </AppShell>
  );
}
