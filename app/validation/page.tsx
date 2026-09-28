import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { ValidationClient } from "./ValidationClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Validation — OceanEmbed",
  description: "OceanEmbed performance metrics: RMSE, skill, and correlation vs withheld ARGO floats. Test period 2022–2023.",
};

export default function ValidationPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="flex-1 skeleton" style={{ minHeight: "400px" }} />}>
        <ValidationClient />
      </Suspense>
    </AppShell>
  );
}
