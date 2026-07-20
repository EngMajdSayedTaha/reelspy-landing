"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal]";

/**
 * The single owner of scroll-reveal state for the whole page.
 *
 * This used to live inside <Reveal>, one IntersectionObserver per wrapper. That
 * had a silent failure mode: the hidden state in globals.css keys off the bare
 * `[data-reveal]` attribute, but only a <Reveal> *root* ever got `data-visible`.
 * Any element that carried the attribute without being a Reveal root — a bare
 * one used for a stagger delay, or a child nested under a Reveal — was hidden by
 * the CSS and then never revealed by anything. It didn't animate badly; it was
 * invisible forever (the hero eyebrow and the five ProblemLoop pain cards).
 *
 * Observing by selector at the document level removes that class of bug: an
 * element cannot opt into the hidden state without also being observed. It's
 * also one observer instead of ~46.
 */
export function RevealEngine() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      for (const el of document.querySelectorAll(SELECTOR)) {
        el.setAttribute("data-visible", "true");
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.setAttribute("data-visible", "true");
            // Re-arming reveals are opt-in; everything else settles once.
            if (el.dataset.revealOnce !== "false") observer.unobserve(el);
          } else if (el.dataset.revealOnce === "false") {
            el.setAttribute("data-visible", "false");
          }
        }
      },
      // threshold 0 + a bottom inset, rather than a ratio. A ratio can never be
      // met by an element taller than the viewport (max ratio = vh/height), which
      // is exactly the case for the tall pricing and FAQ blocks on a phone.
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );

    const seen = new WeakSet<Element>();
    const observeAll = () => {
      for (const el of document.querySelectorAll(SELECTOR)) {
        if (seen.has(el)) continue;
        seen.add(el);
        observer.observe(el);
      }
    };

    observeAll();

    // Client sections (the trending explorer swaps its grid on tab change) mount
    // reveal targets after hydration.
    const mutations = new MutationObserver(observeAll);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
