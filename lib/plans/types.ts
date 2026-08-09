export type PlanCopy = { name: string; tagline: string; highlights: string[]; badge: string | null };

export type Plan = {
  slug: string;
  kind: "free" | "fixed";
  sortOrder: number;
  copy: Record<"en" | "ar", PlanCopy>;
  price: { currency: string; unitAmount: number; interval: "month" | "year" } | null;
};
