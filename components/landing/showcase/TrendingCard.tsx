import { ArrowUpRight, Eye, Heart, MessageCircle, TrendingUp } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/en";
import type { ShowcaseReel } from "@/lib/showcase/types";
import { formatDaysAgo } from "@/lib/showcase/format";
import { ReelCover } from "./ReelCover";

// Mirrors the dashboard's TrendReelCard, minus everything that needs an
// account: no tracking action, no saved state. What's left is the part a
// visitor can judge the product by.

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

function daysSince(iso: string | null): number | null {
  if (!iso) return null;
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return null;
  // Rendered on the server; the value is stable for the life of the cache
  // entry, which is fine for a "3 days ago" label.
  return Math.max(0, Math.floor((Date.now() - then) / 86_400_000));
}

export function TrendingCard({ reel, dict }: { reel: ShowcaseReel; dict: Dictionary }) {
  const t = dict.showcase;
  const days = daysSince(reel.postedAt);
  const isOutperforming = reel.outperformRatio >= 1.5;

  // A reel is only interactive if the payload gave us somewhere to go. The
  // curated fixtures ship `permalink: null` on every row, so in demo mode the
  // card is deliberately inert rather than a link to nowhere — hover lift and
  // the pointer cursor are gated on the same flag so it doesn't *look*
  // clickable when it isn't.
  const href = reel.permalink;

  return (
    <article
      className={`group lp-surface lp-spot relative flex h-full flex-col overflow-hidden rounded-2xl focus-within:ring-2 focus-within:ring-lp-yellow-ink ${
        href ? "lp-surface-hover" : ""
      }`}
    >
      {/* 4:5, not the reel's native 9:16. At four columns across 1240px a true
          9:16 cover is ~530px tall, so a row of eight cards ran past two full
          screens and the captions and metrics — the part that demonstrates the
          ranking — fell below the fold. 4:5 is the crop Instagram's own grid
          uses, so it still reads as a reel while keeping the card scannable. */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {/* The same frame the wall above uses, on its calm setting: in a static
            grid the reader is scanning captions and numbers, and forty cards
            each pushing in on their own Ken Burns cycle turns that into work.
            The wall performs; the grid holds still. */}
        <ReelCover reel={reel} calm />

        {isOutperforming && (
          <span className="absolute start-2 top-2 inline-flex items-center gap-1 rounded-full bg-lp-yellow px-2 py-0.5 text-[0.66rem] font-bold text-lp-yellow-fg shadow-sm">
            <TrendingUp size={11} strokeWidth={2.6} />
            <span className="tabular" dir="ltr">
              {reel.outperformRatio.toFixed(1)}×
            </span>
          </span>
        )}

        {days !== null && (
          <span className="absolute end-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-[0.64rem] font-medium text-white/85 backdrop-blur-sm">
            {formatDaysAgo(days, t.day)}
          </span>
        )}

        {/* Handle sits on the frame rather than in the body: it belongs to the
            footage, and moving it up buys the caption a full two lines below
            without making the card taller. */}
        <span
          className="absolute inset-x-3 bottom-3 truncate text-[0.8rem] font-semibold text-white drop-shadow"
          dir="ltr"
        >
          @{reel.igUsername}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3.5">
        {/* `dir="auto"` rather than a fixed direction: captions are whatever the
            creator wrote, so the direction has to come from the content, not from
            the page locale. Inheriting the page's RTL for an English caption put
            the clamp ellipsis on the wrong end and reordered the trailing
            fragment ("...xed my lower back in a"). auto resolves per string, so
            English reads LTR and Arabic reads RTL inside the same grid. */}
        {reel.caption && (
          <p dir="auto" className="line-clamp-2 text-start text-[0.8rem] leading-snug text-foreground/85">
            {reel.caption}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-2.5 text-[0.72rem] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Eye size={12} />
            <span className="tabular" dir="ltr">{compact.format(reel.viewCount)}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Heart size={12} />
            <span className="tabular" dir="ltr">{compact.format(reel.likeCount)}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle size={12} />
            <span className="tabular" dir="ltr">{compact.format(reel.commentCount)}</span>
          </span>
        </div>

        {href && (
          <span className="inline-flex items-center gap-1 text-[0.72rem] font-medium text-lp-yellow-ink transition group-hover:gap-1.5">
            {t.viewOn}
            <ArrowUpRight size={12} className="rtl:-scale-x-100" />
          </span>
        )}
      </div>

      {/* Stretched link: the whole card is the hit target, not just the tiny
          "View on Instagram" line, which was a ~90px tap target on a card the
          user is obviously trying to tap. Rendered last and absolutely
          positioned so it covers the card without nesting interactive content
          inside an anchor. */}
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="absolute inset-0 z-10"
        >
          <span className="sr-only">
            {t.viewOn} — @{reel.igUsername}
          </span>
        </a>
      )}
    </article>
  );
}
