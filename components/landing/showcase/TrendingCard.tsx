import { ArrowUpRight, Eye, Heart, MessageCircle, Play, TrendingUp } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/en";
import type { ShowcaseReel } from "@/lib/showcase/types";
import { formatDaysAgo } from "@/lib/showcase/format";

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
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card focus-within:ring-2 focus-within:ring-lp-yellow-ink ${
        href ? "lp-lift" : ""
      }`}
    >
      <div className="relative aspect-[9/16] overflow-hidden bg-secondary">
        {reel.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URLs, not a configured next/image loader.
          <img
            src={reel.thumbnailUrl}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          // Placeholder for reels whose thumbnail we don't self-host. The
          // endpoint nulls out expiring Instagram CDN URLs rather than ship
          // links that rot, so this is the normal case, not an error state —
          // which is exactly why it has to look like a deliberate reel cover,
          // not an empty box that reads as "the image failed to load". A warm
          // graphite wash, the blueprint grid texture and a framed play glyph
          // give it the same visual weight as a real thumbnail.
          <div
            className="relative grid h-full w-full place-items-center overflow-hidden"
            style={{ background: "linear-gradient(155deg,#43434c,#26262d 70%)" }}
            aria-hidden
          >
            <div className="lp-grid-bg absolute inset-0 opacity-40" />
            <div
              className="absolute -inset-x-4 top-0 h-2/3"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(249,228,0,0.14), transparent 65%)" }}
            />
            <span className="relative grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm">
              <Play size={18} className="translate-x-px text-white/85" fill="currentColor" />
            </span>
          </div>
        )}

        {isOutperforming && (
          <span className="lp-chip lp-chip-accent absolute start-2 top-2 backdrop-blur">
            <TrendingUp size={11} />
            <span className="tabular" dir="ltr">
              {reel.outperformRatio.toFixed(1)}×
            </span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-sm font-semibold text-foreground" dir="ltr">
            @{reel.igUsername}
          </span>
          {days !== null && (
            <span className="shrink-0 text-[0.7rem] text-muted-foreground">
              {formatDaysAgo(days, t.day)}
            </span>
          )}
        </div>

        {/* `dir="auto"` rather than a fixed direction: captions are whatever the
            creator wrote, so the direction has to come from the content, not from
            the page locale. Inheriting the page's RTL for an English caption put
            the clamp ellipsis on the wrong end and reordered the trailing
            fragment ("...xed my lower back in a"). auto resolves per string, so
            English reads LTR and Arabic reads RTL inside the same grid. */}
        {reel.caption && (
          <p dir="auto" className="line-clamp-2 text-start text-[0.78rem] leading-snug text-muted-foreground">
            {reel.caption}
          </p>
        )}

        <div className="mt-auto flex items-center gap-3 pt-1 text-[0.72rem] text-muted-foreground">
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
          <span className="inline-flex items-center gap-1 text-[0.72rem] font-medium text-lp-yellow-ink transition group-hover:underline">
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
