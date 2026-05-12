"use client";

import { RotateCcw } from "lucide-react";

import {
  FilterPopover,
  type FilterOption,
} from "@/components/filters/filter-popover";
import {
  ALL_REGIONS,
  REGION_LABELS_NL,
  type Region,
} from "@/data/segments";
import {
  MARKET_CAP_LABELS,
  type MarketCapBand,
} from "@/lib/fx";

export type RegionFilterValue = Region | "all";
export type RdSort = "none" | "pct" | "absolute";

export interface FilterState {
  region: RegionFilterValue;
  marketCap: MarketCapBand;
  therapeuticArea: string;
  rdSort: RdSort;
}

interface FilterBarProps {
  state: FilterState;
  onChange: (state: FilterState) => void;
  therapeuticAreas: string[];
}

export function FilterBar({
  state,
  onChange,
  therapeuticAreas,
}: FilterBarProps) {
  const regionOptions: FilterOption<RegionFilterValue>[] = [
    { value: "all", label: "Alle regio's" },
    ...ALL_REGIONS.map((r) => ({ value: r, label: REGION_LABELS_NL[r] })),
  ];

  const capOptions: FilterOption<MarketCapBand>[] = (
    Object.keys(MARKET_CAP_LABELS) as MarketCapBand[]
  ).map((band) => ({ value: band, label: MARKET_CAP_LABELS[band] }));

  const taOptions: FilterOption<string>[] = [
    { value: "all", label: "Alle ziektegebieden" },
    ...therapeuticAreas.map((name) => ({ value: name, label: name })),
  ];

  const regionLabel =
    state.region === "all"
      ? "Alle"
      : REGION_LABELS_NL[state.region as Region];
  const capLabel =
    state.marketCap === "all"
      ? "Alle"
      : state.marketCap === "mega"
        ? "Mega"
        : state.marketCap === "large"
          ? "Groot"
          : "Midden";
  const taLabel =
    state.therapeuticArea === "all" ? "Alle" : state.therapeuticArea;

  const rdOptions: FilterOption<RdSort>[] = [
    { value: "none", label: "Niet sorteren" },
    { value: "pct", label: "% van omzet", hint: "Hoogste % eerst" },
    { value: "absolute", label: "Absoluut bedrag", hint: "Hoogste bedrag eerst" },
  ];
  const rdLabel =
    state.rdSort === "none"
      ? "Alle"
      : state.rdSort === "pct"
        ? "% van omzet"
        : "Absoluut";

  const activeCount = [
    state.region !== "all",
    state.marketCap !== "all",
    state.therapeuticArea !== "all",
    state.rdSort !== "none",
  ].filter(Boolean).length;

  function reset() {
    onChange({ region: "all", marketCap: "all", therapeuticArea: "all", rdSort: "none" });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterPopover<RegionFilterValue>
        label="Regio"
        selectedLabel={regionLabel}
        isDefault={state.region === "all"}
        options={regionOptions}
        value={state.region}
        onChange={(v) => onChange({ ...state, region: v })}
      />
      <FilterPopover<MarketCapBand>
        label="Markt­waarde"
        selectedLabel={capLabel}
        isDefault={state.marketCap === "all"}
        options={capOptions}
        value={state.marketCap}
        onChange={(v) => onChange({ ...state, marketCap: v })}
      />
      <FilterPopover<string>
        label="Ziekte­gebied"
        selectedLabel={taLabel}
        isDefault={state.therapeuticArea === "all"}
        options={taOptions}
        value={state.therapeuticArea}
        onChange={(v) => onChange({ ...state, therapeuticArea: v })}
      />
      <FilterPopover<RdSort>
        label="R&amp;D"
        selectedLabel={rdLabel}
        isDefault={state.rdSort === "none"}
        options={rdOptions}
        value={state.rdSort}
        onChange={(v) => onChange({ ...state, rdSort: v })}
      />

      {activeCount > 0 && (
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-100/80 hover:text-vig-navy"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset {activeCount}
        </button>
      )}
    </div>
  );
}
