"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { CTALink } from "@/components/ui/CTALink";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/en";
import type { ShowcaseData, ShowcaseSort } from "@/lib/showcase/types";
import { SHOWCASE_SORTS } from "@/lib/showcase/types";
import { reelKey, sortReels } from "@/lib/showcase/sort";
import { TrendingCard } from "./TrendingCard";

export function TrendingExplorer({ data, dict }: { data: ShowcaseData; dict: Dictionary }) {
  const t = dict.showcase;
  const [nicheIndex, setNicheIndex] = useState(0);
  const [sort, setSort] = useState<ShowcaseSort>("score");

  const gridRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef(new Map<string, HTMLElement>());
  const prevRects = useRef(new Map<string, DOMRect>());

  const active = data.niches[nicheIndex] ?? data.niches[0];
  const reels = active ? sortReels(active.reels, sort) : [];

  // FLIP: cards animate from their previous position to the new one, so a
  // re-sort reads as the grid rearranging rather than blinking. Same technique
  // as the feature demo above it, but in two dimensions.
  useLayoutEffect(() => {
    const nodes = itemsRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduced) {
      nodes.forEach((el, key) => {
        const prev = prevRects.current.get(key);
        const next = el.getBoundingClientRect();
        if (!prev) return;
        const dx = prev.left - next.left;
        const dy = prev.top - next.top;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          el.style.transition = "none";
          el.style.transform = `translate(${dx}px, ${dy}px)`;
          requestAnimationFrame(() => {
            el.style.transition = "transform 560ms cubic-bezier(0.22,1,0.36,1)";
            el.style.transform = "";
          });
        }
      });
    }

    prevRects.current = new Map();
    nodes.forEach((el, key) => prevRects.current.set(key, el.getBoundingClientRect()));
  }, [sort, nicheIndex]);

  const nicheLabel = (slug: string) =>
    (t.niches as Record<string, string>)[slug] ?? slug;

  return (
    <div>
      {/* Controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label={t.nicheLabel}
          className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0"
        >
          {data.niches.map((n, i) => (
            <button
              key={n.niche}
              type="button"
              role="tab"
              aria-selected={i === nicheIndex}
              onClick={() => setNicheIndex(i)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition",
                i === nicheIndex
                  ? "border-lp-yellow bg-lp-yellow text-lp-yellow-fg"
                  : "border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground"
              )}
            >
              {nicheLabel(n.niche)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-[0.72rem] font-medium uppercase tracking-wide text-muted-foreground sm:inline">
            {t.sortLabel}
          </span>
          <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {SHOWCASE_SORTS.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={s === sort}
                onClick={() => setSort(s)}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-1.5 text-[0.8rem] font-medium transition",
                  s === sort
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.sorts[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {reels.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">{t.empty}</p>
      ) : (
        <div
          ref={gridRef}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          {reels.map((reel) => {
            const key = reelKey(reel);
            return (
              <div
                key={key}
                ref={(el) => {
                  if (el) itemsRef.current.set(key, el);
                  else itemsRef.current.delete(key);
                }}
              >
                <TrendingCard reel={reel} dict={dict} />
              </div>
            );
          })}
        </div>
      )}

      {/* Footer: sample-data disclosure + CTA */}
      <div className="mt-8 flex flex-col items-center gap-4 text-center">
        {data.isDemo && (
          <p className="text-[0.78rem] text-muted-foreground">{t.demoNote}</p>
        )}
        <CTALink href="/signup" size="lg">
          {t.cta}
          <ArrowRight size={18} className="rtl:-scale-x-100" />
        </CTALink>
      </div>
    </div>
  );
}
