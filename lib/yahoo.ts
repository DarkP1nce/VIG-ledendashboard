import YahooFinance from "yahoo-finance2";
import { unstable_cache } from "next/cache";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

const TWELVE_HOURS = 60 * 60 * 12;
const FIVE_YEARS_MS = 5 * 365 * 24 * 60 * 60 * 1000;

export interface CompanyQuote {
  symbol: string;
  longName: string | null;
  shortName: string | null;
  currency: string | null;
  regularMarketPrice: number | null;
  regularMarketChange: number | null;
  regularMarketChangePercent: number | null;
  marketCap: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  exchange: string | null;
}

export interface IncomeStatementPeriod {
  endDate: string;
  revenue: number | null;
  costOfRevenue: number | null;
  grossProfit: number | null;
  operatingIncome: number | null;
  netIncome: number | null;
  ebitda: number | null;
  basicEps: number | null;
  dilutedEps: number | null;
  researchAndDevelopment: number | null;
}

function n(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (v && typeof v === "object" && "raw" in (v as Record<string, unknown>)) {
    const raw = (v as { raw: unknown }).raw;
    if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  }
  return null;
}

function isoDate(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "string") return v.slice(0, 10);
  if (typeof v === "number") return new Date(v).toISOString().slice(0, 10);
  return "";
}

async function fetchQuote(ticker: string): Promise<CompanyQuote | null> {
  try {
    const q = await yahooFinance.quote(
      ticker,
      {},
      { validateResult: false },
    );
    if (!q || typeof q !== "object" || !("symbol" in q)) return null;
    return {
      symbol: q.symbol,
      longName: q.longName ?? null,
      shortName: q.shortName ?? null,
      currency: q.currency ?? null,
      regularMarketPrice: q.regularMarketPrice ?? null,
      regularMarketChange: q.regularMarketChange ?? null,
      regularMarketChangePercent: q.regularMarketChangePercent ?? null,
      marketCap: q.marketCap ?? null,
      fiftyTwoWeekHigh: q.fiftyTwoWeekHigh ?? null,
      fiftyTwoWeekLow: q.fiftyTwoWeekLow ?? null,
      exchange: q.fullExchangeName ?? q.exchange ?? null,
    };
  } catch (err) {
    console.error(`yahoo.quote failed for ${ticker}:`, err);
    return null;
  }
}

async function fetchIncomeStatement(
  ticker: string,
  type: "annual" | "quarterly",
): Promise<IncomeStatementPeriod[]> {
  const period2 = new Date();
  const period1 = new Date(period2.getTime() - FIVE_YEARS_MS);

  let result: Array<Record<string, unknown>> = [];
  try {
    result = (await yahooFinance.fundamentalsTimeSeries(
      ticker,
      {
        period1,
        period2,
        type,
        module: "financials",
      },
      { validateResult: false },
    )) as Array<Record<string, unknown>>;
  } catch (err) {
    console.error(`yahoo.fundamentalsTimeSeries failed for ${ticker} (${type}):`, err);
    return [];
  }

  if (!Array.isArray(result)) return [];

  return result
    .map((row) => ({
      endDate: isoDate(row.date),
      revenue: n(row.totalRevenue),
      costOfRevenue: n(row.costOfRevenue),
      grossProfit: n(row.grossProfit),
      operatingIncome: n(row.operatingIncome),
      netIncome: n(row.netIncome),
      ebitda: n(row.EBITDA) ?? n(row.normalizedEBITDA),
      basicEps: n(row.basicEPS),
      dilutedEps: n(row.dilutedEPS),
      researchAndDevelopment: n(row.researchAndDevelopment),
    }))
    .filter((p) => p.endDate)
    .sort((a, b) => a.endDate.localeCompare(b.endDate));
}

export const getQuote = unstable_cache(
  fetchQuote,
  ["yahoo-quote"],
  { revalidate: TWELVE_HOURS, tags: ["yahoo"] },
);

export const getIncomeStatementAnnual = unstable_cache(
  async (ticker: string) => fetchIncomeStatement(ticker, "annual"),
  ["yahoo-income-annual"],
  { revalidate: TWELVE_HOURS, tags: ["yahoo"] },
);

export const getIncomeStatementQuarterly = unstable_cache(
  async (ticker: string) => fetchIncomeStatement(ticker, "quarterly"),
  ["yahoo-income-quarterly"],
  { revalidate: TWELVE_HOURS, tags: ["yahoo"] },
);

export interface PricePoint {
  date: string;
  close: number;
}

async function fetchHistoricalCloses(
  ticker: string,
  weeks: number,
): Promise<PricePoint[]> {
  const period2 = new Date();
  const period1 = new Date(
    period2.getTime() - weeks * 7 * 24 * 60 * 60 * 1000,
  );
  try {
    const result = (await yahooFinance.chart(
      ticker,
      {
        period1,
        period2,
        interval: "1wk",
      },
      { validateResult: false },
    )) as { quotes?: Array<{ date: Date | string; close: number | null }> };

    const quotes = Array.isArray(result?.quotes) ? result.quotes : [];
    return quotes
      .filter((r) => typeof r.close === "number" && Number.isFinite(r.close))
      .map((r) => ({
        date: isoDate(r.date),
        close: r.close as number,
      }))
      .filter((r) => r.date)
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (err) {
    console.error(`yahoo.chart failed for ${ticker}:`, err);
    return [];
  }
}

export const getHistoricalPrices52w = unstable_cache(
  async (ticker: string) => fetchHistoricalCloses(ticker, 52),
  ["yahoo-historical-52w"],
  { revalidate: TWELVE_HOURS, tags: ["yahoo"] },
);
