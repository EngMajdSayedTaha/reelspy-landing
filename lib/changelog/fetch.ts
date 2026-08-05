import { CHANGE_KINDS, type Change, type ChangelogData, type Localized, type Release } from "./types";

// The changelog only changes when the dashboard zone deploys, so an hour at the
// edge matches its own s-maxage and keeps this page effectively static.
const REVALIDATE_SECONDS = 3600;

// Bounded like the showcase fetch: this runs during a page render, so a hanging
// upstream must not stall the page itself.
const FETCH_TIMEOUT_MS = 4000;

// Deliberately NOT falling back to fixtures the way the showcase does. Stale
// sample reels are a cosmetic compromise; a stale changelog is a false claim
// about what the product does. If we can't read the real thing, we say so and
// point at the app instead.

function toLocalized(value: unknown): Localized | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (typeof v.en !== "string" || !v.en.trim()) return null;
  // Arabic may legitimately be missing on a future entry; fall back to English
  // rather than dropping the whole release.
  const ar = typeof v.ar === "string" && v.ar.trim() ? v.ar : v.en;
  return { en: v.en, ar };
}

function toChange(value: unknown): Change | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const kind = (CHANGE_KINDS as readonly string[]).includes(v.kind as string)
    ? (v.kind as Change["kind"])
    : null;
  const text = toLocalized(v.text);
  if (!kind || !text) return null;
  return { kind, text };
}

function toRelease(value: unknown): Release | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (typeof v.version !== "string" || !/^\d+\.\d+\.\d+$/.test(v.version)) return null;
  if (typeof v.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v.date)) return null;

  const title = toLocalized(v.title);
  const summary = toLocalized(v.summary);
  if (!title || !summary) return null;

  const changes = Array.isArray(v.changes)
    ? v.changes.map(toChange).filter((c): c is Change => c !== null)
    : [];
  if (changes.length === 0) return null;

  return { version: v.version, date: v.date, title, summary, changes };
}

/**
 * Loads the product changelog from the dashboard zone.
 *
 * Called from a server component, so the endpoint is hit server-to-server and
 * cached by Next; visitors never wait on it. Any failure — network, timeout,
 * a shape change after an independent redeploy of the dashboard — resolves to
 * an empty list, which the page renders as an honest "read it in the app"
 * message rather than as invented history.
 */
export async function getChangelog(): Promise<ChangelogData> {
  const base = process.env.DASHBOARD_URL?.replace(/\/$/, "");
  if (!base) return { releases: [], version: null };

  try {
    const res = await fetch(`${base}/api/public/changelog`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return { releases: [], version: null };

    const json: unknown = await res.json();
    const raw = (json as { releases?: unknown })?.releases;
    if (!Array.isArray(raw)) return { releases: [], version: null };

    const releases = raw.map(toRelease).filter((r): r is Release => r !== null);
    if (releases.length === 0) return { releases: [], version: null };

    const version = (json as { version?: unknown })?.version;
    return {
      releases,
      // Trust the newest entry over the reported version if they disagree —
      // what's rendered on the page is what the number should describe.
      version: typeof version === "string" ? version : releases[0].version,
    };
  } catch {
    return { releases: [], version: null };
  }
}
