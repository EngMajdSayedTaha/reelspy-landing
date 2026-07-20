import type { CSSProperties, ElementType, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Reveal delay in ms — cheap way to stagger siblings. */
  delay?: number;
  /** Reveal once, then stop observing (default true). */
  once?: boolean;
};

/**
 * Marks a subtree as a scroll-reveal target. This is markup only — no hooks, no
 * "use client" — so it stays a server component and ships no JS of its own.
 * <RevealEngine> (mounted once in the root layout) owns the observation.
 *
 * Note that `data-reveal` is the real contract, not this component: a plain
 * element carrying the attribute (used to stagger siblings without a wrapper per
 * child) is revealed the same way.
 */
export function Reveal({ children, as, className, delay = 0, once = true }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;

  return (
    <Tag
      data-reveal=""
      data-reveal-once={once ? undefined : "false"}
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
