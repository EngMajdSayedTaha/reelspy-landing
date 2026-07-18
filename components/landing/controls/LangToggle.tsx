"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Languages } from "lucide-react";
import { LOCALE_COOKIE, dirForLocale, type Locale } from "@/lib/i18n/config";

export function LangToggle({
  locale,
  toggleLabel,
  ariaLabel,
  className,
}: {
  locale: Locale;
  toggleLabel: string;
  ariaLabel: string;
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const next: Locale = locale === "en" ? "ar" : "en";

  const switchLang = () => {
    // Persist for the server render, then flip <html> attributes immediately so
    // direction changes without waiting for the refresh, then re-render server
    // components in the new locale.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = next;
    document.documentElement.dir = dirForLocale(next);
    startTransition(() => router.refresh());
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={switchLang}
      data-pending={pending}
      className={
        "inline-flex items-center gap-1.5 rounded-full border border-current/15 px-3 py-1.5 text-[0.8rem] font-medium text-current/80 transition hover:text-current hover:bg-current/10 data-[pending=true]:opacity-60 " +
        (className ?? "")
      }
    >
      <Languages size={15} strokeWidth={1.6} />
      <span>{toggleLabel}</span>
    </button>
  );
}
