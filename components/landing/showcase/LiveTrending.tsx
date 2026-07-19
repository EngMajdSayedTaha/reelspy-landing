import { Section, SectionHeading } from "../Section";
import { Reveal } from "@/components/ui/Reveal";
import { getShowcase } from "@/lib/showcase/fetch";
import type { Dictionary } from "@/lib/i18n/en";
import { TrendingExplorer } from "./TrendingExplorer";

// Server component: the dashboard's public endpoint is fetched server-to-server
// and cached by Next, so a visitor never waits on it and the service-role data
// path never touches the browser. Falls back to curated fixtures when the live
// data isn't usable — see lib/showcase/fetch.
export async function LiveTrending({ dict }: { dict: Dictionary }) {
  const data = await getShowcase();
  const t = dict.showcase;

  // With no niches at all there is nothing to demonstrate; drop the section
  // rather than render an empty shell.
  if (data.niches.length === 0) return null;

  return (
    <Section id="live" className="bg-surface-2">
      <SectionHeading
        eyebrow={t.eyebrow}
        title={t.h2a}
        titleAccent={t.h2b}
        description={t.body}
        align="center"
        className="mx-auto mb-12"
      />
      <Reveal>
        <TrendingExplorer data={data} dict={dict} />
      </Reveal>
    </Section>
  );
}
