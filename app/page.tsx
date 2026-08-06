import { cookies } from "next/headers";
import { getDictionary } from "@/lib/i18n";
import { LOCALE_COOKIE, normalizeLocale } from "@/lib/i18n/config";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/hero/Hero";
import { LogoStrip } from "@/components/landing/LogoStrip";
import { ProblemLoop } from "@/components/landing/ProblemLoop";
import { Features } from "@/components/landing/features/Features";
import { LiveTrending } from "@/components/landing/showcase/LiveTrending";
import { NicheRadar } from "@/components/landing/NicheRadar";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { Pricing } from "@/components/landing/pricing/Pricing";
import { BeforeAfter } from "@/components/landing/BeforeAfter";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { WaitlistProvider } from "@/components/landing/waitlist/WaitlistProvider";
import { getWaitlistState } from "@/lib/waitlist";

function jsonLd() {
  const en = getDictionary("en");
  const application = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description:
      "ReelSpy tracks the creators you admire, ranks which reels are over-performing right now, writes original AI scripts in your voice, and publishes straight to Instagram, with TikTok, YouTube & Facebook coming soon.",
    offers: en.pricing.plans.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.price,
      priceCurrency: "AED",
    })),
  };
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: en.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return [application, organization, faq];
}

export default async function LandingPage() {
  const cookieStore = await cookies();
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const dict = getDictionary(locale);
  // Closed-beta state, read from the dashboard at render (cached 60s, fails to
  // "off"). When it's on, every /signup CTA below becomes "Join the waiting
  // list" and opens the dialog — see components/ui/CTALink.tsx.
  const waitlist = await getWaitlistState();

  return (
    <WaitlistProvider
      enabled={waitlist.enabled}
      total={waitlist.total}
      copy={dict.waitlist}
      locale={locale}
    >
      <a href="#top" className="skip-link">
        Skip to content
      </a>
      <Nav dict={dict} locale={locale} />
      <main>
        <Hero dict={dict} locale={locale} />
        <LogoStrip dict={dict} />
        <ProblemLoop dict={dict} />
        <Features dict={dict} locale={locale} />
        <LiveTrending dict={dict} />
        <NicheRadar dict={dict} />
        <BentoGrid dict={dict} />
        <Pricing dict={dict} />
        <BeforeAfter dict={dict} />
        <FAQ dict={dict} />
        <FinalCTA dict={dict} />
      </main>
      <Footer dict={dict} locale={locale} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
    </WaitlistProvider>
  );
}
