import { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { CrossSectionsClient } from "./CrossSectionsClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Cross-sections — OceanEmbed",
  description: "2-D vertical cross-sections through the North Indian Ocean — temperature vs depth along latitude or longitude transects.",
};

export default function CrossSectionsPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="flex-1 skeleton" style={{ minHeight: "400px" }} />}>
        <CrossSectionsClient />
      </Suspense>
    </AppShell>
  );
}
