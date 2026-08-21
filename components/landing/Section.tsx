import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export function Section({
  id,
  children,
  className,
  containerClassName,
  dark = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  /**
   * Renders the section one elevation step off the page background, to break
   * up a long scroll. It used to force a fixed near-black regardless of theme,
   * which is what left light mode looking like alternating stripes of two
   * different sites.
   */
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        // Grain on every section, not just the ambient ones: it is what keeps a
        // 1400px-wide flat fill from banding on a cheap panel, and it is the
        // difference between "a background color" and "a surface".
        "lp-noise relative scroll-mt-24",
        dark && "bg-surface-2 text-foreground",
        className
      )}
      style={{ paddingBlock: "clamp(5rem, 10vh, 8.5rem)" }}
    >
      <div className={cn("relative mx-auto w-full max-w-[1240px] px-4 sm:px-6", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  titleAccent,
  align = "center",
  description,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  titleAccent?: string;
  align?: "center" | "start";
  description?: string;
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start text-start",
        className
      )}
    >
      {eyebrow && <span className="lp-eyebrow">{eyebrow}</span>}
      {/* 22ch, not 20ch: the display scale grew, and at the old measure a
          two-clause headline broke after its second word on desktop. */}
      <h2 className="lp-h2 max-w-[22ch] text-foreground">
        {title} {titleAccent && <span className="lp-accent-text">{titleAccent}</span>}
      </h2>
      {description && (
        <p className={cn("lp-lead max-w-[60ch] text-muted-foreground", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
