"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Sparkline } from "@/components/charts/sparkline";
import { CompanyMonogram } from "@/components/company-monogram";
import { Card } from "@/components/ui/card";
import type { Company } from "@/data/companies";
import { REGION_LABELS_NL, type Region } from "@/data/segments";
import { formatCurrencyCompact, formatCurrencyPrice, formatPercentChange } from "@/lib/format";
import type { CompanyQuote, PricePoint } from "@/lib/yahoo";
import { cn } from "@/lib/utils";
import { useDisplayCurrency } from "@/lib/currency-context";
import { convertAmount } from "@/lib/fx";

export type HighlightMode = "rd-pct" | "rd-absolute" | "revenue" | "marketcap" | "price52w" | "netmargin";

interface CompanyCardProps {
  company: Company;
  regionShare?: { region: Region; share: number; absoluteRevenue: number | null };
  therapeuticAreaShare?: { name: string; share: number; absoluteRevenue: number | null };
  highlight?: HighlightMode;
  latestRevenue?: number | null;
  netMargin?: number | null;
  prices?: PricePoint[];
  quote?: CompanyQuote | null;
  rd?: { absolute: number | null; pct: number | null };
}

export function CompanyCard({
  company,
  regionShare,
  therapeuticAreaShare,
  highlight,
  latestRevenue = null,
  netMargin = null,
  prices = [],
  quote = null,
  rd,
}: CompanyCardProps) {
  const { displayCurrency } = useDisplayCurrency();

  function fmtAmount(value: number | null, fromCurrency: string) {
    if (value === null) return "—";
    const { amount, currency } = convertAmount(value, fromCurrency, displayCurrency);
    return formatCurrencyCompact(amount, currency);
  }

  const closes = prices.map((p) => p.close);
  const firstClose = closes[0];
  const lastClose = closes[closes.length - 1];
  const yearChange =
    firstClose && lastClose && firstClose > 0
      ? (lastClose / firstClose - 1) * 100
      : null;
  const positiveYear = (yearChange ?? 0) >= 0;
  const currentPrice = quote?.regularMarketPrice ?? lastClose ?? null;

  return (
    <Link href={`/company/${company.slug}`} className="group block">
      <Card
        className="flex h-full flex-col border-zinc-200/70 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_18px_44px_-20px_rgba(11,46,74,0.25)]"
        style={{ borderTopWidth: 3, borderTopColor: company.color }}
      >
        <div className="flex items-start">
          <CompanyMonogram company={company} size="lg" />
        </div>

        <div className="mt-5">
          <h2 className="font-display text-xl font-semibold tracking-tight text-vig-navy">
            {company.shortName}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">{company.headquarters}</p>
        </div>

        {(regionShare || therapeuticAreaShare || highlight) && (() => {
          // Sort highlight tile
          type TileStyle = { bg: string; label: string; text: string };
          const ORANGE: TileStyle = { bg: "bg-gradient-to-br from-vig-orange-soft/10 to-vig-orange/5", label: "text-vig-orange-dark", text: "text-vig-navy" };
          const VIOLET: TileStyle = { bg: "bg-violet-50/70", label: "text-violet-500", text: "text-vig-navy" };
          const GREEN: TileStyle  = { bg: "bg-emerald-50/80", label: "text-emerald-700", text: "text-emerald-800" };
          const RED: TileStyle    = { bg: "bg-rose-50/80",    label: "text-rose-700",    text: "text-rose-800" };

          let sortLabel = "";
          let sortValue = "";
          let sortStyle: TileStyle = ORANGE;

          if (highlight === "rd-pct") {
            sortLabel = "R&D / omzet";
            sortValue = rd?.pct != null ? `${rd.pct.toFixed(1)}%` : "—";
            sortStyle = VIOLET;
          } else if (highlight === "rd-absolute") {
            sortLabel = "R&D absoluut";
            sortValue = fmtAmount(rd?.absolute ?? null, company.currency);
            sortStyle = VIOLET;
          } else if (highlight === "revenue") {
            sortLabel = "Omzet";
            sortValue = fmtAmount(latestRevenue, company.currency);
            sortStyle = ORANGE;
          } else if (highlight === "marketcap") {
            sortLabel = "Marktwaarde";
            sortValue = fmtAmount(quote?.marketCap ?? null, company.currency);
            sortStyle = ORANGE;
          } else if (highlight === "price52w") {
            sortLabel = "Koerswijziging 52w";
            sortValue = yearChange != null ? formatPercentChange(yearChange) : "—";
            sortStyle = (yearChange ?? 0) >= 0 ? GREEN : RED;
          } else if (highlight === "netmargin") {
            sortLabel = "Nettomarge";
            sortValue = netMargin != null ? `${netMargin.toFixed(1)}%` : "—";
            sortStyle = (netMargin ?? 0) >= 0 ? GREEN : RED;
          }

          // Both filters active — show each dimension separately + disclaimer
          if (regionShare && therapeuticAreaShare) {
            return (
              <div className="mt-5 space-y-1.5">
                <div className="rounded-lg bg-gradient-to-r from-vig-orange-soft/10 to-vig-orange/5 px-3 py-2.5">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-vig-orange-dark">
                    Omzet {REGION_LABELS_NL[regionShare.region]}
                  </p>
                  <p className="mt-0.5 font-display text-xl font-semibold tabular-nums tracking-tight text-vig-navy">
                    {regionShare.share}%
                  </p>
                  {regionShare.absoluteRevenue !== null && (
                    <p className="mt-0.5 text-xs text-zinc-400">
                      ≈ {fmtAmount(regionShare.absoluteRevenue, company.currency)}
                    </p>
                  )}
                </div>
                <div className="rounded-lg bg-violet-50/70 px-3 py-2.5">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-violet-500">
                    Omzet {therapeuticAreaShare.name}
                  </p>
                  <p className="mt-0.5 font-display text-xl font-semibold tabular-nums tracking-tight text-vig-navy">
                    {therapeuticAreaShare.share}%
                  </p>
                  {therapeuticAreaShare.absoluteRevenue !== null && (
                    <p className="mt-0.5 text-xs text-zinc-400">
                      ≈ {fmtAmount(therapeuticAreaShare.absoluteRevenue, company.currency)}
                    </p>
                  )}
                </div>
                <p className="px-1 pt-0.5 text-[10px] leading-snug text-zinc-400">
                  Hoeveel van de {therapeuticAreaShare.name.toLowerCase()}-omzet uit {REGION_LABELS_NL[regionShare.region]} komt, wordt door bedrijven niet apart gepubliceerd.
                </p>
              </div>
            );
          }

          // Only sort active — show prominently (large tile)
          if (!regionShare && !therapeuticAreaShare) {
            return (
              <div className={`mt-5 rounded-xl ${sortStyle.bg} px-4 py-3`}>
                <p className={`text-[11px] font-medium uppercase tracking-wider ${sortStyle.label}`}>
                  {sortLabel}
                </p>
                <p className={`mt-0.5 font-display text-2xl font-semibold tabular-nums tracking-tight ${sortStyle.text}`}>
                  {sortValue}
                </p>
              </div>
            );
          }

          // Single filter active — stacked compact tiles
          const filterLabel = regionShare
            ? `Omzet uit ${REGION_LABELS_NL[regionShare.region]}`
            : `Omzet uit ${therapeuticAreaShare!.name}`;
          const filterValue = regionShare
            ? `${regionShare.share}%`
            : `${therapeuticAreaShare!.share}%`;
          const filterAbsolute = regionShare?.absoluteRevenue ?? therapeuticAreaShare?.absoluteRevenue ?? null;

          return (
            <div className="mt-5 space-y-1.5">
              <div className="flex items-center justify-between gap-2 rounded-lg bg-gradient-to-r from-vig-orange-soft/10 to-vig-orange/5 px-3 py-2">
                <p className="min-w-0 truncate text-[10px] font-medium uppercase tracking-wider text-vig-orange-dark">
                  {filterLabel}
                </p>
                <p className="shrink-0 font-display text-base font-semibold tabular-nums tracking-tight text-vig-navy">
                  {filterValue}
                </p>
              </div>
              {filterAbsolute !== null && (
                <div className="flex items-center justify-between gap-2 rounded-lg bg-sky-50/80 px-3 py-2">
                  <p className="min-w-0 truncate text-[10px] font-medium uppercase tracking-wider text-sky-600">
                    Omzet absoluut
                  </p>
                  <p className="shrink-0 font-display text-base font-semibold tabular-nums tracking-tight text-vig-navy">
                    ≈ {fmtAmount(filterAbsolute, company.currency)}
                  </p>
                </div>
              )}
              {highlight && (
                <div className={`flex items-center justify-between gap-2 rounded-lg ${sortStyle.bg} px-3 py-2`}>
                  <p className={`min-w-0 truncate text-[10px] font-medium uppercase tracking-wider ${sortStyle.label}`}>
                    {sortLabel}
                  </p>
                  <p className={`shrink-0 font-display text-base font-semibold tabular-nums tracking-tight ${sortStyle.text}`}>
                    {sortValue}
                  </p>
                </div>
              )}
            </div>
          );
        })()}

        <div className="mt-auto pt-6">
          {closes.length >= 2 ? (
            <div className="mb-3">
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                    Koers (1J)
                  </p>
                  {currentPrice !== null && (
                    <p className="font-display mt-0.5 text-lg font-semibold tabular-nums tracking-tight text-vig-navy">
                      {formatCurrencyPrice(currentPrice, company.currency)}
                    </p>
                  )}
                </div>
                {yearChange !== null && (
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums",
                      positiveYear
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700",
                    )}
                  >
                    {formatPercentChange(yearChange)}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <Sparkline values={closes} color={company.color} height={42} />
              </div>
              <p className="mt-1 text-[10px] text-zinc-400">
                Wekelijkse slotkoersen, 52 weken
              </p>
            </div>
          ) : (
            <p className="mb-3 text-xs text-zinc-400">
              Geen koersdata beschikbaar.
            </p>
          )}

          <dl className="grid grid-cols-2 gap-y-2 border-t border-zinc-100 pt-4 text-sm">
            <dt className="text-zinc-500">Beurs</dt>
            <dd className="text-right text-vig-navy">{company.exchange}</dd>
            <dt className="text-zinc-500">Valuta</dt>
            <dd className="text-right font-medium text-vig-navy">
              {displayCurrency === "original" ? company.currency : displayCurrency}
              {displayCurrency !== "original" && displayCurrency !== company.currency && (
                <span className="ml-1 text-zinc-400 font-normal text-xs">(orig. {company.currency})</span>
              )}
            </dd>
            {quote?.marketCap && (
              <>
                <dt className="text-zinc-500">Marktwaarde</dt>
                <dd className="text-right font-medium tabular-nums text-vig-navy">
                  {fmtAmount(quote.marketCap, company.currency)}
                </dd>
              </>
            )}
            {rd && (rd.absolute !== null || rd.pct !== null) && (
              <>
                <dt className="text-zinc-500">R&amp;D-uitgaven</dt>
                <dd className="text-right font-medium tabular-nums text-vig-navy">
                  {fmtAmount(rd.absolute, company.currency)}
                </dd>
                <dt className="text-zinc-500">R&amp;D / omzet</dt>
                <dd className="text-right font-medium tabular-nums text-vig-navy">
                  {rd.pct !== null ? `${rd.pct.toFixed(1)}%` : "—"}
                </dd>
              </>
            )}
          </dl>

          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-vig-blue opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            Bekijk details
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
