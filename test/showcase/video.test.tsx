import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { getDictionary } from "@/lib/i18n";
import { SHOWCASE_FIXTURES } from "@/lib/showcase/fixtures";
import { ReelCover } from "@/components/landing/showcase/ReelCover";
import { ReelWall } from "@/components/landing/showcase/ReelWall";
import { TrendingCard } from "@/components/landing/showcase/TrendingCard";
import { mockReducedMotion } from "../setup";
import type { ShowcaseReel } from "@/lib/showcase/types";

const en = getDictionary("en");
const base = SHOWCASE_FIXTURES.niches[0].reels[0];
const withVideo: ShowcaseReel = {
  ...base,
  thumbnailUrl: "https://cdn.example.com/a/cover.jpg",
  videoUrl: "https://cdn.example.com/a/reel.mp4",
};

describe("ReelCover video layer", () => {
  it("plays the reel when the payload has a video and the caller opts in", () => {
    const { container } = render(<ReelCover reel={withVideo} video />);
    const video = container.querySelector("video");
    expect(video).toBeTruthy();
    expect(video!.getAttribute("poster")).toBe(withVideo.thumbnailUrl);
  });

  // Sound is never wanted on this page: a wall of reels that all started
  // talking at once would be unusable — and an unmuted video is refused
  // autoplay outright, which would leave the card frozen on its poster.
  it("is muted, looping, inline and has no controls", () => {
    const { container } = render(<ReelCover reel={withVideo} video />);
    const video = container.querySelector("video")!;
    expect(video.muted).toBe(true);
    expect(video.volume).toBe(0);
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("playsinline");
    expect(video).not.toHaveAttribute("controls");
    // Decorative: the card around it carries the handle, metrics and link.
    expect(video).toHaveAttribute("aria-hidden", "true");
    expect(video.tabIndex).toBe(-1);
  });

  // The source is attached only once IntersectionObserver reports the card
  // near the viewport. The stub observer in test/setup never fires, which is
  // exactly the off-screen case: nothing should be downloading.
  it("attaches no source until the card approaches the viewport", () => {
    const { container } = render(<ReelCover reel={withVideo} video />);
    const video = container.querySelector("video")!;
    expect(video.getAttribute("src")).toBeNull();
    expect(video.getAttribute("preload")).toBe("none");
  });

  it("renders no video when the reel has none", () => {
    const { container } = render(<ReelCover reel={base} video />);
    expect(container.querySelector("video")).toBeNull();
  });

  it("renders no video unless the caller opts in", () => {
    const { container } = render(<ReelCover reel={withVideo} />);
    expect(container.querySelector("video")).toBeNull();
  });

  // The still underneath is a complete, informative frame, so reduced motion
  // gets it rather than a substitute.
  it("does not autoplay under prefers-reduced-motion", () => {
    mockReducedMotion(true);
    const { container } = render(<ReelCover reel={withVideo} video />);
    expect(container.querySelector("video")).toBeNull();
    mockReducedMotion(false);
  });

  it("keeps the still cover mounted underneath the video", () => {
    const { container } = render(<ReelCover reel={withVideo} video />);
    // A video that is slow, blocked or broken must reveal a real frame, not a
    // black rectangle — so the poster image stays in the tree either way.
    expect(container.querySelector("img")?.getAttribute("src")).toBe(withVideo.thumbnailUrl);
  });
});

describe("video placement across the section", () => {
  // A wall where only half the cards were ever allowed to play read as
  // broken, not as depth — every card plays its video when the reel has one,
  // on both rows.
  it("plays video on every row of the wall", () => {
    const reels = SHOWCASE_FIXTURES.niches
      .flatMap((n) => n.reels)
      .map((r) => ({ ...r, videoUrl: "https://cdn.example.com/r.mp4" }));
    const { container } = render(<ReelWall reels={reels} dict={en} />);
    const [front, back] = [...container.querySelectorAll<HTMLElement>(".lp-rail")];
    expect(front.querySelectorAll("video").length).toBe(front.children.length);
    expect(back.querySelectorAll("video").length).toBe(back.children.length);
  });

  // Nothing on the wall is clickable and the band never pauses, so a play
  // glyph sitting on top of it has no state to announce — it only ever reads
  // as a stray "unmute me" icon.
  it("never shows the play glyph on the wall", () => {
    const reels = SHOWCASE_FIXTURES.niches
      .flatMap((n) => n.reels)
      .map((r) => ({ ...r, videoUrl: "https://cdn.example.com/r.mp4" }));
    const { container } = render(<ReelWall reels={reels} dict={en} />);
    expect(container.querySelectorAll('svg[class*="lucide-play"]')).toHaveLength(0);
  });

  // The grid is for reading captions and numbers. Cards that each start
  // playing turn scanning into work.
  it("leaves the explorer grid on stills", () => {
    const { container } = render(<TrendingCard reel={withVideo} dict={en} />);
    expect(container.querySelector("video")).toBeNull();
  });
});
