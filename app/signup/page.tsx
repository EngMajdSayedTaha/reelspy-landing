import type { Metadata } from "next";
import { AuthScreen } from "@/components/site/AuthScreen";

export const metadata: Metadata = {
  title: "Start free",
  description: "Create your free ReelSpy account — no card needed.",
  robots: { index: false, follow: true },
};

export default function SignupPage() {
  return <AuthScreen mode="signup" />;
}
