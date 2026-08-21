import { Eye, TrendingUp } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/en";
import type { ShowcaseReel } from "@/lib/showcase/types";
import { reelKey } from "@/lib/showcase/sort";
import { cn } from "@/lib/utils";
import { ReelCover, ReelPlayback } from "./ReelCover";

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

// Two rows, opposite directions, different speeds. Matched speeds read as one
// rigid slab sliding past; mismatched ones read as depth — the same reason a
// parallax layer works. The back row is smaller and dimmer so the depth cue
// survives even when the motion is frozen by prefers-reduced-motion.
const ROWS = [
  { seconds: 78, reverse: false, scale: "w-[152px] sm:w-[176px] lg:w-[198px]", dim: "" },
  // 0.85, not 0.72: these covers are near-black, and on the light theme the
  // extra transparency turned the whole back row a milky grey instead of
  // reading as footage further away. Size and shadow carry the depth; the
  // opacity is only there to take the row off the front plane.
  { seconds: 104, reverse: true, scale: "w-[128px] sm:w-[148px] lg:w-[166px]", dim: "opacity-[0.85]" },
] as const;

/**
 * The reel wall: a band of reels running continuously, in both directions,
 * forever.
 *
 * Seamlessness is the whole engineering problem, and it comes down to one
 * invariant: **the track holds every card exactly twice, and travels exactly
 * -50%.** When the first copy has fully exited, the second copy is
 * pixel-for-pixel where the first one started, so the animation can restart
 * with nothing to see. Break the invariant and the wall snaps.
 *
 * Which is why the spacing between cards is per-card PADDING and not a flex
 * `gap`. With `gap: G` across 2N items the track is `2N·W + (2N−1)·G` wide —
 * half of that is one gap short of the content width, so -50% lands slightly
 * off and the wall drifts a few pixels further out of alignment on every lap.
 * Padding is part of each item's own width, so doubling the items doubles the
 * track exactly.
 *
 * It also never pauses — not on hover, not on focus. This band is playback, not
 * a carousel; a wall of reels that freezes when the cursor crosses it stops
 * looking like a feed. The interactive, inspectable version of this data is the
 * explorer directly below it, which is where hovering and clicking belong.
 *
 * Server component — the entire thing is CSS. No JS ships for it at all.
 */
export function ReelWall({
  reels,
  dict,
  rtl = false,
}: {
  reels: ShowcaseReel[];
  dict: Dictionary;
  rtl?: boolean;
}) {
  const t = dict.showcase;

  // Interleave rather than slice: taking the first half and the second half
  // would put every high performer on the top row and every quiet reel on the
  // bottom, so the two rows would look like different quality tiers.
  const rowA = reels.filter((_, i) => i % 2 === 0);
  const rowB = reels.filter((_, i) => i % 2 === 1);
  if (rowA.length === 0) return null;

  return (
    <div className="relative">
      {/* The rail is decorative — the same reels are rendered as real,
          inspectable content by the explorer below. One sentence describing
          what it is beats forty cards of unreachable card text. */}
      <p className="sr-only">{t.wallLabel}</p>

      <div aria-hidden className="relative">
        {/* Horizontal fade. Cards must dissolve at the edges rather than being
            guillotined by an overflow boundary — a hard cut announces "this is
            a scroller"; a fade lets the band read as a window onto something
            larger that continues past the screen. */}
        <div className="[mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]">
          <div className="flex flex-col gap-3 sm:gap-4">
            {ROWS.map((row, i) => {
              const items = i === 0 ? rowA : rowB;
              if (items.length === 0) return null;
              return (
                <Rail
                  key={i}
                  items={items}
                  seconds={row.seconds}
                  // `reverse` is now purely "against the reading direction".
                  // Locale is handled by which keyframe the rail runs (see
                  // Rail), not by flipping the direction here — doing both
                  // cancelled out and left every row travelling the same way.
                  reverse={row.reverse}
                  rtl={rtl}
                  cardClass={cn(row.scale, row.dim)}
                  // Both rows name their creator — a card with nothing but a
                  // play glyph on it reads as a placeholder. Only the front row
                  // carries the runtime and level meter, so the back row stays
                  // quieter without going blank.
                  showPlayback={i === 0}
                />
              );
            })}
          </div>
        </div>

        {/* Vertical bleed into the section, top and bottom, so the band has no
            edges at all in any direction. */}
        <div className="pointer-events-none absolute inset-x-0 -top-px h-12 bg-gradient-to-b from-surface-2 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 -bottom-px h-12 bg-gradient-to-t from-surface-2 to-transparent" />
      </div>
    </div>
  );
}

function Rail({
  items,
  seconds,
  reverse,
  rtl,
  cardClass,
  showPlayback,
}: {
  items: ShowcaseReel[];
  seconds: number;
  reverse: boolean;
  rtl: boolean;
  cardClass: string;
  showPlayback: boolean;
}) {
  // Both copies are rendered from the same array in the same order. The `copy`
  // prefix only exists to keep React keys unique — nothing about the second
  // copy may differ, or the seam becomes visible once per lap.
  const copies = [0, 1];
  return (
    <div className="overflow-hidden">
      <div
        className="lp-rail"
        style={{
          ["--rail-dur" as string]: `${seconds}s`,
          // A max-content flex track lays out from the right in RTL, so the
          // travel that lands copy 2 on copy 1's starting position is +50%
          // there and -50% here. `transform` has no logical equivalent, so this
          // is a genuine per-direction keyframe rather than a missing token.
          animationName: rtl ? "lp-rail-run-rtl" : "lp-rail-run",
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {copies.map((copy) =>
          items.map((reel) => (
            <div key={`${copy}-${reelKey(reel)}`} className={cn("shrink-0 px-1.5 sm:px-2", cardClass)}>
              <WallCard reel={reel} showPlayback={showPlayback} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function WallCard({ reel, showPlayback }: { reel: ShowcaseReel; showPlayback: boolean }) {
  const hot = reel.outperformRatio >= 2.5;
  return (
    <div className="group relative aspect-[9/16] overflow-hidden rounded-[1.15rem] border border-white/10 bg-lp-deep shadow-[var(--lp-shadow-3)]">
      <ReelCover reel={reel} />

      {/* Top row: the out-performance multiple is the one thing on this wall
          that is allowed to be yellow, because it is the one thing the product
          is claiming to find. Everything else is white on graded footage. */}
      <div className="pointer-events-none absolute inset-x-2 top-2 flex items-start justify-between gap-1">
        {hot ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-lp-yellow px-1.5 py-0.5 text-[0.62rem] font-bold text-lp-yellow-fg shadow-sm">
            <TrendingUp size={10} strokeWidth={2.6} />
            <span className="tabular" dir="ltr">
              {reel.outperformRatio.toFixed(1)}×
            </span>
          </span>
        ) : (
          <span />
        )}
        {showPlayback && <ReelPlayback reel={reel} />}
      </div>

      {/* Bottom row: who, and how big. Two facts is the right amount for a card
          moving past at this speed — a caption here would be unreadable and
          would only make the wall look busy. */}
      <div className="pointer-events-none absolute inset-x-2.5 bottom-3 flex items-center justify-between gap-2">
        <span className="truncate text-[0.68rem] font-semibold text-white/95 drop-shadow" dir="ltr">
          @{reel.igUsername}
        </span>
        {showPlayback && (
          <span className="inline-flex shrink-0 items-center gap-1 text-[0.66rem] font-medium text-white/80 drop-shadow">
            <Eye size={11} />
            <span className="tabular" dir="ltr">
              {compact.format(reel.viewCount)}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
