// Shape of the public changelog served by the dashboard zone
// (app/api/public/changelog in the reelspy project). Declared independently
// here rather than imported, for the same reason as lib/showcase/types.ts: the
// two apps are separate deployments with separate builds, so this is a wire
// contract, not a shared type. The runtime guard in ./fetch is what enforces it.

export const CHANGE_KINDS = ["new", "improved", "fixed"] as const;
export type ChangeKind = (typeof CHANGE_KINDS)[number];

export type Localized = { en: string; ar: string };

export type Change = {
  kind: ChangeKind;
  text: Localized;
};

export type Release = {
  version: string;
  /** YYYY-MM-DD */
  date: string;
  title: Localized;
  summary: Localized;
  changes: Change[];
};

export type ChangelogData = {
  /** Newest first. Empty when the dashboard zone couldn't be reached. */
  releases: Release[];
  /** Current product version, or null when nothing could be loaded. */
  version: string | null;
};
