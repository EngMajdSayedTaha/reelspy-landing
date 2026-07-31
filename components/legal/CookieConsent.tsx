"use client";

import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { LegalLink } from "@/components/landing/LegalLink";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

// Same cookie name as the dashboard app's CookieConsent (host-only, so each
// origin keeps its own decision — reelspy.dev and app.reelspy.dev don't share
// a cookie jar). Independently reading this cookie on both sides keeps
// analytics scripts consent-gated everywhere without a cross-domain cookie,
// which the dashboard's own consent component deliberately avoided.
const STORAGE_KEY = "reelspy:cookie-consent";

type Consent = "accepted" | "rejected";

function persist(choice: Consent) {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
    document.cookie = `cookie_consent=${choice}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  } catch {
    // Storage can be unavailable (private mode); banner just won't persist.
  }
}

export function CookieConsent({ locale }: { locale: Locale }) {
  // `null`-equivalent: stays hidden until we know the stored choice, so
  // returning visitors never see a flash of the banner.
  const [visible, setVisible] = useState(false);
  const dict = getDictionary(locale).cookieConsent;

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    // Syncing with localStorage (an external system) is only possible
    // post-mount; deciding visibility any earlier would mismatch the
    // server-rendered (hidden) HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored !== "accepted" && stored !== "rejected") setVisible(true);
  }, []);

  if (!visible) return null;

  function choose(choice: Consent) {
    persist(choice);
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label={dict.ariaLabel}
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4"
    >
      <div
        className="cc-banner lp-glass mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-border p-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:flex-row sm:items-center sm:gap-4"
      >
        <span className="lp-icon-tile shrink-0">
          <Cookie className="h-5 w-5" />
        </span>
        <p className="flex-1 text-sm text-muted-foreground">
          {dict.message}{" "}
          <LegalLink href="/cookies" className="font-medium text-lp-yellow-ink hover:underline">
            {dict.cookiePolicy}
          </LegalLink>{" "}
          {dict.and}{" "}
          <LegalLink href="/privacy" className="font-medium text-lp-yellow-ink hover:underline">
            {dict.privacyPolicy}
          </LegalLink>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="h-9 rounded-full border border-border-strong px-3.5 text-sm font-medium text-foreground transition hover:bg-accent"
          >
            {dict.reject}
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="lp-cta-bg h-9 rounded-full px-4 text-sm font-semibold shadow-[0_8px_30px_rgba(249,228,0,0.28)] transition hover:brightness-[0.96]"
          >
            {dict.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
