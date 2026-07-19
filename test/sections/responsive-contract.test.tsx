import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { getDictionary } from "@/lib/i18n";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { Pricing } from "@/components/landing/pricing/Pricing";
import { HeroArt } from "@/components/landing/hero/HeroArt";
import { ProblemLoop } from "@/components/landing/ProblemLoop";

// Class-contract tests. They assert the *layout decisions* that keep the page
// usable at every width, so a future refactor can restructure the markup but
// can't quietly delete a breakpoint tier. They're a cheap stand-in for the
// browser checks that actually caught these problems.

const en = getDictionary("en");

const t = en.hero;
const HERO_LABELS = {
  viral: t.cardViralScore,
  above: t.cardAbove,
  rising: t.cardRising,
  goingViral: t.cardGoingViral,
};

function classesOf(container: HTMLElement): string {
  return [...container.querySelectorAll("*")]
    .map((el) => el.getAttribute("class") ?? "")
    .join(" ");
}

describe("BentoGrid", () => {
  // It used to jump 1 → 4 columns at the sm breakpoint, so between roughly
  // 640px and 1024px four tiles (two of them double-wide) shared one row and
  // the text inside them was unreadable.
  it("has an intermediate column tier between one and four", () => {
    const { container } = render(<BentoGrid dict={en} />);
    const grid = container.querySelector('[class*="grid-cols-1"]');
    expect(grid, "expected a grid container").toBeTruthy();
    const cls = grid!.getAttribute("class") ?? "";
    expect(cls).toMatch(/sm:grid-cols-2|md:grid-cols-2/);
    expect(cls).toMatch(/lg:grid-cols-4|md:grid-cols-4/);
  });
});

describe("Pricing", () => {
  // Four plans can't fit side by side on a phone; the mobile treatment is a
  // snap carousel rather than a squeeze.
  it("keeps the mobile snap carousel", () => {
    const { container } = render(<Pricing dict={en} />);
    expect(classesOf(container)).toMatch(/snap-x|snap-mandatory/);
  });
});

describe("HeroArt", () => {
  // A fixed pixel height plus absolutely positioned 290px cards overflowed
  // narrow phones. The container now derives its height from an aspect ratio
  // and the cards are width-clamped.
  it("does not pin its height to fixed pixels", () => {
    const { container } = render(<HeroArt labels={HERO_LABELS} />);
    const cls = classesOf(container);
    expect(cls).not.toMatch(/h-\[\d+px\]/);
    expect(cls).toMatch(/aspect-\[/);
  });

  it("clamps card width instead of hardcoding it", () => {
    const { container } = render(<HeroArt labels={HERO_LABELS} />);
    expect(classesOf(container)).not.toMatch(/w-\[290px\]/);
  });
});

describe("ProblemLoop", () => {
  // The circular loop diagram positions its nodes absolutely; below the sm
  // breakpoint they overlapped, so a plain list takes over there.
  it("offers a non-diagram layout on small screens", () => {
    const { container } = render(<ProblemLoop dict={en} />);
    const cls = classesOf(container);
    expect(cls).toMatch(/sm:hidden/);
    expect(cls).toMatch(/hidden sm:|sm:block|sm:grid|sm:flex/);
  });
});
