"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * A footer link into the dashboard-zone legal pages (/privacy, /terms,
 * /cookies). Those pages live in the separate dashboard app (proxied in via the
 * rewrites in next.config.ts), and their own "Back" control defaults to
 * /dashboard — which strands a marketing-site visitor in the app they never
 * asked to enter. We hand the legal page a `redirect` query param naming where
 * the visitor actually came from, so it can send them back to the landing page
 * (and the exact section they were reading) instead.
 *
 * The param is filled in on the client after hydration: the server-rendered
 * href is the bare path, so the link still works with JS disabled — it just
 * falls back to the dashboard's default Back behavior in that case.
 */
export function LegalLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  // Point the anchor at `${href}?redirect=<where we are now>`, written straight
  // to the DOM node (not React state) so it never triggers a re-render — the
  // anchor is otherwise fully static. Path + query + hash so a return trip lands
  // the visitor back on the same section (#pricing, #faq, …) they were reading.
  const syncHref = useCallback(() => {
    const a = ref.current;
    if (!a) return;
    const back = window.location.pathname + window.location.search + window.location.hash;
    const sep = href.includes("?") ? "&" : "?";
    a.setAttribute("href", `${href}${sep}redirect=${encodeURIComponent(back)}`);
  }, [href]);

  // Resolve once on mount for correctness without JS interaction, then refresh
  // the instant before the visitor acts — a same-document hash change (clicking
  // a nav anchor) doesn't re-run the mount effect, so pointer/focus is what
  // keeps the captured section current at click time.
  useEffect(syncHref, [syncHref]);

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      onPointerDown={syncHref}
      onFocus={syncHref}
    >
      {children}
    </a>
  );
}
