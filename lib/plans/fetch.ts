import type { Plan, PlanCopy } from "./types";

// The dashboard zone's published plan catalog, for the pricing section.
//
// Deliberately NOT falling back to fixtures the way the showcase does. An
// empty array here means Pricing.tsx falls back to its own static dict copy
// (see lib/i18n/en.ts pricing.plans) — a stale price shown to a visitor is a
// real-money mistake, so any doubt about freshness must resolve to the copy
// that ships with this deploy, not to invented numbers.
const DASHBOARD_URL = process.env.DASHBOARD_URL?.replace(/\/$/, "");

// Re-checked at most once a minute, matching the route's own s-maxage — a
// minute of staleness on a price costs nothing next to a DB round trip on
// every pageview of the marketing site.
const REVALIDATE_SECONDS = 60;
const FETCH_TIMEOUT_MS = 3000;

function toCopy(value: unknown): PlanCopy | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (typeof v.name !== "string" || !v.name.trim()) return null;
  return {
    name: v.name,
    tagline: typeof v.tagline === "string" ? v.tagline : "",
    highlights: Array.isArray(v.highlights) ? v.highlights.filter((h): h is string => typeof h === "string") : [],
    badge: typeof v.badge === "string" && v.badge.trim() ? v.badge : null,
  };
}

function toPlan(value: unknown): Plan | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (typeof v.slug !== "string" || !v.slug) return null;
  const kind = v.kind === "free" || v.kind === "fixed" ? v.kind : null;
  if (!kind) return null;

  const rawCopy = (v.copy ?? {}) as Record<string, unknown>;
  const en = toCopy(rawCopy.en);
  if (!en) return null;
  // Arabic copy missing is recoverable — fall back to English rather than
  // dropping the whole plan from the grid.
  const ar = toCopy(rawCopy.ar) ?? en;

  const rawPrice = v.price as Record<string, unknown> | null | undefined;
  const price =
    rawPrice && typeof rawPrice.unitAmount === "number" && typeof rawPrice.currency === "string"
      ? {
          currency: rawPrice.currency,
          unitAmount: rawPrice.unitAmount,
          interval: rawPrice.interval === "year" ? ("year" as const) : ("month" as const),
        }
      : null;

  return {
    slug: v.slug,
    kind,
    sortOrder: typeof v.sortOrder === "number" ? v.sortOrder : 100,
    copy: { en, ar },
    price,
  };
}

export async function getPlans(): Promise<Plan[]> {
  if (!DASHBOARD_URL) return [];

  try {
    const res = await fetch(`${DASHBOARD_URL}/api/public/plans`, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return [];

    const body: unknown = await res.json();
    const raw = (body as { plans?: unknown })?.plans;
    if (!Array.isArray(raw)) return [];

    return raw.map(toPlan).filter((p): p is Plan => p !== null).sort((a, b) => a.sortOrder - b.sortOrder);
  } catch {
    return [];
  }
}
