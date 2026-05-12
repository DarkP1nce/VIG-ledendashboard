import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { PriceChart } from "@/components/charts/price-chart";
import { RdChart } from "@/components/charts/rd-chart";
import { QuoteTile } from "@/components/charts/quote-tile";
import { SegmentPie } from "@/components/charts/segment-pie";
import { CompanyMonogram } from "@/components/company-monogram";
import { CsvExportButton } from "@/components/csv-export-button";
import { FinancialsTabs } from "@/components/financials-tabs";
import { KeyMetricsRow } from "@/components/key-metrics-row";
import { companies, getCompanyBySlug } from "@/data/companies";
import { getLatestSegments } from "@/data/segments";
import {
  getHistoricalPrices5y,
  getIncomeStatementAnnual,
  getIncomeStatementQuarterly,
  getQuote,
} from "@/lib/yahoo";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return companies.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const company = getCompanyBySlug(params.slug);
  if (!company) return {};
  return {
    title: company.fullName,
    description: `Financiële data voor ${company.fullName} (${company.ticker}): omzet, nettowinst, R&D-investeringen en beurskoers.`,
    openGraph: {
      title: `${company.fullName} · VIG Ledendashboard`,
      description: `Financiële data voor ${company.fullName} (${company.ticker}): omzet, nettowinst, R&D-investeringen en beurskoers.`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${company.fullName} · VIG Ledendashboard`,
      description: `Financiële data voor ${company.fullName} (${company.ticker}): omzet, nettowinst, R&D-investeringen en beurskoers.`,
    },
  };
}

export const revalidate = 43200;

export default async function CompanyDetailPage({ params }: PageProps) {
  const company = getCompanyBySlug(params.slug);
  if (!company) notFound();

  const [quote, annual, quarterly, prices] = await Promise.all([
    getQuote(company.ticker),
    getIncomeStatementAnnual(company.ticker),
    getIncomeStatementQuarterly(company.ticker),
    getHistoricalPrices5y(company.ticker),
  ]);

  const latest = getLatestSegments(company.ticker);

  const csvRows = [
    ...annual.map((p) => ({
      type: "annual",
      endDate: p.endDate,
      revenue: p.revenue,
      grossProfit: p.grossProfit,
      operatingIncome: p.operatingIncome,
      netIncome: p.netIncome,
      ebitda: p.ebitda,
    })),
    ...quarterly.map((p) => ({
      type: "quarterly",
      endDate: p.endDate,
      revenue: p.revenue,
      grossProfit: p.grossProfit,
      operatingIncome: p.operatingIncome,
      netIncome: p.netIncome,
      ebitda: p.ebitda,
    })),
  ];

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-vig-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Terug naar overzicht
      </Link>

      <header className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-end gap-5">
          <CompanyMonogram company={company} size="xl" />
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-vig-orange" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-vig-orange">
                {company.country}
              </p>
            </div>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-vig-navy sm:text-5xl">
              {company.fullName}
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              {company.exchange} · {company.ticker} · {company.currency}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-end">
          <CsvExportButton
            rows={csvRows}
            filename={`${company.slug}-financials.csv`}
          />
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-vig-navy shadow-sm transition-colors hover:border-vig-blue hover:text-vig-blue"
          >
            Bedrijfswebsite
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      <section className="mt-10">
        <KeyMetricsRow
          annual={annual}
          quarterly={quarterly}
          currency={company.currency}
        />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <QuoteTile quote={quote} currency={company.currency} />
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-card lg:col-span-2">
          <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Financiële resultaten
          </h2>
          <div className="mt-4">
            <FinancialsTabs
              annual={annual}
              quarterly={quarterly}
              currency={company.currency}
            />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border bg-white p-6 shadow-card">
        <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Beurskoers
        </h2>
        <div className="mt-4">
          <PriceChart
            prices={prices}
            currency={company.currency}
            color={company.color}
          />
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-card">
          <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Ziektegebieden
          </h2>
          {latest ? (
            <>
              <p className="mt-1 text-sm text-zinc-500">
                Aandeel van omzet, boekjaar {latest.fiscalYear}.
              </p>
              <div className="mt-6">
                <SegmentPie
                  ariaLabel="Verdeling per ziektegebied"
                  data={latest.therapeuticAreas.map((t) => ({
                    name: t.name,
                    revenueShare: t.revenueShare,
                  }))}
                />
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">
              Geen segmentdata beschikbaar.
            </p>
          )}
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-card">
          <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Geografische omzet
          </h2>
          {latest ? (
            <>
              <p className="mt-1 text-sm text-zinc-500">
                Aandeel van omzet, boekjaar {latest.fiscalYear}.
              </p>
              <div className="mt-6">
                <SegmentPie
                  ariaLabel="Verdeling per regio"
                  data={latest.geographicSegments.map((g) => ({
                    name: g.region,
                    revenueShare: g.revenueShare,
                  }))}
                />
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">
              Geen segmentdata beschikbaar.
            </p>
          )}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border bg-white p-6 shadow-card">
        <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          R&amp;D-investeringen
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Uitgaven aan onderzoek &amp; ontwikkeling als % van de omzet, per boekjaar.
        </p>
        <div className="mt-6">
          <RdChart annual={annual} currency={company.currency} />
        </div>
      </section>

      {latest?.source && (
        <p className="mt-8 text-xs text-zinc-500">
          Bron segmentdata: {latest.source}
        </p>
      )}
    </div>
  );
}
