import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileClient } from "./ProfileClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Profile Viewer — OceanEmbed",
  description: "Temperature profile 0–1000 m: OceanEmbed vs GLORYS vs ARGO at a selected point and date.",
};

export default function ProfilePage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="flex-1 skeleton" style={{ minHeight: "400px" }} />}>
        <ProfileClient />
      </Suspense>
    </AppShell>
  );
}
