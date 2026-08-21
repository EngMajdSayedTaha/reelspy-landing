"use client";

import { useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowRight, Info } from "lucide-react";
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

  // Feeds the cursor spotlight on each card (.lp-spot). Custom properties
  // inherit, so writing them on the wrapper reaches the <article> inside it —
  // and writing a property, rather than a style the card also uses, means this
  // can never fight the FLIP transform living on the same element.
  const trackPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const nicheLabel = (slug: string) =>
    (t.niches as Record<string, string>)[slug] ?? slug;

  return (
    <div>
      {/* Controls. Two segmented groups of the same primitive, so the row reads
          as one control surface rather than as tabs plus loose text buttons. */}
      <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label={t.nicheLabel} className="lp-segment">
          {data.niches.map((n, i) => (
            <button
              key={n.niche}
              type="button"
              role="tab"
              aria-selected={i === nicheIndex}
              onClick={() => setNicheIndex(i)}
              className="lp-segment-item"
            >
              {nicheLabel(n.niche)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <span className="hidden text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70 sm:inline">
            {t.sortLabel}
          </span>
          <div className="lp-segment">
            {SHOWCASE_SORTS.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={s === sort}
                onClick={() => setSort(s)}
                className="lp-segment-item"
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
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
        >
          {reels.map((reel) => {
            const key = reelKey(reel);
            return (
              <div
                key={key}
                onPointerMove={trackPointer}
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
      <div className="mt-10 flex flex-col items-center gap-5 text-center">
        {data.isDemo && (
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-[0.76rem] text-muted-foreground">
            <Info size={13} className="shrink-0 text-muted-foreground/70" />
            {t.demoNote}
          </p>
        )}
        <CTALink href="/signup" size="lg">
          {t.cta}
          <ArrowRight size={18} className="rtl:-scale-x-100" />
        </CTALink>
      </div>
    </div>
  );
}
