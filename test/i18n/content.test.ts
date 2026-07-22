import { describe, it, expect } from "vitest";
import { en } from "@/lib/i18n/en";
import { ar } from "@/lib/i18n/ar";

// Terms that legitimately stay in Latin script in the Arabic dictionary:
// the brand, platform names, plan tiers, model names and the language toggle's
// own label. Everything else should actually be Arabic — a key left in English
// is the most common way a translation regresses.
const LATIN_ALLOWED = [
  "ReelSpy",
  "Instagram",
  "TikTok",
  "YouTube",
  "Facebook",
  "Claude",
  "Sonnet",
  "Opus",
  "Supabase",
  "Vercel",
  "Stripe",
  "Creator",
  "Pro",
  "Studio",
  "Free",
  "English",
  "AED",
];

const ARABIC = /[؀-ۿ]/;

// Paths that are NOT prose and so are exempt from the checks below:
//  - meta.* are HTML attribute values (lang="ar", dir="rtl")
//  - the BYO sliders are unitless counts, so a blank unit suffix is correct
//  - features.f3.demo.scripts.en[*] are the English sample scripts the demo
//    types out (Gulf/MSA voice slots); their Arabic counterparts live in
//    scripts.ar[*], so these stay Latin in both dictionaries by design
const NOT_PROSE = [
  /^meta\./,
  /^pricing\.byoSliders\[\d+\]\.unit$/,
  /^features\.f3\.demo\.scripts\.en\[/,
];

function isProse(path: string): boolean {
  return !NOT_PROSE.some((re) => re.test(path));
}

function leaves(node: unknown, path = ""): Array<[string, string]> {
  if (typeof node === "string") return [[path, node]];
  if (Array.isArray(node)) return node.flatMap((v, i) => leaves(v, `${path}[${i}]`));
  if (node && typeof node === "object") {
    return Object.entries(node as Record<string, unknown>).flatMap(([k, v]) =>
      leaves(v, path ? `${path}.${k}` : k)
    );
  }
  return [];
}

describe("dictionary content", () => {
  it.each([
    ["en", en],
    ["ar", ar],
  ])("%s has no empty strings", (_name, dict) => {
    const empty = leaves(dict)
      .filter(([path]) => isProse(path))
      .filter(([, value]) => value.trim() === "")
      .map(([path]) => path);
    expect(empty).toEqual([]);
  });

  it("ar leaves are actually in Arabic", () => {
    // Strip the allowed Latin terms, then anything left with Latin letters and
    // no Arabic script is an untranslated string.
    const untranslated = leaves(ar)
      .filter(([path]) => isProse(path))
      .filter(([, value]) => {
        let rest = value;
        for (const term of LATIN_ALLOWED) rest = rest.split(term).join("");
        const hasLatinWord = /[A-Za-z]{3,}/.test(rest);
        return hasLatinWord && !ARABIC.test(rest);
      })
      .map(([path, value]) => `${path}: ${value}`);
    expect(untranslated).toEqual([]);
  });
});
