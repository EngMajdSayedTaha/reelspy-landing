import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
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

  // Regression test for the reported bug: an already-approved applicant who
  // (re-)submits their email used to land on static "you're on the list" text
  // with nothing to click — the real account form was unreachable, because
  // /signup always shows the join form while the gate is on. The fix is a
  // dedicated "approved" outcome with a CTA into /signup?email=, which
  // app/signup/page.tsx verifies server-side before granting the real form.
  describe("re-submitting an already-approved email", () => {
    // vi.restoreAllMocks(), not vi.unstubAllGlobals(): the latter also wipes
    // the IntersectionObserver/ResizeObserver stubs test/setup.ts installs
    // once at module load (not per-test), which would break every later test
    // in this file that renders an animated section.
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("offers a way into the real account form instead of a dead end", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify({ ok: true, alreadyOnList: true, queueNumber: 12, status: "approved" }), {
          status: 200,
        })
      );

      const user = userEvent.setup();
      render(withWaitlist(<Hero dict={en} />, true));
      await user.click(screen.getAllByRole("button", { name: en.waitlist.cta })[0]);

      const dialog = within(await screen.findByRole("dialog"));
      // cta and submit share the same copy ("Join the waiting list"), so the
      // opener button behind the overlay still matches by name — scope every
      // query below to the dialog itself.
      await user.type(dialog.getByLabelText(en.waitlist.emailLabel), "approved@example.com");
      await user.click(dialog.getByRole("button", { name: en.waitlist.submit }));

      expect(await dialog.findByText(en.waitlist.approvedTitle)).toBeTruthy();
      const cta = dialog.getByRole("link", { name: en.waitlist.approvedCta });
      expect(cta.getAttribute("href")).toBe("/signup?email=approved%40example.com");
    });
  });

  // Regression test for the second reported bug: re-submitting a REJECTED
  // email used to fall through to the generic "you're already on the list —
  // we'll email you when access opens" text, which is actively wrong — it
  // promises an email that will never arrive and implies they're still
  // waiting on a decision that was already made.
  describe("re-submitting a rejected email", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("says so honestly instead of implying they're still waiting", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify({ ok: true, alreadyOnList: true, queueNumber: 12, status: "rejected" }), {
          status: 200,
        })
      );

      const user = userEvent.setup();
      render(withWaitlist(<Hero dict={en} />, true));
      await user.click(screen.getAllByRole("button", { name: en.waitlist.cta })[0]);

      const dialog = within(await screen.findByRole("dialog"));
      await user.type(dialog.getByLabelText(en.waitlist.emailLabel), "rejected@example.com");
      await user.click(dialog.getByRole("button", { name: en.waitlist.submit }));

      expect(await dialog.findByText(en.waitlist.rejectedTitle)).toBeTruthy();
      expect(dialog.queryByText(en.waitlist.alreadyTitle)).toBeNull();
      expect(dialog.queryByText(/we'll email you when access opens/i)).toBeNull();
    });
  });
});
