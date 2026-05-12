"use client";

import { useState } from "react";
import { FinancialsChart } from "@/components/charts/financials-chart";
import { QuarterlyOverview } from "@/components/quarterly-overview";
import { cn } from "@/lib/utils";
import type { IncomeStatementPeriod } from "@/lib/yahoo";

interface FinancialsTabsProps {
  annual: IncomeStatementPeriod[];
  quarterly: IncomeStatementPeriod[];
  currency: string;
}

export function FinancialsTabs({ annual, quarterly, currency }: FinancialsTabsProps) {
  const [tab, setTab] = useState<"annual" | "quarterly">("annual");

  return (
    <div>
      <div className="flex gap-1 border-b border-zinc-100">
        {(["annual", "quarterly"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              tab === t
                ? "border-b-2 border-vig-blue text-vig-blue"
                : "text-zinc-500 hover:text-vig-navy",
            )}
          >
            {t === "annual" ? "Jaarlijks" : "Per kwartaal"}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tab === "annual" ? (
          <FinancialsChart annual={annual} quarterly={quarterly} currency={currency} />
        ) : (
          <QuarterlyOverview quarterly={quarterly} currency={currency} />
        )}
      </div>
    </div>
  );
}
