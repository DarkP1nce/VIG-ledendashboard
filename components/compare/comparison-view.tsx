"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  IndexedRevenueChart,
  type CompanyAnnualData,
} from "@/components/compare/indexed-revenue-chart";
import { CompanyMonogram } from "@/components/company-monogram";
import { CsvExportButton } from "@/components/csv-export-button";
import { RegionFilter, type RegionSelection } from "@/components/region-filter";
import type { Company } from "@/data/companies";
import { REGION_LABELS_NL, type Region } from "@/data/segments";
import type { CompanyQuote } from "@/lib/yahoo";
import {
  formatCurrencyCompact,
  formatPercentChange,
} from "@/lib/format";
import { cn } from "@/lib/utils";

interface ComparisonViewProps {
  companies: Company[];
  annualByTicker: Record<string, CompanyAnnualData["data"]>;
  quoteByTicker: Record<string, CompanyQuote | null>;
  regionSharesByTicker: Record<string, Partial<Record<Region, number>>>;
  rdByTicker: Record<string, { absolute: number | null; pct: number | null }>;
}

export function ComparisonView({
  companies,
  annualByTicker,
  quoteByTicker,
  regionSharesByTicker,
  rdByTicker,
}: ComparisonViewProps) {
  const [region, setRegion] = useState<RegionSelection>("all");

  const visibleCompanies = useMemo(() => {
    if (region === "all") return companies;
    return companies
      .filter((c) => (regionSharesByTicker[c.ticker]?.[region] ?? 0) > 0)
      .sort(
        (a, b) =>
          (regionSharesByTicker[b.ticker]?.[region] ?? 0) -
          (regionSharesByTicker[a.ticker]?.[region] ?? 0),
      );
  }, [companies, region, regionSharesByTicker]);

  const [selected, setSelected] = useState<Set<string>>(
    new Set(companies.map((c) => c.ticker)),
  );

  useEffect(() => {
    setSelected(new Set(visibleCompanies.map((c) => c.ticker)));
  }, [visibleCompanies]);

  const selectedCompanies = useMemo(
    () => visibleCompanies.filter((c) => selected.has(c.ticker)),
    [visibleCompanies, selected],
  );

  const chartData: CompanyAnnualData[] = useMemo(
    () =>
      selectedCompanies.map((c) => ({
        ticker: c.ticker,
        data: annualByTicker[c.ticker] ?? [],
      })),
    [selectedCompanies, annualByTicker],
  );

  function toggle(ticker: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(ticker)) next.delete(ticker);
      else next.add(ticker);
      return next;
    });
  }

  const csvRows = useMemo(() =>
    selectedCompanies.map((c) => {
      const { latest, prior, netIncome } = pickLatestAndPrior(annualByTicker[c.ticker] ?? []);
      const revenueYoY = latest && prior && prior !== 0 ? ((latest / prior - 1) * 100).toFixed(1) + "%" : "";
      const netMargin = latest && netIncome !== null && latest !== 0 ? ((netIncome / latest) * 100).toFixed(1) + "%" : "";
      const rd = rdByTicker[c.ticker];
      const quote = quoteByTicker[c.ticker];
      return {
        Bedrijf: c.shortName,
        Ticker: c.ticker,
        Valuta: c.currency,
        "Omzet (laatste jaar)": latest ?? "",
        "Omzetgroei YoY": revenueYoY,
        Nettowinst: netIncome ?? "",
        Nettomarge: netMargin,
        Marktwaarde: quote?.marketCap ?? "",
        "R&D absoluut": rd?.absolute ?? "",
        "R&D / omzet": rd?.pct !== null && rd?.pct !== undefined ? rd.pct.toFixed(1) + "%" : "",
      };
    }), [selectedCompanies, annualByTicker, rdByTicker, quoteByTicker]);

  return (
    <div>
      <section className="flex items-center justify-between gap-4">
        <RegionFilter value={region} onChange={setRegion} />
        <CsvExportButton rows={csvRows} filename="vig-vergelijking.csv" label="Exporteer CSV" />
      </section>

      <section className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Selecteer bedrijven
          {region !== "all" && (
            <span className="ml-2 normal-case tracking-normal text-zinc-400">
              · met omzet uit {REGION_LABELS_NL[region]}
            </span>
          )}
        </p>
        {visibleCompanies.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">
            Geen bedrijven met omzet uit deze regio.
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {visibleCompanies.map((c) => {
              const active = selected.has(c.ticker);
              const share =
                region !== "all"
                  ? regionSharesByTicker[c.ticker]?.[region]
                  : undefined;
              return (
                <button
                  key={c.ticker}
                  type="button"
                  onClick={() => toggle(c.ticker)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                    active
                      ? "border-transparent text-white shadow-sm"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-vig-navy",
                  )}
                  style={active ? { background: c.color } : undefined}
                  aria-pressed={active}
                >
                  <span
                    className={cn(
                      "inline-block h-2 w-2 rounded-full",
                      active ? "bg-white/80" : "",
                    )}
                    style={!active ? { background: c.color } : undefined}
                  />
                  {c.shortName}
                  {share !== undefined && (
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-xs tabular-nums",
                        active
                          ? "bg-white/20 text-white"
                          : "bg-zinc-100 text-zinc-600",
                      )}
                    >
                      {share}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-10 rounded-2xl border bg-white p-6 shadow-card">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Omzetgroei vergeleken
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Geïndexeerd, basisjaar = 100. Cross-currency vergelijking.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <IndexedRevenueChart
            companies={selectedCompanies}
            data={chartData}
          />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border bg-white p-6 shadow-card">
        <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          R&amp;D-uitgaven vergeleken
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Onderzoek &amp; ontwikkeling als % van de omzet — meest recente jaarcijfers.
        </p>
        <div className="mt-6">
          <RdComparisonChart companies={selectedCompanies} rdByTicker={rdByTicker} />
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Kerncijfers
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Meest recente jaarcijfers in eigen valuta.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {selectedCompanies.map((c) => (
            <CompanyMetricCard
              key={c.ticker}
              company={c}
              annual={annualByTicker[c.ticker] ?? []}
              quote={quoteByTicker[c.ticker] ?? null}
              rd={rdByTicker[c.ticker] ?? { absolute: null, pct: null }}
            />
          ))}
        </div>
        {selectedCompanies.length === 0 && (
          <div className="mt-4 flex h-40 items-center justify-center rounded-2xl border border-dashed border-zinc-200 text-sm text-zinc-500">
            Geen bedrijven geselecteerd.
          </div>
        )}
      </section>
    </div>
  );
}

interface CompanyMetricCardProps {
  company: Company;
  annual: CompanyAnnualData["data"];
  quote: CompanyQuote | null;
  rd: { absolute: number | null; pct: number | null };
}

function CompanyMetricCard({
  company,
  annual,
  quote,
  rd,
}: CompanyMetricCardProps) {
  const { latest, prior, netIncome, priorNetIncome } = useMemo(
    () => pickLatestAndPrior(annual),
    [annual],
  );

  const revenueYoY =
    latest && prior && prior !== 0 ? (latest / prior - 1) * 100 : null;
  const netIncomeYoY =
    netIncome !== null &&
    priorNetIncome !== null &&
    priorNetIncome !== 0
      ? (netIncome / priorNetIncome - 1) * 100
      : null;
  const netMargin =
    latest && netIncome !== null && latest !== 0
      ? (netIncome / latest) * 100
      : null;

  return (
    <Link
      href={`/company/${company.slug}`}
      className="group block rounded-2xl border bg-white p-5 shadow-card transition-shadow duration-200 hover:shadow-card-hover"
      style={{
        borderTopWidth: 3,
        borderTopColor: company.color,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <CompanyMonogram company={company} size="md" />
          <div>
            <h3 className="font-display text-base font-semibold tracking-tight text-vig-navy">
              {company.shortName}
            </h3>
            <p className="mt-0.5 text-xs text-zinc-500">{company.currency}</p>
          </div>
        </div>
        <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-700">
          {company.ticker}
        </span>
      </div>

      <dl className="mt-4 space-y-3 text-sm">
        <Metric
          label="Omzet (laatste jaar)"
          value={formatCurrencyCompact(latest, company.currency)}
          change={revenueYoY}
        />
        <Metric
          label="Nettowinst"
          value={formatCurrencyCompact(netIncome, company.currency)}
          change={netIncomeYoY}
        />
        <Metric
          label="Nettomarge"
          value={netMargin !== null ? `${netMargin.toFixed(1)}%` : "—"}
        />
        <Metric
          label="Marktwaarde"
          value={
            quote
              ? formatCurrencyCompact(quote.marketCap, company.currency)
              : "—"
          }
        />
        <Metric
          label="R&D-uitgaven"
          value={formatCurrencyCompact(rd.absolute, company.currency)}
        />
        <Metric
          label="R&D / omzet"
          value={rd.pct !== null ? `${rd.pct.toFixed(1)}%` : "—"}
        />
      </dl>
    </Link>
  );
}

function Metric({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change?: number | null;
}) {
  const showChange = change !== undefined && change !== null;
  const positive = (change ?? 0) >= 0;
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="flex items-baseline gap-2">
        <span className="font-medium tabular-nums text-vig-navy">{value}</span>
        {showChange && (
          <span
            className={cn(
              "text-xs font-medium tabular-nums",
              positive ? "text-emerald-600" : "text-rose-600",
            )}
          >
            {formatPercentChange(change)}
          </span>
        )}
      </dd>
    </div>
  );
}

function RdComparisonChart({
  companies,
  rdByTicker,
}: {
  companies: Company[];
  rdByTicker: Record<string, { absolute: number | null; pct: number | null }>;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const data = companies
    .map((c) => ({
      name: c.shortName,
      pct: rdByTicker[c.ticker]?.pct ?? null,
      color: c.color,
    }))
    .filter((d) => d.pct !== null)
    .sort((a, b) => (b.pct ?? 0) - (a.pct ?? 0));

  if (data.length === 0) {
    return (
      <p className="text-sm text-zinc-500">Geen R&D-data beschikbaar.</p>
    );
  }

  if (!mounted) return <div className="h-[260px]" />;

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 48, left: 0, bottom: 0 }}
          barCategoryGap="25%"
        >
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 11 }}
            tickFormatter={(v: number) => `${v}%`}
            domain={[0, "dataMax + 2"]}
          />
          <YAxis
            type="category"
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 12 }}
            width={110}
          />
          <Tooltip
            cursor={{ fill: "#f4f4f5" }}
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;
              const d = payload[0]?.payload as (typeof data)[0];
              return (
                <div className="rounded-xl border border-zinc-200 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
                  <p className="font-medium text-vig-navy">{d.name}</p>
                  <p className="mt-1 text-zinc-600">
                    R&amp;D / omzet:{" "}
                    <span className="font-medium text-vig-navy">
                      {d.pct?.toFixed(1)}%
                    </span>
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="pct" radius={[0, 4, 4, 0]} isAnimationActive={false} label={{ position: "right", formatter: (v: unknown) => typeof v === "number" ? `${v.toFixed(1)}%` : "", fontSize: 11, fill: "#71717a" }}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function pickLatestAndPrior(annual: CompanyAnnualData["data"]) {
  type Row = { endDate: string; revenue: number | null; netIncome: number | null };
  const rows: Row[] = annual.map((p) => ({
    endDate: p.endDate,
    revenue: p.revenue,
    netIncome: (p as unknown as { netIncome?: number | null }).netIncome ?? null,
  }));
  const sorted = [...rows].sort((a, b) =>
    b.endDate.localeCompare(a.endDate),
  );
  const latestRow = sorted.find((r) => r.revenue !== null) ?? null;
  const latestYear = latestRow ? new Date(latestRow.endDate).getUTCFullYear() : null;
  const priorRow =
    latestYear !== null
      ? sorted.find(
          (r) =>
            r.revenue !== null &&
            new Date(r.endDate).getUTCFullYear() === latestYear - 1,
        ) ?? null
      : null;
  return {
    latest: latestRow?.revenue ?? null,
    prior: priorRow?.revenue ?? null,
    netIncome: latestRow?.netIncome ?? null,
    priorNetIncome: priorRow?.netIncome ?? null,
  };
}
