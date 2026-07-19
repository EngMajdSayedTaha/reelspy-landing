"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, Flame, Play, TrendingUp } from "lucide-react";
import { MockScreen } from "./MockScreen";

type Labels = {
  sortOut: string;
  sortViral: string;
  rising: string;
  aria: string;
  above: string;
};

type Reel = { id: string; name: string; grad: string; score: number; mult: number };

const REELS: Reel[] = [
  { id: "a", name: "@fit.mia", grad: "linear-gradient(150deg,#f9e400,#a16207)", score: 640, mult: 5.2 },
  { id: "b", name: "@chef.omar", grad: "linear-gradient(150deg,#3f3f46,#27272d)", score: 1520, mult: 1.4 },
  { id: "c", name: "@code.sam", grad: "linear-gradient(150deg,#52525b,#34343b)", score: 910, mult: 3.1 },
  { id: "d", name: "@travel.lea", grad: "linear-gradient(150deg,#3f3f46,#27272d)", score: 1180, mult: 2.0 },
  { id: "e", name: "@studio.k", grad: "linear-gradient(150deg,#52525b,#34343b)", score: 430, mult: 4.4 },
];

const RISING = [
  { id: "e", name: "@studio.k", rate: 38 },
  { id: "a", name: "@fit.mia", rate: 27 },
  { id: "c", name: "@code.sam", rate: 19 },
];

export function FeedDemo({ labels }: { labels: Labels }) {
  const [sort, setSort] = useState<"out" | "viral">("out");
  const [userLocked, setUserLocked] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef(new Map<string, HTMLElement>());
  const prevRects = useRef(new Map<string, DOMRect>());

  const order = [...REELS].sort((a, b) => (sort === "out" ? b.mult - a.mult : b.score - a.score));

  // Auto-toggle sort every few seconds while on-screen (unless the user took over).
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (timer || userLocked) return;
      timer = setInterval(() => setSort((s) => (s === "out" ? "viral" : "out")), 3600);
    };
    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.3 });
    io.observe(el);
    return () => {
      stop();
      io.disconnect();
    };
  }, [userLocked]);

  // FLIP: animate cards to their new rank positions.
  useLayoutEffect(() => {
    const nodes = itemsRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    nodes.forEach((el, id) => {
      const prev = prevRects.current.get(id);
      const next = el.getBoundingClientRect();
      if (prev && !reduced) {
        const dy = prev.top - next.top;
        if (Math.abs(dy) > 1) {
          el.style.transition = "none";
          el.style.transform = `translateY(${dy}px)`;
          requestAnimationFrame(() => {
            el.style.transition = "transform 620ms cubic-bezier(0.22,1,0.36,1)";
            el.style.transform = "";
          });
        }
      }
    });
    const m = new Map<string, DOMRect>();
    nodes.forEach((el, id) => m.set(id, el.getBoundingClientRect()));
    prevRects.current = m;
  }, [sort]);

  const pick = (mode: "out" | "viral") => {
    setUserLocked(true);
    setSort(mode);
  };

  return (
    <MockScreen path="dashboard/feed" srLabel={labels.aria}>
      <div ref={rootRef}>
        {/* Sort toggle */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div
            role="group"
            aria-label="Sort reels"
            className="inline-flex rounded-full border border-[var(--lp-hairline)] bg-white/[0.03] p-0.5 text-xs font-medium"
          >
            {(["out", "viral"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={sort === mode}
                onClick={() => pick(mode)}
                className={`rounded-full px-3 py-1.5 transition ${
                  sort === mode ? "lp-cta-bg shadow" : "text-lp-ink-dim hover:text-lp-ink"
                }`}
              >
                {mode === "out" ? labels.sortOut : labels.sortViral}
              </button>
            ))}
          </div>
          <span className="lp-chip lp-chip-accent">
            <span className="relative flex h-1.5 w-1.5">
              <span className="lp-pulse absolute inline-flex h-1.5 w-1.5 rounded-full bg-lp-yellow" />
            </span>
            {labels.rising}
          </span>
        </div>

        {/* Feed list */}
        <ol className="flex flex-col gap-2">
          {order.map((reel, rank) => {
            const outActive = sort === "out";
            return (
              <li
                key={reel.id}
                ref={(el) => {
                  if (el) itemsRef.current.set(reel.id, el);
                  else itemsRef.current.delete(reel.id);
                }}
                className="flex items-center gap-3 rounded-xl border border-[var(--lp-hairline)] bg-white/[0.02] p-2.5"
              >
                <span className="w-4 shrink-0 text-center text-sm font-semibold tabular text-lp-ink-dim">{rank + 1}</span>
                <div className="relative grid h-11 w-8 shrink-0 place-items-center overflow-hidden rounded-md" style={{ background: reel.grad }}>
                  <Play size={12} className="text-white/90" fill="currentColor" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[0.8rem] font-medium text-lp-ink" dir="ltr">
                    {reel.name}
                  </div>
                  <div className="mt-1 h-1.5 w-2/3 rounded-full bg-white/8" />
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className={`lp-chip tabular transition ${outActive ? "lp-chip-neutral" : "lp-chip-neutral opacity-45"}`}>
                    <TrendingUp size={11} />↑ {reel.mult.toFixed(1)}×
                  </span>
                  <span className={`lp-chip tabular transition ${!outActive ? "lp-chip-accent" : "lp-chip-accent opacity-45"}`}>
                    <Flame size={11} />
                    {reel.score.toLocaleString()}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Rising Now rail */}
        <div className="mt-4 rounded-xl border border-[var(--lp-hairline)] bg-gradient-to-br from-[rgba(73,228,255,0.08)] to-transparent p-3">
          <div className="mb-2 flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-wide text-lp-yellow-ink">
            <ArrowUpRight size={13} /> {labels.rising}
          </div>
          <div className="flex gap-2 overflow-hidden">
            {RISING.map((r) => (
              <div key={r.id} className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-white/[0.03] px-2.5 py-2">
                <span className="h-6 w-6 shrink-0 rounded-md" style={{ background: REELS.find((x) => x.id === r.id)?.grad }} />
                <div className="min-w-0">
                  <div className="truncate text-[0.72rem] font-medium text-lp-ink" dir="ltr">
                    {r.name}
                  </div>
                  <div className="text-[0.68rem] font-semibold tabular text-lp-yellow-ink">+{r.rate}%/hr</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockScreen>
  );
}
