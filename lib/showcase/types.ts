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
  /**
   * Direct URL to the reel's video file (mp4), self-hosted the same way
   * thumbnails are. When present the card PLAYS it — muted, looping, inline —
   * instead of showing a still.
   *
   * The dashboard does not emit this yet: `ig_reel_snapshots` carries
   * `thumbnail_url` and nothing else, and the `ig-media` bucket holds images
   * only. Until the enrichment job mirrors the video alongside the thumbnail
   * this is null for every reel and the wall renders stills — which is exactly
   * what it does today. Nothing here breaks when it stays null; the moment the
   * endpoint starts emitting `videoUrl`, the wall starts playing.
   *
   * Must be a self-hosted URL, not a raw Instagram CDN one: those are signed
   * and expire in about a week, so a cached marketing page would rot into
   * dead <video> elements the same way it would rot into broken images.
   */
  videoUrl: string | null;
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
