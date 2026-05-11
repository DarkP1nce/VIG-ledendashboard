"use client";

import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export interface SegmentDatum {
  name: string;
  revenueShare: number;
}

interface SegmentPieProps {
  data: SegmentDatum[];
  ariaLabel?: string;
}

const COLORS = [
  "#0A84FF",
  "#30D158",
  "#FF9F0A",
  "#BF5AF2",
  "#FF453A",
  "#5E5CE6",
  "#64D2FF",
  "#FFD60A",
];

export function SegmentPie({ data, ariaLabel }: SegmentPieProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (data.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center rounded-xl border border-dashed border-zinc-200 text-sm text-zinc-500">
        Geen data.
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-[180px_minmax(0,1fr)] items-center gap-6"
      aria-label={ariaLabel}
    >
      <div className="h-[180px]">
        {mounted && (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="revenueShare"
              nameKey="name"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={2}
              isAnimationActive={false}
              stroke="white"
              strokeWidth={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;
                const p = payload[0];
                return (
                  <div className="rounded-xl border border-zinc-200 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
                    <p className="font-medium text-vig-navy">{p.name}</p>
                    <p className="mt-0.5 tabular-nums text-zinc-600">
                      {Number(p.value).toFixed(0)}% van omzet
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        )}
      </div>

      <ul className="space-y-1.5 text-sm">
        {data.map((item, i) => (
          <li
            key={item.name}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="truncate text-zinc-700">{item.name}</span>
            </span>
            <span className="shrink-0 font-medium tabular-nums text-vig-navy">
              {item.revenueShare}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
