"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n/en";
import type { Locale } from "@/lib/i18n/config";
import { WaitlistDialog } from "./WaitlistDialog";

// Closed-beta mode for the whole marketing page.
//
// Rather than thread an `enabled` prop through Hero → Pricing → FinalCTA →
// changelog and hand-edit every CTA, the state lives in one context that
// `CTALink` reads. Any CTA pointing at /signup automatically becomes "Join the
// waiting list" and opens the dialog instead of navigating — including CTAs
// added later, which is the part that stops this from rotting.
//
// The default is OFF, so a component rendered WITHOUT a provider (the section
// tests, the changelog page) behaves exactly as it did before this existed.

export type WaitlistCopy = Dictionary["waitlist"];

type WaitlistContextValue = {
  enabled: boolean;
  total: number;
  copy: WaitlistCopy | null;
  locale: Locale;
  open: () => void;
};

const FALLBACK: WaitlistContextValue = {
  enabled: false,
  total: 0,
  copy: null,
  locale: "en",
  open: () => {},
};

const WaitlistContext = createContext<WaitlistContextValue>(FALLBACK);

export function useWaitlist(): WaitlistContextValue {
  return useContext(WaitlistContext);
}

export function WaitlistProvider({
  enabled,
  total,
  copy,
  locale,
  children,
}: {
  enabled: boolean;
  total: number;
  copy: WaitlistCopy;
  locale: Locale;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const openDialog = useCallback(() => setOpen(true), []);
  const value = useMemo<WaitlistContextValue>(
    () => ({ enabled, total, copy, locale, open: openDialog }),
    [enabled, total, copy, locale, openDialog]
  );

  return (
    <WaitlistContext.Provider value={value}>
      {children}
      {enabled && open ? (
        <WaitlistDialog copy={copy} locale={locale} total={total} onClose={() => setOpen(false)} />
      ) : null}
    </WaitlistContext.Provider>
  );
}
