"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, ChevronDown, X } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/en";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

// The join dialog. Hand-rolled rather than pulled from a component library:
// this project ships no dialog primitive, and the mobile sheet in Nav.tsx
// already establishes the pattern (fixed overlay, scroll lock, Escape to close,
// focus moved in on open).
//
// It posts to /api/waitlist, which the multi-zone rewrites proxy to the
// dashboard deployment — so this is a same-origin request from the browser's
// point of view and needs no CORS setup. See DASHBOARD_PROXY_PATHS in
// next.config.ts.

const FOLLOWER_RANGES = ["0-1k", "1k-10k", "10k-50k", "50k-250k", "250k+"] as const;

type JoinResponse = {
  ok?: boolean;
  alreadyOnList?: boolean;
  queueNumber?: number | null;
  status?: string;
  reason?: string;
  error?: string;
};

export function WaitlistDialog({
  copy,
  locale,
  total,
  onClose,
}: {
  copy: Dictionary["waitlist"];
  locale: Locale;
  total: number;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [niche, setNiche] = useState("");
  const [followerRange, setFollowerRange] = useState("");
  const [referral, setReferral] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [showDetails, setShowDetails] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{
    already: boolean;
    queueNumber: number | null;
    approved: boolean;
    email: string;
  } | null>(null);
  const [opened, setOpened] = useState(false);

  // Scroll lock + Escape, and move focus into the panel — same treatment the
  // mobile nav sheet gets.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("input,button")?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || undefined,
          instagramHandle: handle || undefined,
          niche: niche || undefined,
          followerRange: followerRange || undefined,
          referralSource: referral || undefined,
          locale,
          website: website || undefined,
          utm: readUtm(),
        }),
      });
      const body = (await res.json().catch(() => ({}))) as JoinResponse;

      // The gate came down while this page was cached for up to a minute (see
      // lib/waitlist.ts). That's good news, not an error — say so and point
      // them at signup.
      if (res.status === 409 && body.reason === "closed") {
        setOpened(true);
        return;
      }
      if (res.status === 429) {
        setError(copy.errorThrottled);
        return;
      }
      if (!res.ok || !body.ok) {
        setError(body.error ?? copy.errorGeneric);
        return;
      }
      setDone({
        already: body.alreadyOnList === true,
        queueNumber: body.queueNumber ?? null,
        approved: body.status === "approved",
        email,
      });
    } catch {
      setError(copy.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={copy.dialogTitle}>
      <button
        type="button"
        aria-label={copy.close}
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        className="relative m-0 max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-border bg-background p-6 text-foreground shadow-2xl sm:m-4 sm:max-w-md sm:rounded-2xl"
        style={{ animation: "riseInSheet 0.24s cubic-bezier(0.22,1,0.36,1) both", ["--sheet-from" as string]: "0%" }}
      >
        <button
          type="button"
          aria-label={copy.close}
          onClick={onClose}
          className="absolute end-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:text-foreground"
        >
          <X size={18} strokeWidth={1.7} />
        </button>

        {opened ? (
          <div className="space-y-4 py-6 text-center">
            <h2 className="text-lg font-semibold">{copy.openedTitle}</h2>
            <p className="text-sm text-muted-foreground">{copy.openedBody}</p>
            <a
              href="/signup"
              className="lp-cta-bg inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
            >
              {copy.openedCta}
            </a>
          </div>
        ) : done?.approved ? (
          // Already approved — most often someone re-submitting after the
          // "you're in" email, or opening this dialog directly instead of
          // clicking through it. /signup?email= re-verifies this exact
          // address server-side and swaps in the real account form for it
          // (dashboard app: app/signup/page.tsx, isEmailApproved) — a bare
          // "you're approved" message with nothing to click would just be
          // this same dead end one layer up.
          <div className="space-y-4 py-6 text-center">
            <CheckCircle2 size={40} className="mx-auto text-lp-yellow-ink" aria-hidden />
            <h2 className="text-lg font-semibold">{copy.approvedTitle}</h2>
            <p className="text-sm text-muted-foreground">{copy.approvedBody}</p>
            <a
              href={`/signup?email=${encodeURIComponent(done.email)}`}
              className="lp-cta-bg inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
            >
              {copy.approvedCta}
            </a>
          </div>
        ) : done ? (
          <div className="space-y-3 py-6 text-center">
            <CheckCircle2 size={40} className="mx-auto text-lp-yellow-ink" aria-hidden />
            <h2 className="text-lg font-semibold">{done.already ? copy.alreadyTitle : copy.doneTitle}</h2>
            <p className="text-sm text-muted-foreground">
              {done.queueNumber != null
                ? (done.already ? copy.alreadyBody : copy.doneBody).replace("{n}", String(done.queueNumber))
                : copy.checkInbox}
            </p>
            {done.queueNumber != null && !done.already ? (
              <p className="text-xs text-muted-foreground/80">{copy.checkInbox}</p>
            ) : null}
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 pe-8">
            <div>
              <span className="lp-eyebrow inline-flex rounded-full border border-border bg-secondary px-3 py-1 text-[0.68rem]">
                {copy.badge}
              </span>
              <h2 className="mt-3 text-xl font-semibold">{copy.dialogTitle}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{copy.dialogSub}</p>
            </div>

            <Field id="wl-email" label={copy.emailLabel}>
              <input
                id="wl-email"
                type="email"
                required
                autoComplete="email"
                placeholder={copy.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </Field>

            {/* Honeypot — hidden from sight and from assistive tech. Anything in
                it came from a bot, and the server silently drops the request. */}
            <div aria-hidden className="hidden">
              <label htmlFor="wl-website">Website</label>
              <input
                id="wl-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              aria-expanded={showDetails}
              className="flex w-full items-center justify-between text-sm text-muted-foreground transition hover:text-foreground"
            >
              {copy.details}
              <ChevronDown size={16} className={cn("transition-transform", showDetails && "rotate-180")} />
            </button>

            {showDetails ? (
              <div className="space-y-3 rounded-xl border border-border p-4">
                <p className="text-xs text-muted-foreground">{copy.detailsHint}</p>
                <Field id="wl-name" label={copy.nameLabel}>
                  <input id="wl-name" value={name} placeholder={copy.namePlaceholder} onChange={(e) => setName(e.target.value)} className={inputClass} />
                </Field>
                <Field id="wl-handle" label={copy.handleLabel}>
                  <input id="wl-handle" value={handle} placeholder={copy.handlePlaceholder} onChange={(e) => setHandle(e.target.value)} className={inputClass} />
                </Field>
                <Field id="wl-niche" label={copy.nicheLabel}>
                  <input id="wl-niche" value={niche} placeholder={copy.nichePlaceholder} onChange={(e) => setNiche(e.target.value)} className={inputClass} />
                </Field>
                <Field id="wl-followers" label={copy.followersLabel}>
                  <select id="wl-followers" value={followerRange} onChange={(e) => setFollowerRange(e.target.value)} className={inputClass}>
                    <option value="">{copy.followersAny}</option>
                    {FOLLOWER_RANGES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="wl-referral" label={copy.referralLabel}>
                  <input id="wl-referral" value={referral} placeholder={copy.referralPlaceholder} onChange={(e) => setReferral(e.target.value)} className={inputClass} />
                </Field>
              </div>
            ) : null}

            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            <button
              type="submit"
              disabled={submitting || !email}
              className="lp-cta-bg inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-60"
            >
              {submitting ? copy.submitting : copy.submit}
            </button>

            {total > 0 ? (
              <p className="text-center text-xs text-muted-foreground">
                {copy.social.replace("{count}", String(total))}
              </p>
            ) : null}

            <p className="text-center text-xs text-muted-foreground">
              {copy.haveAccount}{" "}
              <a href="/login" className="underline hover:text-foreground">
                {copy.login}
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

const inputClass =
  "h-10 w-full rounded-lg border border-border bg-transparent px-3 text-sm text-foreground outline-none transition focus:border-foreground/30";

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

// Attribution, best-effort: whatever utm_* params are on the URL right now.
function readUtm(): Record<string, string> {
  try {
    const sp = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const [k, v] of sp.entries()) {
      if (k.startsWith("utm_") && v) utm[k] = v.slice(0, 200);
    }
    return utm;
  } catch {
    return {};
  }
}
