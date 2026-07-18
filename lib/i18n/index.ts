import { en, type Dictionary } from "./en";
import { ar } from "./ar";
import { normalizeLocale, type Locale } from "./config";

const DICTIONARIES: Record<Locale, Dictionary> = { en, ar };

export function getDictionary(locale: string | undefined | null): Dictionary {
  return DICTIONARIES[normalizeLocale(locale)];
}

export type { Dictionary } from "./en";
export * from "./config";
