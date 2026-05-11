import { HeroPattern } from "@/components/hero-pattern";
import { HomeGrid } from "@/components/home-grid";
import { companies } from "@/data/companies";
import {
  ALL_REGIONS,
  getLatestSegments,
  type Region,
} from "@/data/segments";
import { annualRevenueSeries } from "@/lib/aggregate";
import { toUsdEquivalent } from "@/lib/fx";
import { formatCurrencyCompact } from "@/lib/format";
import {
  getHistoricalPrices52w,
  getIncomeStatementAnnual,
  getQuote,
  type CompanyQuote,
  type PricePoint,
} from "@/lib/yahoo";

export const revalidate = 43200;

export default async function HomePage() {
  const regionSharesByTicker: Record<
    string,
    Partial<Record<Region, number>>
  > = {};
  const therapeuticAreasByTicker: Record<string, string[]> = {};
  for (const c of companies) {
    const latest = getLatestSegments(c.ticker);
    const shares: Partial<Record<Region, number>> = {};
    const areas: string[] = [];
    if (latest) {
      for (const region of ALL_REGIONS) {
        const found = latest.geographicSegments.find(
          (g) => g.region === region,
        );
        if (found) shares[region] = found.revenueShare;
      }
      for (const ta of latest.therapeuticAreas) {
        if (ta.revenueShare > 0) areas.push(ta.name);
      }
    }
    regionSharesByTicker[c.ticker] = shares;
    therapeuticAreasByTicker[c.ticker] = areas;
  }

  const results = await Promise.all(
    companies.map(async (c) => {
      const [annual, quote, prices] = await Promise.all([
        getIncomeStatementAnnual(c.ticker),
        getQuote(c.ticker),
        getHistoricalPrices52w(c.ticker),
      ]);
      return {
        ticker: c.ticker,
        revenueSeries: annualRevenueSeries(annual),
        quote,
        prices,
      };
    }),
  );

  const revenueSeriesByTicker: Record<string, number[]> = {};
  const quotesByTicker: Record<string, CompanyQuote | null> = {};
  const pricesByTicker: Record<string, PricePoint[]> = {};
  for (const r of results) {
    revenueSeriesByTicker[r.ticker] = r.revenueSeries;
    quotesByTicker[r.ticker] = r.quote;
    pricesByTicker[r.ticker] = r.prices;
  }

  const latestByCurrency = new Map<string, number>();
  for (const c of companies) {
    const series = revenueSeriesByTicker[c.ticker];
    const latestRevenue = series[series.length - 1];
    if (latestRevenue !== undefined) {
      latestByCurrency.set(
        c.currency,
        (latestByCurrency.get(c.currency) ?? 0) + latestRevenue,
      );
    }
  }

  return (
    <div className="relative">
      <HeroPattern />
      <section className="max-w-3xl">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-vig-orange" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-vig-orange">
            Vereniging Innovatieve Geneesmiddelen
          </p>
        </div>
        <h1 className="font-display mt-5 text-5xl font-semibold tracking-tight text-vig-navy sm:text-6xl sm:leading-[1.05]">
          Beursgenoteerde leden, in één oogopslag.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
          Financiële kerncijfers, ziektegebieden en geografische omzet­verdeling
          van de beursgenoteerde leden van de VIG. Cijfers in eigen valuta.
        </p>
      </section>

      <section className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-zinc-200/70 bg-zinc-200/60 sm:grid-cols-3">
        <Stat label="Leden" value={String(companies.length)} sublabel="In dit dashboard" />
        <Stat
          label="Beurzen & valuta's"
          value={`${new Set(companies.map((c) => c.exchange)).size} · ${new Set(companies.map((c) => c.currency)).size}`}
          sublabel="Verspreid over markten"
        />
        <Stat
          label="Gecombineerde omzet (jaar)"
          value={renderCombinedRevenue(latestByCurrency)}
          sublabel="Som laatste jaarcijfers, eigen valuta"
        />
      </section>

      <section className="mt-16">
        <HomeGrid
          companies={companies}
          regionSharesByTicker={regionSharesByTicker}
          quotesByTicker={quotesByTicker}
          pricesByTicker={pricesByTicker}
          therapeuticAreasByTicker={therapeuticAreasByTicker}
        />
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="bg-white px-6 py-5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="font-display mt-2 text-2xl font-semibold tabular-nums tracking-tight text-vig-navy">
        {value}
      </p>
      {sublabel && (
        <p className="mt-1 text-xs text-zinc-500">{sublabel}</p>
      )}
    </div>
  );
}

function renderCombinedRevenue(byCurrency: Map<string, number>): string {
  const entries = Array.from(byCurrency.entries());
  if (entries.length === 0) return "—";
  return entries
    .sort(
      (a, b) =>
        toUsdEquivalent(b[1], b[0]) - toUsdEquivalent(a[1], a[0]),
    )
    .map(([cur, sum]) => formatCurrencyCompact(sum, cur))
    .join(" · ");
}
