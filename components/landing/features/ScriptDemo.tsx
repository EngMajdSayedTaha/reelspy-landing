"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import { MockScreen } from "./MockScreen";
import { usePrefersReducedMotion } from "@/components/ui/usePrefersReducedMotion";
import type { Locale } from "@/lib/i18n/config";

type ScriptText = { hook: string; body: string; cta: string };
type Labels = {
  voice: string;
  chips: string[]; // [English, العربية, Gulf, MSA]
  hook: string;
  bodyLabel: string;
  cta: string;
  writtenBy: string;
  regenerate: string;
  aria: string;
  script: ScriptText;
  scriptAr: ScriptText;
};

export function ScriptDemo({ labels, defaultLang }: { labels: Labels; defaultLang: Locale }) {
  const [lang, setLang] = useState<"en" | "ar">(defaultLang === "ar" ? "ar" : "en");
  const [dialect, setDialect] = useState<0 | 1>(0);
  const [typed, setTyped] = useState({ field: 0, chars: 0, done: false });
  const [active, setActive] = useState(false);
  const [nonce, setNonce] = useState(0);
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const script = lang === "ar" ? labels.scriptAr : labels.script;
  // The three labels used to be three different hues. Under the one-accent
  // system the accent marks what matters — the hook and the call to action —
  // and the body label stays neutral.
  const fields = [
    { label: labels.hook, text: script.hook, accent: "text-lp-yellow-ink" },
    { label: labels.bodyLabel, text: script.body, accent: "text-lp-ink-dim" },
    { label: labels.cta, text: script.cta, accent: "text-lp-yellow-ink" },
  ];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active || reduced) return;
    let field = 0;
    let chars = 0;
    let hold: ReturnType<typeof setTimeout> | null = null;

    const id = setInterval(() => {
      if (field >= fields.length) {
        clearInterval(id);
        setTyped({ field: fields.length, chars: 0, done: true });
        hold = setTimeout(() => setNonce((n) => n + 1), 2800);
        return;
      }
      chars += lang === "ar" ? 1 : 2; // type latin a touch faster
      if (chars >= fields[field].text.length) {
        field += 1;
        chars = 0;
        setTyped({ field, chars: 0, done: false });
        return;
      }
      setTyped({ field, chars, done: false });
    }, 26);

    return () => {
      clearInterval(id);
      if (hold) clearTimeout(hold);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, dialect, active, nonce, reduced]);

  // Reset typing immediately on user action (setState in an event handler is
  // fine); the typing effect then re-runs and types the new selection.
  const restart = () => setTyped({ field: 0, chars: 0, done: false });

  const langChips = [labels.chips[0], labels.chips[1]];
  const styleChips = [labels.chips[2], labels.chips[3]];

  return (
    <MockScreen path="dashboard/scripts" srLabel={labels.aria}>
      <div ref={rootRef} className="grid gap-3.5">
        {/* Voice chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.72rem] font-medium uppercase tracking-wide text-lp-ink-dim">{labels.voice}</span>
          <div className="inline-flex rounded-full border border-[var(--lp-hairline)] bg-white/[0.03] p-0.5">
            {langChips.map((c, i) => (
              <button
                key={c}
                type="button"
                aria-pressed={lang === (i === 1 ? "ar" : "en")}
                onClick={() => {
                  setLang(i === 1 ? "ar" : "en");
                  restart();
                }}
                className={`rounded-full px-2.5 py-1 text-[0.72rem] font-medium transition ${
                  lang === (i === 1 ? "ar" : "en") ? "lp-cta-bg" : "text-lp-ink-dim hover:text-lp-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="inline-flex rounded-full border border-[var(--lp-hairline)] bg-white/[0.03] p-0.5">
            {styleChips.map((c, i) => (
              <button
                key={c}
                type="button"
                aria-pressed={dialect === i}
                onClick={() => {
                  setDialect(i as 0 | 1);
                  restart();
                }}
                className={`rounded-full px-2.5 py-1 text-[0.72rem] font-medium transition ${
                  dialect === i ? "bg-white/12 text-lp-ink" : "text-lp-ink-dim hover:text-lp-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Script body */}
        <div dir={lang === "ar" ? "rtl" : "ltr"} className="grid gap-2.5">
          {fields.map((f, i) => {
            const allDone = reduced || typed.done;
            const isTyping = !allDone && typed.field === i;
            const shownFull = allDone || typed.field > i;
            const text = shownFull ? f.text : isTyping ? f.text.slice(0, typed.chars) : "";
            return (
              <div key={i} className="rounded-xl border border-[var(--lp-hairline)] bg-white/[0.02] p-3">
                <div className={`mb-1 text-[0.66rem] font-semibold uppercase tracking-[0.14em] ${f.accent}`}>{f.label}</div>
                <p className="min-h-[1.2rem] text-[0.82rem] leading-relaxed text-lp-ink">
                  {text}
                  {isTyping && !reduced && <span className="lp-caret" />}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="lp-chip lp-chip-neutral">
            <Sparkles size={12} /> {labels.writtenBy}
          </span>
          <button
            type="button"
            onClick={() => {
              setNonce((n) => n + 1);
              restart();
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--lp-hairline)] px-3 py-1.5 text-[0.72rem] font-medium text-lp-ink-dim transition hover:text-lp-ink hover:border-white/20"
          >
            <RotateCcw size={12} /> {labels.regenerate}
          </button>
        </div>
      </div>
    </MockScreen>
  );
}
