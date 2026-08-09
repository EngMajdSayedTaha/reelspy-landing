import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import type { ReactElement } from "react";
import { getDictionary } from "@/lib/i18n";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/hero/Hero";
import { LogoStrip } from "@/components/landing/LogoStrip";
import { ProblemLoop } from "@/components/landing/ProblemLoop";
import { Features } from "@/components/landing/features/Features";
import { NicheRadar } from "@/components/landing/NicheRadar";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { Pricing } from "@/components/landing/pricing/Pricing";
import { BeforeAfter } from "@/components/landing/BeforeAfter";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import type { Plan } from "@/lib/plans/types";

const en = getDictionary("en");
const ar = getDictionary("ar");

// Every section, in both locales. The point is coverage of the whole page:
// a re-skin that breaks one section's markup should fail here rather than in
// a browser three commits later.
const SECTIONS: Array<[string, (dict: typeof en, locale: "en" | "ar") => ReactElement]> = [
  ["Nav", (d, l) => <Nav dict={d} locale={l} />],
  ["Hero", (d) => <Hero dict={d} />],
  ["LogoStrip", (d) => <LogoStrip dict={d} />],
  ["ProblemLoop", (d) => <ProblemLoop dict={d} />],
  ["Features", (d, l) => <Features dict={d} locale={l} />],
  ["NicheRadar", (d) => <NicheRadar dict={d} />],
  ["BentoGrid", (d) => <BentoGrid dict={d} />],
  ["Pricing", (d) => <Pricing dict={d} />],
  ["BeforeAfter", (d) => <BeforeAfter dict={d} />],
  ["FAQ", (d) => <FAQ dict={d} />],
  ["FinalCTA", (d) => <FinalCTA dict={d} />],
  ["Footer", (d, l) => <Footer dict={d} locale={l} />],
];

describe.each([
  ["en", en, "ltr"],
  ["ar", ar, "rtl"],
] as const)("sections render in %s", (locale, dict, dir) => {
  it.each(SECTIONS)("%s renders", (_name, node) => {
    const { container } = render(
      <div dir={dir}>{node(dict, locale as "en" | "ar")}</div>
    );
    expect(container.firstChild).toBeTruthy();
    expect(container.textContent?.trim().length ?? 0).toBeGreaterThan(0);
  });
});

describe("structural contracts", () => {
  it("the hero has exactly one h1 and it carries the headline", () => {
    render(<Hero dict={en} />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent?.trim().length ?? 0).toBeGreaterThan(10);
  });

  it("the hero's primary CTA points at signup", () => {
    const { container } = render(<Hero dict={en} />);
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/signup");
  });

  // These are the entry points into the dashboard zone. If a re-skin drops
  // one, the marketing site has no way in.
  it("the nav links to both login and signup", () => {
    const { container } = render(<Nav dict={en} locale="en" />);
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/login");
    expect(hrefs).toContain("/signup");
  });

  it("the footer links to all three legal pages, each carrying a return redirect", () => {
    const { container } = render(<Footer dict={en} locale="en" />);
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    // LegalLink resolves the bare path to a `?redirect=<here>` variant after
    // mount so the dashboard's Back control can return the visitor to the
    // landing page. In jsdom `window.location` is "/", so redirect=%2F.
    for (const base of ["/privacy", "/terms", "/cookies"]) {
      expect(hrefs).toContainEqual(expect.stringMatching(new RegExp(`^${base}\\?redirect=`)));
    }
  });

  // The FAQ must stay native <details> so it works without JS and keeps
  // feeding the FAQPage JSON-LD.
  it("the FAQ renders one native details per question", () => {
    const { container } = render(<FAQ dict={en} />);
    const details = container.querySelectorAll("details");
    expect(details).toHaveLength(en.faq.items.length);
    for (const d of details) expect(d.querySelector("summary")).toBeTruthy();
  });

  it("pricing renders every plan with a signup CTA", () => {
    const { container } = render(<Pricing dict={en} />);
    for (const plan of en.pricing.plans) {
      expect(screen.getAllByText(plan.name).length).toBeGreaterThan(0);
    }
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs.filter((h) => h === "/signup").length).toBeGreaterThanOrEqual(
      en.pricing.plans.length
    );
  });

  it("pricing reflects the admin catalog's badge, sale price and trial", () => {
    const plans: Plan[] = [
      {
        slug: "creator",
        kind: "fixed",
        sortOrder: 10,
        trialDays: 14,
        copy: {
          en: { name: "Creator", tagline: "For creators", highlights: ["30 accounts"], badge: "Most popular" },
          ar: { name: "Creator", tagline: "لصنّاع المحتوى", highlights: ["30 حسابًا"], badge: "الأكثر رواجًا" },
        },
        price: {
          currency: "aed",
          unitAmount: 4900,
          interval: "month",
          compareAtAmount: 7900,
          saleEndsAt: "2099-01-01T00:00:00.000Z",
        },
      },
    ];
    render(<Pricing dict={en} plans={plans} locale="en" />);
    // Badge drives the highlighted-card pill.
    expect(screen.getByText("Most popular")).toBeTruthy();
    // "Was" price struck through, current price shown plainly.
    expect(screen.getByText("79")).toBeTruthy();
    expect(screen.getByText("49")).toBeTruthy();
    // Sale + trial badges, matching the dashboard billing page's wording.
    expect(screen.getByText(/Save 38%/)).toBeTruthy();
    expect(screen.getByText("14-day free trial")).toBeTruthy();
  });

  it("renders the Arabic headline, not the English one", () => {
    const { container } = render(<div dir="rtl"><Hero dict={ar} /></div>);
    const h1 = within(container).getAllByRole("heading", { level: 1 })[0];
    expect(h1.textContent).toMatch(/[؀-ۿ]/);
  });
});
