import { Reveal } from "@/components/ui/Reveal";
import { getShowcase } from "@/lib/showcase/fetch";
import { sortReels } from "@/lib/showcase/sort";
import type { Dictionary } from "@/lib/i18n/en";
import { TrendingExplorer } from "./TrendingExplorer";
import { ReelWall } from "./ReelWall";

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

  // The wall draws from every niche at once — it is the "here is the whole
  // firehose" moment, and the per-niche cut is what the explorer below is for.
  // Ranked by out-performance so the strongest reels are the ones on screen.
  const wallReels = sortReels(
    data.niches.flatMap((n) => n.reels),
    "score"
  );

  return (
    // Not <Section>: the wall has to bleed past the 1240px container to the
    // viewport edges, and a band that stops at a content margin stops reading
    // as a feed running past you.
    <section
      id="live"
      className="lp-noise relative scroll-mt-20 overflow-hidden bg-surface-2 text-foreground"
      style={{ paddingBlock: "clamp(4.5rem, 9vh, 7.5rem)" }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="lp-air"
          style={{
            inset: "-30% -10% auto -10%",
            height: "70%",
            ["--lp-bloom" as string]: 0.09,
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1240px] px-4 sm:px-6">
        <Reveal className="mx-auto flex max-w-[46rem] flex-col items-center gap-5 text-center">
          <span className="lp-eyebrow">{t.eyebrow}</span>
          <h2 className="lp-h2 text-balance text-foreground">
            {t.h2a} <span className="text-muted-foreground">{t.h2b}</span>
          </h2>
          <p className="lp-lead max-w-[54ch] text-muted-foreground">{t.body}</p>
        </Reveal>
      </div>

      {/* Full-bleed band. `mx-[calc(50%-50vw)]` is the standard escape from a
          centered container; `body { overflow-x: hidden }` (globals.css) absorbs
          the scrollbar-width difference between 100vw and the visual viewport. */}
      <div className="relative mx-[calc(50%-50vw)] mt-12 w-screen sm:mt-14">
        <ReelWall reels={wallReels} dict={dict} rtl={dict.meta.dir === "rtl"} />
      </div>

      <div className="relative mx-auto w-full max-w-[1240px] px-4 sm:px-6">
        {/* Hand-off from the spectacle to the proof. The wall says "look at the
            volume"; the explorer says "fine — sort it yourself". */}
        <Reveal className="mx-auto mt-16 flex max-w-[46rem] flex-col items-center gap-4 text-center sm:mt-20">
          <hr className="lp-rule w-full max-w-[16rem]" />
          <h3 className="lp-h3 text-balance text-foreground">{t.exploreTitle}</h3>
          <p className="max-w-[52ch] text-[0.95rem] leading-relaxed text-muted-foreground">
            {t.exploreBody}
          </p>
        </Reveal>

        <Reveal className="mt-10">
          <TrendingExplorer data={data} dict={dict} />
        </Reveal>
      </div>
    </section>
  );
}
