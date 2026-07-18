import type { Metadata } from "next";
import { PageShell } from "@/components/site/PageShell";

export const metadata: Metadata = {
  title: "Cookies",
  description: "How ReelSpy uses cookies and local preferences.",
};

function Block({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold text-foreground">{heading}</h2>
      <p>{children}</p>
    </section>
  );
}

export default function CookiesPage() {
  return (
    <PageShell title="Cookie Policy" intro="ReelSpy uses a minimal set of cookies and local preferences.">
      <Block heading="Essential">
        Required to keep you signed in and to remember your language and theme preferences. These cannot be turned off without breaking core functionality.
      </Block>
      <Block heading="Preferences">
        Your language (English / العربية) and light/dark choice are stored so the site loads the way you left it.
      </Block>
      <Block heading="Analytics">
        Aggregate, privacy-respecting analytics help us understand what&apos;s useful. No cross-site advertising trackers are used.
      </Block>
    </PageShell>
  );
}
