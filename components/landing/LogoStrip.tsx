import { Sparkles } from "lucide-react";
import { InstagramMark, TikTokMark, YouTubeMark, FacebookMark } from "@/components/brand/PlatformMarks";
import type { Dictionary } from "@/lib/i18n/en";

export function LogoStrip({ dict }: { dict: Dictionary }) {
  const t = dict.proof;

  // Instagram is the only platform actually wired up. The rest are labelled as
  // upcoming rather than listed flat next to it — an unqualified logo row reads
  // as "all four work today", which is a promise the product doesn't keep yet.
  const items = [
    { node: <InstagramMark size={20} />, label: "Instagram", soon: false },
    { node: <TikTokMark size={20} />, label: "TikTok", soon: true },
    { node: <YouTubeMark size={20} />, label: "YouTube", soon: true },
    { node: <FacebookMark size={20} />, label: "Facebook", soon: true },
    { node: <Sparkles size={18} strokeWidth={1.6} />, label: t.poweredBy, soon: false },
  ];

  // Rendered twice back-to-back so the marquee loops seamlessly (translateX -50%).
  const row = (keyPrefix: string) =>
    items.map((it, i) => (
      <li key={`${keyPrefix}-${i}`} className="flex shrink-0 items-center gap-2.5 px-7 text-muted-foreground/75">
        <span className={it.soon ? "text-muted-foreground/50" : "text-muted-foreground/90"}>{it.node}</span>
        <span className={`whitespace-nowrap text-sm font-medium ${it.soon ? "text-muted-foreground/55" : ""}`}>
          {it.label}
        </span>
        {it.soon && (
          <span className="lp-chip lp-chip-neutral whitespace-nowrap text-[0.62rem] uppercase tracking-wide">
            {t.soon}
          </span>
        )}
      </li>
    ));

  return (
    <section aria-label={t.connects} className="relative border-y border-border bg-background py-7 text-foreground">
      <p className="sr-only">{t.connects}</p>
      <div
        aria-hidden="true"
        className="lp-marquee group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
      >
        <ul className="lp-marquee-track flex w-max items-center">
          {row("a")}
          {row("b")}
        </ul>
      </div>
    </section>
  );
}
