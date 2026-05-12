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

import type { IncomeStatementPeriod } from "@/lib/yahoo";
import { formatCompactNumber, formatPeriodLabel } from "@/lib/format";
import { useFmtAmount } from "@/lib/use-fmt-amount";
import { cn } from "@/lib/utils";

type Period = "annual" | "quarterly";
type Range = "1y" | "3y" | "5y" | "all";

const RANGE_OPTIONS: { value: Range; label: string; years: number | null }[] = [
  { value: "1y", label: "1J", years: 1 },
  { value: "3y", label: "3J", years: 3 },
  { value: "5y", label: "5J", years: 5 },
  { value: "all", label: "Alles", years: null },
];

interface FinancialsChartProps {
  annual: IncomeStatementPeriod[];
  quarterly: IncomeStatementPeriod[];
  currency: string;
}

const REVENUE_COLOR = "#F28C28";
const NET_INCOME_COLOR = "#1F6AA5";

export function FinancialsChart({
  annual,
  quarterly,
  currency,
}: FinancialsChartProps) {
  const { compact, convert, effectiveCurrency } = useFmtAmount(currency);
  const [period, setPeriod] = useState<Period>("annual");
  const [range, setRange] = useState<Range>("5y");
  const [mounted, setMounted] = useState(false);
  const quarterlyDisabled = quarterly.length === 0;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (period === "annual" && range === "1y") setRange("5y");
  }, [period, range]);

  const data = useMemo(() => {
    const rows = period === "annual" ? annual : quarterly;
    const filtered = rows.filter(
      (p) => p.revenue !== null || p.netIncome !== null,
    );
    const rangeYears = RANGE_OPTIONS.find((r) => r.value === range)?.years;
    const sliced =
      rangeYears === null || rangeYears === undefined
        ? filtered
        : filtered.slice(
            -1 * (period === "annual" ? rangeYears : rangeYears * 4),
          );
    return sliced.map((p) => ({
      label: formatPeriodLabel(p.endDate, period),
      revenue: convert(p.revenue),
      netIncome: convert(p.netIncome),
    }));
  }, [period, range, annual, quarterly, convert]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs text-zinc-600">
          <LegendDot color={REVENUE_COLOR} label="Omzet" />
          <LegendDot color={NET_INCOME_COLOR} label="Nettowinst" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PeriodToggle
            value={period}
            onChange={setPeriod}
            quarterlyDisabled={quarterlyDisabled}
          />
          <RangeToggle value={range} onChange={setRange} period={period} />
        </div>
      </div>

      <div className="mt-4 h-[280px] w-full">
        {!mounted ? null : data.length === 0 ? (
          <EmptyState message="Geen data beschikbaar voor deze periode." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                stroke="#f1f5f9"
                strokeDasharray="0"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
                interval="preserveStartEnd"
                minTickGap={20}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
                width={60}
                tickFormatter={(v: number) => formatCompactNumber(v)}
              />
              <Tooltip
                cursor={{ stroke: "#e4e4e7", strokeWidth: 1 }}
                content={({ active, payload, label }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  return (
                    <div className="rounded-xl border border-zinc-200 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
                      <p className="font-medium text-vig-navy">{label}</p>
                      {payload.map((entry) => (
                        <p key={String(entry.dataKey)} className="mt-1 flex items-center gap-2">
                          <span
                            className="inline-block h-2 w-2 rounded-full"
                            style={{ background: entry.color }}
                          />
                          <span className="text-zinc-600">
                            {entry.dataKey === "revenue" ? "Omzet" : "Nettowinst"}
                          </span>
                          <span className="ml-auto font-medium tabular-nums text-vig-navy">
                            {compact(entry.value as number)}
                          </span>
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={REVENUE_COLOR}
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 0, fill: REVENUE_COLOR }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="netIncome"
                stroke={NET_INCOME_COLOR}
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 0, fill: NET_INCOME_COLOR }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        Bedragen in {effectiveCurrency}. Bron: Yahoo Finance.
      </p>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}

function PeriodToggle({
  value,
  onChange,
  quarterlyDisabled,
}: {
  value: Period;
  onChange: (v: Period) => void;
  quarterlyDisabled: boolean;
}) {
  return (
    <div className="inline-flex rounded-lg bg-zinc-100 p-0.5 text-xs font-medium">
      <button
        type="button"
        onClick={() => onChange("annual")}
        className={cn(
          "rounded-md px-3 py-1 transition-colors",
          value === "annual"
            ? "bg-white text-vig-navy shadow-sm"
            : "text-zinc-600 hover:text-vig-navy",
        )}
      >
        Jaarlijks
      </button>
      <button
        type="button"
        onClick={() => onChange("quarterly")}
        disabled={quarterlyDisabled}
        className={cn(
          "rounded-md px-3 py-1 transition-colors",
          value === "quarterly"
            ? "bg-white text-vig-navy shadow-sm"
            : "text-zinc-600 hover:text-vig-navy",
          quarterlyDisabled && "cursor-not-allowed opacity-40 hover:text-zinc-600",
        )}
      >
        Kwartaal
      </button>
    </div>
  );
}

function RangeToggle({
  value,
  onChange,
  period,
}: {
  value: Range;
  onChange: (v: Range) => void;
  period: Period;
}) {
  const visible = RANGE_OPTIONS.filter(
    (opt) => !(period === "annual" && opt.value === "1y"),
  );
  return (
    <div className="inline-flex rounded-lg bg-zinc-100 p-0.5 text-xs font-medium">
      {visible.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-md px-2.5 py-1 transition-colors",
            value === opt.value
              ? "bg-white text-vig-navy shadow-sm"
              : "text-zinc-600 hover:text-vig-navy",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-zinc-200 text-sm text-zinc-500">
      {message}
    </div>
  );
}
