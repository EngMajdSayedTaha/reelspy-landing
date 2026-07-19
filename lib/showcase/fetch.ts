import { SHOWCASE_FIXTURES } from "./fixtures";
import type { ShowcaseData, ShowcaseNiche, ShowcaseReel } from "./types";

// Niches to show as tabs, in order. These must exist in SHOWCASE_NICHES on the
// dashboard's public endpoint, which validates against its own allowlist.
const NICHES = ["fitness", "food", "travel"] as const;

// Below this, a niche's grid looks broken rather than sparse, so the whole
// section falls back to fixtures instead of showing a half-empty tab.
const MIN_REELS_PER_NICHE = 4;

// Half an hour, matching the endpoint's own s-maxage. The underlying snapshot
// cache only changes when the refresh crons run, so anything shorter just adds
// origin traffic for identical bytes.
const REVALIDATE_SECONDS = 1800;

// This fetch happens during a page render. Without a bound, a hanging upstream
// would stall the marketing page itself — so give up quickly and show the
// fixtures instead. The endpoint is CDN-cached, so a healthy response is
// nowhere near this.
const FETCH_TIMEOUT_MS = 4000;

// Hand-rolled rather than a schema library: this is the only validated
// boundary in the project and it isn't worth a dependency. It exists because
// the payload crosses a deployment boundary — the dashboard can be redeployed
// independently, and a shape change there must degrade to fixtures here rather
// than throw during a page render.
function toReel(value: unknown): ShowcaseReel | null {
  if (!value || typeof value !== "object") return null;
  const r = value as Record<string, unknown>;
  if (typeof r.igUsername !== "string" || !r.igUsername) return null;

  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
  const str = (v: unknown) => (typeof v === "string" && v ? v : null);

  return {
    igUsername: r.igUsername,
    permalink: str(r.permalink),
    caption: str(r.caption),
    thumbnailUrl: str(r.thumbnailUrl),
    viewCount: num(r.viewCount),
    likeCount: num(r.likeCount),
    commentCount: num(r.commentCount),
    postedAt: str(r.postedAt),
    outperformRatio: num(r.outperformRatio),
    followers: typeof r.followers === "number" ? r.followers : null,
  };
}

async function fetchNiche(base: string, niche: string): Promise<ShowcaseNiche | null> {
  try {
    const res = await fetch(`${base}/api/public/trending?niche=${encodeURIComponent(niche)}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    const raw = (json as { reels?: unknown })?.reels;
    if (!Array.isArray(raw)) return null;

    const reels = raw.map(toReel).filter((r): r is ShowcaseReel => r !== null);
    return reels.length >= MIN_REELS_PER_NICHE ? { niche, reels } : null;
  } catch {
    // Network error, DNS failure, malformed JSON — all the same to us.
    return null;
  }
}

/**
 * Loads trending reels for the showcase section, falling back to curated
 * sample data whenever the live data isn't usable.
 *
 * Called from a server component, so the dashboard's public endpoint is hit
 * server-to-server and cached by Next; visitors never wait on it.
 */
export async function getShowcase(): Promise<ShowcaseData> {
  const base = process.env.DASHBOARD_URL?.replace(/\/$/, "");
  if (!base) return SHOWCASE_FIXTURES;

  const results = await Promise.all(NICHES.map((niche) => fetchNiche(base, niche)));
  const niches = results.filter((n): n is ShowcaseNiche => n !== null);

  // All or nothing. A tab strip where some niches are live and others are
  // invented would make the "sample data" label meaningless.
  return niches.length === NICHES.length ? { niches, isDemo: false } : SHOWCASE_FIXTURES;
}
