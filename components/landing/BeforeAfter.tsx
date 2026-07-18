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
          <span className="text-[0.72rem] font-semibold uppercase tracking-wide text-muted-foreground">{t.before}</span>
          <span className="w-4" />
          <span className="text-[0.72rem] font-semibold uppercase tracking-wide text-brand">{t.after}</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {t.rows.map((row, i) => (
            <Reveal
              key={i}
              delay={i * 70}
              className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-3 sm:gap-5"
            >
              <div className="flex items-center gap-2.5 rounded-xl border border-border bg-secondary/40 px-4 py-3.5">
                <X size={15} className="shrink-0 text-muted-foreground" />
                <span className="text-[0.82rem] text-muted-foreground line-through decoration-muted-foreground/30">{row.before}</span>
              </div>
              <div className="flex items-center justify-center text-muted-foreground/50">
                <ArrowRight size={16} className="rtl:-scale-x-100" />
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-lp-violet/25 bg-gradient-to-br from-lp-violet/[0.08] to-lp-cyan/[0.05] px-4 py-3.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-lp-violet to-lp-cyan text-white">
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
