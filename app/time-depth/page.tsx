import { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { TimeDepthClient } from "./TimeDepthClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Time–depth (Hovmöller) — OceanEmbed",
  description: "Hovmöller diagram showing ocean temperature evolution over time and depth at a fixed point.",
};

export default function TimeDepthPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="flex-1 skeleton" style={{ minHeight: "400px" }} />}>
        <TimeDepthClient />
      </Suspense>
    </AppShell>
  );
}
