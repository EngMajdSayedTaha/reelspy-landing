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
          <details
            key={i}
            name="faq"
            className="faq-item lp-surface group px-5 open:shadow-[var(--lp-shadow-2),var(--lp-sheen)] hover:border-border-strong"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 py-4.5 text-[0.95rem] font-medium text-foreground">
              {item.q}
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition group-open:border-border-strong group-open:text-foreground">
                <ChevronDown size={15} className="faq-chevron transition-transform duration-300" />
              </span>
            </summary>
            <p className="faq-body pb-5 pe-10 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </Reveal>
    </Section>
  );
}
