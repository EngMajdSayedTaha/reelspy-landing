"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { useWaitlist } from "@/components/landing/waitlist/WaitlistProvider";
import { cn } from "@/lib/utils";

type CTAProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
  magnetic?: boolean;
  className?: string;
  onClick?: () => void;
};

/**
 * Primary = solid brand-yellow pill with a magnetic pull (desktop pointer only)
 * and a warm glow on hover. Ghost = hairline outline that fills faintly on
 * hover. Both are theme-aware; the ghost variant used to be white-on-dark only,
 * which made it invisible once sections stopped being permanently dark.
 */
export function CTALink({
  href,
  children,
  variant = "primary",
  size = "md",
  magnetic = true,
  className,
  onClick,
}: CTAProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const waitlist = useWaitlist();

  // Closed beta: every CTA that would send someone to signup opens the join
  // dialog instead, with the waiting-list label. Doing the swap HERE rather
  // than at each call site means a CTA added to a new section next month is
  // covered automatically. Outside a WaitlistProvider (the section tests, the
  // changelog page) `enabled` is false and nothing below changes.
  const intercept = waitlist.enabled && href === "/signup" && waitlist.copy !== null;

  const handleMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!magnetic) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  const base =
    "relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap tracking-[-0.01em] transition-[transform,box-shadow,background-color,border-color] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus-visible:outline-2 focus-visible:outline-offset-2";
  const sizes = {
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-[0.95rem]",
  };
  // The primary button's glow used to be a 44px-wide yellow halo. On a page
  // that no longer has any other yellow light on it, that halo was the loudest
  // element on screen and it bled onto whatever sat behind the button. It is
  // now a real elevation shadow — the button reads as raised rather than lit —
  // with the color kept where it belongs: in the fill.
  const variants = {
    primary:
      "lp-cta-bg shadow-[var(--lp-shadow-2)] hover:shadow-[var(--lp-shadow-3)] hover:brightness-[0.97] hover:scale-[1.02] active:scale-[0.99] before:absolute before:inset-0 before:rounded-full before:bg-[linear-gradient(180deg,rgba(255,255,255,0.36),transparent_46%)] before:pointer-events-none",
    ghost:
      "border border-border bg-card/60 text-foreground shadow-[var(--lp-sheen)] hover:bg-accent hover:border-border-strong backdrop-blur-sm",
  };

  // A plain <a>, not next/link, on purpose. Almost every CTA points at
  // /signup or /login, which the multi-zone rewrites proxy to the dashboard
  // deployment. next/link would try a client-side RSC navigation into an app
  // that isn't this one and fail on the prefetch. Hash anchors (#how) still
  // scroll smoothly via html { scroll-behavior }.
  if (intercept) {
    // A <button>, not an <a> with a fake href: it opens a dialog, it doesn't
    // navigate, and screen readers and middle-click should both be told the
    // truth. The label replaces whatever children the call site passed —
    // "Start free — no card needed" is a promise we can't keep right now — but
    // any icon children (the arrow) are dropped with it, which is fine: the
    // button no longer means "go somewhere".
    return (
      <button
        type="button"
        onClick={() => {
          onClick?.();
          waitlist.open();
        }}
        className={cn(base, sizes[size], variants[variant], className)}
      >
        {waitlist.copy!.cta}
      </button>
    );
  }

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      {children}
    </a>
  );
}
