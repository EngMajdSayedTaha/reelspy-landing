import type { Metadata } from "next";
import { PageShell } from "@/components/site/PageShell";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How ReelSpy handles your data: per-user isolation, anonymized niche trends, server-side tokens, and export or deletion anytime.",
};

function Block({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold text-foreground">{heading}</h2>
      <p>{children}</p>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <PageShell
      title="Privacy"
      intro="Your data is yours. This summary describes how ReelSpy handles it; the full policy governs the product."
    >
      <Block heading="Per-user isolation">
        Every account is isolated with row-level security. Your tracked accounts, scripts, and analytics are never visible to other users.
      </Block>
      <Block heading="Anonymized niche intelligence">
        Niche Radar aggregates activity across users anonymously. Nobody can see what any individual tracks — you see the trend, never the source.
      </Block>
      <Block heading="Social tokens stay server-side">
        Tokens for connected social platforms are stored server-side and are never exposed to the browser. ReelSpy reads only public data from the accounts you choose to track.
      </Block>
      <Block heading="Export & deletion">
        You can export a full copy of your data or delete your account at any time. Deletion removes your personal data and revokes connected tokens.
      </Block>
    </PageShell>
  );
}
