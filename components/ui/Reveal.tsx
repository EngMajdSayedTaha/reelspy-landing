"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

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
 * Reveal-on-scroll wrapper. Server-rendered children stay server-rendered; this
 * only attaches an IntersectionObserver that flips `data-visible`. The hidden
 * initial state is CSS-gated behind `html.js`, so JS-off users see everything.
 */
export function Reveal({ children, as, className, delay = 0, once = true }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.setAttribute("data-visible", "true");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.setAttribute("data-visible", "true");
            if (once) observer.unobserve(el);
          } else if (!once) {
            el.setAttribute("data-visible", "false");
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
