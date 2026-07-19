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
        "relative scroll-mt-20",
        dark && "bg-surface-2 text-foreground",
        className
      )}
      style={{ paddingBlock: "clamp(4.5rem, 9vh, 7.5rem)" }}
    >
      <div className={cn("mx-auto w-full max-w-[1240px] px-4 sm:px-6", containerClassName)}>{children}</div>
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
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-start",
        className
      )}
    >
      {eyebrow && <span className="lp-eyebrow">{eyebrow}</span>}
      <h2 className="lp-h2 max-w-[20ch] text-balance text-foreground">
        {title} {titleAccent && <span className="lp-accent-text">{titleAccent}</span>}
      </h2>
      {description && (
        <p className="lp-lead max-w-[62ch] text-muted-foreground">
          {description}
        </p>
      )}
    </Reveal>
  );
}
