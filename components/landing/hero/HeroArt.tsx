"use client";

import { useEffect, useRef, useState } from "react";
import { Flame, Play, TrendingUp } from "lucide-react";
import { usePrefersReducedMotion } from "@/components/ui/usePrefersReducedMotion";

type Labels = {
  viral: string;
  above: string;
  rising: string;
  goingViral: string;
};

const CARDS = [
  { id: 0, baseScore: 612, mult: "2.1×" },
  { id: 1, baseScore: 894, mult: "3.4×" },
  { id: 2, baseScore: 1203, mult: "4.2×" },
  { id: 3, baseScore: 738, mult: "2.8×" },
];

// Stacked layout, front-most last. Offsets are in `cqw` (percent of the scene's
// own width), NOT pixels: the scene has a fixed aspect ratio, so one unit
// scales both axes together and the whole composition shrinks intact down to a
// 320px viewport. The previous version used fixed pixel offsets inside a fixed
// pixel height, which is why the cards spilled out of their box on small
// phones.
//
// `mobile: false` cards are hidden below the sm breakpoint — four overlapping
// cards on a narrow screen read as clutter, two read as a deck. The choice is
// made in CSS rather than JS so server and client render the same markup.
const LAYOUT = [
  { x: -10.5, y: 21.8, z: -120, r: -5, o: 0.72, mobile: false },
  { x: 8.6, y: 9.1, z: -60, r: 3.5, o: 0.85, mobile: false },
  { x: -6.8, y: -4.5, z: 0, r: -2.5, o: 1, mobile: true },
  { x: 10, y: -20.9, z: 40, r: 4.5, o: 0.94, mobile: true },
];

// Thumbnail ramps: graphite by default, warm for the card that's "going viral".
const THUMB_COOL = "linear-gradient(150deg,#3f3f46,#27272d)";
const THUMB_HOT = "linear-gradient(150deg,#f9e400,#a16207)";

