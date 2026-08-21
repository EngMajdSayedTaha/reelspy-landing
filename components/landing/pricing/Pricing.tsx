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
  /** Struck-through "was" figure, matching the dashboard billing page's sale design. */
  wasPrice: string | null;
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
  /** "Save 20% · ends Aug 20" — null when there's no active sale. */
  saleLabel: string | null;
  /** "14-day free trial" — null when the plan has no trial. */
  trialLabel: string | null;
};

function saleLabelFor(t: Dictionary["pricing"], plan: Plan, locale: Locale): string | null {
  const price = plan.price;
  if (!price?.compareAtAmount) return null;
  const pct = Math.round(((price.compareAtAmount - price.unitAmount) / price.compareAtAmount) * 100);
  if (pct <= 0) return null;
  const save = t.saveBadge.replace("{pct}", String(pct));
  if (!price.saleEndsAt) return save;
  const date = new Date(price.saleEndsAt).toLocaleDateString(locale === "ar" ? "ar-AE-u-nu-latn" : "en-US", {
    month: "short",
    day: "numeric",
  });
  return `${save} · ${t.saleEndsOn.replace("{date}", date)}`;
}

// Admin-published plans (from the dashboard's plan catalog) win when present;
// the dictionary's static copy is the fallback for a fetch failure, a fresh
// checkout before the catalog migration is applied, or a caller (tests) that
// doesn't pass `plans` at all. See lib/plans/fetch.ts for why an empty array,
// never stale/invented data, is what a failure resolves to.
//
// The static fallback has no sale/trial data to show — those are catalog-only
// fields, so the fallback plans render exactly as they always have.
function resolvePlans(t: Dictionary["pricing"], plans: Plan[] | undefined, locale: Locale): RenderPlan[] {
  if (plans && plans.length > 0) {
    return plans.map((plan) => {
      const copy = plan.copy[locale] ?? plan.copy.en;
      const priceMajor = plan.price ? Math.round(plan.price.unitAmount / 100) : 0;
      return {
        key: plan.slug,
        name: copy.name,
        price: String(priceMajor),
        wasPrice: plan.price?.compareAtAmount ? String(Math.round(plan.price.compareAtAmount / 100)) : null,
        tagline: copy.tagline,
        cta: plan.kind === "free" ? t.ctaFree : t.ctaGet.replace("{name}", copy.name),
        features: copy.highlights,
        badge: copy.badge,
        subBadge: null,
        saleLabel: saleLabelFor(t, plan, locale),
        trialLabel: plan.trialDays > 0 ? t.trialBadge.replace("{days}", String(plan.trialDays)) : null,
      };
    });
  }
  return t.plans.map((plan) => ({
    key: plan.name,
    name: plan.name,
    price: plan.price,
    wasPrice: null,
    tagline: plan.tagline,
    cta: plan.cta,
    features: plan.features,
    badge: plan.name === "Pro" ? t.mostPopular : null,
    subBadge: plan.name === "Studio" ? t.forStudios : null,
    saleLabel: null,
    trialLabel: null,
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
                highlighted
                  ? "lp-gradient-border order-first shadow-[var(--lp-shadow-3)] sm:order-none"
                  : "lp-surface"
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <span className="absolute -top-3 start-6 rounded-full bg-lp-yellow px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.06em] text-lp-yellow-fg shadow-[var(--lp-shadow-2)]">
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

                {(plan.saleLabel || plan.trialLabel) && (
                  <div className="mt-2 flex flex-col gap-0.5">
                    {plan.saleLabel && (
                      <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{plan.saleLabel}</p>
                    )}
                    {plan.trialLabel && (
                      <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{plan.trialLabel}</p>
                    )}
                  </div>
                )}

                <div className="mt-5 flex items-end gap-1.5">
                  {!rtl && <span className="mb-2 text-sm font-medium text-muted-foreground">{t.currency}</span>}
                  {plan.wasPrice && (
                    <s className="mb-2 text-lg font-normal text-muted-foreground/70">{plan.wasPrice}</s>
                  )}
                  {/* The price is the one number on this card anyone is looking
                      for, so it gets display treatment — tight tracking and real
                      weight — rather than a slightly-larger body size. */}
                  <span className="tabular text-[2.75rem] font-semibold leading-none tracking-[-0.035em] text-foreground">
                    {plan.price}
                  </span>
                  {rtl && <span className="mb-2 text-sm font-medium text-muted-foreground">{t.currency}</span>}
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

                <ul className="mt-6 flex flex-col gap-2.5 border-t border-border pt-5">
                  {plan.features.map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-[0.82rem] leading-relaxed text-muted-foreground">
                      <Check size={14} strokeWidth={2.6} className="mt-[3px] shrink-0 text-lp-yellow-ink" />
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

      <p className="mt-8 text-center text-[0.78rem] text-muted-foreground">{t.footnote}</p>
    </Section>
  );
}
