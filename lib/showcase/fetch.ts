import { SHOWCASE_FIXTURES } from "./fixtures";
import type { ShowcaseData, ShowcaseNiche, ShowcaseReel } from "./types";

// Niches to show as tabs, in order. These must exist in SHOWCASE_NICHES on the
// dashboard's public endpoint, which validates against its own allowlist.
const NICHES = ["real estate", "food", "travel"] as const;

// Below this, a niche's grid looks broken rather than sparse, so that
// individual tab falls back to its own fixture instead of showing a
// half-empty grid.
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
// Every URL in this payload ends up in an `href` or a `src`. The payload
// crosses a deployment boundary, so "the dashboard would never send that" is a
// deployment assumption rather than a guarantee — and a `javascript:` value
// reaching `permalink` becomes script execution the moment a visitor clicks a
// card. Restricting the scheme costs nothing and closes that off. Relative
// URLs are rejected too (`new URL` throws without a base); the endpoint serves
// absolute Supabase Storage URLs, so there is nothing legitimate to lose.
function safeUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:" ? value : null;
  } catch {
    return null;
  }
}

function toReel(value: unknown): ShowcaseReel | null {
  if (!value || typeof value !== "object") return null;
  const r = value as Record<string, unknown>;
  if (typeof r.igUsername !== "string" || !r.igUsername) return null;

  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
  const str = (v: unknown) => (typeof v === "string" && v ? v : null);

  return {
    igUsername: r.igUsername,
    permalink: safeUrl(r.permalink),
    caption: str(r.caption),
    thumbnailUrl: safeUrl(r.thumbnailUrl),
    // Absent today — see ShowcaseReel.videoUrl. Reading it now means shipping
    // video is a change to the endpoint alone, not to this app as well.
    videoUrl: safeUrl(r.videoUrl),
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

  // Per-niche fallback rather than all-or-nothing: a niche can run thin on its
  // own (e.g. its seed accounts haven't posted inside the trending window)
  // without real data existing for the other tabs too, and that's expected to
  // happen on a rotating basis given the shared daily enrichment budget. A tab
  // that falls back draws its own curated fixture instead of taking the whole
  // section down with it; any fallback flips the disclosure note on so the
  // page never presents fabricated numbers as live.
  let usedFixture = false;
  const niches: ShowcaseNiche[] = NICHES.map((niche, i) => {
    const live = results[i];
    if (live) return live;
    usedFixture = true;
    return (
      SHOWCASE_FIXTURES.niches.find((n) => n.niche === niche) ?? { niche, reels: [] }
    );
  });

  return { niches, isDemo: usedFixture };
}
