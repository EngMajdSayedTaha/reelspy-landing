import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getDictionary } from "@/lib/i18n";
import { Hero } from "@/components/landing/hero/Hero";
import { Nav } from "@/components/landing/Nav";
import { Pricing } from "@/components/landing/pricing/Pricing";
import { WaitlistProvider } from "@/components/landing/waitlist/WaitlistProvider";

const en = getDictionary("en");

function withWaitlist(node: React.ReactElement, enabled: boolean) {
  return (
    <WaitlistProvider enabled={enabled} total={128} copy={en.waitlist} locale="en">
      {node}
    </WaitlistProvider>
  );
}

// The whole point of intercepting in CTALink rather than at each call site is
// that sections nobody touched are covered too. These tests pin that: the same
// unmodified Hero/Nav/Pricing components change behaviour purely from context.
describe("closed-beta CTA interception", () => {
  it("leaves signup CTAs alone when the waiting list is off", () => {
    const { container } = render(withWaitlist(<Hero dict={en} />, false));
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/signup");
    expect(screen.queryByText(en.waitlist.cta)).toBeNull();
  });

  it("turns every signup CTA into a waiting-list button when it's on", () => {
    const { container } = render(withWaitlist(<Pricing dict={en} />, true));
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).not.toContain("/signup");
    // One per plan card, plus the build-your-own teaser.
    expect(screen.getAllByRole("button", { name: en.waitlist.cta }).length).toBeGreaterThanOrEqual(
      en.pricing.plans.length
    );
  });

  it("keeps the login link — existing users must still be able to get in", () => {
    const { container } = render(withWaitlist(<Nav dict={en} locale="en" />, true));
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/login");
    expect(hrefs).not.toContain("/signup");
  });

  it("opens the join dialog when a CTA is pressed", async () => {
    const user = userEvent.setup();
    render(withWaitlist(<Hero dict={en} />, true));

    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getAllByRole("button", { name: en.waitlist.cta })[0]);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeTruthy();
    // Email is the only required field — the rest sit behind the disclosure.
    expect(screen.getByLabelText(en.waitlist.emailLabel)).toBeTruthy();
    expect(screen.queryByLabelText(en.waitlist.nicheLabel)).toBeNull();
  });
});
