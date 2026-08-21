import { BarChart3, CalendarDays, Boxes, Compass, Palette, Languages, Download, Users } from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/en";

const ICONS = [BarChart3, CalendarDays, Boxes, Compass, Palette, Languages, Download, Users];
// Bento spans: the first two tiles are featured (double width). At the 2-column
// tier that means one featured tile per row; at 4 columns they pair up.
const SPANS = ["sm:col-span-2", "sm:col-span-2", "", "", "", "", "", ""];

export function BentoGrid({ dict }: { dict: Dictionary }) {
  const t = dict.bento;
  return (
    <Section className="bg-background">
      <SectionHeading eyebrow={t.eyebrow} title={t.h2} align="center" className="mx-auto mb-16" />
      {/* The 2-column tier matters: going straight from 1 to 4 columns put four
          tiles (two of them double-width) on one row from 640px up, which was
          unreadable on a small tablet. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.tiles.map((tile, i) => {
          const Icon = ICONS[i];
          return (
            // The card is a child of the Reveal, never the Reveal itself.
            // A reveal target is held at `transform: translateY(18px)` by a
            // selector more specific than any `:hover` rule, so a hover lift on
            // the same element silently does nothing — which is exactly what
            // was happening to these tiles.
            <Reveal key={i} delay={(i % 4) * 60} className={cn("flex", SPANS[i])}>
              <div className="lp-surface lp-surface-hover lp-spot group flex w-full flex-col gap-4 p-5">
                <span className="lp-icon-tile h-10 w-10 transition-transform duration-300 group-hover:scale-110">
                  <Icon size={18} strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="text-[0.95rem] font-semibold text-foreground">{tile.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tile.d}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
