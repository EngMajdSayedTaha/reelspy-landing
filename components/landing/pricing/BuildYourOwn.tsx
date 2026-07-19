"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { CTALink } from "@/components/ui/CTALink";
import type { Dictionary } from "@/lib/i18n/en";

type Slider = { min: number; max: number; step: number; default: number };
const CONFIG: Slider[] = [
  { min: 3, max: 100, step: 1, default: 30 }, // accounts
  { min: 10, max: 500, step: 10, default: 80 }, // scripts
  { min: 0, max: 60, step: 5, default: 15 }, // auto-replies
  { min: 1, max: 4, step: 1, default: 4 }, // publish targets
];

export function BuildYourOwn({ dict }: { dict: Dictionary }) {
  const t = dict.pricing;
  const rtl = dict.meta.dir === "rtl";
  const [vals, setVals] = useState(CONFIG.map((c) => c.default));

  const price = useMemo(() => {
    const [acc, scr, ar, tgt] = vals;
    const raw = 19 + acc * 0.8 + scr * 0.25 + ar * 1.5 + tgt * 8;
    return Math.round(raw / 5) * 5;
  }, [vals]);

  return (
    <div className="lp-gradient-border mt-8 overflow-hidden p-6 sm:p-8">
      <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-lp-yellow-ink">
            <SlidersHorizontal size={18} />
            <span className="text-sm font-semibold">{t.byoTitle}</span>
          </div>
          <p className="mt-2 max-w-[42ch] text-muted-foreground">{t.byoBody}</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {t.byoSliders.map((s, i) => (
              <label key={i} className="block">
                <div className="mb-1.5 flex items-center justify-between text-[0.78rem]">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="tabular font-semibold text-foreground">{vals[i]}</span>
                </div>
                <input
                  type="range"
                  min={CONFIG[i].min}
                  max={CONFIG[i].max}
                  step={CONFIG[i].step}
                  value={vals[i]}
                  aria-label={s.label}
                  onChange={(e) => setVals((v) => v.map((x, j) => (j === i ? Number(e.target.value) : x)))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary"
                  style={{ accentColor: "var(--lp-yellow)" }}
                  dir={rtl ? "rtl" : "ltr"}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-6 text-center">
          <span className="text-[0.72rem] font-medium uppercase tracking-wide text-muted-foreground">{t.byoLivePrice}</span>
          <div className="flex items-end justify-center gap-1.5">
            {!rtl && <span className="mb-1 text-sm font-medium text-muted-foreground">{t.currency}</span>}
            <span className="tabular text-5xl font-semibold text-foreground">{price}</span>
            {rtl && <span className="mb-1 text-sm font-medium text-muted-foreground">{t.currency}</span>}
            <span className="mb-1.5 text-sm text-muted-foreground">{t.perMonth}</span>
          </div>
          <CTALink href="/signup" size="md" className="w-full">
            {t.byoCta}
          </CTALink>
        </div>
      </div>
    </div>
  );
}
