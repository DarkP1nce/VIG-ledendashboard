"use client";

import { ALL_REGIONS, REGION_LABELS_NL, type Region } from "@/data/segments";
import { cn } from "@/lib/utils";

export type RegionSelection = Region | "all";

interface RegionFilterProps {
  value: RegionSelection;
  onChange: (value: RegionSelection) => void;
  label?: string;
}

export function RegionFilter({
  value,
  onChange,
  label = "Filter op omzetregio",
}: RegionFilterProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Chip
          active={value === "all"}
          onClick={() => onChange("all")}
          label="Alle regio's"
        />
        {ALL_REGIONS.map((r) => (
          <Chip
            key={r}
            active={value === r}
            onClick={() => onChange(r)}
            label={REGION_LABELS_NL[r]}
          />
        ))}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-vig-navy bg-vig-navy text-white"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-vig-navy",
      )}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
