import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { LangToggle } from "@/components/landing/controls/LangToggle";
import { ThemeToggle } from "@/components/landing/controls/ThemeToggle";
import { ChangelogList } from "@/components/landing/changelog/ChangelogList";
import { Footer } from "@/components/landing/Footer";
import { CTALink } from "@/components/ui/CTALink";
import { getChangelog } from "@/lib/changelog/fetch";
import { getDictionary } from "@/lib/i18n";
import { LOCALE_COOKIE, normalizeLocale } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/site";

// Metadata is generated in English only, like the rest of the site's metadata:
// the page is served from one URL in whichever language the visitor's cookie
// says, and a crawler has no cookie.
export const metadata: Metadata = {
  title: getDictionary("en").changelog.metaTitle,
  description: getDictionary("en").changelog.metaDescription,
  alternates: { canonical: `${SITE_URL}/changelog` },
  openGraph: {
    title: getDictionary("en").changelog.metaTitle,
    description: getDictionary("en").changelog.metaDescription,
    url: `${SITE_URL}/changelog`,
    type: "website",
  },
};

// The public face of the product changelog. Rendered from the dashboard zone's
// /api/public/changelog rather than from a copy kept here, so a release note is
// written exactly once — see docs/RELEASING.md in the dashboard repo.
//
// The homepage's Nav is deliberately not reused: every one of its links is an
// on-page anchor (#features, #pricing) that would do nothing here. A sub-page
// gets a sub-page header.
export default async function ChangelogPage() {
  const cookieStore = await cookies();
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const dict = getDictionary(locale);
  const t = dict.changelog;
  const { releases, version } = await getChangelog();

  return (
    <>
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-[900px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" aria-label="ReelSpy — home" className="shrink-0">
            <Logo size={28} animated={false} />
          </Link>
          <div className="flex items-center gap-2">
            <LangToggle
              locale={locale}
              toggleLabel={dict.nav.langToggle}
              ariaLabel={dict.nav.langToggleLabel}
            />
            <ThemeToggle label={dict.nav.themeToggle} />
            <CTALink href="/signup" size="md" magnetic={false}>
              {dict.nav.startFree}
            </CTALink>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-[900px] px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-lp-yellow-ink">
          {t.eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">{t.h1}</h1>
        <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-muted-foreground">{t.sub}</p>

        <div className="mt-10">
          {releases.length > 0 ? (
            <ChangelogList
              releases={releases}
              dict={dict}
              locale={locale}
              currentVersion={version}
            />
          ) : (
            // No fixtures here on purpose: stale sample reels on the homepage are
            // a cosmetic compromise, but a made-up changelog is a false claim
            // about what the product does.
            <div className="rounded-2xl border border-dashed border-border bg-surface-2 p-8 text-center">
              <p className="font-medium text-foreground">{t.unavailableTitle}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{t.unavailableBody}</p>
              <div className="mt-5 flex justify-center">
                <CTALink href="/login" size="md" magnetic={false}>
                  {t.unavailableCta}
                </CTALink>
              </div>
            </div>
          )}
        </div>

        <Link
          href="/"
          className="mt-12 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-lp-yellow-ink"
        >
          <ArrowLeft size={16} strokeWidth={1.8} className="rtl:rotate-180" />
          {t.backHome}
        </Link>
      </main>

      <Footer dict={dict} locale={locale} version={version} />
    </>
  );
}
