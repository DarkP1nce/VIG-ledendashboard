import { NextResponse } from "next/server";

import { getCompanyBySlug, getCompanyByTicker } from "@/data/companies";
import {
  getIncomeStatementAnnual,
  getIncomeStatementQuarterly,
  getQuote,
} from "@/lib/yahoo";

interface RouteContext {
  params: { ticker: string };
}

export async function GET(_req: Request, { params }: RouteContext) {
  const input = decodeURIComponent(params.ticker);
  const resolved = getCompanyBySlug(input) ?? getCompanyByTicker(input);
  const symbol = resolved?.ticker ?? input;

  const started = Date.now();
  try {
    const [quote, annual, quarterly] = await Promise.all([
      getQuote(symbol),
      getIncomeStatementAnnual(symbol),
      getIncomeStatementQuarterly(symbol),
    ]);
    return NextResponse.json(
      {
        ok: true,
        input,
        resolvedTicker: symbol,
        company: resolved ?? null,
        fetchedInMs: Date.now() - started,
        annualPeriods: annual.length,
        quarterlyPeriods: quarterly.length,
        quote,
        annual,
        quarterly,
      },
      { status: 200 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        ok: false,
        input,
        resolvedTicker: symbol,
        error: message,
      },
      { status: 500 },
    );
  }
}
