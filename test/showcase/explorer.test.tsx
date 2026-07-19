import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getDictionary } from "@/lib/i18n";
import { SHOWCASE_FIXTURES } from "@/lib/showcase/fixtures";
import { TrendingExplorer } from "@/components/landing/showcase/TrendingExplorer";
import type { ShowcaseData } from "@/lib/showcase/types";

const en = getDictionary("en");
const ar = getDictionary("ar");

function usernames(container: HTMLElement): string[] {
  return [...container.querySelectorAll("article")].map(
    (a) => a.querySelector("[dir='ltr']")?.textContent?.trim() ?? ""
  );
}

describe("TrendingExplorer", () => {
  it("renders the first niche's reels", () => {
    const { container } = render(<TrendingExplorer data={SHOWCASE_FIXTURES} dict={en} />);
    expect(container.querySelectorAll("article")).toHaveLength(
      SHOWCASE_FIXTURES.niches[0].reels.length
    );
  });

  it("switches niche when a tab is clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(<TrendingExplorer data={SHOWCASE_FIXTURES} dict={en} />);
    const before = usernames(container);

    await user.click(screen.getByRole("tab", { name: en.showcase.niches.food }));

    expect(usernames(container)).not.toEqual(before);
    expect(screen.getByRole("tab", { name: en.showcase.niches.food })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("reorders the grid when the sort changes", async () => {
    const user = userEvent.setup();
    const { container } = render(<TrendingExplorer data={SHOWCASE_FIXTURES} dict={en} />);
    const byScore = usernames(container);

    await user.click(screen.getByRole("button", { name: en.showcase.sorts.recent }));
    const byRecent = usernames(container);

    expect(byRecent).not.toEqual(byScore);
    // Same reels, different order — nothing should appear or vanish.
    expect([...byRecent].sort()).toEqual([...byScore].sort());
  });

  it("discloses when it is showing sample data", () => {
    render(<TrendingExplorer data={SHOWCASE_FIXTURES} dict={en} />);
    expect(screen.getByText(en.showcase.demoNote)).toBeInTheDocument();
  });

  it("says nothing about sample data when the reels are live", () => {
    const live: ShowcaseData = { ...SHOWCASE_FIXTURES, isDemo: false };
    render(<TrendingExplorer data={live} dict={en} />);
    expect(screen.queryByText(en.showcase.demoNote)).not.toBeInTheDocument();
  });

  it("renders an empty niche without crashing", () => {
    const empty: ShowcaseData = { isDemo: false, niches: [{ niche: "fitness", reels: [] }] };
    render(<TrendingExplorer data={empty} dict={en} />);
    expect(screen.getByText(en.showcase.empty)).toBeInTheDocument();
  });

  it("renders in Arabic", () => {
    const { container } = render(
      <div dir="rtl">
        <TrendingExplorer data={SHOWCASE_FIXTURES} dict={ar} />
      </div>
    );
    expect(within(container).getByText(ar.showcase.demoNote)).toBeInTheDocument();
    expect(within(container).getByRole("tab", { name: ar.showcase.niches.fitness })).toBeInTheDocument();
  });

  // Outbound links to someone else's Instagram post must not leak referrer or
  // pass ranking signal.
  it("marks outbound reel links safely", () => {
    const withLinks: ShowcaseData = {
      isDemo: false,
      niches: [
        {
          niche: "fitness",
          reels: [
            { ...SHOWCASE_FIXTURES.niches[0].reels[0], permalink: "https://www.instagram.com/reel/AAA/" },
          ],
        },
      ],
    };
    const { container } = render(<TrendingExplorer data={withLinks} dict={en} />);
    const link = container.querySelector('a[target="_blank"]');
    expect(link).toBeTruthy();
    expect(link!.getAttribute("rel")).toContain("noopener");
    expect(link!.getAttribute("rel")).toContain("nofollow");
  });
});
