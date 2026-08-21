import { describe, it, expect } from "vitest";
import { coverArtFor } from "@/lib/showcase/cover";
import { SHOWCASE_FIXTURES } from "@/lib/showcase/fixtures";
import type { ShowcaseReel } from "@/lib/showcase/types";

const reels = SHOWCASE_FIXTURES.niches.flatMap((n) => n.reels);

describe("coverArtFor", () => {
  // The wall renders every reel twice (see ReelWall) and the grid renders the
  // same reels again. If the art weren't a pure function of the reel, the two
  // copies in a rail would draw different frames and the loop seam would become
  // visible once per lap — and the server and client renders would disagree.
  it("is deterministic for the same reel", () => {
    for (const reel of reels) {
      expect(coverArtFor(reel)).toEqual(coverArtFor(reel));
    }
  });

  it("gives different reels different art", () => {
    const frames = new Set(reels.map((r) => coverArtFor(r).frame));
    // Not all 24 need be unique — the hue set is deliberately small — but a
    // handful of distinct frames means the hash is actually reaching the output.
    expect(frames.size).toBeGreaterThan(6);
  });

  it("derives its art from the reel's identity, not its position", () => {
    const [first, second] = reels;
    expect(coverArtFor(first).frame).not.toEqual(coverArtFor(second).frame);
    // Same reel, re-created as a fresh object: identity is the username plus
    // permalink/caption, so an equal reel must produce equal art.
    const clone: ShowcaseReel = { ...first };
    expect(coverArtFor(clone)).toEqual(coverArtFor(first));
  });

  it("keeps playback timings inside plausible reel bounds", () => {
    for (const reel of reels) {
      const art = coverArtFor(reel);
      expect(art.playSeconds).toBeGreaterThanOrEqual(9);
      expect(art.playSeconds).toBeLessThanOrEqual(30);
      // The offset starts each card mid-playback, so it must be negative (or
      // zero) and never longer than the clip itself — a delay past the duration
      // would park the playhead outside the animation.
      expect(art.playOffset).toBeLessThanOrEqual(0);
      expect(Math.abs(art.playOffset)).toBeLessThan(art.playSeconds);
      expect(art.runtime).toMatch(/^0:\d{2}$/);
    }
  });

  // Saturation is the difference between "a wall of graded footage" and "a row
  // of coloured blobs". Nothing in the generator may exceed the ceiling.
  it("never emits a saturated frame", () => {
    for (const reel of reels) {
      const sats = [...coverArtFor(reel).frame.matchAll(/hsl\(\d+ (\d+)%/g)].map((m) => Number(m[1]));
      expect(sats.length).toBeGreaterThan(0);
      for (const s of sats) expect(s).toBeLessThanOrEqual(20);
    }
  });

  it("prefers a real thumbnail's absence over inventing one", () => {
    // The generator never fabricates a thumbnailUrl; it only supplies CSS the
    // caller paints when thumbnailUrl is null. Guard the contract.
    const art = coverArtFor(reels[0]);
    expect(art).not.toHaveProperty("thumbnailUrl");
  });
});
