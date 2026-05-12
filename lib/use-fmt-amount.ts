"use client";

import { useDisplayCurrency } from "@/lib/currency-context";
import { convertAmount } from "@/lib/fx";
import { formatCurrencyCompact, formatCurrencyPrice } from "@/lib/format";

export function useFmtAmount(fromCurrency: string) {
  const { displayCurrency } = useDisplayCurrency();

  function compact(value: number | null): string {
    if (value === null) return "—";
    const { amount, currency } = convertAmount(value, fromCurrency, displayCurrency);
    return formatCurrencyCompact(amount, currency);
  }

  function price(value: number | null): string {
    if (value === null) return "—";
    const { amount, currency } = convertAmount(value, fromCurrency, displayCurrency);
    return formatCurrencyPrice(amount, currency);
  }

  function convert(value: number | null): number | null {
    if (value === null) return null;
    return convertAmount(value, fromCurrency, displayCurrency).amount;
  }

  const effectiveCurrency =
    displayCurrency === "original" ? fromCurrency : displayCurrency;

  return { compact, price, convert, effectiveCurrency };
}
