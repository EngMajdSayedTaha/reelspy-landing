import { describe, it, expect, vi, afterEach } from "vitest";
import { getShowcase } from "@/lib/showcase/fetch";
import type { ShowcaseReel } from "@/lib/showcase/types";

// The only validated boundary in the project: the payload crosses a deployment
// boundary, so everything here is about what happens when the dashboard sends
// something this app didn't expect.

// fetchNiche requires MIN_REELS_PER_NICHE (4) or the niche falls back to its
// fixture, so every mock response has to clear that bar.
function reels(over: Partial<Record<string, unknown>> = {}) {
  return Array.from({ length: 5 }, (_, i) => ({
    igUsername: `creator${i}`,
    permalink: "https://www.instagram.com/reel/ABC/",
    caption: "hello",
    thumbnailUrl: "https://cdn.example.com/a.jpg",
    videoUrl: "https://cdn.example.com/a.mp4",
    viewCount: 10,
    likeCount: 5,
    commentCount: 1,
    postedAt: "2026-07-01T00:00:00.000Z",
    outperformRatio: 2,
    followers: 100,
    ...over,
  }));
}

function mockEndpoint(body: unknown, ok = true) {
  vi.stubEnv("DASHBOARD_URL", "https://dash.example.com");
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok, json: async () => body }) as unknown as Response)
  );
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

// The demo assertion is load-bearing, not incidental. Every fixture reel ships
// `permalink: null` and `videoUrl: null`, so a test that expects null after a
// bad URL would pass just as happily if the fetch had quietly fallen back to
// fixtures — proving nothing about the validator. Pinning isDemo false forces
// the assertion to be about the live payload.
async function firstReel(): Promise<ShowcaseReel> {
  const data = await getShowcase();
  expect(data.isDemo, "expected the mocked live payload, not the fixture fallback").toBe(false);
  return data.niches[0].reels[0];
}

describe("getShowcase URL handling", () => {
  it("passes through https media URLs", async () => {
    mockEndpoint({ reels: reels() });
    const reel = await firstReel();
    expect(reel.videoUrl).toBe("https://cdn.example.com/a.mp4");
    expect(reel.thumbnailUrl).toBe("https://cdn.example.com/a.jpg");
    expect(reel.permalink).toBe("https://www.instagram.com/reel/ABC/");
  });

  // permalink lands in an href. A javascript: value there executes on click,
  // so the scheme is checked rather than assumed.
  it("drops a javascript: permalink instead of rendering it", async () => {
    mockEndpoint({ reels: reels({ permalink: "javascript:alert(1)" }) });
    expect((await firstReel()).permalink).toBeNull();
  });

  it("drops non-http media URLs", async () => {
    mockEndpoint({
      reels: reels({ videoUrl: "data:video/mp4;base64,AAAA", thumbnailUrl: "file:///etc/passwd" }),
    });
    const reel = await firstReel();
    expect(reel.videoUrl).toBeNull();
    expect(reel.thumbnailUrl).toBeNull();
  });

  it("drops relative URLs, which this cross-deployment payload never sends", async () => {
    mockEndpoint({ reels: reels({ videoUrl: "/media/a.mp4" }) });
    expect((await firstReel()).videoUrl).toBeNull();
  });

  // The field does not exist on the endpoint yet. Its absence has to be a
  // plain null, not undefined leaking into `<video src>`.
  it("resolves a missing videoUrl to null", async () => {
    mockEndpoint({ reels: reels({ videoUrl: undefined }) });
    expect((await firstReel()).videoUrl).toBeNull();
  });

  it("resolves a non-string videoUrl to null", async () => {
    mockEndpoint({ reels: reels({ videoUrl: 42 }) });
    expect((await firstReel()).videoUrl).toBeNull();
  });
});

describe("getShowcase fallbacks", () => {
  it("falls back to labelled sample data when the endpoint fails", async () => {
    mockEndpoint({}, false);
    const data = await getShowcase();
    expect(data.isDemo).toBe(true);
    expect(data.niches.length).toBeGreaterThan(0);
  });

  it("falls back when the payload is the wrong shape", async () => {
    mockEndpoint({ reels: "not an array" });
    expect((await getShowcase()).isDemo).toBe(true);
  });

  it("falls back when a niche is too thin to fill a grid", async () => {
    mockEndpoint({ reels: reels().slice(0, 2) });
    expect((await getShowcase()).isDemo).toBe(true);
  });

  it("serves fixtures without calling out when DASHBOARD_URL is unset", async () => {
    const spy = vi.fn();
    vi.stubEnv("DASHBOARD_URL", "");
    vi.stubGlobal("fetch", spy);
    const data = await getShowcase();
    expect(spy).not.toHaveBeenCalled();
    expect(data.isDemo).toBe(true);
  });

  it("marks live data as live", async () => {
    mockEndpoint({ reels: reels() });
    expect((await getShowcase()).isDemo).toBe(false);
  });
});
