"use client";

import { useEffect, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

import type { Company } from "@/data/companies";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const COMPANY_COORDS: Record<string, [number, number]> = {
  // Verenigde Staten
  ABBV:          [-87.9,  42.0],   // North Chicago
  AMGN:          [-118.9, 34.2],   // Thousand Oaks
  BIIB:          [-71.1,  42.4],   // Cambridge MA
  BMY:           [-76.5,  41.5],   // uitgespreid van NJ-cluster
  GILD:          [-122.3, 37.6],   // Foster City
  JNJ:           [-74.5,  40.5],   // New Brunswick
  LLY:           [-86.2,  39.8],   // Indianapolis
  MRK:           [-72.5,  39.5],   // uitgespreid van NJ-cluster
  PFE:           [-73.0,  41.2],   // uitgespreid van NJ-cluster

  // Europa
  AZN:           [0.1,    52.2],   // Cambridge UK
  "BAYN.DE":     [6.9,    51.0],   // Leverkusen
  GSK:           [-0.8,   51.5],   // Londen
  "IPN.PA":      [1.5,    49.2],   // uitgespreid van Parijs
  "HLUN-B.CO":   [11.0,   56.5],   // Denemarken west
  "NOVN.SW":     [6.5,    48.0],   // uitgespreid van Basel
  "NOVO-B.CO":   [14.0,   55.8],   // Denemarken oost
  "RO.SW":       [8.5,    47.0],   // uitgespreid van Basel
  "SAN.PA":      [2.8,    48.3],   // uitgespreid van Parijs
  "UCB.BR":      [4.4,    50.8],   // Brussel

  // Japan — uitgespreid rondom Japan
  "4503.T":      [136.0,  37.5],   // Astellas
  "4568.T":      [141.0,  37.5],   // Daiichi Sankyo
  "4523.T":      [136.0,  34.5],   // Eisai
  "4502.T":      [141.0,  34.5],   // Takeda
};

interface TooltipState {
  x: number;
  y: number;
  company: Company;
}

interface WorldMapProps {
  companies: Company[];
}

export function WorldMap({ companies }: WorldMapProps) {
  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-[520px]" />;

  function handleEnter(
    e: React.MouseEvent,
    company: Company,
  ) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      company,
    });
  }

  function handleMove(e: React.MouseEvent) {
    if (!tooltip) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip((prev) =>
      prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null,
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[520px] w-full overflow-hidden rounded-2xl"
      onMouseMove={handleMove}
      onMouseLeave={() => setTooltip(null)}
    >
      <ComposableMap
        projectionConfig={{ scale: 147, center: [10, 10] }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={GEO_URL}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {({ geographies }: { geographies: Record<string, unknown>[] }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey as string}
                geography={geo}
                fill="#E4EBF0"
                stroke="#C8D6DF"
                strokeWidth={0.4}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {companies.map((company) => {
          const coords = COMPANY_COORDS[company.ticker];
          if (!coords) return null;
          const isHovered = tooltip?.company.ticker === company.ticker;
          return (
            <Marker key={company.ticker} coordinates={coords}>
              <circle
                r={isHovered ? 8 : 5}
                fill={company.color}
                fillOpacity={isHovered ? 1 : 0.85}
                stroke="white"
                strokeWidth={isHovered ? 2 : 1.5}
                style={{ cursor: "pointer", transition: "r 0.15s ease" }}
                onMouseEnter={(e) => handleEnter(e as unknown as React.MouseEvent, company)}
                onMouseLeave={() => setTooltip(null)}
              />
            </Marker>
          );
        })}
      </ComposableMap>

      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 max-w-[180px] rounded-xl border border-zinc-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur"
          style={{
            left: tooltip.x + 14,
            top: tooltip.y - 40,
            transform:
              tooltip.x > 700 ? "translateX(-110%)" : undefined,
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: tooltip.company.color }}
            />
            <p className="text-sm font-semibold text-vig-navy">
              {tooltip.company.shortName}
            </p>
          </div>
          <p className="mt-0.5 text-xs text-zinc-500">
            {tooltip.company.headquarters}
          </p>
          <p className="mt-0.5 font-mono text-[10px] text-zinc-400">
            {tooltip.company.ticker}
          </p>
        </div>
      )}
    </div>
  );
}
