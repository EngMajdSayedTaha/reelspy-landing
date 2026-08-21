import type { ShowcaseReel } from "./types";

// Deterministic cover art for a reel — the last-resort tier.
//
// Production usually has a real thumbnail: the enrichment job mirrors reel
// covers into the `ig-media` bucket, and the endpoint nulls out only the raw
// Instagram CDN URLs, which are signed and expire in about a week. What it
// never has is video, so what this draws is a still either way.
//
// This exists for the cases where even the thumbnail is missing: a reel
// enriched before mirroring existed, one whose CDN URL expired before it was
// copied, and the curated fixtures, which are `thumbnailUrl: null` throughout
// because shipping hotlinked images in the repo would be worse. A card with no
// cover has to look like a deliberate frame, not like a failed image.
//
// The rule those frames follow is that they must look GRADED, not generated.
// Random hues at full saturation would give a rainbow wall that reads as
// placeholder art the moment you see two cards side by side. Instead every
// frame is a dark graphite base pushed a few degrees toward one cinematic hue
// at low saturation — the same thing a colorist does to a shot. Put forty of
// them in a row and they read as one wall of footage.
//
// Everything here is derived from a hash of the reel's own identity, so a given
// reel draws the same frame on the server and on the client (no hydration
// mismatch) and the same frame on every visit.

/** FNV-1a, 32-bit. Small, fast, and stable across runtimes. */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Pulls a bounded integer out of the hash without disturbing other draws. */
function pick(seed: number, shift: number, span: number): number {
  return ((seed >>> shift) & 0xff) % span;
}

// Cinematic grades, not a color wheel: amber, rust, plum, indigo, teal, moss.
// Each stays under 20% saturation in use, which is what keeps the wall reading
// as one system instead of six unrelated thumbnails.
const HUES = [32, 14, 318, 236, 186, 96];

export type ReelCoverArt = {
  /** The graded frame itself. */
  frame: string;
  /** A soft off-center highlight — the "subject" the shot is lit on. */
  subject: string;
  /** Seconds for one playhead sweep. */
  playSeconds: number;
  /** Negative delay, so every card on the wall sits at a different point of playback. */
  playOffset: number;
  /** Seconds for one Ken Burns cycle. */
  driftSeconds: number;
  /** "0:14" — a plausible reel runtime, stable per reel. */
  runtime: string;
  /** True for roughly one card in five; drives the pulsing live dot. */
  isLive: boolean;
};

export function coverArtFor(reel: ShowcaseReel): ReelCoverArt {
  const seed = hash(`${reel.igUsername}|${reel.permalink ?? reel.caption ?? reel.postedAt ?? ""}`);

  const h1 = HUES[pick(seed, 0, HUES.length)];
  // The second hue is always two steps around the ring, never adjacent: a frame
  // lit by two nearly identical hues just looks flat.
  const h2 = HUES[(pick(seed, 0, HUES.length) + 2) % HUES.length];

  const lift = 27 + pick(seed, 8, 11); // how bright the key light reads
  const keyX = 24 + pick(seed, 12, 38);
  const keyY = 10 + pick(seed, 16, 24);
  const fillX = 56 + pick(seed, 20, 34);
  const fillY = 60 + pick(seed, 4, 26);
  const subjectX = 34 + pick(seed, 24, 32);
  const subjectY = 46 + pick(seed, 26, 18);

  // Saturation is deliberately low — 18% at the key, 8% at the base. The first
  // pass ran at 26% and the wall came out as a row of green, teal and violet
  // blobs: obviously synthetic, and six competing hues on one band with a
  // single-accent brand. At these values each frame is graphite that has been
  // pushed a few degrees, which is what a graded night shot actually looks
  // like. The contrast between key and base does the work the color was doing.
  const frame = [
    // Key light
    `radial-gradient(110% 80% at ${keyX}% ${keyY}%, hsl(${h1} 18% ${lift}%), transparent 58%)`,
    // Fill, from the opposite corner
    `radial-gradient(85% 62% at ${fillX}% ${fillY}%, hsl(${h2} 15% ${Math.round(lift * 0.62)}%), transparent 60%)`,
    // Floor. A frame with no dark anchor at the bottom floats; this is what
    // gives every cover a consistent place for the handle and metrics to sit.
    `linear-gradient(to top, hsl(${h2} 14% 4%) 0%, transparent 46%)`,
    // Base grade
    `linear-gradient(168deg, hsl(${h1} 9% 13%), hsl(${h2} 11% 6%))`,
  ].join(", ");

  // Bokeh, not a blob.
  //
  // The first version put one wide soft white ellipse in the middle of every
  // frame as "the subject". At any size it read as a smudge on the lens — the
  // exact thing that makes generated art look generated, because nothing in a
  // real photograph is that evenly soft and that centred.
  //
  // Out-of-focus points of light are the fix. They are what a real shallow-depth
  // frame has in its background, they are legible at 130px and at 300px, and
  // because they are hard-edged circles rather than a gradient wash, they give
  // the eye something with actual structure to land on. The radii are in px on
  // purpose: bokeh is a property of the lens, so it should NOT scale with the
  // card — the same 26px circle reading larger on a small card is precisely
  // what happens when you crop in on a real frame.
  const bokeh = [
    [26, 0.11, 18 + pick(seed, 2, 26), 16 + pick(seed, 3, 22)],
    [15, 0.09, 56 + pick(seed, 5, 32), 22 + pick(seed, 7, 26)],
    [34, 0.055, 24 + pick(seed, 9, 46), 60 + pick(seed, 11, 22)],
    [11, 0.10, 62 + pick(seed, 13, 28), 44 + pick(seed, 15, 30)],
  ]
    .map(([r, a, x, y]) => `radial-gradient(circle ${r}px at ${x}% ${y}%, rgba(255,255,255,${a}), transparent 72%)`)
    .join(", ");

  // A much fainter key on the subject than before — it is there to give the
  // bokeh somewhere to sit, not to be seen in its own right.
  const subject = `${bokeh}, radial-gradient(38% 26% at ${subjectX}% ${subjectY}%, rgba(255,255,255,0.06), transparent 74%)`;

  const seconds = 9 + pick(seed, 6, 22); // 9–30s, the real range for a reel
  return {
    frame,
    subject,
    playSeconds: seconds,
    playOffset: -pick(seed, 14, seconds),
    driftSeconds: 16 + pick(seed, 18, 14),
    runtime: `0:${String(seconds).padStart(2, "0")}`,
    isLive: pick(seed, 10, 5) === 0,
  };
}
