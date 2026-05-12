"use client";

"use client";

import { useMemo, useState } from "react";

import { CompanyCard } from "@/components/company-card";
import {
  FilterBar,
  type FilterState,
} from "@/components/filters/filter-bar";

import type { Company } from "@/data/companies";
import { getRegionFromCountry, type Region } from "@/data/segments";
import { classifyMarketCap } from "@/lib/fx";
import type { CompanyQuote, PricePoint } from "@/lib/yahoo";

interface HomeGridProps {
  companies: Company[];
  regionSharesByTicker: Record<string, Partial<Record<Region, number>>>;
  quotesByTicker: Record<string, CompanyQuote | null>;
  pricesByTicker: Record<string, PricePoint[]>;
  therapeuticAreasByTicker: Record<string, string[]>;
  taSharesByTicker: Record<string, Record<string, number>>;
  rdByTicker: Record<string, { absolute: number | null; pct: number | null }>;
}

export function HomeGrid({
  companies,
  regionSharesByTicker,
  quotesByTicker,
  pricesByTicker,
  therapeuticAreasByTicker,
  taSharesByTicker,
  rdByTicker,
}: HomeGridProps) {
  const [filters, setFilters] = useState<FilterState>({
    region: "all",
    marketCap: "all",
    therapeuticArea: "all",
    rdSort: "none",
  });

  const allTherapeuticAreas = useMemo(() => {
    const set = new Set<string>();
    for (const c of companies) {
      for (const ta of therapeuticAreasByTicker[c.ticker] ?? []) {
        set.add(ta);
      }
    }
    return [...set].sort((a, b) => a.localeCompare(b, "nl"));
  }, [companies, therapeuticAreasByTicker]);

  const items = useMemo(() => {
    return companies
      .map((c) => {
        const explicitShare =
          filters.region === "all"
            ? null
            : regionSharesByTicker[c.ticker]?.[filters.region as Region] ?? 0;
        const fallbackMatches =
          filters.region !== "all" &&
          getRegionFromCountry(c.country) === filters.region;
        const taShare =
          filters.therapeuticArea === "all"
            ? null
            : taSharesByTicker[c.ticker]?.[filters.therapeuticArea] ?? null;
        const quote = quotesByTicker[c.ticker];
        const band = classifyMarketCap(quote?.marketCap, c.currency);
        const areas = therapeuticAreasByTicker[c.ticker] ?? [];
        return {
          company: c,
          explicitShare,
          fallbackMatches,
          taShare,
          band,
          areas,
        };
      })
      .filter((item) => {
        if (filters.region !== "all") {
          const hasExplicit = (item.explicitShare ?? 0) > 0;
          if (!hasExplicit && !item.fallbackMatches) return false;
        }
        if (filters.marketCap !== "all" && item.band !== filters.marketCap)
          return false;
        if (
          filters.therapeuticArea !== "all" &&
          !item.areas.includes(filters.therapeuticArea)
        )
          return false;
        return true;
      })
      .sort((a, b) => {
        if (filters.rdSort !== "none") {
          const aRd = rdByTicker[a.company.ticker];
          const bRd = rdByTicker[b.company.ticker];
          const av = filters.rdSort === "pct" ? (aRd?.pct ?? -1) : (aRd?.absolute ?? -1);
          const bv = filters.rdSort === "pct" ? (bRd?.pct ?? -1) : (bRd?.absolute ?? -1);
          if (av !== bv) return bv - av;
          return a.company.shortName.localeCompare(b.company.shortName, "nl");
        }
        if (filters.therapeuticArea !== "all") {
          const av = a.taShare ?? -1;
          const bv = b.taShare ?? -1;
          if (av !== bv) return bv - av;
          return a.company.shortName.localeCompare(b.company.shortName, "nl");
        }
        if (filters.region !== "all") {
          const av = a.explicitShare ?? -1;
          const bv = b.explicitShare ?? -1;
          if (av !== bv) return bv - av;
          return a.company.shortName.localeCompare(b.company.shortName, "nl");
        }
        return a.company.shortName.localeCompare(b.company.shortName, "nl");
      });
  }, [
    companies,
    filters,
    regionSharesByTicker,
    quotesByTicker,
    therapeuticAreasByTicker,
    taSharesByTicker,
    rdByTicker,
  ]);

  return (
    <div>
      <FilterBar
        state={filters}
        onChange={setFilters}
        therapeuticAreas={allTherapeuticAreas}
      />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map(({ company, explicitShare, taShare }) => (
          <CompanyCard
            key={company.ticker}
            company={company}
            regionShare={
              filters.region !== "all" &&
              explicitShare !== null &&
              explicitShare > 0
                ? { region: filters.region as Region, share: explicitShare }
                : undefined
            }
            therapeuticAreaShare={
              filters.therapeuticArea !== "all" && taShare !== null
                ? { name: filters.therapeuticArea, share: taShare }
                : undefined
            }
            prices={pricesByTicker[company.ticker] ?? []}
            quote={quotesByTicker[company.ticker] ?? null}
            rd={rdByTicker[company.ticker] ?? { absolute: null, pct: null }}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="mt-6 flex h-32 items-center justify-center rounded-2xl border border-dashed border-zinc-200 text-sm text-zinc-500">
          Geen bedrijven passen bij deze filters.
        </div>
      )}
    </div>
  );
}
