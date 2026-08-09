import { Check } from "lucide-react";
import { Section, SectionHeading } from "../Section";
import { Reveal } from "@/components/ui/Reveal";
import { CTALink } from "@/components/ui/CTALink";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/en";
import type { Locale } from "@/lib/i18n/config";
import type { Plan } from "@/lib/plans/types";
import { BuildYourOwn } from "./BuildYourOwn";

type RenderPlan = {
  key: string;
  name: string;
  price: string;
  tagline: string;
  cta: string;
  features: string[];
  badge: string | null;
  /**
   * The small "For teams & studios" chip. The plan catalog only carries one
   * copy field for a badge, so this only exists for the built-in Studio slug
   * shown by the fallback dictionary copy — an admin-published plan has no
   * second badge to show here yet.
   */
  subBadge: string | null;
};

// Admin-published plans (from the dashboard's plan catalog) win when present;
// the dictionary's static copy is the fallback for a fetch failure, a fresh
// checkout before the catalog migration is applied, or a caller (tests) that
// doesn't pass `plans` at all. See lib/plans/fetch.ts for why an empty array,
// never stale/invented data, is what a failure resolves to.
function resolvePlans(t: Dictionary["pricing"], plans: Plan[] | undefined, locale: Locale): RenderPlan[] {
  if (plans && plans.length > 0) {
    return plans.map((plan) => {
      const copy = plan.copy[locale] ?? plan.copy.en;
      const priceMajor = plan.price ? Math.round(plan.price.unitAmount / 100) : 0;
      return {
        key: plan.slug,
        name: copy.name,
        price: String(priceMajor),
        tagline: copy.tagline,
        cta: plan.kind === "free" ? t.ctaFree : t.ctaGet.replace("{name}", copy.name),
        features: copy.highlights,
        badge: copy.badge,
        subBadge: null,
      };
    });
  }
  return t.plans.map((plan) => ({
    key: plan.name,
    name: plan.name,
    price: plan.price,
    tagline: plan.tagline,
    cta: plan.cta,
    features: plan.features,
    badge: plan.name === "Pro" ? t.mostPopular : null,
    subBadge: plan.name === "Studio" ? t.forStudios : null,
  }));
}

export function Pricing({ dict, plans, locale = "en" }: { dict: Dictionary; plans?: Plan[]; locale?: Locale }) {
  const t = dict.pricing;
  const rtl = dict.meta.dir === "rtl";
  const renderPlans = resolvePlans(t, plans, locale);

  return (
    <Section id="pricing" className="bg-background">
      <SectionHeading eyebrow={t.eyebrow} title={t.h2a} titleAccent={t.h2b} align="center" className="mx-auto mb-14" />

      {/* Cards: horizontal snap-scroll on mobile (Pro first), grid on desktop.
          The `pt-5` is load-bearing, not spacing taste: `overflow-x: auto` forces
          the computed `overflow-y` to `auto` too — it cannot stay `visible` — so
          this scroller clips vertically as well. The Pro card's "Most popular"
          badge sits at `-top-3`, outside the content box, and was being sliced
          off at the top edge on every phone. Padding the scroller moves the clip
          boundary out far enough to contain the badge. Desktop is a plain grid
          with `overflow-visible`, so it resets. */}
      <Reveal className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 pt-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 sm:pt-0 lg:grid-cols-4">
        {renderPlans.map((plan) => {
          const highlighted = Boolean(plan.badge);
          return (
            <div
              key={plan.key}
              className={cn(
                "relative flex min-w-[80%] shrink-0 snap-center flex-col rounded-2xl p-6 sm:min-w-0",
                highlighted ? "lp-gradient-border order-first sm:order-none" : "border border-border bg-card"
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <span className="absolute -top-3 start-6 rounded-full bg-lp-yellow px-3 py-1 text-[0.68rem] font-semibold text-lp-yellow-fg shadow">
                  {plan.badge}
                </span>
              )}
              {/* The highlighted card no longer needs its own text colors: it
                  used to sit on a dark gradient panel while the others were
                  light, so every label had to branch. Now every card is a
                  themed surface and the highlight is carried by the animated
                  accent border plus the filled CTA. */}
              <div className="relative flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                  {plan.subBadge && (
                    <span className="rounded-full border border-border px-2 py-0.5 text-[0.62rem] font-medium text-muted-foreground">
                      {plan.subBadge}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-end gap-1.5">
                  {!rtl && <span className="mb-1.5 text-sm font-medium text-muted-foreground">{t.currency}</span>}
                  <span className="tabular text-4xl font-semibold text-foreground">{plan.price}</span>
                  {rtl && <span className="mb-1.5 text-sm font-medium text-muted-foreground">{t.currency}</span>}
                  <span className="mb-1.5 text-sm text-muted-foreground">{t.perMonth}</span>
                </div>

                <p className="mt-2 min-h-[2.5rem] text-[0.82rem] leading-snug text-muted-foreground">
                  {plan.tagline}
                </p>

                <CTALink
                  href="/signup"
                  size="md"
                  variant={highlighted ? "primary" : "ghost"}
                  magnetic={false}
                  className={cn("mt-4 w-full", !highlighted && "border-border-strong text-foreground hover:bg-accent")}
                >
                  {plan.cta}
                </CTALink>

                <ul className="mt-6 flex flex-col gap-2.5">
                  {plan.features.map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-[0.82rem] text-muted-foreground">
                      <Check size={15} className="mt-0.5 shrink-0 text-lp-yellow-ink" />
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
