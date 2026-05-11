import { YoYPill } from "@/components/yoy-pill";
import {
  pickLatestAndPriorAnnual,
  ttmSum,
  yoyPercent,
} from "@/lib/aggregate";
import { formatCurrencyCompact } from "@/lib/format";
import type { IncomeStatementPeriod } from "@/lib/yahoo";

interface KeyMetricsRowProps {
  annual: IncomeStatementPeriod[];
  quarterly: IncomeStatementPeriod[];
  currency: string;
}

export function KeyMetricsRow({
  annual,
  quarterly,
  currency,
}: KeyMetricsRowProps) {
  const { latest, prior } = pickLatestAndPriorAnnual(annual);

  const revenueYoY = yoyPercent(latest?.revenue, prior?.revenue);
  const netIncomeYoY = yoyPercent(latest?.netIncome, prior?.netIncome);
  const ttmRev = ttmSum(quarterly, "revenue");
  const ttmNet = ttmSum(quarterly, "netIncome");

  const margin =
    latest?.revenue && latest?.netIncome
      ? (latest.netIncome / latest.revenue) * 100
      : null;

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-200/70 bg-zinc-200/60 sm:grid-cols-4">
      <Stat
        label="Omzet (jaar)"
        value={formatCurrencyCompact(latest?.revenue ?? null, currency)}
        pill={<YoYPill value={revenueYoY} />}
        sublabel={
          latest?.endDate
            ? `FY ${new Date(latest.endDate).getUTCFullYear()}`
            : undefined
        }
      />
      <Stat
        label="Nettowinst (jaar)"
        value={formatCurrencyCompact(latest?.netIncome ?? null, currency)}
        pill={<YoYPill value={netIncomeYoY} />}
        sublabel={
          latest?.endDate
            ? `FY ${new Date(latest.endDate).getUTCFullYear()}`
            : undefined
        }
      />
      <Stat
        label="Nettomarge"
        value={margin !== null ? `${margin.toFixed(1)}%` : "—"}
        sublabel="op laatste jaar"
      />
      <Stat
        label="Omzet TTM"
        value={ttmRev !== null ? formatCurrencyCompact(ttmRev, currency) : "—"}
        sublabel={
          ttmNet !== null
            ? `Nettowinst ${formatCurrencyCompact(ttmNet, currency)}`
            : "Laatste 4 kwartalen"
        }
      />
    </div>
  );
}

function Stat({
  label,
  value,
  sublabel,
  pill,
}: {
  label: string;
  value: string;
  sublabel?: string;
  pill?: React.ReactNode;
}) {
  return (
    <div className="bg-white p-5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="font-display text-2xl font-semibold tabular-nums tracking-tight text-vig-navy">
          {value}
        </p>
        {pill}
      </div>
      {sublabel && (
        <p className="mt-1 text-xs text-zinc-500">{sublabel}</p>
      )}
    </div>
  );
}
