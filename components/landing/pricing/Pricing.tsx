import { Check } from "lucide-react";
import { Section, SectionHeading } from "../Section";
import { Reveal } from "@/components/ui/Reveal";
import { CTALink } from "@/components/ui/CTALink";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/en";
import { BuildYourOwn } from "./BuildYourOwn";

export function Pricing({ dict }: { dict: Dictionary }) {
  const t = dict.pricing;
  const rtl = dict.meta.dir === "rtl";

  return (
    <Section id="pricing" className="bg-background">
      <SectionHeading eyebrow={t.eyebrow} title={t.h2a} titleAccent={t.h2b} align="center" className="mx-auto mb-14" />

      {/* Cards: horizontal snap-scroll on mobile (Pro first), grid on desktop */}
      <Reveal className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
        {t.plans.map((plan, i) => {
          const isPro = plan.name === "Pro";
          const isStudio = plan.name === "Studio";
          return (
            <div
              key={i}
              className={cn(
                "relative flex min-w-[80%] shrink-0 snap-center flex-col rounded-2xl p-6 sm:min-w-0",
                isPro
                  ? "lp-gradient-border order-first text-lp-ink sm:order-none"
                  : "border border-border bg-card"
              )}
            >
              {/* Badge */}
              {isPro && (
                <span className="absolute -top-3 start-6 rounded-full bg-gradient-to-r from-lp-violet to-lp-cyan px-3 py-1 text-[0.68rem] font-semibold text-white shadow">
                  {t.mostPopular}
                </span>
              )}
              <div className={cn("relative flex flex-col", isPro && "text-lp-ink")}>
                <div className="flex items-center gap-2">
                  <h3 className={cn("text-lg font-semibold", isPro ? "text-lp-ink" : "text-foreground")}>{plan.name}</h3>
                  {isStudio && (
                    <span className="rounded-full border border-border px-2 py-0.5 text-[0.62rem] font-medium text-muted-foreground">
                      {t.forStudios}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-end gap-1.5">
                  {!rtl && <span className={cn("mb-1.5 text-sm font-medium", isPro ? "text-lp-ink-dim" : "text-muted-foreground")}>{t.currency}</span>}
                  <span className={cn("tabular text-4xl font-semibold", isPro ? "text-lp-ink" : "text-foreground")}>{plan.price}</span>
                  {rtl && <span className={cn("mb-1.5 text-sm font-medium", isPro ? "text-lp-ink-dim" : "text-muted-foreground")}>{t.currency}</span>}
                  <span className={cn("mb-1.5 text-sm", isPro ? "text-lp-ink-dim" : "text-muted-foreground")}>{t.perMonth}</span>
                </div>

                <p className={cn("mt-2 min-h-[2.5rem] text-[0.82rem] leading-snug", isPro ? "text-lp-ink-dim" : "text-muted-foreground")}>
                  {plan.tagline}
                </p>

                <CTALink
                  href="/signup"
                  size="md"
                  variant={isPro ? "primary" : "ghost"}
                  magnetic={false}
                  className={cn("mt-4 w-full", !isPro && "border-border-strong text-foreground hover:bg-accent")}
                >
                  {plan.cta}
                </CTALink>

                <ul className="mt-6 flex flex-col gap-2.5">
                  {plan.features.map((feat, fi) => (
                    <li key={fi} className={cn("flex items-start gap-2 text-[0.82rem]", isPro ? "text-lp-ink-dim" : "text-muted-foreground")}>
                      <Check size={15} className={cn("mt-0.5 shrink-0", isPro ? "text-lp-cyan" : "text-brand")} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </Reveal>

      {/* Build-your-own teaser */}
      <Reveal>
        <BuildYourOwn dict={dict} />
      </Reveal>

      <p className="mt-6 text-center text-[0.78rem] text-muted-foreground">{t.footnote}</p>
    </Section>
  );
}
