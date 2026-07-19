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
    const onScroll = () => setScrolled(window.scrollY > 80);
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
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        // The unscrolled state used to be text-white, which worked only because
        // the hero behind it was permanently dark. Now that the hero follows
        // the theme, the nav has to as well.
        scrolled
          ? "bg-background/72 backdrop-blur-xl border-b border-border/70 text-foreground supports-[backdrop-filter]:bg-background/60"
          : "bg-transparent text-foreground"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="#top" aria-label="ReelSpy — home" className="shrink-0">
          <span className="text-foreground transition-opacity">
            <Logo size={30} animated />
          </span>
        </Link>

        {/* Center anchors — desktop */}
        <ul className="hidden items-center gap-1 lg:flex">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium text-current/75 transition hover:text-current",
                  active === s.id && "text-current"
                )}
              >
                {t[s.key]}
                <span
                  className={cn(
                    "absolute inset-x-3.5 -bottom-0.5 h-px origin-center scale-x-0 rounded bg-current transition-transform duration-300",
                    active === s.id && "scale-x-100"
                  )}
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Right controls — desktop */}
        <div className="hidden items-center gap-2 lg:flex">
          <LangToggle locale={locale} toggleLabel={t.langToggle} ariaLabel={t.langToggleLabel} />
          <ThemeToggle label={t.themeToggle} />
          {/* Plain anchor: /login lives in the dashboard zone (see lib/zones). */}
          <a
            href="/login"
            className="rounded-full px-3.5 py-2 text-sm font-medium text-current/85 transition hover:text-current"
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-current/15 text-current"
          >
            <Menu size={20} strokeWidth={1.7} />
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
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
            className="absolute inset-y-0 end-0 flex w-[min(88vw,360px)] flex-col gap-1 border-s border-border bg-background p-5 text-foreground shadow-2xl"
            style={
              {
                animation: "riseInSheet 0.28s cubic-bezier(0.22,1,0.36,1) both",
                "--sheet-from": locale === "ar" ? "-12%" : "12%",
              } as React.CSSProperties
            }
          >
            <div className="mb-4 flex items-center justify-between">
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
            <div className="my-3 h-px bg-border" />
            <a
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-lg font-medium text-foreground transition hover:bg-accent"
            >
              {t.login}
            </a>
            <CTALink href="/signup" size="lg" magnetic={false} className="mt-1 w-full" onClick={() => setOpen(false)}>
              {t.startFree}
            </CTALink>
            <div className="mt-4">
              <LangToggle locale={locale} toggleLabel={t.langToggle} ariaLabel={t.langToggleLabel} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
