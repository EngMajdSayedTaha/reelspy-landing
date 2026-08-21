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

      {/* Pain cards. The grid itself is a plain container — each card is its own
          reveal target so they stagger in. Wrapping the grid in a <Reveal> too
          would fade the group and the cards independently, multiplying the two
          opacities into a muddy double-fade. */}
      <div className="mx-auto mt-14 grid max-w-[1080px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {t.pains.map((p, i) => {
          const Icon = PAIN_ICONS[i];
          return (
            <div
              key={i}
              data-reveal=""
              style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
              className="flex"
            >
              {/* Inner card, not the reveal target — see BentoGrid for why a
                  hover lift on a [data-reveal] element never fires. */}
              <div className="lp-surface lp-surface-hover group flex w-full flex-col p-5">
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground transition group-hover:border-border-strong group-hover:text-foreground">
                  <Icon size={18} strokeWidth={1.6} />
                </span>
                <h3 className="text-[0.95rem] font-semibold leading-snug text-foreground">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pivot + loop diagram */}
      <div className="mt-20 flex flex-col items-center">
        <Reveal className="mb-2 flex flex-col items-center gap-5 text-center">
          <hr className="lp-rule w-full max-w-[14rem]" />
          <span className="lp-h3 max-w-[26ch] text-balance font-semibold text-foreground">{t.pivot}</span>
        </Reveal>

        {/* Below sm the circular diagram doesn't work: its four nodes are
            absolutely positioned at the cardinal points and start overlapping
            each other and the hub once the circle drops under ~420px. The same
            four steps read fine as a vertical list, so that's what small
            screens get. */}
        <Reveal className="mt-6 flex w-full max-w-[420px] flex-col gap-3 sm:hidden" delay={120}>
          {NODES.map((n, i) => {
            const step = t.loop[n.key as keyof typeof t.loop];
            const Icon = n.icon;
            return (
              <div
                key={n.key}
                className="lp-surface flex items-start gap-3 p-4"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-lp-yellow-ink">
                  <Icon size={18} strokeWidth={1.7} />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground">{step.k}</div>
                  <div className="mt-0.5 text-[0.8rem] leading-snug text-muted-foreground">{step.d}</div>
                </div>
                <span className="ms-auto shrink-0 self-center text-xs tabular text-muted-foreground/60">
                  {i + 1}
                </span>
              </div>
            );
          })}
        </Reveal>

        <Reveal className="relative mt-6 hidden w-full max-w-[480px] sm:block" delay={120}>
          <div className="relative mx-auto aspect-square w-full" style={{ containerType: "inline-size" }}>
            {/* Ring */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
              <circle cx="50" cy="50" r="35" fill="none" stroke="var(--border)" strokeWidth="0.5" />
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
                {/* The dashed ring used to be full-strength brand yellow the
                    whole way round — a 340px yellow circle competing with the
                    one dot that is actually meant to be tracked, and by far the
                    largest patch of accent color on the page. The ring is track;
                    only the dot moving along it is signal. */}
                <linearGradient id="loopGrad" x1="0" y1="0" x2="100" y2="100">
                  <stop offset="0" stopColor="var(--border-strong)" />
                  <stop offset="0.5" stopColor="var(--border)" />
                  <stop offset="1" stopColor="var(--border-strong)" />
                </linearGradient>
              </defs>
            </svg>

            {/* Orbiting dot */}
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0">
              <div className="lp-orbit absolute h-0 w-0">
                <span
                  className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lp-yellow"
                  style={{ top: "-35%", boxShadow: "0 0 14px 3px color-mix(in srgb, var(--lp-yellow) 55%, transparent)" }}
                />
              </div>
            </div>

            {/* Center hub */}
            <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-border bg-card shadow-[var(--lp-shadow-3),var(--lp-sheen)]">
              <LoopHub />
            </div>

            {/* Nodes */}
            {NODES.map((n) => {
              const step = t.loop[n.key as keyof typeof t.loop];
              const Icon = n.icon;
              return (
                <div
                  key={n.key}
                  className={`absolute w-[clamp(112px,30cqw,140px)] -translate-x-1/2 -translate-y-1/2 ${n.pos}`}
                >
                  <div className="lp-glass flex flex-col items-center gap-2 rounded-2xl p-3 text-center">
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
          <stop offset="0" stopColor="var(--lp-yellow)" />
          <stop offset="1" stopColor="var(--muted-foreground)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
