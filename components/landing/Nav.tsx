"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { CTALink } from "@/components/ui/CTALink";
import { ThemeToggle } from "./controls/ThemeToggle";
import { LangToggle } from "./controls/LangToggle";
import type { Dictionary } from "@/lib/i18n/en";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "features", key: "features" as const },
  { id: "how", key: "how" as const },
  { id: "live", key: "live" as const },
  { id: "pricing", key: "pricing" as const },
  { id: "faq", key: "faq" as const },
];

export function Nav({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.nav;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Body scroll lock + Escape to close the mobile sheet.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    sheetRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* A floating pill rather than a full-width bar.
          The full-width bar had to choose between two bad states: transparent,
          in which case it disappeared over the hero grid, or a solid strip,
          which cut a hard horizontal line across the top of the page. A
          detached, self-contained pill is legible over anything, keeps the
          hero's top edge intact, and gives the page an object at the top rather
          than a chrome band. */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <nav
          className={cn(
            "pointer-events-auto mx-auto flex max-w-[1160px] items-center justify-between gap-3 rounded-full border px-3 text-foreground transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-4",
            scrolled
              ? "h-14 border-border bg-background/75 shadow-[var(--lp-shadow-2),var(--lp-sheen)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
              : "h-16 border-transparent bg-transparent shadow-none"
          )}
        >
          <Link href="#top" aria-label="ReelSpy — home" className="shrink-0">
            <span className="text-foreground transition-opacity">
              <Logo size={30} animated />
            </span>
          </Link>

          {/* Center anchors — desktop */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={cn(
                    // The active state is a filled chip, not an underline.
                    // A 1px underline under a 14px label inside a translucent
                    // pill is invisible at a glance; a soft chip is readable
                    // over the hero art and over a solid section alike.
                    "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                    active === s.id
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t[s.key]}
                </a>
              </li>
            ))}
          </ul>

          {/* Right controls — desktop */}
          <div className="hidden items-center gap-1.5 lg:flex">
            <LangToggle locale={locale} toggleLabel={t.langToggle} ariaLabel={t.langToggleLabel} />
            <ThemeToggle label={t.themeToggle} />
            <span aria-hidden className="mx-1 h-5 w-px bg-border" />
            {/* Plain anchor: /login lives in the dashboard zone (see lib/zones). */}
            <a
              href="/login"
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.login}
            </a>
            <CTALink href="/signup" size="md" magnetic={false}>
              {t.startFree}
            </CTALink>
          </div>

          {/* Mobile trigger */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <ThemeToggle label={t.themeToggle} />
            <button
              type="button"
              aria-label={t.openMenu}
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/70 text-foreground shadow-[var(--lp-sheen)] backdrop-blur-sm"
            >
              <Menu size={19} strokeWidth={1.8} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile sheet — rendered as a sibling of <header>, NOT a child.
          When the page is scrolled the nav gets `backdrop-blur-xl`, and a
          `backdrop-filter` turns an element into the containing block for its
          `position: fixed` descendants. Nested inside the header, this overlay
          therefore sized to the 64px header instead of the viewport: its opaque
          panel covered only the top strip and the menu links overflowed
          straight over the page content. Hoisting it to the body (which has no
          such filter) keeps `fixed inset-0` bound to the viewport. */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label={t.openMenu}>
          <button
            aria-label={t.closeMenu}
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div
            ref={sheetRef}
            className="absolute inset-y-0 end-0 flex w-[min(88vw,360px)] flex-col gap-1 overflow-y-auto border-s border-border bg-background p-5 text-foreground shadow-2xl"
            style={
              {
                animation: "riseInSheet 0.28s cubic-bezier(0.22,1,0.36,1) both",
                "--sheet-from": locale === "ar" ? "-12%" : "12%",
              } as React.CSSProperties
            }
          >
            <div className="mb-5 flex items-center justify-between">
              <Logo size={28} animated={false} />
              <button
                type="button"
                aria-label={t.closeMenu}
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground"
              >
                <X size={20} strokeWidth={1.7} />
              </button>
            </div>
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-lg font-medium text-foreground transition hover:bg-accent"
              >
                {t[s.key]}
              </a>
            ))}
            <hr className="lp-rule my-3" />
            <a
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-lg font-medium text-foreground transition hover:bg-accent"
            >
              {t.login}
            </a>
            <CTALink href="/signup" size="lg" magnetic={false} className="mt-2 w-full" onClick={() => setOpen(false)}>
              {t.startFree}
            </CTALink>
            <div className="mt-5">
              <LangToggle locale={locale} toggleLabel={t.langToggle} ariaLabel={t.langToggleLabel} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
