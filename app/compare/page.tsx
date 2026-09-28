import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { CompareClient } from "./CompareClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Compare — OceanEmbed",
  description: "Side-by-side comparison of OceanEmbed, GLORYS, and the climatological baseline.",
};

export default function ComparePage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="flex-1 skeleton" style={{ minHeight: "400px" }} />}>
        <CompareClient />
      </Suspense>
    </AppShell>
  );
}
