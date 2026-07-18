import { ArrowRight } from "lucide-react";
import { CTALink } from "@/components/ui/CTALink";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/lib/i18n/en";

export function FinalCTA({ dict }: { dict: Dictionary }) {
  const t = dict.finalCta;
  return (
    <section className="relative overflow-hidden bg-lp-space text-lp-ink" style={{ paddingBlock: "clamp(5rem, 11vh, 8rem)" }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="lp-grid-bg absolute inset-0 opacity-40" />
        <div className="lp-nebula lp-drift" style={{ inset: "auto auto -30% 20%", width: "60%", height: "80%", background: "radial-gradient(circle,#6d5cff,transparent 60%)", opacity: 0.4 }} />
        <div className="lp-nebula lp-drift" style={{ inset: "-20% 10% auto auto", width: "50%", height: "70%", background: "radial-gradient(circle,#49e4ff,transparent 62%)", opacity: 0.3, animationDelay: "-7s" }} />
      </div>

      <Reveal className="relative mx-auto max-w-[720px] px-4 text-center sm:px-6">
        <h2 className="lp-h2 mx-auto max-w-[18ch] text-balance text-lp-ink">
          {t.h2a} <span className="lp-gradient-text">{t.h2b}</span>
        </h2>
        <p className="lp-lead mx-auto mt-5 max-w-[52ch] text-lp-ink-dim">{t.sub}</p>
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
