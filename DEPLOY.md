# Deploying the reelspy.dev multi-zone setup

`reelspy.dev` is served by **two** Vercel projects:

| Zone | Project | Serves |
|---|---|---|
| Marketing (primary) | `reelspy-landing` | `/`, `sitemap.xml`, `robots.txt`, `opengraph-image` |
| Product (secondary) | `reelspy` | `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/dashboard/*`, `/admin/*`, `/api/*`, `/auth/*`, `/privacy`, `/terms`, `/cookies` |

The landing project owns the domain and proxies the product routes through
`rewrites()`. Everything stays on one origin, which is the whole point: the
Supabase auth cookies, the Google OAuth redirect URIs and the Stripe return
URLs are all bound to `https://reelspy.dev` and **none of them need to change**.

## Environment variables

**`reelspy-landing`**
- `DASHBOARD_URL` — the product project's own deployment URL, no trailing
  slash (e.g. `https://reelspy-xxxx.vercel.app`). Without it the rewrites are
  skipped and every product route 404s.
- `NEXT_PUBLIC_SITE_URL` — `https://reelspy.dev`

**`reelspy`** — unchanged.

## Cutover order

The domain currently points at the product project, so move it **last**.

1. **Deploy `reelspy`.** It now sets `assetPrefix: "/dashboard-static"` in
   production. Smoke-test on its own `*.vercel.app` URL:
   - `/login` renders and its CSS/JS load (assets come from
     `/dashboard-static/_next/...`)
   - `/api/public/trending?niche=fitness` returns JSON with
     `cache-control: public, s-maxage=1800, stale-while-revalidate=86400`
   - `/api/public/trending?niche=nope` returns 400

2. **Set `DASHBOARD_URL`** on `reelspy-landing` to that URL, then deploy it.
   Smoke-test on the landing's preview URL:
   - `/` renders, including the Live Trending section
   - `/login` serves the **product's** auth page, with its assets loading
   - `/privacy` serves the product's legal page

3. **Move the domain.** In Vercel, remove `reelspy.dev` and `www.reelspy.dev`
   from the `reelspy` project and add them to `reelspy-landing`. DNS is
   unchanged, so this is close to zero downtime.

### Rollback

Move the domain back to `reelspy`. The product project still serves every one
of its own routes on its own paths — the only thing it loses is the marketing
homepage, since its `/` redirects to `/login`.

## Post-cutover checks on reelspy.dev

Auth and money first, because they cross the zone boundary:
- [ ] Sign up with email → confirmation mail → `/auth/confirm` → onboarding
- [ ] Google OAuth round-trip (`/auth/callback`)
- [ ] Password reset → `/reset-password`
- [ ] Stripe checkout completes and the webhook is delivered. Consider
      re-pointing the Stripe webhook at the product project's **direct**
      `*.vercel.app` URL rather than through the proxy — signature
      verification reads the raw body, and one less hop is one less thing
      between Stripe and the handler.
- [ ] Vercel crons still fire (they hit the product deployment directly, so
      they're unaffected — confirm in the project's cron logs)

Then the surface:
- [ ] `/`, `/privacy`, `/terms`, `/cookies` all 200
- [ ] `/brand/reelspy-logo-512.png` loads (proxied)
- [ ] Landing → `/login` → `/dashboard` keeps both the theme and the language
- [ ] Arabic end-to-end: `dir="rtl"`, and the dashboard inherits the
      language chosen on the landing page
- [ ] Live Trending shows real reels, or the labelled sample data if the
      snapshot cache hasn't been populated yet (see below)
- [ ] Lighthouse mobile on `/`

Widths worth eyeballing, since the hero and the grids were rebuilt:
320, 360, 390, 700 (the Bento 2-column band), 768, 1024, 1440 — in both
light and dark, and in both languages.

## Live Trending data

The section calls `/api/public/trending`, which reads the **curated seed
account pool**, never the cross-user aggregate — that's built from what paying
users chose to track and must not leave the product.

It only returns reels once `ig_reel_snapshots` has been populated, which
happens when the enrichment crons run against a live Meta token. Until then
the endpoint returns an empty list and the landing renders curated sample
data, clearly labelled as such. That's the expected state of a fresh
deployment, not a failure.

Thumbnails only ship if they're self-hosted in the `ig-media` bucket. Raw
Instagram CDN URLs are signed and expire in about a week, so a cached
marketing page would rot into broken images; cards render a generated cover
instead.

### Playing video on the reel wall

The wall plays a reel whenever the payload gives it somewhere to play from,
and shows the still cover when it doesn't. Today it never does: the endpoint
returns `thumbnailUrl` and nothing else, `ig_reel_snapshots` has no video
column, and `ig-media` holds images only. That's why the band is stills.

The landing side is already wired for it, so this is a dashboard change
alone. To turn it on, add one field to `/api/public/trending`:

```jsonc
{ "videoUrl": "https://<project>.supabase.co/storage/v1/object/public/ig-media/<id>.mp4" }
```

It must be **self-hosted**, for the same reason thumbnails are — Instagram's
`media_url` for a VIDEO is a signed CDN link that expires in about a week, so
mirroring it into `ig-media` alongside the cover is the whole job. Anything
that isn't an `http(s)` URL is dropped at the boundary (`lib/showcase/fetch`),
and a URL that 404s or fails to decode falls back to the still with nothing
visible to the user.

Playback is muted, looping, inline and uncontrollable by design, and only the
wall's front row plays — roughly eight concurrent decodes rather than the ~48
that playing every card twice would cost. `prefers-reduced-motion` gets the
stills.
