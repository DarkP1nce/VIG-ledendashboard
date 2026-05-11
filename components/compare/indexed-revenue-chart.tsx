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

export interface CompanyAnnualPoint {
  endDate: string;
  revenue: number | null;
  netIncome?: number | null;
}

export interface CompanyAnnualData {
  ticker: string;
  data: CompanyAnnualPoint[];
}

interface IndexedRevenueChartProps {
  companies: Company[];
  data: CompanyAnnualData[];
}

export function IndexedRevenueChart({
  companies,
  data,
}: IndexedRevenueChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { rows, baseYear, validCompanies, droppedCompanies } = useMemo(
    () => buildIndexedRows(companies, data),
    [companies, data],
  );

  if (rows.length === 0 || validCompanies.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-xl border border-dashed border-zinc-200 text-sm text-zinc-500">
        Selecteer minstens twee bedrijven met overlappende jaardata.
      </div>
    );
  }

  return (
    <div>
      <div className="h-[320px] w-full">
        {mounted && (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#f1f5f9" strokeDasharray="0" vertical={false} />
            <XAxis
              dataKey="year"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 12 }}
              width={50}
              tickFormatter={(v: number) => `${v}`}
              domain={["dataMin - 10", "dataMax + 10"]}
            />
            <Tooltip
              cursor={{ stroke: "#e4e4e7", strokeWidth: 1 }}
              content={({ active, payload, label }) => {
                if (!active || !payload || payload.length === 0) return null;
                return (
                  <div className="rounded-xl border border-zinc-200 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
                    <p className="font-medium text-vig-navy">{label}</p>
                    {payload
                      .filter((p) => p.value !== null && p.value !== undefined)
                      .sort(
                        (a, b) =>
                          (b.value as number) - (a.value as number),
                      )
                      .map((p) => {
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
                              className="inline-block h-2 w-2 rounded-full"
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
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 0, fill: c.color }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                isAnimationActive={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        )}
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        Geïndexeerd: omzet in {baseYear} = 100. Eigen valuta per bedrijf, dus
        groei (niet absolute bedragen) wordt vergeleken.
        {droppedCompanies.length > 0 && (
          <>
            {" "}
            <span className="text-zinc-400">
              Niet getoond (te weinig overlappende jaardata):{" "}
              {droppedCompanies.map((c) => c.shortName).join(", ")}.
            </span>
          </>
        )}
      </p>
    </div>
  );
}

interface IndexedRows {
  rows: Array<Record<string, string | number | null>>;
  baseYear: number;
  validCompanies: Company[];
  droppedCompanies: Company[];
}

function buildIndexedRows(
  companies: Company[],
  data: CompanyAnnualData[],
): IndexedRows {
  const byTicker = new Map<string, Map<number, number>>();

  for (const c of companies) {
    const series = data.find((d) => d.ticker === c.ticker);
    const yearMap = new Map<number, number>();
    if (series) {
      for (const point of series.data) {
        if (point.revenue === null || !point.endDate) continue;
        const year = new Date(point.endDate).getUTCFullYear();
        if (!Number.isFinite(year)) continue;
        yearMap.set(year, point.revenue);
      }
    }
    byTicker.set(c.ticker, yearMap);
  }

  const droppedCompanies: Company[] = [];
  const validCompanies: Company[] = [];
  const earliestYears: number[] = [];

  for (const c of companies) {
    const map = byTicker.get(c.ticker)!;
    if (map.size < 2) {
      droppedCompanies.push(c);
      continue;
    }
    validCompanies.push(c);
    earliestYears.push(Math.min(...Array.from(map.keys())));
  }

  if (validCompanies.length === 0) {
    return { rows: [], baseYear: 0, validCompanies, droppedCompanies };
  }

  const baseYear = Math.max(...earliestYears);

  const allYears = new Set<number>();
  for (const c of validCompanies) {
    const map = byTicker.get(c.ticker)!;
    for (const y of Array.from(map.keys())) {
      if (y >= baseYear) allYears.add(y);
    }
  }

  const sortedYears = Array.from(allYears).sort((a, b) => a - b);

  const rows = sortedYears.map((year) => {
    const row: Record<string, string | number | null> = { year: String(year) };
    for (const c of validCompanies) {
      const map = byTicker.get(c.ticker)!;
      const base = map.get(baseYear);
      const v = map.get(year);
      row[c.ticker] =
        base && v !== undefined && base !== 0 ? (v / base) * 100 : null;
    }
    return row;
  });

  return { rows, baseYear, validCompanies, droppedCompanies };
}
