// Ruwe statische FX-koersen naar USD. ALLEEN voor interne vergelijkingen
// (bv. markt­waarde-filter). NIET gebruikt voor weergegeven bedragen.
// Werk jaarlijks bij.
export const TO_USD: Record<string, number> = {
  USD: 1,
  EUR: 1.05,
  CHF: 1.1,
  DKK: 0.14,
  JPY: 0.0067,
};

export function toUsdEquivalent(value: number, currency: string): number {
  const rate = TO_USD[currency] ?? 1;
  return value * rate;
}

export type MarketCapBand = "all" | "mega" | "large" | "mid";

export function classifyMarketCap(
  marketCap: number | null | undefined,
  currency: string,
): MarketCapBand {
  if (marketCap === null || marketCap === undefined || !Number.isFinite(marketCap)) {
    return "mid";
  }
  const usd = toUsdEquivalent(marketCap, currency);
  if (usd >= 400e9) return "mega";
  if (usd >= 150e9) return "large";
  return "mid";
}

export const MARKET_CAP_LABELS: Record<MarketCapBand, string> = {
  all: "Alle",
  mega: "Mega cap (> $400B)",
  large: "Large cap ($150B – $400B)",
  mid: "Mid cap (< $150B)",
};
