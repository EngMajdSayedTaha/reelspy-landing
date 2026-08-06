// Is the product behind a waiting list right now?
//
// The switch lives in the dashboard app's database (one app_settings row,
// flipped from /admin/waitlist), because that's where the gate is actually
// enforced. This side just asks — server-side, at render — so the marketing
// page can say "Join the waiting list" instead of "Start free" and show the
// social-proof count.
//
// Fails to OFF on absolutely everything: no DASHBOARD_URL, a timeout, a 500, a
// body that isn't the shape we expect. A marketing page that keeps its normal
// signup CTAs during a blip is a non-event; one that 500s because a fetch
// failed is an outage. The dashboard's /signup renders the join form on its own
// when the gate is closed, so an out-of-date CTA here still lands the visitor in
// the right place.

const DASHBOARD_URL = process.env.DASHBOARD_URL?.replace(/\/$/, "");

export type WaitlistState = { enabled: boolean; total: number };

export const WAITLIST_OFF: WaitlistState = { enabled: false, total: 0 };

export async function getWaitlistState(): Promise<WaitlistState> {
  if (!DASHBOARD_URL) return WAITLIST_OFF;

  try {
    const res = await fetch(`${DASHBOARD_URL}/api/waitlist`, {
      // Re-checked at most once a minute. The endpoint sets the same s-maxage,
      // and a minute of staleness on a CTA label costs nothing — while a DB
      // round trip on every pageview of the marketing site is real money.
      next: { revalidate: 60 },
      headers: { accept: "application/json" },
      // Don't let a wedged upstream hold the whole page render hostage.
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return WAITLIST_OFF;

    const body: unknown = await res.json();
    const v = (body ?? {}) as Record<string, unknown>;
    return {
      enabled: v.enabled === true,
      total: typeof v.total === "number" && Number.isFinite(v.total) ? v.total : 0,
    };
  } catch {
    return WAITLIST_OFF;
  }
}
