import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";
import { CTALink } from "@/components/ui/CTALink";
import type { Dictionary } from "@/lib/i18n/en";
import type { Locale } from "@/lib/i18n/config";
import { HeroArt } from "./HeroArt";

export function Hero({ dict, locale = "en" }: { dict: Dictionary; locale?: Locale }) {
  const t = dict.hero;
  return (
    <section
      id="top"
      className="lp-noise relative overflow-hidden bg-background text-foreground"
      style={{ paddingBlock: "clamp(7.5rem, 13vh, 11rem) clamp(3rem, 8vh, 6rem)" }}
    >
      {/* Ambient background (decorative).
          This used to be two yellow blooms sitting directly behind the headline
          and the lead paragraph — which is why the copy kept reading as washed
          out no matter how the opacity was tuned. The light is achromatic now
          (see .lp-air) and anchored to the corners, so it lifts the page without
          ever tinting text. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="lp-grid-bg absolute inset-0 opacity-70" />
        <div
          className="lp-air lp-drift"
          style={{
            inset: "-22% auto auto -18%",
            width: "52%",
            height: "62%",
            ["--lp-bloom" as string]: 0.11,
          }}
        />
        <div
          className="lp-air lp-drift hidden sm:block"
          style={{
            inset: "auto -14% -26% auto",
            width: "56%",
            height: "68%",
            ["--lp-bloom" as string]: 0.08,
            animationDelay: "-8s",
          }}
        />
        {/* Fade into the section below */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        {/* Copy */}
        <div className="text-center lg:text-start">
          <p className="lp-eyebrow mb-6" data-reveal="">
            {t.eyebrow}
          </p>

          <h1 className="lp-h1 mx-auto max-w-[15ch] lg:mx-0">
            {t.h1a} <span className="lp-accent-text">{t.h1grad}</span>
          </h1>

          <p className="lp-lead mx-auto mt-7 max-w-[52ch] text-muted-foreground lg:mx-0">{t.sub}</p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <CTALink href="/signup" size="lg" className="w-full sm:w-auto">
              {t.ctaPrimary}
              <ArrowRight size={18} className="rtl:-scale-x-100" />
            </CTALink>
            <CTALink href="#how" variant="ghost" size="lg" magnetic={false} className="w-full sm:w-auto">
              {t.ctaSecondary}
              <ChevronDown size={18} />
            </CTALink>
          </div>

          {/* Trust row. Now on its own hairline shelf rather than floating as
              loose grey text — three unrelated fragments with no container is
              the thing that most reliably makes a hero look unfinished. */}
          <ul className="mt-9 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-2xl border border-border bg-card/60 px-4 py-3 text-[0.82rem] text-muted-foreground backdrop-blur-sm lg:justify-start">
            <li className="inline-flex items-center gap-1.5 font-medium text-foreground/80">
              <ShieldCheck size={15} className="text-lp-yellow-ink" /> {t.trust1}
            </li>
            <li aria-hidden className="hidden h-3.5 w-px bg-border sm:block" />
            <li className="inline-flex items-center gap-1.5">{t.trust2}</li>
            <li aria-hidden className="hidden h-3.5 w-px bg-border sm:block" />
            <li className="inline-flex items-center gap-1.5">{t.trust3}</li>
          </ul>
        </div>

        {/* Interactive 3D card stack.
            It no longer jumps above the copy on mobile. `order-first` meant a
            phone opened on a wordless card deck: the headline, the sub and the
            CTA all started below the fold, so the first screen of the site said
            nothing about what the product is. In the two-column layout from lg
            up the art sits on the right regardless, so nothing is lost. */}
        <div className="relative">
          <HeroArt
            rtl={locale === "ar"}
            labels={{
              viral: t.cardViralScore,
              above: t.cardAbove,
              rising: t.cardRising,
              goingViral: t.cardGoingViral,
            }}
          />
        </div>
      </div>

      {/* Scroll cue */}
      <div aria-hidden className="relative mt-14 flex justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground/60">
          <span className="text-[0.68rem] font-medium uppercase tracking-[0.22em]">{t.scrollCue}</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </div>
    </section>
  );
}
