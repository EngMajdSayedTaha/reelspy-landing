import { Lock } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/lib/i18n/en";

// Hot (over-performing) nodes carry a label chip; dim nodes are ambient dots.
const HOT = [
  { x: 62, y: 31, mult: "6.1×", label: 0, drift: "lp-float" },
  { x: 34, y: 60, mult: "4.3×", label: 1, drift: "lp-float-slow" },
  { x: 69, y: 64, mult: "3.7×", label: 3, drift: "lp-float" },
];
const DIM = [
  { x: 26, y: 36 },
  { x: 47, y: 22 },
  { x: 78, y: 46 },
  { x: 41, y: 79 },
  { x: 58, y: 82 },
  { x: 20, y: 58 },
];

export function NicheRadar({ dict }: { dict: Dictionary }) {
  const t = dict.radar;
  return (
    <section
      className="relative overflow-hidden bg-surface-2 text-foreground"
      style={{ paddingBlock: "clamp(5rem, 10vh, 8rem)" }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="lp-grid-bg absolute inset-0 opacity-40" />
        <div className="lp-nebula lp-drift" style={{ inset: "auto -8% -18% 30%", width: "50%", height: "60%", background: "radial-gradient(circle, var(--lp-yellow), transparent 62%)", opacity: 0.22 }} />
      </div>

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Copy */}
        <Reveal>
          <span className="lp-eyebrow">{t.eyebrow}</span>
          <h2 className="lp-h2 mt-4 max-w-[16ch] text-balance text-foreground">
            {t.h2a} <span className="lp-accent-text">{t.h2b}</span>
          </h2>
          <p className="lp-lead mt-5 max-w-[48ch] text-muted-foreground">{t.body}</p>
          <p className="mt-6 inline-flex items-start gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            <Lock size={16} className="mt-0.5 shrink-0 text-lp-yellow-ink" />
            <span className="max-w-[44ch]">{t.anonymity}</span>
          </p>
        </Reveal>

        {/* Radar */}
        <Reveal delay={120} className="flex justify-center">
          <div className="relative aspect-square w-full max-w-[460px]" aria-hidden>
            {/* Rings */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              <defs>
                <radialGradient id="radarGlow" cx="50" cy="50" r="50" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="var(--lp-yellow)" stopOpacity="0.14" />
                  <stop offset="1" stopColor="var(--lp-yellow)" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="46" fill="url(#radarGlow)" />
              {[46, 34, 22, 10].map((r) => (
                <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="0.4" />
              ))}
              <line x1="4" y1="50" x2="96" y2="50" stroke="var(--border)" strokeWidth="0.3" />
              <line x1="50" y1="4" x2="50" y2="96" stroke="var(--border)" strokeWidth="0.3" />
            </svg>

            {/* Sweep */}
            <div
              className="absolute inset-[4%] rounded-full"
              style={{
                background: "conic-gradient(from 0deg, rgba(249,228,0,0.5) 0deg, rgba(249,228,0,0.12) 26deg, transparent 60deg, transparent 360deg)",
                WebkitMask: "radial-gradient(circle, #000 68%, transparent 70%)",
                mask: "radial-gradient(circle, #000 68%, transparent 70%)",
                animation: "lp-spin 7s linear infinite",
              }}
            />

            {/* Dim ambient nodes */}
            {DIM.map((n, i) => (
              <span
                key={i}
                className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/50"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              />
            ))}

            {/* Hot nodes with labels */}
            {HOT.map((n, i) => (
              <div
                key={i}
                className={n.drift}
                style={{ position: "absolute", left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%,-50%)", animationDelay: `${i * -3}s` }}
              >
                <div className="relative flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="lp-pulse absolute inline-flex h-2.5 w-2.5 rounded-full bg-lp-yellow" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lp-yellow" />
                  </span>
                  <span className="lp-chip lp-chip-accent whitespace-nowrap text-[0.66rem]">
                    ↑ {n.mult} · {t.labels[n.label]}
                  </span>
                </div>
              </div>
            ))}

            {/* Center hub */}
            <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lp-yellow shadow-[0_0_20px_6px_rgba(249,228,0,0.45)]" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
