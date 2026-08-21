import { ArrowRight } from "lucide-react";
import { CTALink } from "@/components/ui/CTALink";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/lib/i18n/en";

export function FinalCTA({ dict }: { dict: Dictionary }) {
  const t = dict.finalCta;
  return (
    <section
      className="lp-noise relative overflow-hidden border-y border-border bg-surface-2 text-foreground"
      style={{ paddingBlock: "clamp(5rem, 11vh, 8rem)" }}
    >
      {/* The closing band is where the accent earns its keep — but as a single
          hairline rail, not as a bloom. An 80%-tall yellow wash behind the
          closing copy was the loudest thing on the page, and it was sitting
          directly under the one paragraph that has to be read before someone
          decides to sign up. The light behind the copy is achromatic now; the
          only yellow left in the band is the rail and the CTA it points at. */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lp-yellow to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="lp-grid-bg absolute inset-0 opacity-50" />
        <div
          className="lp-air lp-drift"
          style={{
            inset: "auto auto -34% 18%",
            width: "64%",
            height: "84%",
            ["--lp-bloom" as string]: 0.14,
          }}
        />
      </div>

      <Reveal className="relative mx-auto max-w-[720px] px-4 text-center sm:px-6">
        <h2 className="lp-h2 mx-auto max-w-[18ch] text-balance text-foreground">
          {t.h2a} <span className="lp-accent-text">{t.h2b}</span>
        </h2>
        <p className="lp-lead mx-auto mt-5 max-w-[52ch] text-muted-foreground">{t.sub}</p>
        <div className="mt-9 flex justify-center">
          <CTALink href="/signup" size="lg">
            {t.cta}
            <ArrowRight size={18} className="rtl:-scale-x-100" />
          </CTALink>
        </div>
      </Reveal>
    </section>
  );
}
