"use client";

import { useDisplayCurrency } from "@/lib/currency-context";
import type { DisplayCurrency } from "@/lib/fx";
import { cn } from "@/lib/utils";

const OPTIONS: { value: DisplayCurrency; label: string }[] = [
  { value: "original", label: "Origineel" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

export function CurrencySwitcher() {
  const { displayCurrency, setDisplayCurrency } = useDisplayCurrency();

  return (
    <div className="flex items-center rounded-lg border border-white/15 bg-white/10 p-0.5 text-xs font-medium">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setDisplayCurrency(opt.value)}
          className={cn(
            "rounded-md px-2.5 py-1 transition-colors",
            displayCurrency === opt.value
              ? "bg-vig-blue-light/40 text-white shadow-sm"
              : "text-white/60 hover:text-white",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
