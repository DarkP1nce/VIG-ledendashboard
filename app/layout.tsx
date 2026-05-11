import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { CommandPalette } from "@/components/command-palette";
import { ThemeToggle } from "@/components/theme-toggle";
import { companies } from "@/data/companies";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VIG Dashboard — Beursgenoteerde leden",
  description:
    "Financieel overzicht van beursgenoteerde leden van de Vereniging Innovatieve Geneesmiddelen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(47,168,214,0.08),transparent),linear-gradient(to_bottom,#fafafa,#ffffff)] font-sans text-vig-navy antialiased dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(31,106,165,0.18),transparent),linear-gradient(to_bottom,#0b0f1a,#020409)] dark:text-zinc-100">
        <header className="sticky top-0 z-40 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-white/5 dark:bg-zinc-950/60">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="group flex items-center gap-2.5">
              <span className="relative flex h-7 w-7 items-center justify-center rounded-xl bg-vig-navy">
                <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-vig-blue to-vig-navy" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-vig-orange" />
              </span>
              <span className="text-sm font-semibold tracking-tight text-vig-navy dark:text-zinc-100">
                VIG Dashboard
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <nav className="hidden items-center gap-1 text-sm sm:flex">
                <NavLink href="/">Bedrijven</NavLink>
                <NavLink href="/compare">Vergelijken</NavLink>
              </nav>
              <CommandPalette companies={companies} />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-16">{children}</main>

        <footer className="mt-32 border-t border-zinc-200/60 bg-white/60 dark:border-white/5 dark:bg-zinc-950/40">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-vig-orange" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-vig-navy dark:text-zinc-100">
                Disclaimer
              </p>
            </div>
            <p className="mt-3 max-w-3xl text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Geen beleggingsadvies. Data kan vertraagd of onnauwkeurig zijn.
              Dit dashboard is een informatief overzicht en geen aanbeveling
              tot koop, verkoop of het aanhouden van financiële instrumenten.
              Raadpleeg de jaarverslagen van de bedrijven voor officiële
              cijfers.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-1.5 text-zinc-600 transition-colors hover:bg-zinc-100/80 hover:text-vig-navy dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-zinc-100"
    >
      {children}
    </Link>
  );
}
