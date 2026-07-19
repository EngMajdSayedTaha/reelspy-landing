import { describe, it, expect } from "vitest";
import { sortReels, viralScore, reelKey } from "@/lib/showcase/sort";
import { SHOWCASE_FIXTURES } from "@/lib/showcase/fixtures";
import type { ShowcaseReel } from "@/lib/showcase/types";

function reel(over: Partial<ShowcaseReel> = {}): ShowcaseReel {
  return {
    igUsername: "creator",
    permalink: "https://www.instagram.com/reel/ABC/",
    caption: null,
    thumbnailUrl: null,
    viewCount: 1000,
    likeCount: 100,
    commentCount: 10,
    postedAt: "2026-07-01T00:00:00.000Z",
    outperformRatio: 2,
    followers: 1000,
    ...over,
  };
}

describe("sortReels", () => {
  const a = reel({ igUsername: "a", outperformRatio: 1.2, viewCount: 9000, likeCount: 10, postedAt: "2026-07-18T00:00:00.000Z" });
  const b = reel({ igUsername: "b", outperformRatio: 6.0, viewCount: 1000, likeCount: 900, postedAt: "2026-07-01T00:00:00.000Z" });
  const c = reel({ igUsername: "c", outperformRatio: 3.0, viewCount: 5000, likeCount: 400, postedAt: "2026-07-10T00:00:00.000Z" });
  const input = [a, b, c];

  const names = (rs: ShowcaseReel[]) => rs.map((r) => r.igUsername);

  it("ranks by out-performance, not raw reach", () => {
    // This is the product's actual claim: a smaller reel that beat its own
    // account's median outranks a bigger one that didn't.
    expect(names(sortReels(input, "score"))).toEqual(["b", "c", "a"]);
  });

  it("sorts by views, likes and recency", () => {
    expect(names(sortReels(input, "views"))).toEqual(["a", "c", "b"]);
    expect(names(sortReels(input, "likes"))).toEqual(["b", "c", "a"]);
    expect(names(sortReels(input, "recent"))).toEqual(["a", "c", "b"]);
  });

  it("never mutates its input", () => {
    const before = names(input);
    sortReels(input, "views");
    expect(names(input)).toEqual(before);
  });

  it("tolerates a missing or unparseable date", () => {
    const undated = [reel({ igUsername: "x", postedAt: null }), reel({ igUsername: "y", postedAt: "not a date" }), a];
    expect(() => sortReels(undated, "recent")).not.toThrow();
    expect(sortReels(undated, "recent")[0].igUsername).toBe("a");
  });
});

describe("viralScore", () => {
  it("weights comments above likes above views", () => {
    expect(viralScore(reel({ likeCount: 0, commentCount: 0, viewCount: 100 }))).toBe(1);
    expect(viralScore(reel({ likeCount: 1, commentCount: 0, viewCount: 0 }))).toBe(1);
    expect(viralScore(reel({ likeCount: 0, commentCount: 1, viewCount: 0 }))).toBe(3);
  });
});

describe("reelKey", () => {
  it("distinguishes two reels from the same account", () => {
    const one = reel({ permalink: "https://instagram.com/reel/AAA/" });
    const two = reel({ permalink: "https://instagram.com/reel/BBB/" });
    expect(reelKey(one)).not.toBe(reelKey(two));
  });

  it("is stable across calls", () => {
    const r = reel();
    expect(reelKey(r)).toBe(reelKey(r));
  });
});

describe("fixtures", () => {
  it("fill every grid they back", () => {
    expect(SHOWCASE_FIXTURES.isDemo).toBe(true);
    expect(SHOWCASE_FIXTURES.niches.length).toBeGreaterThanOrEqual(3);
    for (const n of SHOWCASE_FIXTURES.niches) {
      expect(n.reels.length, n.niche).toBeGreaterThanOrEqual(8);
    }
  });

  // Fabricated engagement numbers must not be attributed to anyone real, and
  // no fixture should ship a link that implies it is live.
  it("carry no outbound links or thumbnails", () => {
    for (const n of SHOWCASE_FIXTURES.niches) {
      for (const r of n.reels) {
        expect(r.permalink).toBeNull();
        expect(r.thumbnailUrl).toBeNull();
      }
    }
  });

  it("produce a distinct key per reel", () => {
    for (const n of SHOWCASE_FIXTURES.niches) {
      const keys = n.reels.map(reelKey);
      expect(new Set(keys).size, n.niche).toBe(keys.length);
    }
  });
});
