import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { getDictionary } from "@/lib/i18n";
import { SHOWCASE_FIXTURES } from "@/lib/showcase/fixtures";
import { ReelWall } from "@/components/landing/showcase/ReelWall";

const en = getDictionary("en");
const ar = getDictionary("ar");
const reels = SHOWCASE_FIXTURES.niches.flatMap((n) => n.reels);

function rails(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(".lp-rail")];
}

// A per-card fingerprint. The first `dir="ltr"` node in a wall card is the
// out-performance multiple on a hot card and the @handle on a quiet one —
// either way it is stable for a given reel, which is all these assertions need.
function cardKeys(rail: HTMLElement): string[] {
  return [...rail.children].map((c) => c.querySelector("[dir='ltr']")?.textContent ?? "");
}

describe("ReelWall", () => {
  it("renders two rails", () => {
    const { container } = render(<ReelWall reels={reels} dict={en} />);
    expect(rails(container)).toHaveLength(2);
  });

  // THE invariant. The rail animates a fixed -50% (or +50% in RTL), which only
  // lands seamlessly if the track holds each row's cards exactly twice. Any
  // change that renders the second copy conditionally, dedupes it, or appends a
  // stray child breaks the loop — the wall visibly snaps once per lap. It is
  // not something a screenshot review would catch, so it is asserted here.
  it("renders each rail's cards exactly twice, in the same order", () => {
    const { container } = render(<ReelWall reels={reels} dict={en} />);
    for (const rail of rails(container)) {
      const keys = cardKeys(rail);
      expect(keys.length).toBeGreaterThan(0);
      expect(keys.filter((k) => k === "")).toHaveLength(0);
      expect(keys.length % 2).toBe(0);
      const half = keys.length / 2;
      expect(keys.slice(0, half)).toEqual(keys.slice(half));
    }
  });

  // Spacing has to live on each card's own padding. A flex `gap` would make the
  // track 2N·W + (2N−1)·G wide, so half of it is one gap short of the content
  // width and -50% lands off by that much — a drift that compounds every lap.
  it("spaces cards with padding, never a flex gap", () => {
    const { container } = render(<ReelWall reels={reels} dict={en} />);
    for (const rail of rails(container)) {
      expect(rail.className).not.toMatch(/\bgap-/);
      for (const child of rail.children) {
        expect(child.className).toMatch(/px-/);
      }
    }
  });

  // The band is playback, not a carousel: it must not stop under the cursor.
  it("never pauses on hover or focus", () => {
    const { container } = render(<ReelWall reels={reels} dict={en} />);
    for (const rail of rails(container)) {
      expect(rail.className).not.toMatch(/lp-marquee/);
      expect(rail.getAttribute("style") ?? "").not.toMatch(/animation-play-state/);
    }
  });

  // `transform` is physical, so an RTL track has to travel the other way or it
  // walks straight off the left edge of the viewport and never comes back.
  it("runs the mirrored keyframe under RTL", () => {
    const { container: ltr } = render(<ReelWall reels={reels} dict={en} />);
    for (const rail of rails(ltr)) {
      expect(rail.style.animationName).toBe("lp-rail-run");
    }
    const { container: rtl } = render(<ReelWall reels={reels} dict={ar} rtl />);
    for (const rail of rails(rtl)) {
      expect(rail.style.animationName).toBe("lp-rail-run-rtl");
    }
  });

  it("gives the two rows different speeds and opposite directions", () => {
    const { container } = render(<ReelWall reels={reels} dict={en} />);
    const [front, back] = rails(container);
    expect(front.style.animationDirection).not.toBe(back.style.animationDirection);
    expect(front.style.getPropertyValue("--rail-dur")).not.toBe(
      back.style.getPropertyValue("--rail-dur")
    );
  });

  // The rail is decorative; the explorer below it renders the same reels as
  // real content. A screen reader gets one sentence instead of ~48 cards.
  it("is hidden from assistive tech behind a single description", () => {
    const { container } = render(<ReelWall reels={reels} dict={en} />);
    expect(container.querySelector(".sr-only")?.textContent).toBe(en.showcase.wallLabel);
    expect(container.querySelector("[aria-hidden='true']")).toBeTruthy();
  });

  // Slicing the sorted list in half would put every high performer on the top
  // row and every quiet reel on the bottom, so the two rows would read as
  // different quality tiers rather than as one wall.
  it("splits every reel across the two rows without dropping or repeating any", () => {
    const { container } = render(<ReelWall reels={reels} dict={en} />);
    const [front, back] = rails(container);
    // Each rail holds its share twice, so half of each is the real row size.
    expect(front.children.length / 2 + back.children.length / 2).toBe(reels.length);
    expect(front.children.length).toBeGreaterThan(0);
    expect(back.children.length).toBeGreaterThan(0);
  });

  it("renders nothing when there are no reels", () => {
    const { container } = render(<ReelWall reels={[]} dict={en} />);
    expect(container.firstChild).toBeNull();
  });
});
