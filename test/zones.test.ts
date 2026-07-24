import { describe, it, expect } from "vitest";
import { isDashboardZone } from "@/lib/zones";
import { DASHBOARD_PROXY_PATHS, DASHBOARD_REDIRECT_PATHS } from "@/next.config";

// reelspy.dev hands product paths off to another app — by proxy for the
// marketing/legal surface, by redirect for the authenticated surface. If these
// lists drift from the link helper, links break in a way that only shows up in
// production: a path this zone doesn't own gets rendered as a next/link, and the
// client-side navigation 404s against the wrong app (or worse, silently fails to
// leave the origin for a path that is now a cross-origin redirect).

describe("isDashboardZone", () => {
  it("recognizes the product routes", () => {
    for (const href of [
      "/login",
      "/signup",
      "/forgot-password",
      "/reset-password",
      "/dashboard",
      "/dashboard/feed",
      "/admin/users",
      "/auth/callback",
      "/api/public/trending",
      "/privacy",
      "/terms",
      "/cookies",
    ]) {
      expect(isDashboardZone(href), href).toBe(true);
    }
  });

  it("leaves this zone's own paths alone", () => {
    for (const href of ["/", "#pricing", "#how", "https://instagram.com/x"]) {
      expect(isDashboardZone(href), href).toBe(false);
    }
  });

  // "/loginhelp" must not match "/login".
  it("matches on path segments, not string prefixes", () => {
    expect(isDashboardZone("/loginhelp")).toBe(false);
    expect(isDashboardZone("/dashboards")).toBe(false);
    expect(isDashboardZone("/login?next=/dashboard")).toBe(true);
  });
});

describe("zone config parity", () => {
  it("every handed-off path is also treated as cross-zone by the link helper", () => {
    const missing = [...DASHBOARD_PROXY_PATHS, ...DASHBOARD_REDIRECT_PATHS]
      // Asset/static prefixes are never rendered as links.
      .filter((p) => !p.startsWith("/dashboard-static") && !p.startsWith("/brand"))
      .map((p) => p.replace("/:path*", ""))
      .filter((p) => !isDashboardZone(p));
    expect(missing).toEqual([]);
  });
});
