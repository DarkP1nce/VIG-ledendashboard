"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { IncomeStatementPeriod } from "@/lib/yahoo";
import { formatPeriodLabel } from "@/lib/format";
import { useFmtAmount } from "@/lib/use-fmt-amount";

const RD_COLOR = "#7C3AED";

interface RdChartProps {
  annual: IncomeStatementPeriod[];
  currency: string;
}

export function RdChart({ annual, currency }: RdChartProps) {
  const { compact, effectiveCurrency } = useFmtAmount(currency);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const data = useMemo(() => {
    return annual
      .filter((p) => p.researchAndDevelopment !== null && p.revenue !== null && p.revenue > 0)
      .sort((a, b) => a.endDate.localeCompare(b.endDate))
      .map((p) => ({
        label: formatPeriodLabel(p.endDate, "annual"),
        pct: parseFloat(((p.researchAndDevelopment! / p.revenue!) * 100).toFixed(1)),
        absolute: p.researchAndDevelopment!,
      }));
  }, [annual]);

  const latest = data[data.length - 1] ?? null;

  if (!mounted) return null;

  if (data.length === 0) {
    return (
      <p className="mt-4 text-sm text-zinc-500">
        Geen R&D-data beschikbaar via Yahoo Finance.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start gap-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            R&amp;D-uitgaven (laatste jaar)
          </p>
          <p className="font-display mt-1 text-2xl font-semibold tabular-nums tracking-tight text-vig-navy">
            {latest ? compact(latest.absolute) : "—"}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            R&amp;D / omzet (laatste jaar)
          </p>
          <p className="font-display mt-1 text-2xl font-semibold tabular-nums tracking-tight text-vig-navy">
            {latest ? `${latest.pct}%` : "—"}
          </p>
        </div>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
            barCategoryGap="30%"
          >
            <CartesianGrid stroke="#f1f5f9" strokeDasharray="0" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 12 }}
              width={38}
              tickFormatter={(v: number) => `${v}%`}
              domain={[0, "auto"]}
            />
            <Tooltip
              cursor={{ fill: "#f4f4f5" }}
              content={({ active, payload, label }) => {
                if (!active || !payload || payload.length === 0) return null;
                const d = payload[0]?.payload as typeof data[0];
                return (
                  <div className="rounded-xl border border-zinc-200 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
                    <p className="font-medium text-vig-navy">{label}</p>
                    <p className="mt-1 text-zinc-600">
                      R&amp;D / omzet:{" "}
                      <span className="font-medium tabular-nums text-vig-navy">
                        {d.pct}%
                      </span>
                    </p>
                    <p className="mt-0.5 text-zinc-600">
                      Absoluut:{" "}
                      <span className="font-medium tabular-nums text-vig-navy">
                        {compact(d.absolute)}
                      </span>
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="pct" radius={[4, 4, 0, 0]} isAnimationActive={false}>
              {data.map((entry, i) => (
                <Cell
                  key={entry.label}
                  fill={i === data.length - 1 ? RD_COLOR : "#C4B5FD"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        R&amp;D als % van omzet per boekjaar. Bedragen in {effectiveCurrency}. Bron: Yahoo Finance.
      </p>
    </div>
  );
}
