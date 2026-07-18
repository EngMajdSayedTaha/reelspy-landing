import type { Metadata } from "next";
import { PageShell } from "@/components/site/PageShell";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms that govern your use of ReelSpy.",
};

function Block({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold text-foreground">{heading}</h2>
      <p>{children}</p>
    </section>
  );
}

export default function TermsPage() {
  return (
    <PageShell title="Terms of Service" intro="A short summary of the terms governing your use of ReelSpy.">
      <Block heading="Acceptable use">
        ReelSpy helps you study public content structure and create original work. You agree not to use it to republish others&apos; content as your own.
      </Block>
      <Block heading="Your content">
        You retain ownership of everything you create with ReelSpy, including AI-assisted scripts written in your brand voice.
      </Block>
      <Block heading="Plans & billing">
        Paid plans are billed monthly in AED through Stripe. You can upgrade, downgrade, or cancel at any time; access continues until the end of the paid period.
      </Block>
      <Block heading="Availability">
        We aim for high availability but provide the service on an &quot;as is&quot; basis. Feature limits per plan are described on the pricing page.
      </Block>
    </PageShell>
  );
}
