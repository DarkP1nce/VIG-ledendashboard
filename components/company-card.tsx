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

interface CompanyCardProps {
  company: Company;
  regionShare?: { region: Region; share: number };
  therapeuticAreaShare?: { name: string; share: number };
  highlightRd?: "pct" | "absolute";
  prices?: PricePoint[];
  quote?: CompanyQuote | null;
  rd?: { absolute: number | null; pct: number | null };
}

export function CompanyCard({
  company,
  regionShare,
  therapeuticAreaShare,
  highlightRd,
  prices = [],
  quote = null,
  rd,
}: CompanyCardProps) {
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

        {(regionShare || therapeuticAreaShare || highlightRd) && (() => {
          const primaryLabel = regionShare
            ? `Omzet uit ${REGION_LABELS_NL[regionShare.region]}`
            : therapeuticAreaShare
            ? `Omzet uit ${therapeuticAreaShare.name}`
            : null;
          const primaryValue = regionShare
            ? `${regionShare.share}%`
            : therapeuticAreaShare
            ? `${therapeuticAreaShare.share}%`
            : null;
          const rdLabel = highlightRd === "pct" ? "R&D / omzet" : "R&D absoluut";
          const rdValue = highlightRd === "pct"
            ? (rd?.pct !== null && rd?.pct !== undefined ? `${rd.pct.toFixed(1)}%` : "—")
            : formatCurrencyCompact(rd?.absolute ?? null, company.currency);
          const dual = primaryLabel && highlightRd;

          return (
            <div className="mt-5 rounded-xl bg-gradient-to-br from-vig-orange-soft/10 to-vig-orange/5 px-4 py-3">
              {dual ? (
                <div className="grid grid-cols-2 divide-x divide-vig-orange/20">
                  <div className="pr-3 min-w-0">
                    <p className="truncate text-[10px] font-medium uppercase tracking-wider text-vig-orange-dark">
                      {primaryLabel}
                    </p>
                    <p className="mt-0.5 font-display text-xl font-semibold tabular-nums tracking-tight text-vig-navy">
                      {primaryValue}
                    </p>
                  </div>
                  <div className="pl-3 min-w-0">
                    <p className="truncate text-[10px] font-medium uppercase tracking-wider text-violet-500">
                      {rdLabel}
                    </p>
                    <p className="mt-0.5 font-display text-xl font-semibold tabular-nums tracking-tight text-vig-navy">
                      {rdValue}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-vig-orange-dark">
                    {primaryLabel ?? rdLabel}
                  </p>
                  <p className="mt-0.5 font-display text-2xl font-semibold tabular-nums tracking-tight text-vig-navy">
                    {primaryValue ?? rdValue}
                  </p>
                </>
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
              {company.currency}
            </dd>
            {rd && (rd.absolute !== null || rd.pct !== null) && (
              <>
                <dt className="text-zinc-500">R&amp;D-uitgaven</dt>
                <dd className="text-right font-medium tabular-nums text-vig-navy">
                  {rd.absolute !== null
                    ? formatCurrencyCompact(rd.absolute, company.currency)
                    : "—"}
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
