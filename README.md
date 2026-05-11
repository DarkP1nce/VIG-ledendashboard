# VIG Dashboard

Financieel overzicht van beursgenoteerde leden van de **Vereniging Innovatieve Geneesmiddelen** (VIG). Live koersen + jaarcijfers via Yahoo Finance, ziektegebieden + geografische omzet via handmatig onderhouden JSON.

> **Disclaimer:** Geen beleggingsadvies. Data kan vertraagd of onnauwkeurig zijn.

## Tech stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS v3** + **shadcn/ui** componenten (Tailwind v3 variant — niet `shadcn add` blindelings draaien)
- **Recharts** voor grafieken
- **yahoo-finance2** voor financiële data, gecachet met `unstable_cache` (12 uur)
- **cmdk** voor ⌘K-zoekpalet
- **lucide-react** voor icoontjes
- **TradingView mini-widget** voor live koers­grafieken (extern via JS-embed)

## Lokaal draaien

```bash
npm install
npm run dev
# → http://localhost:3000 (of 3001 als 3000 bezet is)
```

## Belangrijkste mappen

```
app/
  page.tsx                       overzicht met hero + sparkline-cards
  company/[slug]/page.tsx        detailpagina per bedrijf
  compare/page.tsx               vergelijkings­pagina met regio-filter
  api/test/[ticker]/route.ts     debug-route voor ruwe Yahoo-data

components/
  charts/                        Recharts-componenten
  compare/                       comparison-view + indexed chart
  ui/                            shadcn primitieven (Card, Button)
  company-card.tsx
  company-monogram.tsx           gradient-monogram of logo
  command-palette.tsx            ⌘K
  ...

data/
  companies.ts                   bedrijfslijst (metadata + brand color)
  segments.ts                    ziektegebieden + geografie (handmatig)

lib/
  yahoo.ts                       getQuote, getIncomeStatement* (cached 12u)
  aggregate.ts                   YoY, TTM, sparkline-serie helpers
  format.ts                      Intl-gebaseerde formatters
  utils.ts                       cn() helper

public/
  logos/                         (leeg) — drop hier .svg's en zet
                                  logoUrl in companies.ts om monogram te vervangen
```

## Een bedrijf toevoegen

1. Open `data/companies.ts`, kopieer een bestaand object, vul aan:
   - `slug`: URL-vriendelijke naam (bv. `eli-lilly`)
   - `ticker`: Yahoo-symbool (bv. `LLY`)
   - `tradingViewSymbol`: bv. `NYSE:LLY` (zie tradingview.com voor exact symbool)
   - `color`: hex uit VIG-palet of distinct
2. Open `data/segments.ts`, voeg een entry toe onder de yahoo-ticker met therapeutische + geografische verdeling uit het meest recente jaarverslag. Percentages tellen op tot ~100.
3. Hot-reload pikt het op.

## Segmentdata bijwerken

Eens per jaar (na publicatie nieuw jaarverslag):

1. Open `data/segments.ts`
2. Voeg een nieuw `YearlySegments`-object toe aan de array van het bedrijf (zelfde structuur, hoger `fiscalYear`)
3. `getLatestSegments()` pakt automatisch het meest recente jaar

## Yahoo Finance kwirken

Belangrijke gotchas (zie ook commentaren in `lib/yahoo.ts`):

- yahoo-finance2 v3 vereist `new YahooFinance()`.
- `module` voor income statement is `"financials"` — niet `"income-statement"`.
- Response-keys hebben geen prefix: `row.totalRevenue`, niet `row.annualTotalRevenue`.
- Roche werkt alleen met `RO.SW` (niet `ROG.SW`).
- Quarterly historie via gratis API is gelimiteerd tot ~5-7 perioden, niet 20.

## Deployment naar Vercel

1. **GitHub repo aanmaken.** In de root van dit project:
   ```bash
   git init
   git add .
   git commit -m "Initial VIG Dashboard"
   git branch -M main
   git remote add origin https://github.com/<jouw-username>/vig-dashboard.git
   git push -u origin main
   ```
   *(Maak eerst de repo aan op github.com — leeg, geen README, geen .gitignore.)*

2. **Vercel koppelen.** Op [vercel.com/new](https://vercel.com/new):
   - "Import Git Repository" → kies `vig-dashboard`
   - Framework preset: **Next.js** (auto-gedetecteerd)
   - Build command: `npm run build` (default)
   - Output directory: `.next` (default)
   - Environment variables: **geen** — Yahoo Finance heeft geen API-key nodig.
   - Klik **Deploy**.

3. **Custom domain (optioneel).** Onder Settings → Domains, voeg je eigen domein toe.

Volgende pushes naar `main` deployen automatisch.

## Bekende beperkingen / volgende stappen

- **Logo's** — `logoUrl`-veld in `companies.ts` staat klaar. Drop SVG's in `public/logos/` en zet bv. `logoUrl: "/logos/pfizer.svg"`.
- **Marktaandeel per ziektegebied** — UI-sectie staat klaar op `/compare`, data ontbreekt nog.
- **Dark mode** — toggle werkt; kleuren zijn voor ~80% omgezet; sommige cards kunnen nog polish gebruiken.
- **Echte 5-jaar kwartaalhistorie** — vereist betaalde data-bron (Refinitiv, Bloomberg, Polygon).
