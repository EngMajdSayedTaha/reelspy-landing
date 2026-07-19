import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Browser-chrome mock frame — reads instantly as "the product".
 *
 *  DELIBERATELY always dark, regardless of page theme. This is the one
 *  exception to the theme-aware rule: it depicts a screenshot of the app, and
 *  a screenshot that inverts along with the marketing page around it stops
 *  reading as a screenshot. It uses the fixed --lp-deep/--lp-mock-* tokens
 *  rather than the semantic ones for exactly that reason.
 *  Decorative by default. */
export function MockScreen({
  children,
  path = "dashboard",
  className,
  srLabel,
}: {
  children: ReactNode;
  path?: string;
  className?: string;
  srLabel?: string;
}) {
  return (
    <div
      className={cn(
        "lp-mock relative overflow-hidden rounded-3xl border border-[var(--lp-hairline)] bg-lp-deep text-lp-ink shadow-[0_30px_80px_rgba(0,0,0,0.45)]",
        className
      )}
      aria-hidden={srLabel ? undefined : "true"}
      role={srLabel ? "img" : undefined}
      aria-label={srLabel}
    >
      {/* top highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
      {/* chrome header */}
      <div className="flex items-center gap-3 border-b border-[var(--lp-hairline)] bg-white/[0.02] px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
        </div>
        <div className="mx-auto flex max-w-[70%] items-center gap-1.5 truncate rounded-md border border-[var(--lp-hairline)] bg-white/[0.03] px-3 py-1 text-[0.72rem] text-lp-ink-dim">
          <span className="h-1.5 w-1.5 rounded-full bg-lp-yellow/70" />
          <span className="truncate" dir="ltr">reelspy.dev/{path}</span>
        </div>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
