import { AnimatedStat } from "@/components/animated-stat";
import { HeroPattern } from "@/components/hero-pattern";
import { HomeGrid } from "@/components/home-grid";
import { WorldMap } from "@/components/world-map";
import { companies } from "@/data/companies";
import {
  ALL_REGIONS,
  getLatestSegments,
  normalizeTherapeuticArea,
  type Region,
} from "@/data/segments";
import { annualRevenueSeries } from "@/lib/aggregate";
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
  const taSharesByTicker: Record<string, Record<string, number>> = {};
  for (const c of companies) {
    const latest = getLatestSegments(c.ticker);
    const shares: Partial<Record<Region, number>> = {};
    const areas: string[] = [];
    const taShares: Record<string, number> = {};
    if (latest) {
      for (const region of ALL_REGIONS) {
        const found = latest.geographicSegments.find(
          (g) => g.region === region,
        );
        if (found) shares[region] = found.revenueShare;
      }
      for (const ta of latest.therapeuticAreas) {
        if (ta.revenueShare > 0) {
          const normalized = normalizeTherapeuticArea(ta.name);
          if (!areas.includes(normalized)) areas.push(normalized);
          taShares[normalized] = (taShares[normalized] ?? 0) + ta.revenueShare;
        }
      }
    }
    regionSharesByTicker[c.ticker] = shares;
    therapeuticAreasByTicker[c.ticker] = areas;
    taSharesByTicker[c.ticker] = taShares;
  }

  const results = await Promise.all(
    companies.map(async (c) => {
      const [annual, quote, prices] = await Promise.all([
        getIncomeStatementAnnual(c.ticker),
        getQuote(c.ticker),
        getHistoricalPrices52w(c.ticker),
      ]);
      const latestAnnual = [...annual]
        .filter((p) => p.revenue !== null)
        .sort((a, b) => b.endDate.localeCompare(a.endDate))[0] ?? null;
      return {
        ticker: c.ticker,
        revenueSeries: annualRevenueSeries(annual),
        quote,
        prices,
        rdAbsolute: latestAnnual?.researchAndDevelopment ?? null,
        rdRevenue: latestAnnual?.revenue ?? null,
      };
    }),
  );

  const revenueSeriesByTicker: Record<string, number[]> = {};
  const quotesByTicker: Record<string, CompanyQuote | null> = {};
  const pricesByTicker: Record<string, PricePoint[]> = {};
  const rdByTicker: Record<string, { absolute: number | null; pct: number | null }> = {};
  for (const r of results) {
    revenueSeriesByTicker[r.ticker] = r.revenueSeries;
    quotesByTicker[r.ticker] = r.quote;
    pricesByTicker[r.ticker] = r.prices;
    rdByTicker[r.ticker] = {
      absolute: r.rdAbsolute,
      pct:
        r.rdAbsolute !== null && r.rdRevenue !== null && r.rdRevenue > 0
          ? (r.rdAbsolute / r.rdRevenue) * 100
          : null,
    };
  }

  const rdPcts = Object.values(rdByTicker)
    .map((r) => r.pct)
    .filter((p): p is number => p !== null);
  const avgRdPct = rdPcts.length > 0
    ? rdPcts.reduce((a, b) => a + b, 0) / rdPcts.length
    : 0;
  const numCountries = new Set(companies.map((c) => c.country)).size;

  return (
    <div className="relative">
      <HeroPattern />
      <section className="mx-auto max-w-3xl text-center">
        <div className="flex items-center justify-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-vig-orange">
            Vereniging Innovatieve Geneesmiddelen
          </p>
        </div>
        <h1 className="font-display mt-5 text-5xl font-semibold tracking-tight text-vig-navy sm:text-6xl sm:leading-[1.05]">
          VIG Ledendashboard
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
          Financieel overzicht van de beursgenoteerde leden van de Vereniging Innovatieve Geneesmiddelen. Omzet, nettowinst, R&amp;D-investeringen en geografische omzetverdeling, per kwartaal en per jaar, rechtstreeks uit de markt.
        </p>
      </section>

      <section className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-8 border-t border-zinc-100 pt-10">
        <AnimatedStat
          value={companies.length}
          label="Beursgenoteerde leden"
          sublabel="In dit dashboard"
        />
        <AnimatedStat
          value={avgRdPct}
          suffix="%"
          decimals={1}
          label="Gemiddelde R&D-intensiteit"
          sublabel="Percentage van de omzet"
        />
        <AnimatedStat
          value={numCountries}
          label="Landen vertegenwoordigd"
          sublabel="VS, Europa en Japan"
        />
      </section>

      <section className="mt-10">
        <WorldMap companies={companies} />
      </section>

      <section className="mt-16">
        <HomeGrid
          companies={companies}
          regionSharesByTicker={regionSharesByTicker}
          quotesByTicker={quotesByTicker}
          pricesByTicker={pricesByTicker}
          therapeuticAreasByTicker={therapeuticAreasByTicker}
          taSharesByTicker={taSharesByTicker}
          rdByTicker={rdByTicker}
        />
      </section>
    </div>
  );
}

