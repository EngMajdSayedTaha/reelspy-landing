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
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-20",
        dark && "bg-lp-space text-lp-ink",
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
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  titleAccent?: string;
  align?: "center" | "start";
  description?: string;
  dark?: boolean;
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
      <h2 className={cn("lp-h2 max-w-[20ch] text-balance", dark ? "text-lp-ink" : "text-foreground")}>
        {title} {titleAccent && <span className="lp-gradient-text">{titleAccent}</span>}
      </h2>
      {description && (
        <p className={cn("lp-lead max-w-[62ch]", dark ? "text-lp-ink-dim" : "text-muted-foreground")}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
