import type { ShowcaseReel, ShowcaseSort } from "./types";

// Mirrors the product's own scoring (lib/trends/shared.ts in the dashboard):
// comments are the scarcest signal and views the most abundant, so they're
// weighted accordingly. Kept in sync deliberately — the marketing page should
// rank reels the same way the app does, or the demo misrepresents the product.
export function viralScore(reel: ShowcaseReel): number {
  return reel.likeCount * 1 + reel.commentCount * 3 + reel.viewCount * 0.01;
}

const COMPARATORS: Record<ShowcaseSort, (a: ShowcaseReel, b: ShowcaseReel) => number> = {
  // Not raw score: outperformRatio is score relative to the account's own
  // median, which is the whole pitch — a small account's genuine outlier
  // should rank above a big account's ordinary day.
  score: (a, b) => b.outperformRatio - a.outperformRatio || viralScore(b) - viralScore(a),
  views: (a, b) => b.viewCount - a.viewCount,
  likes: (a, b) => b.likeCount - a.likeCount,
  recent: (a, b) => {
    const ta = a.postedAt ? Date.parse(a.postedAt) : 0;
    const tb = b.postedAt ? Date.parse(b.postedAt) : 0;
    return (Number.isNaN(tb) ? 0 : tb) - (Number.isNaN(ta) ? 0 : ta);
  },
};

/** Returns a new sorted array; never mutates the input. */
export function sortReels(reels: ShowcaseReel[], sort: ShowcaseSort): ShowcaseReel[] {
  return [...reels].sort(COMPARATORS[sort]);
}

/** Stable identity for FLIP animations and React keys. */
export function reelKey(reel: ShowcaseReel): string {
  return `${reel.igUsername}:${reel.permalink ?? reel.postedAt ?? reel.viewCount}`;
}
