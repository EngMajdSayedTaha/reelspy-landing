import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom ships none of the observer/media APIs the animated sections reach for
// on mount (HeroArt's tilt + card cycling, Reveal's scroll gating, Nav's
// scroll state, CTALink's magnetic hover). Without these stubs every section
// test would fail on a missing global rather than on a real regression.

// Reports "no match" for every query, which is the honest jsdom answer: no
// hover pointer, no reduced-motion preference, no viewport width. Individual
// tests override this when they need the reduced-motion branch.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// The language toggle calls useRouter().refresh() to re-render the server
// components in the new locale. Outside a Next app there is no router context,
// so stub the hooks the landing actually uses.
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

class MockObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = "";
  thresholds: number[] = [];
}

vi.stubGlobal("IntersectionObserver", MockObserver);
vi.stubGlobal("ResizeObserver", MockObserver);

// jsdom implements neither, and the Pricing carousel + Nav sheet call them.
Element.prototype.scrollTo = Element.prototype.scrollTo ?? vi.fn();
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView ?? vi.fn();

afterEach(() => {
  cleanup();
});

// Helper for tests that need to assert the reduced-motion code path.
export function mockReducedMotion(reduced: boolean) {
  (window.matchMedia as unknown as ReturnType<typeof vi.fn>).mockImplementation((query: string) => ({
    matches: reduced && query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}
