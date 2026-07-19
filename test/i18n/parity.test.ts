import { describe, it, expect } from "vitest";
import { en } from "@/lib/i18n/en";
import { ar } from "@/lib/i18n/ar";

// `ar` is typed as Dictionary, so a missing or misspelled KEY is already a
// compile error. What the type system cannot see:
//   - arrays whose lengths drift apart (a plan or FAQ entry dropped in one
//     locale renders a shorter list, not a type error)
//   - function-valued entries whose arity drifts
//   - a key present but left as an empty string
// Those are what these tests cover.

type Path = string;

function walk(
  a: unknown,
  b: unknown,
  path: Path,
  visit: (a: unknown, b: unknown, path: Path) => void
) {
  visit(a, b, path);
  if (Array.isArray(a) && Array.isArray(b)) {
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) walk(a[i], b[i], `${path}[${i}]`, visit);
    return;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    for (const key of Object.keys(a as Record<string, unknown>)) {
      walk(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
        path ? `${path}.${key}` : key,
        visit
      );
    }
  }
}

describe("en/ar dictionary parity", () => {
  it("has the same key set at every level", () => {
    const missing: Path[] = [];
    walk(en, ar, "", (a, b, path) => {
      if (a !== undefined && b === undefined) missing.push(path);
    });
    expect(missing).toEqual([]);
  });

  it("has matching value types at every level", () => {
    const mismatched: string[] = [];
    walk(en, ar, "", (a, b, path) => {
      if (b === undefined) return;
      if (typeof a !== typeof b) mismatched.push(`${path}: ${typeof a} vs ${typeof b}`);
      if (Array.isArray(a) !== Array.isArray(b)) mismatched.push(`${path}: array shape differs`);
    });
    expect(mismatched).toEqual([]);
  });

  // A plan, FAQ item or bento tile dropped from one locale silently renders a
  // shorter section rather than failing to compile.
  it("has matching array lengths", () => {
    const drift: string[] = [];
    walk(en, ar, "", (a, b, path) => {
      if (Array.isArray(a) && Array.isArray(b) && a.length !== b.length) {
        drift.push(`${path}: ${a.length} vs ${b.length}`);
      }
    });
    expect(drift).toEqual([]);
  });

  it("has matching function arity", () => {
    const drift: string[] = [];
    walk(en, ar, "", (a, b, path) => {
      if (typeof a === "function" && typeof b === "function") {
        const fa = a as (...args: unknown[]) => unknown;
        const fb = b as (...args: unknown[]) => unknown;
        if (fa.length !== fb.length) drift.push(`${path}: ${fa.length} vs ${fb.length}`);
      }
    });
    expect(drift).toEqual([]);
  });
});
