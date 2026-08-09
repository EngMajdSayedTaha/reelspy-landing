export type PlanCopy = { name: string; tagline: string; highlights: string[]; badge: string | null };

export type PlanPrice = {
  currency: string;
  unitAmount: number;
  interval: "month" | "year";
  /** The struck-through "was" figure. Already null once the sale has ended. */
  compareAtAmount: number | null;
  saleEndsAt: string | null;
};

export type Plan = {
  slug: string;
  kind: "free" | "fixed";
  sortOrder: number;
  /** Days of free trial before billing starts. 0 = none. */
  trialDays: number;
  copy: Record<"en" | "ar", PlanCopy>;
  price: PlanPrice | null;
};
