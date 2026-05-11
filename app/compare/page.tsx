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
      return { ticker: c.ticker, annual: annualPoints, quote };
    }),
  );

  const annualByTicker: Record<string, CompanyAnnualPoint[]> = {};
  const quoteByTicker: Record<string, CompanyQuote | null> = {};
  for (const r of results) {
    annualByTicker[r.ticker] = r.annual;
    quoteByTicker[r.ticker] = r.quote;
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
        />
      </div>

      <section className="mt-12 rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-8">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-vig-orange" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-vig-orange">
            Volgende stap
          </p>
        </div>
        <h2 className="font-display mt-3 text-2xl font-semibold tracking-tight text-vig-navy">
          Markt­aandeel per ziekte­gebied
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
          Stacked-bar­grafiek die per ziektegebied (Oncologie, Immunologie, …)
          toont welk bedrijf welk aandeel had. Vraagt extra invoer­data:
          omzet per therapeutisch gebied per bedrijf per jaar.
          Dat kun je handmatig invullen in <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs">data/segments.ts</code>{" "}
          door percentages om te zetten naar absolute bedragen, of via een
          nieuw bestand <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs">data/therapeutic-market-share.ts</code>.
        </p>
      </section>
    </div>
  );
}
