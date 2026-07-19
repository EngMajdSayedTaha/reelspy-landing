// Shape of the public trending payload served by the dashboard zone
// (app/api/public/trending in the reelspy project). Declared independently
// here rather than imported: the two apps are separate deployments with
// separate builds, so this is a wire contract, not a shared type. The runtime
// guard in ./fetch is what actually enforces it.

export type ShowcaseReel = {
  igUsername: string;
  permalink: string | null;
  caption: string | null;
  thumbnailUrl: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  postedAt: string | null;
  outperformRatio: number;
  followers: number | null;
};

export type ShowcaseNiche = {
  /** Slug as the API knows it — always English, never displayed raw. */
  niche: string;
  reels: ShowcaseReel[];
};

export type ShowcaseData = {
  niches: ShowcaseNiche[];
  /**
   * True when the section is rendering curated sample data instead of live
   * reels. Surfaced in the UI — showing fabricated numbers as if they were
   * live would be a lie, and a quiet "sample data" note costs nothing.
   */
  isDemo: boolean;
};

export const SHOWCASE_SORTS = ["score", "views", "likes", "recent"] as const;
export type ShowcaseSort = (typeof SHOWCASE_SORTS)[number];
