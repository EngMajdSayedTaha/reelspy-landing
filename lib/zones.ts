// Cross-zone link helper.
//
// reelspy.dev (this app) hands product paths to the dashboard two different
// ways: the legal/brand/api surface is PROXIED in via rewrites, and the
// authenticated surface now REDIRECTS to https://app.reelspy.dev. Either way a
// next/link is wrong — it would attempt a client-side RSC navigation against a
// build this app doesn't share (prefetch 404s), or try to client-navigate to
// what is actually a cross-origin redirect. Both cases need a plain anchor and a
// real document navigation.
//
// Keep this list in sync with DASHBOARD_PROXY_PATHS + DASHBOARD_REDIRECT_PATHS
// in next.config.ts — test/zones.test.ts enforces that.
const DASHBOARD_ZONE_PREFIXES = [
  "/dashboard",
  "/admin",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/auth",
  "/api",
  "/privacy",
  "/terms",
  "/cookies",
];

export function isDashboardZone(href: string): boolean {
  if (!href.startsWith("/")) return false;
  return DASHBOARD_ZONE_PREFIXES.some(
    (prefix) => href === prefix || href.startsWith(`${prefix}/`) || href.startsWith(`${prefix}?`)
  );
}

// The legal pages are a subset of the dashboard zone (they're served by that
// app) that a marketing visitor reaches from the footer. They get a `redirect`
// param so the dashboard's Back control can return the visitor to the landing
// page rather than dropping them at /dashboard.
const LEGAL_ZONE_PREFIXES = ["/privacy", "/terms", "/cookies"];

export function isLegalZone(href: string): boolean {
  if (!href.startsWith("/")) return false;
  return LEGAL_ZONE_PREFIXES.some(
    (prefix) => href === prefix || href.startsWith(`${prefix}/`) || href.startsWith(`${prefix}?`)
  );
}
