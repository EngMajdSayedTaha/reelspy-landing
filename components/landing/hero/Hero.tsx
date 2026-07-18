import { ArrowRight, ChevronDown, ShieldCheck, Sparkles } from "lucide-react";
import { CTALink } from "@/components/ui/CTALink";
import type { Dictionary } from "@/lib/i18n/en";
import { HeroArt } from "./HeroArt";

export function Hero({ dict }: { dict: Dictionary }) {
  const t = dict.hero;
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-lp-space text-lp-ink"
      style={{ paddingBlock: "clamp(7rem, 12vh, 10rem) clamp(3rem, 8vh, 6rem)" }}
    >
      {/* Ambient background: grid + nebula glows (decorative) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="lp-grid-bg absolute inset-0 opacity-[0.5]" />
        <div
          className="lp-nebula lp-drift"
          style={{ inset: "-12% auto auto -8%", width: "48%", height: "60%", background: "radial-gradient(circle,#6d5cff,transparent 62%)", opacity: 0.4 }}
        />
        <div
          className="lp-nebula lp-drift"
          style={{ inset: "auto -10% -20% auto", width: "52%", height: "64%", background: "radial-gradient(circle,#49e4ff,transparent 64%)", opacity: 0.28, animationDelay: "-8s" }}
        />
        {/* Fade to the section below */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-lp-space" />
      </div>

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        {/* Copy */}
        <div className="text-center lg:text-start">
          <p
            className="lp-eyebrow mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5"
            data-reveal=""
          >
            <Sparkles size={14} className="text-lp-cyan" />
            {t.eyebrow}
          </p>

          <h1 className="lp-h1 mx-auto max-w-[16ch] text-balance lg:mx-0">
            {t.h1a} <span className="lp-gradient-text">{t.h1grad}</span>
          </h1>

          <p className="lp-lead mx-auto mt-6 max-w-[54ch] text-lp-ink-dim lg:mx-0">{t.sub}</p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <CTALink href="/signup" size="lg" className="w-full sm:w-auto">
              {t.ctaPrimary}
              <ArrowRight size={18} className="rtl:-scale-x-100" />
            </CTALink>
            <CTALink href="#how" variant="ghost" size="lg" magnetic={false} className="w-full sm:w-auto">
              {t.ctaSecondary}
              <ChevronDown size={18} />
            </CTALink>
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.82rem] text-lp-ink-dim lg:justify-start">
            <li className="inline-flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-lp-cyan" /> {t.trust1}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-lp-ink-dim/50" /> {t.trust2}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-lp-ink-dim/50" /> {t.trust3}
            </li>
          </ul>
        </div>

        {/* Interactive 3D card stack */}
        <div className="relative order-first lg:order-none">
          <HeroArt
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
      <div aria-hidden className="relative mt-10 flex justify-center">
        <div className="flex flex-col items-center gap-2 text-lp-ink-dim/70">
          <span className="text-[0.7rem] uppercase tracking-[0.2em]">{t.scrollCue}</span>
          <ChevronDown size={18} className="animate-bounce" />
        </div>
      </div>
    </section>
  );
}
