import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { InstagramMark, TikTokMark, YouTubeMark, FacebookMark } from "@/components/brand/PlatformMarks";
import { LangToggle } from "./controls/LangToggle";
import { LegalLink } from "./LegalLink";
import type { Dictionary } from "@/lib/i18n/en";
import type { Locale } from "@/lib/i18n/config";
import { isDashboardZone, isLegalZone } from "@/lib/zones";

export function Footer({
  dict,
  locale,
  version,
}: {
  dict: Dictionary;
  locale: Locale;
  /**
   * Product version, shown next to the copyright. Only passed on /changelog,
   * which already loads it — the homepage deliberately doesn't fetch across the
   * zone boundary just to print a number in the footer.
   */
  version?: string | null;
}) {
  const t = dict.footer;
  const nav = dict.nav;
  const year = 2026;

  const columns = [
    {
      title: t.product,
      links: [
        { label: t.links.features, href: "#features" },
        { label: t.links.pricing, href: "#pricing" },
        { label: t.links.faq, href: "#faq" },
        { label: t.links.changelog, href: "/changelog" },
      ],
    },
    {
      title: t.company,
      links: [
        { label: t.links.privacy, href: "/privacy" },
        { label: t.links.terms, href: "/terms" },
        { label: t.links.cookies, href: "/cookies" },
      ],
    },
    {
      title: t.account,
      links: [
        { label: t.links.login, href: "/login" },
        { label: t.links.signup, href: "/signup" },
      ],
    },
  ];

  return (
    <footer className="lp-noise relative border-t border-border bg-surface-2 text-foreground">
      <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-10 px-4 py-20 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-1">
          <Logo size={30} animated={false} />
          <p className="mt-5 max-w-[32ch] text-sm leading-relaxed text-muted-foreground">{t.tagline}</p>
          <div className="mt-6 flex items-center gap-2.5">
            {[InstagramMark, TikTokMark, YouTubeMark, FacebookMark].map((Mark, i) => (
              <span
                key={i}
                className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground/80 shadow-[var(--lp-sheen)]"
              >
                <Mark size={16} />
              </span>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70">
              {col.title}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {col.links.map((l) => {
                // Account links point into the dashboard zone, so they need a
                // real navigation rather than a client-side route change. The
                // legal pages live there too, but additionally carry a `redirect`
                // param so their Back control returns here (see LegalLink).
                const cls = "text-sm text-muted-foreground transition-colors hover:text-foreground";
                return (
                  <li key={l.href}>
                    {isLegalZone(l.href) ? (
                      <LegalLink href={l.href} className={cls}>
                        {l.label}
                      </LegalLink>
                    ) : isDashboardZone(l.href) ? (
                      <a href={l.href} className={cls}>
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className={cls}>
                        {l.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-4 px-4 py-6 text-[0.78rem] text-muted-foreground sm:flex-row sm:px-6">
          <p>
            © {year} ReelSpy. {t.rights} {t.operatedBy}
          </p>
          <div className="flex items-center gap-4">
            {version ? (
              <Link
                href="/changelog"
                className="font-mono text-[0.72rem] text-muted-foreground/80 transition hover:text-lp-yellow-ink"
              >
                {t.version.replace("{version}", version)}
              </Link>
            ) : null}
            {/* <span className="hidden sm:inline">{t.builtWith}</span> */}
            <LangToggle locale={locale} toggleLabel={nav.langToggle} ariaLabel={nav.langToggleLabel} />
          </div>
        </div>
      </div>
    </footer>
  );
}
