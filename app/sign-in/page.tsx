import type { Metadata } from "next";
import { SignInClient } from "@/app/sign-in/SignInClient";

export const metadata: Metadata = {
  title: "Sign In — OceanEmbed",
  description: "Sign in to OceanEmbed to access saved views, alerts, and bulk downloads.",
};

export default function SignInPage() {
  return <SignInClient />;
}
