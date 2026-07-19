import { ArrowUpRight, Eye, Heart, MessageCircle, Play, TrendingUp } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/en";
import type { ShowcaseReel } from "@/lib/showcase/types";

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

  return (
    <article className="lp-lift group flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
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
          // links that rot, so this is the normal case, not an error state.
          <div
            className="grid h-full w-full place-items-center"
            style={{ background: "linear-gradient(150deg,#3f3f46,#27272d)" }}
            aria-hidden
          >
            <Play size={28} className="text-white/40" fill="currentColor" />
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
            <span className="shrink-0 text-[0.7rem] text-muted-foreground">{t.daysAgo(days)}</span>
          )}
        </div>

        {reel.caption && (
          <p className="line-clamp-2 text-[0.78rem] leading-snug text-muted-foreground">
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

        {reel.permalink && (
          <a
            href={reel.permalink}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 text-[0.72rem] font-medium text-lp-yellow-ink transition hover:underline"
          >
            {t.viewOn}
            <ArrowUpRight size={12} className="rtl:-scale-x-100" />
          </a>
        )}
      </div>
    </article>
  );
}
