"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import type { CompanyQuote } from "@/lib/yahoo";
import { formatPercentChange } from "@/lib/format";
import { useFmtAmount } from "@/lib/use-fmt-amount";
import { cn } from "@/lib/utils";

interface QuoteTileProps {
  quote: CompanyQuote | null;
  currency: string;
}

export function QuoteTile({ quote, currency }: QuoteTileProps) {
  const { compact, price } = useFmtAmount(currency);
  if (!quote || quote.regularMarketPrice === null) {
    return (
      <div className="flex h-full flex-col rounded-2xl border bg-white p-6 shadow-card">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Huidige koers
        </p>
        <div className="mt-auto pt-6 text-sm text-zinc-500">
          Live koers niet beschikbaar via Yahoo Finance voor dit symbool.
        </div>
      </div>
    );
  }

  const change = quote.regularMarketChangePercent;
  const positive = (change ?? 0) >= 0;

  return (
    <div className="flex h-full flex-col rounded-2xl border bg-white p-6 shadow-card">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        Huidige koers
      </p>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-vig-navy">
        {price(quote.regularMarketPrice)}
      </p>
      {change !== null && (
        <p
          className={cn(
            "mt-1 inline-flex items-center gap-1 text-sm font-medium tabular-nums",
            positive ? "text-emerald-600" : "text-rose-600",
          )}
        >
          {positive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {formatPercentChange(change)}
        </p>
      )}

      <dl className="mt-6 space-y-2 border-t border-zinc-100 pt-4 text-sm">
        <Row label="Marktwaarde">
          {compact(quote.marketCap)}
        </Row>
        <Row label="52w hoog">
          {price(quote.fiftyTwoWeekHigh)}
        </Row>
        <Row label="52w laag">
          {price(quote.fiftyTwoWeekLow)}
        </Row>
      </dl>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="font-medium tabular-nums text-vig-navy">{children}</dd>
    </div>
  );
}
