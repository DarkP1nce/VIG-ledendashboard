import type { IncomeStatementPeriod } from "@/lib/yahoo";

export function pickLatestAndPriorAnnual(
  annual: IncomeStatementPeriod[],
): { latest: IncomeStatementPeriod | null; prior: IncomeStatementPeriod | null } {
  const valid = annual.filter((p) => p.revenue !== null);
  const sorted = [...valid].sort((a, b) => b.endDate.localeCompare(a.endDate));
  const latest = sorted[0] ?? null;
  const latestYear = latest
    ? new Date(latest.endDate).getUTCFullYear()
    : null;
  const prior =
    latestYear !== null
      ? sorted.find(
          (p) => new Date(p.endDate).getUTCFullYear() === latestYear - 1,
        ) ?? null
      : null;
  return { latest, prior };
}

export function yoyPercent(
  latest: number | null | undefined,
  prior: number | null | undefined,
): number | null {
  if (
    latest === null ||
    latest === undefined ||
    prior === null ||
    prior === undefined ||
    prior === 0
  ) {
    return null;
  }
  return (latest / prior - 1) * 100;
}

export function ttmSum(
  quarterly: IncomeStatementPeriod[],
  field: "revenue" | "netIncome",
): number | null {
  const valid = quarterly.filter((q) => q[field] !== null);
  const last4 = valid.slice(-4);
  if (last4.length === 0) return null;
  return last4.reduce((s, q) => s + (q[field] ?? 0), 0);
}

export function annualRevenueSeries(
  annual: IncomeStatementPeriod[],
): number[] {
  return annual
    .filter((p) => p.revenue !== null)
    .sort((a, b) => a.endDate.localeCompare(b.endDate))
    .map((p) => p.revenue as number);
}
