import type { Metadata } from "next";
import { SignUpClient } from "./SignUpClient";

export const metadata: Metadata = {
  title: "Create Account — OceanEmbed",
  description: "Create a free OceanEmbed account to save views, set alerts, and download data.",
};

export default function SignUpPage() {
  return <SignUpClient />;
}
