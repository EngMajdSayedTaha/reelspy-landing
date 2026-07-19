import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { InstagramMark, TikTokMark, YouTubeMark, FacebookMark } from "@/components/brand/PlatformMarks";
import { LangToggle } from "./controls/LangToggle";
import type { Dictionary } from "@/lib/i18n/en";
import type { Locale } from "@/lib/i18n/config";

export function Footer({ dict, locale }: { dict: Dictionary; locale: Locale }) {
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
    <footer className="relative border-t border-border bg-surface-2 text-foreground">
      <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-1">
          <Logo size={30} animated={false} />
          <p className="mt-4 max-w-[32ch] text-sm text-muted-foreground">{t.tagline}</p>
          <div className="mt-5 flex items-center gap-4 text-muted-foreground/70">
            <InstagramMark size={18} />
            <TikTokMark size={18} />
            <YouTubeMark size={18} />
            <FacebookMark size={18} />
          </div>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-[0.72rem] font-semibold uppercase tracking-wide text-muted-foreground">{col.title}</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-foreground/80 transition hover:text-lp-yellow-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-[var(--lp-hairline)]">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-4 px-4 py-6 text-[0.78rem] text-muted-foreground sm:flex-row sm:px-6">
          <p>
            © {year} ReelSpy. {t.rights}
          </p>
          <div className="flex items-center gap-4">
            {/* <span className="hidden sm:inline">{t.builtWith}</span> */}
            <LangToggle locale={locale} toggleLabel={nav.langToggle} ariaLabel={nav.langToggleLabel} />
          </div>
        </div>
      </div>
    </footer>
  );
}
