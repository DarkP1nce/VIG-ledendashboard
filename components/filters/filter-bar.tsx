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
  HQ_GROUP_LABELS,
  type HqGroup,
} from "@/data/companies";

export type RegionFilterValue = Region | "all";
export type SortOption =
  | "none"
  | "revenue"
  | "marketcap"
  | "price52w"
  | "netmargin"
  | "rd-pct"
  | "rd-absolute";
export type RdSortOption = "none" | "rd-pct" | "rd-absolute";
export type HqRegionFilter = HqGroup | "all";

export interface FilterState {
  region: RegionFilterValue;
  therapeuticArea: string;
  sort: SortOption;
  hqRegion: HqRegionFilter;
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

  const taOptions: FilterOption<string>[] = [
    { value: "all", label: "Alle ziektegebieden" },
    ...therapeuticAreas.map((name) => ({ value: name, label: name })),
  ];

  const sortOptions: FilterOption<SortOption>[] = [
    { value: "none", label: "Alfabetisch" },
    { value: "revenue", label: "Omzet", hint: "Hoogste omzet eerst" },
    { value: "marketcap", label: "Marktwaarde", hint: "Grootste bedrijf eerst" },
    { value: "price52w", label: "Koers 52w", hint: "Beste prestatie eerst" },
    { value: "netmargin", label: "Nettomarge", hint: "Hoogste marge eerst" },
  ];

  const rdOptions: FilterOption<RdSortOption>[] = [
    { value: "none", label: "Niet sorteren" },
    { value: "rd-pct", label: "% van omzet", hint: "Hoogste percentage eerst" },
    { value: "rd-absolute", label: "Absoluut bedrag", hint: "Hoogste bedrag eerst" },
  ];

  const hqOptions: FilterOption<HqRegionFilter>[] = [
    { value: "all", label: "Alle landen" },
    { value: "us", label: HQ_GROUP_LABELS.us },
    { value: "europe", label: HQ_GROUP_LABELS.europe },
    { value: "japan", label: HQ_GROUP_LABELS.japan },
    { value: "other", label: HQ_GROUP_LABELS.other },
  ];

  const regionLabel =
    state.region === "all" ? "Alle" : REGION_LABELS_NL[state.region as Region];
  const taLabel =
    state.therapeuticArea === "all" ? "Alle" : state.therapeuticArea;
  const sortLabelMap: Record<SortOption, string> = {
    none: "Alle",
    revenue: "Omzet",
    marketcap: "Marktwaarde",
    price52w: "Koers 52w",
    netmargin: "Nettomarge",
    "rd-pct": "% omzet",
    "rd-absolute": "Absoluut",
  };
  const hqLabel =
    state.hqRegion === "all" ? "Alle" : HQ_GROUP_LABELS[state.hqRegion as HqGroup];

  const rdValue: RdSortOption =
    state.sort === "rd-pct" ? "rd-pct"
    : state.sort === "rd-absolute" ? "rd-absolute"
    : "none";

  const rdLabel = rdValue === "rd-pct" ? "% omzet" : rdValue === "rd-absolute" ? "Absoluut" : "Alle";

  const activeCount = [
    state.region !== "all",
    state.therapeuticArea !== "all",
    state.sort !== "none",
    state.hqRegion !== "all",
  ].filter(Boolean).length;

  function reset() {
    onChange({
      region: "all",
      therapeuticArea: "all",
      sort: "none",
      hqRegion: "all",
    });
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <FilterPopover<RegionFilterValue>
        label="Omzetregio"
        selectedLabel={regionLabel}
        isDefault={state.region === "all"}
        options={regionOptions}
        value={state.region}
        onChange={(v) => onChange({ ...state, region: v })}
      />
      <FilterPopover<string>
        label="Ziekte­gebied"
        selectedLabel={taLabel}
        isDefault={state.therapeuticArea === "all"}
        options={taOptions}
        value={state.therapeuticArea}
        onChange={(v) => onChange({ ...state, therapeuticArea: v, sort: v !== "all" ? "none" : state.sort })}
      />
      <FilterPopover<SortOption>
        label="Volgorde"
        selectedLabel={sortLabelMap[state.sort]}
        isDefault={state.sort === "none" || state.sort === "rd-pct" || state.sort === "rd-absolute"}
        options={sortOptions}
        value={(state.sort === "rd-pct" || state.sort === "rd-absolute") ? "none" : state.sort}
        onChange={(v) => onChange({ ...state, sort: v })}
      />
      <FilterPopover<RdSortOption>
        label="R&amp;D"
        selectedLabel={rdLabel}
        isDefault={rdValue === "none"}
        options={rdOptions}
        value={rdValue}
        onChange={(v) => onChange({ ...state, sort: v === "none" ? "none" : v })}
      />
      <FilterPopover<HqRegionFilter>
        label="Hoofdkantoor"
        selectedLabel={hqLabel}
        isDefault={state.hqRegion === "all"}
        options={hqOptions}
        value={state.hqRegion}
        onChange={(v) => onChange({ ...state, hqRegion: v })}
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
