import { describe, it, expect, vi, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { HeroArt } from "@/components/landing/hero/HeroArt";
import { getDictionary } from "@/lib/i18n";
import { mockReducedMotion } from "../setup";

const t = getDictionary("en").hero;
const LABELS = {
  viral: t.cardViralScore,
  above: t.cardAbove,
  rising: t.cardRising,
  goingViral: t.cardGoingViral,
};

// HeroArt is the most machinery-heavy component on the page: a cursor-tilt
// animation loop, a card-cycling interval and an IntersectionObserver that
// pauses both. These tests guard the lifecycle — a leaked interval or a
// listener left on a torn-down node is invisible in a browser until the page
// has been open for a while.

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("HeroArt", () => {
  it("mounts and unmounts without throwing", () => {
    const { unmount } = render(<HeroArt labels={LABELS} />);
    expect(() => unmount()).not.toThrow();
  });

  it("is hidden from assistive tech (it is decorative)", () => {
    const { container } = render(<HeroArt labels={LABELS} />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });

  it("clears its cycling interval on unmount", () => {
    vi.useFakeTimers();
    const { unmount } = render(<HeroArt labels={LABELS} />);
    const before = vi.getTimerCount();
    unmount();
    expect(vi.getTimerCount()).toBeLessThanOrEqual(before);
    // Advancing well past the cycle period must not schedule work on the
    // unmounted tree (React would warn / throw on a state update).
    expect(() => act(() => void vi.advanceTimersByTime(20_000))).not.toThrow();
  });

  it("renders under prefers-reduced-motion", () => {
    mockReducedMotion(true);
    expect(() => render(<HeroArt labels={LABELS} />)).not.toThrow();
  });

  it("renders on a touch device (no hover pointer, so no tilt loop)", () => {
    (window.matchMedia as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (query: string) => ({
        matches: query.includes("hover: none"),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })
    );
    expect(() => render(<HeroArt labels={LABELS} />)).not.toThrow();
  });
});
