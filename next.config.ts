import path from "node:path";
import type { NextConfig } from "next";

// Baseline security headers for every response — mirrors the main ReelSpy app.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

// Two-origin split: this project owns reelspy.dev (marketing), and the product
// lives on its own origin, https://app.reelspy.dev.
//
// This used to be a single origin, with every product route proxied through
// here, specifically so the dashboard's Supabase cookies and OAuth redirect URIs
// wouldn't have to move. That saved a one-time config change and cost us the
// architecture: auth cookies were readable by anything running on the marketing
// origin, and the proxy sat in the middle of the login path — where a relative
// `Location` header once 500'd the entire auth surface on Next 16.
//
// So the authenticated surface is REDIRECTED to the app origin, while the
// marketing/SEO surface stays PROXIED here. See docs/domain-migration.md in the
// dashboard repo.
//
// Set DASHBOARD_URL to the dashboard's own deployment URL (no trailing slash).
// When it's unset — local marketing-only work — the rewrites are simply
// skipped and /privacy etc. 404, which is the honest failure mode.
const DASHBOARD_URL = process.env.DASHBOARD_URL?.replace(/\/$/, "");

// Where the product now lives. Overridable so a preview deployment can point at
// a matching preview of the dashboard instead of production.
const APP_ORIGIN = (process.env.APP_ORIGIN || "https://app.reelspy.dev").replace(/\/$/, "");

// Still served under reelspy.dev by proxying to the dashboard deployment.
//
// - The legal pages are marketing surface and are INDEXED on the apex; the
//   dashboard's versions are the real, fully-translated policies, so we keep
//   one copy and keep its ranking here rather than bouncing crawlers.
// - `/api` stays proxied so any integration still pointed at reelspy.dev keeps
//   working. Redirecting it would be the dangerous option: webhook senders
//   (Meta) and other API clients routinely do not follow redirects.
// - `/dashboard-static` carries the dashboard's own /_next assets (see its
//   assetPrefix); without it the proxied legal-page HTML would load its JS and
//   CSS from this zone and 404.
export const DASHBOARD_PROXY_PATHS = [
  "/api/:path*",
  "/privacy",
  "/terms",
  "/cookies",
  "/dashboard-static/:path*",
  "/brand/:path*",
];

// Moved to app.reelspy.dev. Redirected rather than proxied so the browser ends
// up on the real origin — which is what makes the cookie isolation actually
// hold. Query strings are preserved by Next, so `?next=`, `?error=` and OAuth
// `?code=` survive the hop.
export const DASHBOARD_REDIRECT_PATHS = [
  "/dashboard",
  "/dashboard/:path*",
  "/admin",
  "/admin/:path*",
  "/auth/:path*",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (a parent lockfile exists one level up).
  turbopack: { root: path.resolve() },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async rewrites() {
    if (!DASHBOARD_URL) return [];
    return DASHBOARD_PROXY_PATHS.map((source) => ({
      source,
      destination: `${DASHBOARD_URL}${source}`,
    }));
  },
  async redirects() {
    // Not `permanent`: a 308 is cached hard by browsers, and while the product
    // is in beta we want to be able to move this back without users carrying a
    // stale redirect for months. These paths carry no SEO weight, so the only
    // thing a permanent redirect would buy us is the thing that makes it risky.
    return DASHBOARD_REDIRECT_PATHS.map((source) => ({
      source,
      destination: `${APP_ORIGIN}${source}`,
      permanent: false,
    }));
  },
};

export default nextConfig;
