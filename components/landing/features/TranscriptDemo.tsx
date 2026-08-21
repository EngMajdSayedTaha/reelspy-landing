"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Play, Quote, Search, Sparkles } from "lucide-react";
import { MockScreen } from "./MockScreen";
import { usePrefersReducedMotion } from "@/components/ui/usePrefersReducedMotion";

// The reel thumbnail inside the mock. A graded warm frame rather than a slab
// of brand yellow: a solid #f9e400 rectangle reads as a color swatch, not as a
// piece of video, and it spends the page's one accent color on decoration.
const GRADED_THUMB =
  "radial-gradient(120% 90% at 30% 15%, hsl(38 34% 38%), transparent 62%), linear-gradient(150deg,hsl(32 22% 26%),hsl(24 24% 12%))";

type Labels = {
  transcribing: string;
  hookLibrary: string;
  aria: string;
  savedHook: string;
};

const LINES = [
  "Stop scrolling — you're doing your hooks backwards.",
  "Most creators explain first, then try to hook.",
  "Flip it: lead with the payoff you're promising.",
  "Watch what that does to your retention curve.",
];

const BASE_HOOKS = [
  { text: "Nobody tells you this about reach", score: 88 },
  { text: "I tested this for 30 days straight", score: 81 },
  { text: "The 3-second rule that changed my views", score: 76 },
];

const STEPS = LINES.length + 3; // reveal lines, then save, hold, reset

export function TranscriptDemo({ labels }: { labels: Labels }) {
  const [step, setStep] = useState(0);
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = rootRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (timer) return;
      timer = setInterval(() => setStep((s) => (s + 1) % STEPS), 900);
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
  }, [reduced]);

  const revealed = reduced ? LINES.length : Math.min(step, LINES.length);
  const saved = reduced || step >= LINES.length + 1;

  return (
    <MockScreen path="dashboard/transcript" srLabel={labels.aria}>
      <div ref={rootRef} className="grid gap-3">
        {/* Reel being transcribed */}
        <div className="rounded-xl border border-[var(--lp-hairline)] bg-white/[0.02] p-3">
          <div className="flex items-center gap-3">
            <div className="relative grid h-12 w-9 shrink-0 place-items-center overflow-hidden rounded-md" style={{ background: GRADED_THUMB }}>
              <Play size={13} className="text-white/90" fill="currentColor" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[0.8rem] font-medium text-lp-ink" dir="ltr">@hooks.daily</div>
              <div className="mt-1 flex items-center gap-1.5 text-[0.72rem] text-lp-yellow-ink">
                <span className={`h-1.5 w-1.5 rounded-full bg-lp-yellow ${revealed < LINES.length && !reduced ? "lp-pulse" : ""}`} />
                {revealed < LINES.length && !reduced ? labels.transcribing : "Transcript"}
              </div>
            </div>
          </div>

          {/* Transcript lines materialize */}
          <div className="mt-3 space-y-1.5">
            {LINES.map((line, i) => {
              const isHook = i === 0;
              const shown = i < revealed;
              return (
                <p
                  key={i}
                  className={`rounded-lg px-2.5 py-1.5 text-[0.78rem] leading-snug transition-all duration-500 ${
                    shown ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                  } ${isHook ? "border border-lp-yellow/40 bg-lp-yellow/10 font-medium text-lp-ink" : "text-lp-ink-dim"}`}
                >
                  {isHook && <Quote size={12} className="mb-0.5 me-1 inline text-lp-yellow-ink" />}
                  {line}
                </p>
              );
            })}
          </div>
        </div>

        {/* Hook Library */}
        <div className="rounded-xl border border-[var(--lp-hairline)] bg-white/[0.02] p-3">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[0.78rem] font-semibold text-lp-ink">
              <Sparkles size={14} className="text-lp-yellow-ink" /> {labels.hookLibrary}
            </div>
            <div className="flex items-center gap-1 rounded-md border border-[var(--lp-hairline)] px-2 py-1 text-[0.68rem] text-lp-ink-dim">
              <Search size={11} /> hooks
            </div>
          </div>
          <ul className="space-y-1.5">
            {/* Freshly filed hook */}
            <li
              className={`flex items-center gap-2 overflow-hidden rounded-lg border px-2.5 py-2 transition-all duration-500 ${
                saved
                  ? "max-h-16 border-lp-yellow/45 bg-lp-yellow/10 opacity-100"
                  : "max-h-0 border-transparent py-0 opacity-0"
              }`}
            >
              <Check size={14} className="shrink-0 text-lp-yellow-ink" />
              <span className="min-w-0 flex-1 truncate text-[0.76rem] font-medium text-lp-ink">{LINES[0]}</span>
              <span className="lp-chip lp-chip-accent tabular shrink-0">94</span>
            </li>
            {BASE_HOOKS.map((h, i) => (
              <li key={i} className="flex items-center gap-2 rounded-lg border border-[var(--lp-hairline)] bg-white/[0.02] px-2.5 py-2">
                <span className="min-w-0 flex-1 truncate text-[0.76rem] text-lp-ink-dim">{h.text}</span>
                <span className="lp-chip lp-chip-neutral tabular shrink-0">{h.score}</span>
              </li>
            ))}
          </ul>
          <div className={`mt-2 flex items-center gap-1.5 text-[0.7rem] font-medium text-lp-yellow-ink transition-opacity duration-500 ${saved ? "opacity-100" : "opacity-0"}`}>
            <Check size={12} /> {labels.savedHook}
          </div>
        </div>
      </div>
    </MockScreen>
  );
}
