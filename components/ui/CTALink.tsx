"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
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
    "relative inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus-visible:outline-2 focus-visible:outline-offset-2";
  const sizes = {
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-[0.95rem]",
  };
  const variants = {
    primary:
      "lp-cta-bg shadow-[0_8px_30px_rgba(249,228,0,0.28)] hover:shadow-[0_12px_44px_rgba(249,228,0,0.42)] hover:brightness-[0.96] hover:scale-[1.02] before:absolute before:inset-0 before:rounded-full before:bg-[linear-gradient(180deg,rgba(255,255,255,0.3),transparent_45%)] before:pointer-events-none",
    ghost:
      "border border-border-strong text-foreground hover:bg-accent hover:border-foreground/25 backdrop-blur-sm",
  };

  // A plain <a>, not next/link, on purpose. Almost every CTA points at
  // /signup or /login, which the multi-zone rewrites proxy to the dashboard
  // deployment. next/link would try a client-side RSC navigation into an app
  // that isn't this one and fail on the prefetch. Hash anchors (#how) still
  // scroll smoothly via html { scroll-behavior }.
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
