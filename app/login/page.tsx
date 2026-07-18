import type { Metadata } from "next";
import { AuthScreen } from "@/components/site/AuthScreen";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your ReelSpy dashboard.",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return <AuthScreen mode="login" />;
}
