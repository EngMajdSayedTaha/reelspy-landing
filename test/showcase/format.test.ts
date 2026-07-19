import { describe, it, expect } from "vitest";
import { formatDaysAgo } from "@/lib/showcase/format";
import { en } from "@/lib/i18n/en";
import { ar } from "@/lib/i18n/ar";

describe("formatDaysAgo", () => {
  it("reads correctly in English", () => {
    expect(formatDaysAgo(0, en.showcase.day)).toBe("today");
    expect(formatDaysAgo(1, en.showcase.day)).toBe("1 day ago");
    expect(formatDaysAgo(5, en.showcase.day)).toBe("5 days ago");
    expect(formatDaysAgo(30, en.showcase.day)).toBe("30 days ago");
  });

  // Arabic agrees nouns with number in four shapes. Getting this wrong is the
  // most visible kind of localization bug — it's in every card.
  it("uses the right Arabic form for each bucket", () => {
    expect(formatDaysAgo(0, ar.showcase.day)).toBe("اليوم");
    expect(formatDaysAgo(1, ar.showcase.day)).toBe("قبل يوم");
    expect(formatDaysAgo(2, ar.showcase.day)).toBe("قبل يومين"); // dual, not "2 أيام"
    expect(formatDaysAgo(7, ar.showcase.day)).toBe("قبل 7 أيام"); // 3–10 plural
    expect(formatDaysAgo(15, ar.showcase.day)).toBe("قبل 15 يومًا"); // 11+ singular
  });

  it("interpolates every placeholder", () => {
    for (const dict of [en, ar]) {
      for (const n of [3, 10, 11, 99]) {
        expect(formatDaysAgo(n, dict.showcase.day)).not.toContain("{n}");
      }
    }
  });

  it("clamps nonsense input", () => {
    expect(formatDaysAgo(-5, en.showcase.day)).toBe("today");
    expect(formatDaysAgo(3.7, en.showcase.day)).toBe("3 days ago");
  });
});

// The showcase dictionary is handed from a server component to a client one.
// React cannot serialize a function across that boundary, and it fails at
// request time with a 500 — not at build time, and not in a test that renders
// the client component directly. This is the guard for that.
describe("client-component serializability", () => {
  function functionPaths(node: unknown, path = ""): string[] {
    if (typeof node === "function") return [path];
    if (Array.isArray(node)) return node.flatMap((v, i) => functionPaths(v, `${path}[${i}]`));
    if (node && typeof node === "object") {
      return Object.entries(node as Record<string, unknown>).flatMap(([k, v]) =>
        functionPaths(v, path ? `${path}.${k}` : k)
      );
    }
    return [];
  }

  it.each([
    ["en", en],
    ["ar", ar],
  ])("%s showcase namespace contains no functions", (_name, dict) => {
    expect(functionPaths(dict.showcase)).toEqual([]);
  });

  it.each([
    ["en", en],
    ["ar", ar],
  ])("%s showcase namespace survives a JSON round-trip", (_name, dict) => {
    expect(JSON.parse(JSON.stringify(dict.showcase))).toEqual(dict.showcase);
  });
});
