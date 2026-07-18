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
  { id: 0, grad: "linear-gradient(150deg,#6d5cff,#4e7dff)", baseScore: 612, mult: "2.1×" },
  { id: 1, grad: "linear-gradient(150deg,#4e7dff,#49e4ff)", baseScore: 894, mult: "3.4×" },
  { id: 2, grad: "linear-gradient(150deg,#a78bff,#6d5cff)", baseScore: 1203, mult: "4.2×" },
  { id: 3, grad: "linear-gradient(150deg,#2fe0ff,#4e7dff)", baseScore: 738, mult: "2.8×" },
];

// Static stacked layout (translate + depth) for each card, front-most last.
const LAYOUT = [
  { x: -46, y: 96, z: -120, r: -5, o: 0.72 },
  { x: 38, y: 40, z: -60, r: 3.5, o: 0.85 },
  { x: -30, y: -20, z: 0, r: -2.5, o: 1 },
  { x: 44, y: -92, z: 40, r: 4.5, o: 0.94 },
];

export function HeroArt({ labels }: { labels: Labels }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const [hot, setHot] = useState<number>(2);
  const reduced = usePrefersReducedMotion();

  // Spring-smoothed tilt toward the cursor (desktop pointer only).
  useEffect(() => {
    const scene = sceneRef.current;
    const stack = stackRef.current;
    if (!scene || !stack) return;

    if (reduced || window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    let visible = true;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };

    const onMove = (e: MouseEvent) => {
      const rect = scene.getBoundingClientRect();
      target.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    const loop = () => {
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      stack.style.transform = `rotateX(${(-cur.y * 6).toFixed(2)}deg) rotateY(${(cur.x * 7).toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(loop);
        else if (!visible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(scene);

    scene.addEventListener("mousemove", onMove);
    scene.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
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
    const start = () => {
      if (timer) return;
      timer = setInterval(() => setHot((h) => (h + 1) % CARDS.length), 3600);
    };
    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 });
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
      className="relative mx-auto h-[420px] w-full max-w-[440px] select-none sm:h-[480px]"
      style={{ perspective: "1200px" }}
    >
      {/* Nebula behind the stack */}
      <div
        className="lp-nebula lp-drift"
        style={{ inset: "8% 12% 22% 8%", background: "radial-gradient(circle at 40% 40%,#6d5cff,transparent 60%)", opacity: 0.5 }}
      />
      <div
        className="lp-nebula lp-drift"
        style={{ inset: "26% 6% 8% 30%", background: "radial-gradient(circle at 60% 60%,#49e4ff,transparent 62%)", opacity: 0.4, animationDelay: "-6s" }}
      />

      <div
        ref={stackRef}
        className="absolute inset-0 grid place-items-center"
        style={{ transformStyle: "preserve-3d", transition: "transform 0.1s linear" }}
      >
        {CARDS.map((card, i) => {
          const pos = LAYOUT[i];
          const isHot = hot === card.id;
          return (
            <article
              key={card.id}
              className="absolute w-[290px] rounded-2xl border p-3"
              style={{
                transformStyle: "preserve-3d",
                transform: `translate3d(${pos.x}px, ${pos.y}px, ${pos.z + (isHot ? 70 : 0)}px) rotate(${pos.r}deg) scale(${isHot ? 1.05 : 1})`,
                opacity: pos.o,
                zIndex: isHot ? 50 : 10 + i,
                background: "linear-gradient(180deg,#131631,#222850)",
                borderColor: isHot ? "rgba(73,228,255,0.55)" : "rgba(255,255,255,0.09)",
                boxShadow: isHot
                  ? "0 24px 70px rgba(9,10,24,0.65), 0 0 0 1px rgba(73,228,255,0.4), 0 0 44px rgba(73,228,255,0.35)"
                  : "0 20px 50px rgba(9,10,24,0.55)",
                transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1), box-shadow 0.6s ease, border-color 0.6s ease, opacity 0.6s ease",
                animation: reduced ? undefined : `lp-float ${7 + i}s ease-in-out ${i * 0.6}s infinite`,
              }}
            >
              <div className="flex items-center gap-3">
                {/* Abstract reel thumbnail */}
                <div
                  className="relative grid h-16 w-12 shrink-0 place-items-center overflow-hidden rounded-lg"
                  style={{ background: card.grad }}
                >
                  <Play size={16} className="text-white/90" fill="currentColor" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 h-2.5 w-4/5 rounded-full bg-white/12" />
                  <div className="mb-2.5 h-2.5 w-3/5 rounded-full bg-white/8" />
                  <div className="flex items-center gap-1.5">
                    <span className="lp-chip lp-chip-cyan tabular">
                      <Flame size={11} />
                      {isHot ? <ScoreCount base={card.baseScore} /> : card.baseScore}
                    </span>
                    <span className="lp-chip lp-chip-violet tabular">
                      <TrendingUp size={11} />↑ {card.mult}
                    </span>
                  </div>
                </div>
              </div>
              {isHot && (
                <div className="mt-2.5 flex items-center gap-1.5 border-t border-white/8 pt-2.5 text-[0.7rem] font-semibold text-lp-cyan">
                  <span className="relative flex h-2 w-2">
                    <span className="lp-pulse absolute inline-flex h-2 w-2 rounded-full bg-lp-cyan" />
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
