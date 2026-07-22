// Multi-zone link helper.
//
// reelspy.dev is served by two separate Next apps: this one (marketing) and
// the dashboard, which is proxied in via the rewrites in next.config.ts. A
// next/link into the dashboard zone would attempt a client-side RSC navigation
// against an app that doesn't share this one's build, and the prefetch 404s —
// so links that cross the boundary must be plain anchors and do a real
// document navigation.
//
// Keep this list in sync with DASHBOARD_ZONE_PATHS in next.config.ts.
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
