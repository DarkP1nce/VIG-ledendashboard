"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrencyPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PricePoint } from "@/lib/yahoo";

type Range = "1j" | "2j" | "5j";

const RANGES: { value: Range; label: string; weeks: number }[] = [
  { value: "1j", label: "1J", weeks: 52 },
  { value: "2j", label: "2J", weeks: 104 },
  { value: "5j", label: "5J", weeks: 260 },
];

interface PriceChartProps {
  prices: PricePoint[];
  currency: string;
  color: string;
}

function formatXLabel(dateStr: string, range: Range): string {
  const d = new Date(dateStr);
  if (range === "1j") {
    return d.toLocaleDateString("nl-NL", { month: "short", timeZone: "UTC" });
  }
  return d.toLocaleDateString("nl-NL", { month: "short", year: "2-digit", timeZone: "UTC" });
}

export function PriceChart({ prices, currency, color }: PriceChartProps) {
  const [range, setRange] = useState<Range>("5j");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const data = useMemo(() => {
    const weeks = RANGES.find((r) => r.value === range)?.weeks ?? 260;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - weeks * 7);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return prices
      .filter((p) => p.date >= cutoffStr)
      .map((p) => ({ date: p.date, close: p.close }));
  }, [prices, range]);

  const firstClose = data[0]?.close ?? null;
  const lastClose = data[data.length - 1]?.close ?? null;
  const pctChange =
    firstClose && lastClose && firstClose > 0
      ? ((lastClose / firstClose - 1) * 100)
      : null;
  const positive = (pctChange ?? 0) >= 0;

  const minClose = Math.min(...data.map((d) => d.close));
  const maxClose = Math.max(...data.map((d) => d.close));
  const padding = (maxClose - minClose) * 0.08;

  const gradientId = `price-gradient-${color.replace("#", "")}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          {lastClose !== null && (
            <span className="font-display text-xl font-semibold tabular-nums tracking-tight text-vig-navy">
              {formatCurrencyPrice(lastClose, currency)}
            </span>
          )}
          {pctChange !== null && (
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums",
                positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700",
              )}
            >
              {positive ? "+" : ""}{pctChange.toFixed(1)}%
            </span>
          )}
        </div>
        <div className="inline-flex rounded-lg bg-zinc-100 p-0.5 text-xs font-medium">
          {RANGES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRange(r.value)}
              className={cn(
                "rounded-md px-2.5 py-1 transition-colors",
                range === r.value
                  ? "bg-white text-vig-navy shadow-sm"
                  : "text-zinc-600 hover:text-vig-navy",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-[320px] w-full">
        {!mounted ? null : data.length < 2 ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-zinc-200 text-sm text-zinc-500">
            Geen koersdata beschikbaar.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="0" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
                interval="preserveStartEnd"
                minTickGap={48}
                tickFormatter={(v: string) => formatXLabel(v, range)}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
                width={64}
                domain={[minClose - padding, maxClose + padding]}
                tickFormatter={(v: number) => formatCurrencyPrice(v, currency)}
              />
              <Tooltip
                cursor={{ stroke: "#e4e4e7", strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const d = payload[0]?.payload as PricePoint;
                  const date = new Date(d.date).toLocaleDateString("nl-NL", {
                    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
                  });
                  return (
                    <div className="rounded-xl border border-zinc-200 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
                      <p className="text-zinc-500">{date}</p>
                      <p className="mt-1 font-medium tabular-nums text-vig-navy">
                        {formatCurrencyPrice(d.close, currency)}
                      </p>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="close"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: color }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <p className="mt-2 text-xs text-zinc-400">Weekelijkse slotkoersen · Bron: Yahoo Finance</p>
    </div>
  );
}