export function HeroArt({ labels, rtl = false }: { labels: Labels; rtl?: boolean }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const [hot, setHot] = useState<number>(2);
  const reduced = usePrefersReducedMotion();

  // Spring-smoothed tilt toward the cursor (desktop pointer only).
  //
  // The loop now runs only while the pointer is actually over the scene. It
  // used to run continuously for as long as the hero was on screen, which
  // meant a permanent rAF loop — and a warm phone — for every visitor who
  // never touched the card stack.
  useEffect(() => {
    const scene = sceneRef.current;
    const stack = stackRef.current;
    if (!scene || !stack) return;

    if (reduced || window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };

    const loop = () => {
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      stack.style.transform = `rotateX(${(-cur.y * 6).toFixed(2)}deg) rotateY(${(cur.x * 7).toFixed(2)}deg)`;

      // Settle and stop once the spring has effectively arrived, so a resting
      // pointer doesn't keep the compositor awake.
      const atRest = Math.abs(target.x - cur.x) < 0.001 && Math.abs(target.y - cur.y) < 0.001;
      raf = atRest ? 0 : requestAnimationFrame(loop);
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      const rect = scene.getBoundingClientRect();
      target.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      kick();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      kick(); // spring back to level, then stop
    };

    scene.addEventListener("mousemove", onMove);
    scene.addEventListener("mouseleave", onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      scene.removeEventListener("mousemove", onMove);
      scene.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  // Cycle which card is "going viral" — paused off-screen.
  useEffect(() => {
    if (reduced) return;
    const scene = sceneRef.current;
    if (!scene) return;

    let timer: ReturnType<typeof setInterval> | null = null;

    // Only highlight a card that's actually visible: below sm the back two are
    // hidden, and cycling onto one of them would leave the deck dark. Read at
    // tick time (not render time) so this never affects hydration.
    const nextHot = (current: number) => {
      const wide = window.matchMedia("(min-width: 640px)").matches;
      const candidates = LAYOUT.map((l, i) => (wide || l.mobile ? i : -1)).filter((i) => i >= 0);
      const pos = candidates.indexOf(current);
      return candidates[(pos + 1) % candidates.length];
    };

    const start = () => {
      if (timer) return;
      timer = setInterval(() => setHot(nextHot), 3600);
    };
    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), {
      threshold: 0,
    });
    io.observe(scene);
    return () => {
      stop();
      io.disconnect();
    };
  }, [reduced]);

  return (
    <div
      ref={sceneRef}
      aria-hidden="true"
      className="lp-scene relative mx-auto aspect-[11/12] w-full max-w-[440px] select-none"
      style={{ perspective: "1200px", containerType: "inline-size" }}
    >
      {/* Warm bloom behind the stack. No blur filter — see .lp-nebula. */}
      <div
        className="lp-nebula lp-drift"
        style={{
          inset: "8% 12% 22% 8%",
          background: "radial-gradient(circle at 40% 40%, var(--lp-yellow), transparent 60%)",
          opacity: 0.16,
        }}
      />

      <div
        ref={stackRef}
        className="absolute inset-0 grid place-items-center"
        style={{ transformStyle: "preserve-3d", transition: "transform 0.1s linear" }}
      >
        {CARDS.map((card, i) => {
          const pos = LAYOUT[i];
          const isHot = hot === card.id;
          // Mirror the composition in RTL so the deck fans toward the copy,
          // not away from it.
          const x = rtl ? -pos.x : pos.x;
          return (
            <article
              key={card.id}
              className={[
                "absolute w-[clamp(190px,66cqw,290px)] rounded-2xl border bg-card p-3",
                pos.mobile ? "" : "hidden sm:block",
              ].join(" ")}
              style={{
                transformStyle: "preserve-3d",
                transform: `translate3d(${x}cqw, ${pos.y}cqw, ${pos.z + (isHot ? 70 : 0)}px) rotate(${
                  rtl ? -pos.r : pos.r
                }deg) scale(${isHot ? 1.05 : 1})`,
                opacity: pos.o,
                zIndex: isHot ? 50 : 10 + i,
                borderColor: isHot ? "var(--lp-yellow)" : "var(--border)",
                boxShadow: isHot
                  ? "0 24px 70px rgba(0,0,0,0.28), 0 0 0 1px var(--lp-yellow), 0 0 44px rgba(249,228,0,0.3)"
                  : "0 20px 50px rgba(0,0,0,0.18)",
                transition:
                  "transform 0.7s cubic-bezier(0.22,1,0.36,1), box-shadow 0.6s ease, border-color 0.6s ease, opacity 0.6s ease",
                animation: reduced ? undefined : `lp-float ${7 + i}s ease-in-out ${i * 0.6}s infinite`,
              }}
            >
              <div className="flex items-center gap-3">
                {/* Abstract reel thumbnail */}
                <div
                  className="relative grid h-16 w-12 shrink-0 place-items-center overflow-hidden rounded-lg transition-[background] duration-500"
                  style={{ background: isHot ? THUMB_HOT : THUMB_COOL }}
                >
                  <Play size={16} className="text-white/90" fill="currentColor" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 h-2.5 w-4/5 rounded-full bg-foreground/12" />
                  <div className="mb-2.5 h-2.5 w-3/5 rounded-full bg-foreground/8" />
                  <div className="flex items-center gap-1.5">
                    <span className="lp-chip lp-chip-accent tabular">
                      <Flame size={11} />
                      {isHot ? <ScoreCount base={card.baseScore} /> : card.baseScore}
                    </span>
                    <span className="lp-chip lp-chip-neutral tabular">
                      <TrendingUp size={11} />↑ {card.mult}
                    </span>
                  </div>
                </div>
              </div>
              {isHot && (
                <div className="mt-2.5 flex items-center gap-1.5 border-t border-border pt-2.5 text-[0.7rem] font-semibold text-lp-yellow-ink">
                  <span className="relative flex h-2 w-2">
                    <span className="lp-pulse absolute inline-flex h-2 w-2 rounded-full bg-lp-yellow" />
                  </span>
                  {labels.goingViral} · {labels.above}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <span className="sr-only">
        A floating stack of dashboard reel cards, each showing a virality score and an out-performance badge; one card is highlighted as going viral.
      </span>
    </div>
  );
}

function ScoreCount({ base }: { base: number }) {
  const [v, setV] = useState(base);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const delta = Math.round(base * 0.6);
    const dur = 1300;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(2, -10 * t);
      setV(Math.round(base + delta * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [base]);
  return <>{v.toLocaleString()}</>;
}
