import { ChevronDown } from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/lib/i18n/en";

export function FAQ({ dict }: { dict: Dictionary }) {
  const t = dict.faq;
  return (
    <Section id="faq" className="bg-background">
      <SectionHeading eyebrow={t.eyebrow} title={t.h2} align="center" className="mx-auto mb-12" />

      <Reveal className="mx-auto flex max-w-[760px] flex-col gap-3">
        {t.items.map((item, i) => (
          <details key={i} name="faq" className="faq-item group rounded-2xl border border-border bg-card px-5 transition hover:border-border-strong">
            <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-[0.95rem] font-medium text-foreground">
              {item.q}
              <ChevronDown size={18} className="faq-chevron shrink-0 text-muted-foreground transition-transform duration-300" />
            </summary>
            <p className="faq-body pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </Reveal>
    </Section>
  );
}
