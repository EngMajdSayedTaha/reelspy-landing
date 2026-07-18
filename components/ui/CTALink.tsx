"use client";

import Link from "next/link";
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
 * Primary = brand-gradient pill with a magnetic pull (desktop pointer only) and
 * a glow bloom on hover. Ghost = hairline outline that fills faintly on hover.
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
      "lp-gradient-bg text-white shadow-[0_8px_30px_rgba(78,125,255,0.35)] hover:shadow-[0_12px_44px_rgba(73,228,255,0.5)] hover:scale-[1.02] before:absolute before:inset-0 before:rounded-full before:bg-[linear-gradient(180deg,rgba(255,255,255,0.28),transparent_45%)] before:pointer-events-none",
    ghost:
      "border border-[var(--lp-hairline-strong)] text-lp-ink/90 hover:bg-white/[0.06] hover:border-white/25 backdrop-blur-sm",
  };

  return (
    <Link
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      {children}
    </Link>
  );
}
