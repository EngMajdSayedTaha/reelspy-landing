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

// Multi-zone: this project owns reelspy.dev and serves the marketing pages;
// every product route is proxied through to the dashboard deployment, so both
// apps live on ONE origin.
//
// Keeping a single origin is the whole point — the dashboard's Supabase auth
// cookies, Google OAuth redirect URIs and Stripe return URLs are all bound to
// https://reelspy.dev. A subdomain split would have meant reconfiguring all
// three; this way none of them change.
//
// Set DASHBOARD_URL to the dashboard's own deployment URL (no trailing slash).
// When it's unset — local marketing-only work — the rewrites are simply
// skipped and /login etc. 404, which is the honest failure mode.
const DASHBOARD_URL = process.env.DASHBOARD_URL?.replace(/\/$/, "");

// Paths owned by the dashboard zone. Anything not listed here is served by
// this project. `/dashboard-static` carries the dashboard's own /_next assets
// (see its assetPrefix); without it the proxied HTML would load its JS and CSS
// from this zone and 404.
export const DASHBOARD_ZONE_PATHS = [
  "/dashboard",
  "/dashboard/:path*",
  "/admin",
  "/admin/:path*",
  "/api/:path*",
  "/auth/:path*",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  // The legal pages live in the dashboard app: its versions are the real
  // policies and are fully translated, where this project only ever had
  // English summaries that deferred to them. One copy, and it's the good one.
  "/privacy",
  "/terms",
  "/cookies",
  "/dashboard-static/:path*",
  "/brand/:path*",
];

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (a parent lockfile exists one level up).
  turbopack: { root: path.resolve() },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async rewrites() {
    if (!DASHBOARD_URL) return [];
    return DASHBOARD_ZONE_PATHS.map((source) => ({
      source,
      destination: `${DASHBOARD_URL}${source}`,
    }));
  },
};

export default nextConfig;
