"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { CompanyCard } from "@/components/company-card";
import {
  FilterBar,
  type FilterState,
} from "@/components/filters/filter-bar";

import {
  getHqGroup,
  HQ_GROUP_LABELS,
  type Company,
  type HqGroup,
} from "@/data/companies";
import { getRegionFromCountry, type Region } from "@/data/segments";
import { toUsdEquivalent } from "@/lib/fx";
import { cn } from "@/lib/utils";
import type { CompanyQuote, PricePoint } from "@/lib/yahoo";

interface HomeGridProps {
  companies: Company[];
  regionSharesByTicker: Record<string, Partial<Record<Region, number>>>;
  quotesByTicker: Record<string, CompanyQuote | null>;
  pricesByTicker: Record<string, PricePoint[]>;
  therapeuticAreasByTicker: Record<string, string[]>;
  taSharesByTicker: Record<string, Record<string, number>>;
  rdByTicker: Record<string, { absolute: number | null; pct: number | null }>;
  latestRevenueByTicker: Record<string, number | null>;
  netMarginByTicker: Record<string, number | null>;
}

export function HomeGrid({
  companies,
  regionSharesByTicker,
  quotesByTicker,
  pricesByTicker,
  therapeuticAreasByTicker,
  taSharesByTicker,
  rdByTicker,
  latestRevenueByTicker,
  netMarginByTicker,
}: HomeGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = useState<FilterState>(() => ({
    region: (searchParams.get("region") as FilterState["region"]) ?? "all",
    therapeuticArea: searchParams.get("ta") ?? "all",
    sort: (searchParams.get("sort") as FilterState["sort"]) ?? "none",
    hqRegion: (searchParams.get("hq") as FilterState["hqRegion"]) ?? "all",
  }));

  function updateFilters(next: FilterState) {
    setFilters(next);
    const params = new URLSearchParams();
    if (next.region !== "all") params.set("region", next.region);
    if (next.therapeuticArea !== "all") params.set("ta", next.therapeuticArea);
    if (next.sort !== "none") params.set("sort", next.sort);
    if (next.hqRegion !== "all") params.set("hq", next.hqRegion);
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  const allTherapeuticAreas = useMemo(() => {
    const set = new Set<string>();
    for (const c of companies) {
      for (const ta of therapeuticAreasByTicker[c.ticker] ?? []) {
        set.add(ta);
      }
    }
    return [...set].sort((a, b) => a.localeCompare(b, "nl"));
  }, [companies, therapeuticAreasByTicker]);

  const hqStats = useMemo(() => {
    const groups: HqGroup[] = ["us", "europe", "japan"];
    return Object.fromEntries(
      groups.map((group) => {
        const subset = companies.filter((c) => getHqGroup(c.country) === group);
        const rdPcts = subset
          .map((c) => rdByTicker[c.ticker]?.pct ?? null)
          .filter((p): p is number => p !== null);
        return [
          group,
          {
            count: subset.length,
            avgRd: rdPcts.length > 0
              ? rdPcts.reduce((a, b) => a + b, 0) / rdPcts.length
              : null,
          },
        ];
      }),
    ) as Record<HqGroup, { count: number; avgRd: number | null }>;
  }, [companies, rdByTicker]);

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
        const areas = therapeuticAreasByTicker[c.ticker] ?? [];
        return {
          company: c,
          explicitShare,
          fallbackMatches,
          taShare,
          areas,
        };
      })
      .filter((item) => {
        if (filters.region !== "all") {
          const hasExplicit = (item.explicitShare ?? 0) > 0;
          if (!hasExplicit && !item.fallbackMatches) return false;
        }
        if (
          filters.therapeuticArea !== "all" &&
          !item.areas.includes(filters.therapeuticArea)
        )
          return false;
        if (
          filters.hqRegion !== "all" &&
          getHqGroup(item.company.country) !== filters.hqRegion
        )
          return false;
        return true;
      })
      .sort((a, b) => {
        const alpha = a.company.shortName.localeCompare(b.company.shortName, "nl");

        if (filters.sort === "rd-pct" || filters.sort === "rd-absolute") {
          const aRd = rdByTicker[a.company.ticker];
          const bRd = rdByTicker[b.company.ticker];
          const av = filters.sort === "rd-pct" ? (aRd?.pct ?? -1) : (aRd?.absolute ?? -1);
          const bv = filters.sort === "rd-pct" ? (bRd?.pct ?? -1) : (bRd?.absolute ?? -1);
          return av !== bv ? bv - av : alpha;
        }

        if (filters.sort === "revenue") {
          const av = latestRevenueByTicker[a.company.ticker] ?? -1;
          const bv = latestRevenueByTicker[b.company.ticker] ?? -1;
          const ausd = toUsdEquivalent(av, a.company.currency);
          const busd = toUsdEquivalent(bv, b.company.currency);
          return ausd !== busd ? busd - ausd : alpha;
        }

        if (filters.sort === "marketcap") {
          const aq = quotesByTicker[a.company.ticker];
          const bq = quotesByTicker[b.company.ticker];
          const av = toUsdEquivalent(aq?.marketCap ?? -1, a.company.currency);
          const bv = toUsdEquivalent(bq?.marketCap ?? -1, b.company.currency);
          return av !== bv ? bv - av : alpha;
        }

        if (filters.sort === "price52w") {
          function get52w(ticker: string) {
            const closes = (pricesByTicker[ticker] ?? []).map((p) => p.close);
            if (closes.length < 2) return -Infinity;
            const first = closes[0];
            return first > 0 ? ((closes[closes.length - 1] / first - 1) * 100) : -Infinity;
          }
          const av = get52w(a.company.ticker);
          const bv = get52w(b.company.ticker);
          return av !== bv ? bv - av : alpha;
        }

        if (filters.sort === "netmargin") {
          const av = netMarginByTicker[a.company.ticker] ?? -Infinity;
          const bv = netMarginByTicker[b.company.ticker] ?? -Infinity;
          return av !== bv ? bv - av : alpha;
        }

        if (filters.therapeuticArea !== "all" && filters.region !== "all") {
          // Beide actief: sorteer op totale bedrijfsomzet
          const av = toUsdEquivalent(latestRevenueByTicker[a.company.ticker] ?? 0, a.company.currency);
          const bv = toUsdEquivalent(latestRevenueByTicker[b.company.ticker] ?? 0, b.company.currency);
          return av !== bv ? bv - av : alpha;
        }

        if (filters.therapeuticArea !== "all") {
          const aRev = latestRevenueByTicker[a.company.ticker] ?? 0;
          const bRev = latestRevenueByTicker[b.company.ticker] ?? 0;
          const av = a.taShare != null
            ? toUsdEquivalent((a.taShare / 100) * aRev, a.company.currency)
            : -1;
          const bv = b.taShare != null
            ? toUsdEquivalent((b.taShare / 100) * bRev, b.company.currency)
            : -1;
          return av !== bv ? bv - av : alpha;
        }

        if (filters.region !== "all") {
          const aRev = latestRevenueByTicker[a.company.ticker] ?? 0;
          const bRev = latestRevenueByTicker[b.company.ticker] ?? 0;
          const av = a.explicitShare != null
            ? toUsdEquivalent((a.explicitShare / 100) * aRev, a.company.currency)
            : -1;
          const bv = b.explicitShare != null
            ? toUsdEquivalent((b.explicitShare / 100) * bRev, b.company.currency)
            : -1;
          return av !== bv ? bv - av : alpha;
        }

        return alpha;
      });
  }, [
    companies,
    filters,
    regionSharesByTicker,
    quotesByTicker,
    pricesByTicker,
    therapeuticAreasByTicker,
    taSharesByTicker,
    rdByTicker,
    latestRevenueByTicker,
    netMarginByTicker,
  ]);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3">
        {(["us", "europe", "japan"] as const).map((group) => {
          const stat = hqStats[group];
          const isActive = filters.hqRegion === group;
          const isDefault = filters.hqRegion === "all";
          return (
            <motion.button
              key={group}
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              onClick={() =>
                updateFilters({
                  ...filters,
                  hqRegion: isActive ? "all" : group,
                  sort: isActive ? "none" : "rd-pct",
                })
              }
              className={cn(
                "flex flex-1 flex-col rounded-xl border px-4 py-3 text-left transition-colors sm:flex-none",
                isActive
                  ? "border-vig-orange bg-vig-orange/5 shadow-sm"
                  : isDefault
                    ? "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md"
                    : "border-zinc-100 bg-zinc-50 opacity-50 hover:opacity-75",
              )}
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {HQ_GROUP_LABELS[group]}
              </span>
              <span className="font-display mt-1 text-xl font-semibold tabular-nums text-vig-navy">
                {stat.avgRd !== null ? `${stat.avgRd.toFixed(1)}%` : "—"}
              </span>
              <span className="mt-0.5 text-[11px] text-zinc-400">
                gem. R&amp;D · {stat.count} bedrijven
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6">
        <FilterBar
          state={filters}
          onChange={updateFilters}
          therapeuticAreas={allTherapeuticAreas}
        />
      </div>

      <motion.div layout className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {items.map(({ company, explicitShare, taShare }) => (
            <motion.div
              key={company.ticker}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <CompanyCard
                company={company}
                regionShare={
                  filters.region !== "all" &&
                  explicitShare !== null &&
                  explicitShare > 0
                    ? {
                        region: filters.region as Region,
                        share: explicitShare,
                        absoluteRevenue:
                          latestRevenueByTicker[company.ticker] != null
                            ? (explicitShare / 100) * latestRevenueByTicker[company.ticker]!
                            : null,
                      }
                    : undefined
                }
                therapeuticAreaShare={
                  filters.therapeuticArea !== "all" && taShare !== null
                    ? {
                        name: filters.therapeuticArea,
                        share: taShare,
                        absoluteRevenue:
                          latestRevenueByTicker[company.ticker] != null
                            ? (taShare / 100) * latestRevenueByTicker[company.ticker]!
                            : null,
                      }
                    : undefined
                }
                highlight={
                  filters.sort === "rd-pct" ? "rd-pct"
                  : filters.sort === "rd-absolute" ? "rd-absolute"
                  : filters.sort === "revenue" ? "revenue"
                  : filters.sort === "marketcap" ? "marketcap"
                  : filters.sort === "price52w" ? "price52w"
                  : filters.sort === "netmargin" ? "netmargin"
                  : undefined
                }
                latestRevenue={latestRevenueByTicker[company.ticker] ?? null}
                netMargin={netMarginByTicker[company.ticker] ?? null}
                prices={pricesByTicker[company.ticker] ?? []}
                quote={quotesByTicker[company.ticker] ?? null}
                rd={rdByTicker[company.ticker] ?? { absolute: null, pct: null }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 flex h-32 items-center justify-center rounded-2xl border border-dashed border-zinc-200 text-sm text-zinc-500"
          >
            Geen bedrijven passen bij deze filters.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
