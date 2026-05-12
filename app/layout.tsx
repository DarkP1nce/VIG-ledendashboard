import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { CommandPalette } from "@/components/command-palette";
import { CurrencySwitcher } from "@/components/currency-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { NavLink } from "@/components/nav-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { companies } from "@/data/companies";
import { CurrencyProvider } from "@/lib/currency-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000",
  ),
  title: {
    default: "VIG Ledendashboard",
    template: "%s · VIG Ledendashboard",
  },
  description:
    "Financieel overzicht van beursgenoteerde leden van de Vereniging Innovatieve Geneesmiddelen. Omzet, R&D-investeringen en geografische verdeling per kwartaal en per jaar.",
  openGraph: {
    type: "website",
    siteName: "VIG Ledendashboard",
    title: "VIG Ledendashboard",
    description:
      "Financieel overzicht van beursgenoteerde leden van de Vereniging Innovatieve Geneesmiddelen.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VIG Ledendashboard",
    description:
      "Financieel overzicht van beursgenoteerde leden van de Vereniging Innovatieve Geneesmiddelen.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(47,168,214,0.08),transparent),linear-gradient(to_bottom,#fafafa,#ffffff)] font-sans text-vig-navy antialiased dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(31,106,165,0.18),transparent),linear-gradient(to_bottom,#0b0f1a,#020409)] dark:text-zinc-100">
      <CurrencyProvider>
        <header className="sticky top-0 z-40 border-b border-white/10 bg-vig-navy backdrop-blur-xl relative">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="group flex items-center">
              <img
                src="/vig-logo.svg"
                alt="Vereniging Innovatieve Geneesmiddelen"
                className="h-16 w-auto invert"
              />
            </Link>
            <div className="flex items-center gap-2">
              <nav className="hidden items-center gap-1 text-sm sm:flex">
                <NavLink href="/">Bedrijven</NavLink>
                <NavLink href="/compare">Vergelijken</NavLink>
              </nav>
              <CurrencySwitcher />
              <CommandPalette companies={companies} />
              <ThemeToggle />
              <MobileNav />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 pb-16 pt-0">{children}</main>

        <footer className="mt-32 border-t border-zinc-200/60 bg-white/60 dark:border-white/5 dark:bg-zinc-950/40">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-vig-orange" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-vig-navy dark:text-zinc-100">
                Disclaimer
              </p>
            </div>
            <p className="mt-3 max-w-3xl text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Dit dashboard is uitsluitend bedoeld ter informatie en vormt geen
              beleggingsadvies, aanbeveling tot koop of verkoop, of enige andere
              financiële dienst. Financiële data wordt automatisch opgehaald via
              Yahoo Finance en kan vertraagd, onvolledig of onnauwkeurig zijn.
              Koersen, omzetcijfers en R&amp;D-uitgaven zijn gebaseerd op
              gepubliceerde kwartaal- en jaarverslagen; afwijkingen ten opzichte
              van officiële bronnen zijn mogelijk. Raadpleeg altijd de
              jaarverslagen en officiële berichtgeving van de betreffende
              ondernemingen voor definitieve cijfers. De Vereniging Innovatieve
              Geneesmiddelen (VIG) aanvaardt geen aansprakelijkheid voor
              beslissingen genomen op basis van de informatie op dit dashboard.
            </p>
            <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500" suppressHydrationWarning>
              Data via Yahoo Finance · Verversing elke 12 uur ·{" "}
              &copy; {new Date().getFullYear()} Vereniging Innovatieve Geneesmiddelen
            </p>
          </div>
        </footer>
      </CurrencyProvider>
      </body>
    </html>
  );
}

