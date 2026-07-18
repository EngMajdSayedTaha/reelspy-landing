import { Sparkles, Database } from "lucide-react";
import { InstagramMark, TikTokMark, YouTubeMark, FacebookMark } from "@/components/brand/PlatformMarks";
import type { Dictionary } from "@/lib/i18n/en";

export function LogoStrip({ dict }: { dict: Dictionary }) {
  const t = dict.proof;

  const items = [
    { node: <InstagramMark size={20} />, label: "Instagram" },
    { node: <TikTokMark size={20} />, label: "TikTok" },
    { node: <YouTubeMark size={20} />, label: "YouTube" },
    { node: <FacebookMark size={20} />, label: "Facebook" },
    { node: <Sparkles size={18} strokeWidth={1.6} />, label: t.poweredBy },
    { node: <Database size={18} strokeWidth={1.6} />, label: t.builtOn },
  ];

  // Rendered twice back-to-back so the marquee loops seamlessly (translateX -50%).
  const row = (keyPrefix: string) =>
    items.map((it, i) => (
      <li key={`${keyPrefix}-${i}`} className="flex shrink-0 items-center gap-2.5 px-7 text-lp-ink-dim/75">
        <span className="text-lp-ink-dim/90">{it.node}</span>
        <span className="whitespace-nowrap text-sm font-medium">{it.label}</span>
      </li>
    ));

  return (
    <section aria-label={t.connects} className="relative border-y border-white/5 bg-lp-space py-7 text-lp-ink">
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
