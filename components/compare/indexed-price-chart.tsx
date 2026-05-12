"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Company } from "@/data/companies";
import type { PricePoint } from "@/lib/yahoo";

interface IndexedPriceChartProps {
  companies: Company[];
  pricesByTicker: Record<string, PricePoint[]>;
}

export function IndexedPriceChart({
  companies,
  pricesByTicker,
}: IndexedPriceChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { rows, baseDate, validCompanies, droppedCompanies } = useMemo(
    () => buildIndexedRows(companies, pricesByTicker),
    [companies, pricesByTicker],
  );

  if (rows.length === 0 || validCompanies.length === 0) {
    return (
      <div className="flex h-[360px] items-center justify-center rounded-xl border border-dashed border-zinc-200 text-sm text-zinc-500 sm:h-[500px]">
        Selecteer minstens één bedrijf met koersdata.
      </div>
    );
  }

  return (
    <div>
      <div className="h-[360px] w-full sm:h-[500px]">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="0" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
                interval="preserveStartEnd"
                minTickGap={60}
                tickFormatter={(v: string) =>
                  new Date(v).toLocaleDateString("nl-NL", {
                    month: "short",
                    year: "2-digit",
                    timeZone: "UTC",
                  })
                }
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
                width={50}
                tickFormatter={(v: number) => `${Math.round(v)}`}
                domain={["dataMin - 10", "dataMax + 10"]}
              />
              <Tooltip
                cursor={{ stroke: "#e4e4e7", strokeWidth: 1 }}
                content={({ active, payload, label }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const date = new Date(label as string).toLocaleDateString(
                    "nl-NL",
                    { month: "long", year: "numeric", timeZone: "UTC" },
                  );
                  const sorted = [...payload]
                    .filter((p) => p.value !== null && p.value !== undefined)
                    .sort((a, b) => (b.value as number) - (a.value as number))
                    .slice(0, 8);
                  return (
                    <div className="rounded-xl border border-zinc-200 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
                      <p className="font-medium text-vig-navy">{date}</p>
                      {sorted.map((p) => {
                        const company = companies.find(
                          (c) => c.ticker === p.dataKey,
                        );
                        if (!company) return null;
                        return (
                          <p
                            key={String(p.dataKey)}
                            className="mt-1 flex items-center gap-2"
                          >
                            <span
                              className="inline-block h-2 w-2 shrink-0 rounded-full"
                              style={{ background: company.color }}
                            />
                            <span className="text-zinc-600">
                              {company.shortName}
                            </span>
                            <span className="ml-auto font-medium tabular-nums text-vig-navy">
                              {Math.round(p.value as number)}
                            </span>
                          </p>
                        );
                      })}
                      {payload.length > 8 && (
                        <p className="mt-1 text-zinc-400">
                          +{payload.length - 8} meer
                        </p>
                      )}
                    </div>
                  );
                }}
              />
              {validCompanies.map((c) => (
                <Line
                  key={c.ticker}
                  type="monotone"
                  dataKey={c.ticker}
                  stroke={c.color}
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: c.color }}
                  isAnimationActive={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        Geïndexeerd: koers op{" "}
        {new Date(baseDate).toLocaleDateString("nl-NL", {
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        })}{" "}
        = 100. Weekelijkse slotkoersen · Bron: Yahoo Finance.
        {droppedCompanies.length > 0 && (
          <span className="text-zinc-400">
            {" "}
            Niet getoond (geen koersdata):{" "}
            {droppedCompanies.map((c) => c.shortName).join(", ")}.
          </span>
        )}
      </p>
    </div>
  );
}

function buildIndexedRows(
  companies: Company[],
  pricesByTicker: Record<string, PricePoint[]>,
) {
  const validCompanies: Company[] = [];
  const droppedCompanies: Company[] = [];

  for (const c of companies) {
    if ((pricesByTicker[c.ticker] ?? []).length >= 2) {
      validCompanies.push(c);
    } else {
      droppedCompanies.push(c);
    }
  }

  if (validCompanies.length === 0) {
    return { rows: [], baseDate: "", validCompanies, droppedCompanies };
  }

  // Base date = latest of all companies' first dates (ensures all have data from here)
  const baseDate = validCompanies
    .map((c) => pricesByTicker[c.ticker][0].date)
    .reduce((a, b) => (a > b ? a : b));

  // Build price lookup maps
  const priceMaps = new Map<string, Map<string, number>>();
  for (const c of validCompanies) {
    const map = new Map<string, number>();
    for (const p of pricesByTicker[c.ticker]) map.set(p.date, p.close);
    priceMaps.set(c.ticker, map);
  }

  // Base price: first close on or after baseDate
  const basePrices = new Map<string, number>();
  const finalValid: Company[] = [];
  const finalDropped = [...droppedCompanies];

  for (const c of validCompanies) {
    const prices = pricesByTicker[c.ticker];
    const base = prices.find((p) => p.date >= baseDate)?.close;
    if (base && base > 0) {
      basePrices.set(c.ticker, base);
      finalValid.push(c);
    } else {
      finalDropped.push(c);
    }
  }

  // Collect all dates from valid companies, sample monthly (~every 4 weeks)
  const allDatesSet = new Set<string>();
  for (const c of finalValid) {
    for (const p of pricesByTicker[c.ticker]) {
      if (p.date >= baseDate) allDatesSet.add(p.date);
    }
  }
  const allDates = Array.from(allDatesSet).sort();
  const sampledDates = allDates.filter((_, i) => i % 4 === 0 || i === allDates.length - 1);

  const rows = sampledDates.map((date) => {
    const row: Record<string, string | number | null> = { date };
    for (const c of finalValid) {
      const price = priceMaps.get(c.ticker)?.get(date);
      const base = basePrices.get(c.ticker)!;
      row[c.ticker] = price !== undefined ? Math.round((price / base) * 100) : null;
    }
    return row;
  });

  return { rows, baseDate, validCompanies: finalValid, droppedCompanies: finalDropped };
}
