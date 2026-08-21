import { ArrowRight, Check, X } from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/lib/i18n/en";

export function BeforeAfter({ dict }: { dict: Dictionary }) {
  const t = dict.compare;
  return (
    <Section className="bg-background">
      <SectionHeading eyebrow={t.eyebrow} title={t.h2} align="center" className="mx-auto mb-12" />

      <div className="mx-auto max-w-[860px]">
        {/* Column headers */}
        <div className="mb-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-1 sm:gap-5">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70">
            {t.before}
          </span>
          <span className="w-4" />
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-lp-yellow-ink">{t.after}</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {t.rows.map((row, i) => (
            <Reveal
              key={i}
              delay={i * 70}
              className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-3 sm:gap-5"
            >
              <div className="flex items-center gap-2.5 rounded-xl border border-border bg-secondary/50 px-4 py-4">
                <X size={15} className="shrink-0 text-muted-foreground/60" />
                <span className="text-[0.82rem] text-muted-foreground/80 line-through decoration-muted-foreground/25">
                  {row.before}
                </span>
              </div>
              <div className="flex items-center justify-center text-muted-foreground/40">
                <ArrowRight size={16} className="rtl:-scale-x-100" />
              </div>
              {/* The "after" column is the only tinted surface on the page. It
                  earns it: this row is a claim about what changes, and the tint
                  is what makes the two columns read as before/after rather than
                  as two lists. */}
              <div className="flex items-center gap-2.5 rounded-xl border border-lp-yellow/25 bg-lp-yellow/[0.06] px-4 py-4 shadow-[var(--lp-sheen)]">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lp-yellow text-lp-yellow-fg">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="text-[0.82rem] font-medium text-foreground">{row.after}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
