// Pluralization for the showcase's relative dates.
//
// This is a plain function the client component imports directly, rather than
// a function stored in the dictionary. Dictionary entries are passed from a
// server component into a client one, and functions can't cross that boundary
// — so the dictionary holds the plural FORMS and this picks between them.

export type DayLabels = {
  today: string;
  one: string;
  two: string;
  few: string;
  many: string;
};

/**
 * Arabic agrees nouns with number in four shapes, not two: a dual for exactly
 * two, the plural for 3–10, and the accusative singular from 11 up. Picking
 * only singular/plural produces "قبل 2 أيام" and "قبل 15 أيام", both wrong.
 * English collapses to one/other, which these same buckets express fine.
 */
export function formatDaysAgo(days: number, labels: DayLabels): string {
  const n = Math.max(0, Math.floor(days));
  if (n === 0) return labels.today;
  if (n === 1) return labels.one;
  if (n === 2) return labels.two;
  const form = n <= 10 ? labels.few : labels.many;
  return form.replace("{n}", String(n));
}
