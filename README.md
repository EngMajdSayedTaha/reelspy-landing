# ReelSpy — Landing Page

A premium, fully responsive, bilingual (EN / العربية) marketing landing page for
**ReelSpy** (reelspy.dev), built to the spec in
`reelspy/docs/design/landing/`. Dark-first, cinematic indigo→cyan world with
tasteful 3D depth and **self-driving interactive product screens**.

Built with the same stack as the product app: **Next.js 16 (App Router) · React 19
· Tailwind CSS v4 · next-themes · lucide-react**. No animation mega-dependencies —
every effect is CSS, Web Animations, `IntersectionObserver`, or lightweight `rAF`.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
# or a production build
npm run build && npm run start
npm run lint     # ESLint (flat config)
```

## What's inside

| Section | Highlight |
|---|---|
| **Nav** | Sticky glass, active-section highlight, EN/AR + light/dark toggles, mobile sheet |
| **Hero** | H1 is the LCP text; 3D floating reel-card stack that tilts toward the cursor, cards drift, one "goes viral" (score counts up, glows cyan) over a nebula field |
| **Social proof** | Pausable monochrome platform marquee (IG · TikTok · YouTube · Facebook) |
| **Problem → Loop** | Five pain cards + an animated **WATCH → SPOT → CREATE → PUBLISH** circuit with an orbiting dot and light-up nodes |
| **Feature demos** | Four *self-driving* mock dashboards: a feed that **re-ranks with FLIP** on a sort toggle, a reel that **transcribes** itself into a Hook Library, a script that **types itself** (RTL when Arabic is picked), a video that **fans out** to four platforms + auto-reply chat sim |
| **Niche Radar** | Radar/orbit visualization with a sweeping line and pulsing over-performing nodes |
| **Bento** | Eight feature tiles with hover lift, sheen and border-glow |
| **Pricing** | Four real AED plans (Pro highlighted, animated gradient border), mobile snap-carousel, and a **live-priced "build your own" slider** |
| **Before / After** | Row-by-row reveal, struck-through left vs brand-lit right |
| **FAQ** | Native `<details>` disclosure (works with JS off, feeds FAQ JSON-LD) |
| **Final CTA + Footer** | Gradient-nebula band and a quiet, spacious footer |

## Design system

Brand palette, typography, motion tokens and gradient/glass utilities live in
[`app/globals.css`](app/globals.css). Semantic tokens (`--background`, `--card`,
`--border`, …) are lifted verbatim from the product app so the chrome matches;
marketing-only colors are namespaced `--lp-*`. The **one gradient**
(`violet → blue → cyan`) is used only on the CTA, wordmark accent, one hero word,
and live-data glows — ~90% of every viewport stays neutral.

## Bilingual & RTL

Locale is a cookie (`reelspy_lang`) read **server-side** in
[`app/layout.tsx`](app/layout.tsx) and [`app/page.tsx`](app/page.tsx), so the whole
page renders server-first in the active language and `dir`. The toggle
([`LangToggle`](components/landing/controls/LangToggle.tsx)) sets the cookie, flips
`<html dir>` instantly, and re-renders via `router.refresh()`. All copy lives in
[`lib/i18n/en.ts`](lib/i18n/en.ts) / [`lib/i18n/ar.ts`](lib/i18n/ar.ts) (the Arabic
dictionary is type-checked against the English shape). Layout uses CSS logical
properties throughout; directional animations (arrows, loop, publish fan-out,
marquee, mobile sheet) mirror under `dir="rtl"`.

## Performance / SEO / A11y

- **Server-first.** The page is a Server Component; only the interactive demos,
  nav, and toggles are `"use client"` islands. Hero renders meaningful content
  with zero JS.
- **LCP = the H1** (text). Hero art is `aria-hidden` and sized so it never becomes
  LCP. Fonts are `next/font` (self-hosted, `display: swap`).
- **Reveals are JS-gated** behind `html.js` (stamped before paint) so with
  JavaScript disabled every section is fully visible.
- **`prefers-reduced-motion`** freezes all demos on their most informative frame
  (via [`usePrefersReducedMotion`](components/ui/usePrefersReducedMotion.ts)); idle
  loops and count-ups stop.
- **SEO:** full metadata, a real 1200×630 OG image
  ([`app/opengraph-image.tsx`](app/opengraph-image.tsx)), `robots.ts`,
  `sitemap.ts`, one `<h1>`, sequential headings, and `SoftwareApplication` +
  `Organization` + `FAQPage` JSON-LD.
- **A11y:** skip link, visible cyan focus rings, `aria-pressed` demo toggles,
  focus-trapped mobile sheet, `sr-only` descriptions on decorative demos, ≥44px
  tap targets, and no meaning conveyed by color alone (score chips carry `↑ 4.2×`).

## Notes

- `/login` and `/signup` are branded **preview** screens — the real auth lives in
  the ReelSpy app. `/privacy`, `/terms`, `/cookies` are summary stubs.
- To point the landing at a real app, set `NEXT_PUBLIC_SITE_URL` and repoint the
  `/login` · `/signup` links (in the nav, CTAs and footer) at your app routes.
- All product facts (features, the virality formula, AED pricing) are taken from
  the spec and verified against the product — no invented numbers or testimonials.
