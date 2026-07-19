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
