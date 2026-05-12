import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ComparisonView } from "@/components/compare/comparison-view";
import type { CompanyAnnualPoint } from "@/components/compare/indexed-revenue-chart";
import { companies } from "@/data/companies";
import {
  ALL_REGIONS,
  getLatestSegments,
  type Region,
} from "@/data/segments";
import { getIncomeStatementAnnual, getQuote } from "@/lib/yahoo";
import type { CompanyQuote } from "@/lib/yahoo";


export const revalidate = 43200;

export default async function ComparePage() {
  const results = await Promise.all(
    companies.map(async (c) => {
      const [annual, quote] = await Promise.all([
        getIncomeStatementAnnual(c.ticker),
        getQuote(c.ticker),
      ]);
      const annualPoints: CompanyAnnualPoint[] = annual.map((p) => ({
        endDate: p.endDate,
        revenue: p.revenue,
        netIncome: p.netIncome,
      }));
      const latestAnnual = [...annual]
        .filter((p) => p.revenue !== null)
        .sort((a, b) => b.endDate.localeCompare(a.endDate))[0] ?? null;
      return {
        ticker: c.ticker,
        annual: annualPoints,
        quote,
        rdAbsolute: latestAnnual?.researchAndDevelopment ?? null,
        rdRevenue: latestAnnual?.revenue ?? null,
      };
    }),
  );

  const annualByTicker: Record<string, CompanyAnnualPoint[]> = {};
  const quoteByTicker: Record<string, CompanyQuote | null> = {};
  const rdByTicker: Record<string, { absolute: number | null; pct: number | null }> = {};
  for (const r of results) {
    annualByTicker[r.ticker] = r.annual;
    quoteByTicker[r.ticker] = r.quote;
    rdByTicker[r.ticker] = {
      absolute: r.rdAbsolute,
      pct:
        r.rdAbsolute !== null && r.rdRevenue !== null && r.rdRevenue > 0
          ? (r.rdAbsolute / r.rdRevenue) * 100
          : null,
    };
  }

  const regionSharesByTicker: Record<
    string,
    Partial<Record<Region, number>>
  > = {};
  for (const c of companies) {
    const latest = getLatestSegments(c.ticker);
    const shares: Partial<Record<Region, number>> = {};
    if (latest) {
      for (const region of ALL_REGIONS) {
        const found = latest.geographicSegments.find(
          (g) => g.region === region,
        );
        if (found) shares[region] = found.revenueShare;
      }
    }
    regionSharesByTicker[c.ticker] = shares;
  }

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-vig-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Terug naar overzicht
      </Link>

      <header className="mt-8 max-w-3xl">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-vig-orange" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-vig-orange">
            Vergelijken
          </p>
        </div>
        <h1 className="font-display mt-5 text-5xl font-semibold tracking-tight text-vig-navy sm:text-6xl sm:leading-[1.05]">
          Bedrijven naast elkaar.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
          Vergelijk omzetgroei (geïndexeerd, cross-currency) en kerncijfers
          tussen de beursgenoteerde VIG-leden. Klik een bedrijf aan of uit om
          de grafiek aan te passen.
        </p>
      </header>

      <div className="mt-12">
        <ComparisonView
          companies={companies}
          annualByTicker={annualByTicker}
          quoteByTicker={quoteByTicker}
          regionSharesByTicker={regionSharesByTicker}
          rdByTicker={rdByTicker}
        />
      </div>

    </div>
  );
}
