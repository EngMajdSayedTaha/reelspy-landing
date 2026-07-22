"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Clock, Play, Zap } from "lucide-react";
import { InstagramMark, TikTokMark, YouTubeMark, FacebookMark } from "@/components/brand/PlatformMarks";
import { MockScreen } from "./MockScreen";
import { usePrefersReducedMotion } from "@/components/ui/usePrefersReducedMotion";

type Labels = {
  upload: string;
  schedule: string;
  comment: string;
  reply: string;
  dm: string;
  aria: string;
  autoReply: string;
};

const NODES = [
  { id: "ig", mark: InstagramMark, cap: "Reels", y: 16.7 },
  { id: "tt", mark: TikTokMark, cap: "For You", y: 41.7 },
  { id: "yt", mark: YouTubeMark, cap: "Shorts", y: 66.7 },
  { id: "fb", mark: FacebookMark, cap: "Feed", y: 91.7 },
];

// SVG path endpoints (viewBox 100 x 72), tile right edge -> each node left edge.
const PATHS = [
  "M32 36 C 46 36, 46 12, 58 12",
  "M32 36 C 46 36, 46 30, 58 30",
  "M32 36 C 46 36, 46 48, 58 48",
  "M32 36 C 46 36, 46 66, 58 66",
];

const PHASES = 9; // 0 idle, 1-4 publish, 5 comment, 6 reply, 7 dm, 8 hold

export function PublishDemo({ labels }: { labels: Labels }) {
  const [phase, setPhase] = useState(0);
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = rootRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (timer) return;
      timer = setInterval(() => setPhase((p) => (p + 1) % PHASES), 950);
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

  const published = (i: number) => reduced || phase > i; // node i published when phase passed it
  const showComment = reduced || phase >= 5;
  const showReply = reduced || phase >= 6;
  const showDM = reduced || phase >= 7;

  return (
    <MockScreen path="dashboard/publish" srLabel={labels.aria}>
      <div ref={rootRef} className="grid gap-3.5">
        {/* Fan-out */}
        <div className="fanout-mirror relative w-full" style={{ aspectRatio: "100 / 72" }}>
          <svg viewBox="0 0 100 72" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <linearGradient id="pubFlow" x1="0" y1="0" x2="100" y2="0">
                <stop offset="0" stopColor="var(--lp-yellow)" />
                <stop offset="1" stopColor="var(--lp-yellow-ink)" />
              </linearGradient>
            </defs>
            {PATHS.map((d, i) => (
              <g key={i}>
                <path d={d} fill="none" stroke="var(--lp-hairline)" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
                <path
                  d={d}
                  fill="none"
                  stroke="url(#pubFlow)"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  strokeDasharray="4 5"
                  vectorEffect="non-scaling-stroke"
                  style={{ animation: `lp-flow ${1.4 + i * 0.15}s linear infinite`, opacity: published(i) ? 1 : 0.5 }}
                />
              </g>
            ))}
          </svg>

          {/* Video tile */}
          <div
            className="fanout-unflip absolute flex flex-col items-center"
            style={{ left: "3%", top: "50%", transform: "translateY(-50%) var(--unflip, scaleX(1))", width: "27%" }}
          >
            <div className="relative grid aspect-[9/12] w-full place-items-center overflow-hidden rounded-lg border border-[var(--lp-hairline)]" style={{ background: "linear-gradient(150deg,#f9e400,#a16207)" }}>
              <Play size={16} className="text-white" fill="currentColor" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
            </div>
          </div>

          {/* Schedule badge. Pulled out of the 27%-wide tile column and centered
              inside a wide left-anchored band instead. As a nowrap chip centered
              on the ~16% tile column, its left half ran past the mock's rounded
              edge and got clipped on phones. Centering it in a band that starts
              at the container's near edge keeps the whole chip on-screen at any
              width, and because the band is edge-anchored (not centered on the
              tile) it stays clear of the mock border in RTL too, where the whole
              fan-out mirrors. */}
          <div
            className="fanout-unflip absolute flex justify-center"
            style={{ left: "0%", top: "76%", width: "52%", transform: "var(--unflip, scaleX(1))" }}
          >
            <span className="lp-chip lp-chip-accent whitespace-nowrap text-[0.6rem]">
              <Clock size={9} /> {labels.schedule}
            </span>
          </div>

          {/* Platform nodes */}
          {NODES.map((n, i) => {
            const Mark = n.mark;
            const done = published(i);
            return (
              <div
                key={n.id}
                className="fanout-unflip absolute flex items-center gap-2 rounded-lg border bg-lp-mock-surface px-2 py-1.5 transition-all duration-500"
                style={{
                  left: "58%",
                  top: `${n.y}%`,
                  transform: "translateY(-50%) var(--unflip, scaleX(1))",
                  width: "40%",
                  borderColor: done ? "rgba(73,228,255,0.5)" : "var(--lp-hairline)",
                  boxShadow: done ? "0 0 20px rgba(73,228,255,0.28)" : "none",
                }}
              >
                <span className={`shrink-0 transition-colors ${done ? "text-lp-yellow-ink" : "text-lp-ink-dim"}`}>
                  <Mark size={16} />
                </span>
                <span className="min-w-0 flex-1 truncate text-[0.68rem] text-lp-ink-dim">{n.cap}</span>
                <span
                  className={`grid h-4 w-4 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                    done ? "scale-100 bg-lp-yellow text-lp-yellow-fg" : "scale-0 bg-transparent"
                  }`}
                >
                  <Check size={11} strokeWidth={3} />
                </span>
              </div>
            );
          })}
        </div>

        {/* Auto-reply chat sim */}
        <div className="rounded-xl border border-[var(--lp-hairline)] bg-white/[0.02] p-3">
          <div className="mb-2.5 flex items-center gap-1.5 text-[0.72rem] font-semibold text-lp-yellow-ink">
            <Zap size={13} /> {labels.autoReply}
          </div>
          <div className="grid gap-2">
            {/* Incoming comment */}
            <div className={`flex items-start gap-2 transition-all duration-500 ${showComment ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}>
              <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-secondary" />
              <div className="rounded-2xl rounded-tl-sm bg-white/[0.05] px-3 py-1.5 text-[0.78rem] text-lp-ink" dir="ltr">
                {labels.comment}
              </div>
            </div>
            {/* Public reply */}
            <div className={`flex items-start justify-end gap-2 transition-all duration-500 ${showReply ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}>
              <div className="lp-cta-bg rounded-2xl rounded-tr-sm px-3 py-1.5 text-[0.78rem] font-medium">
                {labels.reply}
              </div>
            </div>
            {/* DM */}
            <div className={`flex items-center gap-2 transition-all duration-500 ${showDM ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}>
              <span className="lp-chip lp-chip-neutral shrink-0">DM</span>
              <div className="min-w-0 flex-1 truncate rounded-lg border border-[var(--lp-hairline)] bg-white/[0.03] px-3 py-1.5 text-[0.76rem] text-lp-ink-dim" dir="ltr">
                {labels.dm}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MockScreen>
  );
}
