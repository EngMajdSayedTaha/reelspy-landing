import { Sparkles, ArrowUpCircle, Wrench } from "lucide-react";
import type { Change, ChangeKind, Release } from "@/lib/changelog/types";
import type { Dictionary } from "@/lib/i18n/en";
import type { Locale } from "@/lib/i18n/config";

// Server-rendered so the whole history is crawlable: this page exists as much
// for a prospect deciding whether the product is alive as for an existing user
// catching up.

const KIND_STYLES: Record<ChangeKind, { icon: typeof Sparkles; className: string }> = {
  new: { icon: Sparkles, className: "bg-lp-yellow-ink/12 text-lp-yellow-ink" },
  improved: { icon: ArrowUpCircle, className: "bg-foreground/8 text-foreground" },
  fixed: { icon: Wrench, className: "bg-foreground/5 text-muted-foreground" },
};

const KIND_ORDER: ChangeKind[] = ["new", "improved", "fixed"];

function sortChanges(changes: Change[]): Change[] {
  return [...changes].sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind));
}

export function ChangelogList({
  releases,
  dict,
  locale,
  currentVersion,
}: {
  releases: Release[];
  dict: Dictionary;
  locale: Locale;
  currentVersion: string | null;
}) {
  const t = dict.changelog;
  // Latin digits even in Arabic, matching the rest of the site's numbers.
  const intlLocale = locale === "ar" ? "ar-AE-u-nu-latn" : "en-US";

  return (
    <ol className="flex flex-col gap-5">
      {releases.map((release) => {
        const released = new Date(`${release.date}T00:00:00Z`).toLocaleDateString(intlLocale, {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        });

        return (
          <li
            key={release.version}
            className="rounded-2xl border border-border bg-surface-2 p-5 sm:p-7"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-foreground/8 px-2.5 py-0.5 font-mono text-xs font-medium text-foreground">
                v{release.version}
              </span>
              <time dateTime={release.date} className="text-xs text-muted-foreground">
                {released}
              </time>
              {release.version === currentVersion ? (
                <span className="rounded-full bg-lp-yellow-ink/12 px-2.5 py-0.5 text-xs font-medium text-lp-yellow-ink">
                  {t.currentBadge}
                </span>
              ) : null}
            </div>

            <h2 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
              {release.title[locale]}
            </h2>
            <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
              {release.summary[locale]}
            </p>

            <ul className="mt-5 flex flex-col gap-3">
              {sortChanges(release.changes).map((change, index) => {
                const { icon: Icon, className } = KIND_STYLES[change.kind];
                return (
                  <li key={index} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-[0.7rem] font-medium ${className}`}
                    >
                      <Icon size={14} strokeWidth={1.8} aria-hidden />
                      {t.kinds[change.kind]}
                    </span>
                    <span className="min-w-0 flex-1 text-sm leading-relaxed text-foreground">
                      {change.text[locale]}
                    </span>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}
