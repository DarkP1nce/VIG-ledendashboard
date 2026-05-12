import { formatCurrencyCompact, formatPeriodLabel } from "@/lib/format";
import type { IncomeStatementPeriod } from "@/lib/yahoo";

interface QuarterlyOverviewProps {
  quarterly: IncomeStatementPeriod[];
  currency: string;
}

export function QuarterlyOverview({ quarterly, currency }: QuarterlyOverviewProps) {
  const rows = [...quarterly]
    .filter((q) => q.revenue !== null || q.netIncome !== null)
    .sort((a, b) => b.endDate.localeCompare(a.endDate))
    .slice(0, 8);

  if (rows.length === 0) {
    return (
      <p className="mt-4 text-sm text-zinc-500">
        Geen kwartaaldata beschikbaar via Yahoo Finance.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-100">
            <th className="pb-3 text-left text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Kwartaal
            </th>
            <th className="pb-3 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Omzet
            </th>
            <th className="pb-3 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Nettowinst
            </th>
            <th className="pb-3 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Nettomarge
            </th>
            <th className="pb-3 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              R&amp;D
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {rows.map((q, i) => {
            const margin =
              q.revenue && q.netIncome !== null && q.revenue > 0
                ? (q.netIncome / q.revenue) * 100
                : null;
            const isLatest = i === 0;
            return (
              <tr
                key={q.endDate}
                className={isLatest ? "bg-vig-blue/[0.03]" : ""}
              >
                <td className="py-3 font-medium tabular-nums text-vig-navy">
                  {formatPeriodLabel(q.endDate, "quarterly")}
                  {isLatest && (
                    <span className="ml-2 rounded bg-vig-blue/10 px-1.5 py-0.5 text-[10px] font-semibold text-vig-blue">
                      Meest recent
                    </span>
                  )}
                </td>
                <td className="py-3 text-right tabular-nums text-vig-navy">
                  {formatCurrencyCompact(q.revenue, currency)}
                </td>
                <td
                  className={`py-3 text-right tabular-nums ${
                    q.netIncome !== null && q.netIncome < 0
                      ? "text-rose-600"
                      : "text-vig-navy"
                  }`}
                >
                  {formatCurrencyCompact(q.netIncome, currency)}
                </td>
                <td
                  className={`py-3 text-right tabular-nums ${
                    margin !== null && margin < 0
                      ? "text-rose-600"
                      : "text-zinc-600"
                  }`}
                >
                  {margin !== null ? `${margin.toFixed(1)}%` : "—"}
                </td>
                <td className="py-3 text-right tabular-nums text-zinc-600">
                  {formatCurrencyCompact(q.researchAndDevelopment, currency)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-zinc-400">
        Bedragen in {currency}. Bron: Yahoo Finance. Laatste 8 kwartalen.
      </p>
    </div>
  );
}
