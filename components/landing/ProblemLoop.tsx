import { Clock3, Eye, FileText, MessageSquareReply, PenLine, Radar, Send, Upload, UsersRound } from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/lib/i18n/en";

const PAIN_ICONS = [Clock3, UsersRound, FileText, Upload, MessageSquareReply];

// Loop nodes at the four cardinal points. Disc light-up is synced to the
// orbiting dot via negative animation-delays (clockwise from top).
const NODES = [
  { key: "watch", icon: Eye, pos: "left-1/2 top-[12%]", delay: "0s" },
  { key: "spot", icon: Radar, pos: "left-[82%] top-1/2", delay: "-6s" },
  { key: "create", icon: PenLine, pos: "left-1/2 top-[88%]", delay: "-4s" },
  { key: "publish", icon: Send, pos: "left-[18%] top-1/2", delay: "-2s" },
] as const;

export function ProblemLoop({ dict }: { dict: Dictionary }) {
  const t = dict.problem;
  return (
    <Section id="how">
      <SectionHeading title={t.h2a} titleAccent={t.h2b} align="center" />

      {/* Pain cards */}
      <Reveal className="mx-auto mt-14 grid max-w-[1080px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {t.pains.map((p, i) => {
          const Icon = PAIN_ICONS[i];
          return (
            <div
              key={i}
              data-reveal=""
              style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
              className="group rounded-2xl border border-border bg-card p-5 transition hover:border-border-strong"
            >
              <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition group-hover:text-foreground">
                <Icon size={18} strokeWidth={1.6} />
              </span>
              <h3 className="text-[0.95rem] font-semibold leading-snug text-foreground">{p.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
            </div>
          );
        })}
      </Reveal>

      {/* Pivot + loop diagram */}
      <div className="mt-20 flex flex-col items-center">
        <Reveal className="mb-4 flex items-center gap-2 text-center">
          <span className="lp-h3 max-w-[26ch] text-balance font-semibold text-foreground">{t.pivot}</span>
        </Reveal>

        <Reveal className="relative mt-6 w-full max-w-[480px]" delay={120}>
          <div className="relative mx-auto aspect-square w-full">
            {/* Ring */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
              <circle cx="50" cy="50" r="35" fill="none" stroke="var(--lp-hairline)" strokeWidth="0.5" />
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="url(#loopGrad)"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeDasharray="14 6"
                style={{ animation: "lp-ring-flow 6s linear infinite" }}
              />
              <defs>
                <linearGradient id="loopGrad" x1="0" y1="0" x2="100" y2="100">
                  <stop offset="0" stopColor="#6d5cff" />
                  <stop offset="0.5" stopColor="#4e7dff" />
                  <stop offset="1" stopColor="#49e4ff" />
                </linearGradient>
              </defs>
            </svg>

            {/* Orbiting dot */}
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0">
              <div className="lp-orbit absolute h-0 w-0">
                <span
                  className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lp-cyan"
                  style={{ top: "-35%", boxShadow: "0 0 16px 4px rgba(73,228,255,0.7)" }}
                />
              </div>
            </div>

            {/* Center hub */}
            <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-border bg-card shadow-lg">
              <LoopHub />
            </div>

            {/* Nodes */}
            {NODES.map((n) => {
              const step = t.loop[n.key as keyof typeof t.loop];
              const Icon = n.icon;
              return (
                <div
                  key={n.key}
                  className={`absolute w-[140px] -translate-x-1/2 -translate-y-1/2 ${n.pos}`}
                >
                  <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card/80 p-3 text-center backdrop-blur">
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground"
                      style={{ animation: `lp-node-lit 8s linear ${n.delay} infinite` }}
                    >
                      <Icon size={18} strokeWidth={1.7} />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{step.k}</div>
                      <div className="mt-0.5 text-[0.72rem] leading-tight text-muted-foreground">{step.d}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function LoopHub() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12a8 8 0 0 1 13.7-5.6M20 12a8 8 0 0 1-13.7 5.6"
        stroke="url(#hubGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M17 3v3.5h-3.5M7 21v-3.5h3.5" stroke="url(#hubGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="hubGrad" x1="0" y1="0" x2="24" y2="24">
          <stop offset="0" stopColor="#6d5cff" />
          <stop offset="1" stopColor="#49e4ff" />
        </linearGradient>
      </defs>
    </svg>
  );
}
