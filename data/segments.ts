export type Region =
  | "North America"
  | "Europe"
  | "Japan"
  | "Asia-Pacific (excl. Japan)"
  | "Latin America"
  | "Rest of World";

export interface TherapeuticArea {
  name: string;
  revenueShare: number;
}

export interface GeographicSegment {
  region: Region;
  revenueShare: number;
}

export interface YearlySegments {
  fiscalYear: number;
  therapeuticAreas: TherapeuticArea[];
  geographicSegments: GeographicSegment[];
  source: string;
  lastUpdated: string;
}

const THERAPEUTIC_AREA_MAP: Record<string, string> = {
  // Oncologie
  "Oncology": "Oncologie",
  "Oncology (Keytruda)": "Oncologie",
  "Oncology (Lenvima)": "Oncologie",
  "Rare Disease & Oncology": "Oncologie",
  // Immunologie
  "Immunology": "Immunologie",
  "Immunology (Dupixent etc.)": "Immunologie",
  "Inflammation": "Immunologie",
  "Respiratory & Immunology": "Immunologie",
  // Neurologie
  "Neuroscience": "Neurologie",
  "Neurology": "Neurologie",
  "Multiple Sclerosis": "Neurologie",
  "Neuroscience (Dysport)": "Neurologie",
  "Neurology (Leqembi & legacy)": "Neurologie",
  "Alzheimer's (Leqembi)": "Neurologie",
  "SMA (Spinraza)": "Neurologie",
  "Psychiatry": "Neurologie",
  // Cardiovasculair
  "Cardiovascular": "Cardiovasculair",
  "Cardiovascular (Eliquis)": "Cardiovasculair",
  "Cardiovascular & Metabolism": "Cardiovasculair",
  "Cardiovascular, Renal & Metabolism": "Cardiovasculair",
  "Diabetes & Cardiovascular": "Cardiovasculair",
  // Diabetes & Obesitas
  "Diabetes Care (GLP-1)": "Diabetes & Obesitas",
  "Diabetes Care (Insulin)": "Diabetes & Obesitas",
  "Obesity Care": "Diabetes & Obesitas",
  "Other Diabetes & Care": "Diabetes & Obesitas",
  "Diabetes (Insulin)": "Diabetes & Obesitas",
  "Diabetes & Obesity (Incretins)": "Diabetes & Obesitas",
  // Zeldzame Ziekten
  "Rare Disease": "Zeldzame Ziekten",
  "Rare Diseases": "Zeldzame Ziekten",
  "Rare Disease & Other": "Zeldzame Ziekten",
  "Rare Disease (Haemophilia & Growth)": "Zeldzame Ziekten",
  "Plasma-Derived Therapies": "Zeldzame Ziekten",
  // Hematologie
  "Hematology": "Hematologie",
  // Infectieziekten
  "Infectious Diseases": "Infectieziekten",
  "Infectious Diseases & Vaccines": "Infectieziekten",
  "HIV": "Infectieziekten",
  "COVID antivirals (Veklury)": "Infectieziekten",
  "Liver Disease (HCV/HBV)": "Infectieziekten",
  "Anti-infective": "Infectieziekten",
  // Vaccins
  "Vaccines": "Vaccins",
  "Vaccines & Other": "Vaccins",
  "Vaccines (Gardasil etc.)": "Vaccins",
  // Biosimilars
  "Biosimilars": "Biosimilars",
  "Other & Biosimilars": "Biosimilars",
  // Oogheelkunde
  "Ophthalmology": "Oogheelkunde",
  "Ophthalmology & Established": "Oogheelkunde",
  "Eye Care": "Oogheelkunde",
  // Gastro-enterologie
  "Gastroenterology": "Gastro-enterologie",
};

export function normalizeTherapeuticArea(name: string): string {
  return THERAPEUTIC_AREA_MAP[name] ?? "Overig";
}

export const segments: Record<string, YearlySegments[]> = {
  PFE: [
    {
      fiscalYear: 2023,
      source:
        "Pfizer Annual Report 2023 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Primary Care", revenueShare: 45 },
        { name: "Specialty Care", revenueShare: 28 },
        { name: "Oncology", revenueShare: 22 },
        { name: "Other", revenueShare: 5 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 52 },
        { region: "Europe", revenueShare: 20 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 13 },
        { region: "Japan", revenueShare: 4 },
        { region: "Latin America", revenueShare: 6 },
        { region: "Rest of World", revenueShare: 5 },
      ],
    },
  ],
  JNJ: [
    {
      fiscalYear: 2023,
      source:
        "J&J Annual Report 2023 (approximate — verify before publishing). Consumer Health spun off as Kenvue in 2023.",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Immunology", revenueShare: 30 },
        { name: "Oncology", revenueShare: 22 },
        { name: "Neuroscience", revenueShare: 14 },
        { name: "Cardiovascular & Metabolism", revenueShare: 10 },
        { name: "Pulmonary Hypertension", revenueShare: 6 },
        { name: "Infectious Diseases & Vaccines", revenueShare: 5 },
        { name: "MedTech & Other", revenueShare: 13 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 55 },
        { region: "Europe", revenueShare: 22 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 13 },
        { region: "Japan", revenueShare: 5 },
        { region: "Latin America", revenueShare: 3 },
        { region: "Rest of World", revenueShare: 2 },
      ],
    },
  ],
  "RO.SW": [
    {
      fiscalYear: 2023,
      source:
        "Roche Annual Report 2023 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Oncology", revenueShare: 38 },
        { name: "Immunology", revenueShare: 14 },
        { name: "Neuroscience", revenueShare: 10 },
        { name: "Ophthalmology", revenueShare: 8 },
        { name: "Hematology", revenueShare: 7 },
        { name: "Infectious Diseases", revenueShare: 5 },
        { name: "Diagnostics", revenueShare: 18 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 49 },
        { region: "Europe", revenueShare: 24 },
        { region: "Japan", revenueShare: 7 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 12 },
        { region: "Latin America", revenueShare: 6 },
        { region: "Rest of World", revenueShare: 2 },
      ],
    },
  ],
  "NOVO-B.CO": [
    {
      fiscalYear: 2023,
      source:
        "Novo Nordisk Annual Report 2023 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Diabetes Care (GLP-1)", revenueShare: 42 },
        { name: "Diabetes Care (Insulin)", revenueShare: 22 },
        { name: "Obesity Care", revenueShare: 22 },
        { name: "Rare Disease (Haemophilia & Growth)", revenueShare: 8 },
        { name: "Other Diabetes & Care", revenueShare: 6 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 58 },
        { region: "Europe", revenueShare: 22 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 11 },
        { region: "Japan", revenueShare: 2 },
        { region: "Latin America", revenueShare: 4 },
        { region: "Rest of World", revenueShare: 3 },
      ],
    },
  ],
  "4502.T": [
    {
      fiscalYear: 2023,
      source:
        "Takeda Annual Report FY2023 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Gastroenterology", revenueShare: 25 },
        { name: "Rare Diseases", revenueShare: 19 },
        { name: "Plasma-Derived Therapies", revenueShare: 19 },
        { name: "Oncology", revenueShare: 12 },
        { name: "Neuroscience", revenueShare: 14 },
        { name: "Vaccines", revenueShare: 3 },
        { name: "Other", revenueShare: 8 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 49 },
        { region: "Japan", revenueShare: 18 },
        { region: "Europe", revenueShare: 21 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 7 },
        { region: "Latin America", revenueShare: 3 },
        { region: "Rest of World", revenueShare: 2 },
      ],
    },
  ],
  ABBV: [
    {
      fiscalYear: 2024,
      source: "AbbVie Annual Report 2024 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Immunology", revenueShare: 50 },
        { name: "Neuroscience", revenueShare: 16 },
        { name: "Oncology", revenueShare: 12 },
        { name: "Aesthetics", revenueShare: 8 },
        { name: "Eye Care", revenueShare: 4 },
        { name: "Other", revenueShare: 10 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 70 },
        { region: "Europe", revenueShare: 15 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 8 },
        { region: "Japan", revenueShare: 3 },
        { region: "Latin America", revenueShare: 2 },
        { region: "Rest of World", revenueShare: 2 },
      ],
    },
  ],
  AMGN: [
    {
      fiscalYear: 2024,
      source: "Amgen Annual Report 2024 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Oncology", revenueShare: 30 },
        { name: "Inflammation", revenueShare: 22 },
        { name: "Bone Health", revenueShare: 21 },
        { name: "Cardiovascular", revenueShare: 9 },
        { name: "Other & Biosimilars", revenueShare: 18 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 73 },
        { region: "Europe", revenueShare: 14 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 7 },
        { region: "Japan", revenueShare: 3 },
        { region: "Latin America", revenueShare: 2 },
        { region: "Rest of World", revenueShare: 1 },
      ],
    },
  ],
  "4503.T": [
    {
      fiscalYear: 2023,
      source: "Astellas Pharma FY2023 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Oncology", revenueShare: 50 },
        { name: "Transplant", revenueShare: 10 },
        { name: "Urology", revenueShare: 8 },
        { name: "Women's Health", revenueShare: 5 },
        { name: "Anti-infective", revenueShare: 7 },
        { name: "Other", revenueShare: 20 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 40 },
        { region: "Japan", revenueShare: 22 },
        { region: "Europe", revenueShare: 22 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 12 },
        { region: "Rest of World", revenueShare: 4 },
      ],
    },
  ],
  AZN: [
    {
      fiscalYear: 2024,
      source: "AstraZeneca Annual Report 2024 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Oncology", revenueShare: 42 },
        { name: "Cardiovascular, Renal & Metabolism", revenueShare: 25 },
        { name: "Respiratory & Immunology", revenueShare: 17 },
        { name: "Rare Disease", revenueShare: 13 },
        { name: "Vaccines & Other", revenueShare: 3 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 45 },
        { region: "Europe", revenueShare: 20 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 25 },
        { region: "Japan", revenueShare: 5 },
        { region: "Rest of World", revenueShare: 5 },
      ],
    },
  ],
  "BAYN.DE": [
    {
      fiscalYear: 2024,
      source: "Bayer Annual Report 2024 (approximate — verify before publishing). Note: Bayer is a diversified conglomerate; Crop Science is its largest division.",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Crop Science", revenueShare: 50 },
        { name: "Pharmaceuticals", revenueShare: 38 },
        { name: "Consumer Health", revenueShare: 12 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 36 },
        { region: "Europe", revenueShare: 30 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 18 },
        { region: "Latin America", revenueShare: 14 },
        { region: "Rest of World", revenueShare: 2 },
      ],
    },
  ],
  BIIB: [
    {
      fiscalYear: 2024,
      source: "Biogen Annual Report 2024 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Multiple Sclerosis", revenueShare: 50 },
        { name: "SMA (Spinraza)", revenueShare: 12 },
        { name: "Alzheimer's (Leqembi)", revenueShare: 5 },
        { name: "Biosimilars", revenueShare: 15 },
        { name: "Other", revenueShare: 18 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 55 },
        { region: "Europe", revenueShare: 25 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 8 },
        { region: "Japan", revenueShare: 5 },
        { region: "Rest of World", revenueShare: 7 },
      ],
    },
  ],
  BMY: [
    {
      fiscalYear: 2024,
      source: "Bristol Myers Squibb Annual Report 2024 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Oncology", revenueShare: 30 },
        { name: "Cardiovascular (Eliquis)", revenueShare: 30 },
        { name: "Hematology", revenueShare: 22 },
        { name: "Immunology", revenueShare: 12 },
        { name: "Other", revenueShare: 6 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 62 },
        { region: "Europe", revenueShare: 22 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 8 },
        { region: "Japan", revenueShare: 5 },
        { region: "Latin America", revenueShare: 2 },
        { region: "Rest of World", revenueShare: 1 },
      ],
    },
  ],
  "4568.T": [
    {
      fiscalYear: 2023,
      source: "Daiichi Sankyo FY2023 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Oncology", revenueShare: 50 },
        { name: "Cardiovascular", revenueShare: 22 },
        { name: "Vaccines", revenueShare: 5 },
        { name: "Specialty & Other", revenueShare: 23 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 38 },
        { region: "Japan", revenueShare: 32 },
        { region: "Europe", revenueShare: 19 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 7 },
        { region: "Rest of World", revenueShare: 4 },
      ],
    },
  ],
  "4523.T": [
    {
      fiscalYear: 2023,
      source: "Eisai FY2023 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Oncology (Lenvima)", revenueShare: 45 },
        { name: "Neurology (Leqembi & legacy)", revenueShare: 25 },
        { name: "Other", revenueShare: 30 },
      ],
      geographicSegments: [
        { region: "Japan", revenueShare: 40 },
        { region: "North America", revenueShare: 25 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 15 },
        { region: "Europe", revenueShare: 12 },
        { region: "Rest of World", revenueShare: 8 },
      ],
    },
  ],
  LLY: [
    {
      fiscalYear: 2024,
      source: "Eli Lilly Annual Report 2024 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Diabetes & Obesity (Incretins)", revenueShare: 50 },
        { name: "Diabetes (Insulin)", revenueShare: 10 },
        { name: "Oncology", revenueShare: 13 },
        { name: "Immunology", revenueShare: 10 },
        { name: "Neuroscience", revenueShare: 7 },
        { name: "Other", revenueShare: 10 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 60 },
        { region: "Europe", revenueShare: 15 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 14 },
        { region: "Japan", revenueShare: 6 },
        { region: "Rest of World", revenueShare: 5 },
      ],
    },
  ],
  GILD: [
    {
      fiscalYear: 2024,
      source: "Gilead Sciences Annual Report 2024 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "HIV", revenueShare: 62 },
        { name: "Oncology", revenueShare: 16 },
        { name: "Liver Disease (HCV/HBV)", revenueShare: 9 },
        { name: "COVID antivirals (Veklury)", revenueShare: 6 },
        { name: "Other", revenueShare: 7 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 75 },
        { region: "Europe", revenueShare: 15 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 6 },
        { region: "Japan", revenueShare: 2 },
        { region: "Rest of World", revenueShare: 2 },
      ],
    },
  ],
  GSK: [
    {
      fiscalYear: 2024,
      source: "GSK Annual Report 2024 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Specialty Medicines", revenueShare: 45 },
        { name: "Vaccines", revenueShare: 30 },
        { name: "General Medicines", revenueShare: 25 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 50 },
        { region: "Europe", revenueShare: 22 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 16 },
        { region: "Japan", revenueShare: 4 },
        { region: "Latin America", revenueShare: 5 },
        { region: "Rest of World", revenueShare: 3 },
      ],
    },
  ],
  "IPN.PA": [
    {
      fiscalYear: 2024,
      source: "Ipsen Annual Report 2024 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Oncology", revenueShare: 70 },
        { name: "Neuroscience (Dysport)", revenueShare: 22 },
        { name: "Rare Disease", revenueShare: 8 },
      ],
      geographicSegments: [
        { region: "Europe", revenueShare: 42 },
        { region: "North America", revenueShare: 38 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 10 },
        { region: "Latin America", revenueShare: 5 },
        { region: "Rest of World", revenueShare: 5 },
      ],
    },
  ],
  "HLUN-B.CO": [
    {
      fiscalYear: 2024,
      source: "Lundbeck Annual Report 2024 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Psychiatry", revenueShare: 55 },
        { name: "Neurology", revenueShare: 45 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 40 },
        { region: "Europe", revenueShare: 32 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 12 },
        { region: "Japan", revenueShare: 5 },
        { region: "Latin America", revenueShare: 6 },
        { region: "Rest of World", revenueShare: 5 },
      ],
    },
  ],
  MRK: [
    {
      fiscalYear: 2024,
      source: "Merck & Co. Annual Report 2024 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Oncology (Keytruda)", revenueShare: 45 },
        { name: "Vaccines (Gardasil etc.)", revenueShare: 17 },
        { name: "Animal Health", revenueShare: 10 },
        { name: "Hospital/Specialty", revenueShare: 8 },
        { name: "Diabetes & Cardiovascular", revenueShare: 8 },
        { name: "Other", revenueShare: 12 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 50 },
        { region: "Europe", revenueShare: 22 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 11 },
        { region: "Japan", revenueShare: 5 },
        { region: "Latin America", revenueShare: 7 },
        { region: "Rest of World", revenueShare: 5 },
      ],
    },
  ],
  "NOVN.SW": [
    {
      fiscalYear: 2024,
      source: "Novartis Annual Report 2024 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Oncology", revenueShare: 36 },
        { name: "Cardiovascular, Renal & Metabolism", revenueShare: 25 },
        { name: "Immunology", revenueShare: 18 },
        { name: "Neuroscience", revenueShare: 13 },
        { name: "Ophthalmology & Established", revenueShare: 8 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 40 },
        { region: "Europe", revenueShare: 30 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 18 },
        { region: "Japan", revenueShare: 5 },
        { region: "Latin America", revenueShare: 4 },
        { region: "Rest of World", revenueShare: 3 },
      ],
    },
  ],
  "SAN.PA": [
    {
      fiscalYear: 2024,
      source: "Sanofi Annual Report 2024 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Immunology (Dupixent etc.)", revenueShare: 30 },
        { name: "Vaccines", revenueShare: 22 },
        { name: "Rare Disease & Oncology", revenueShare: 18 },
        { name: "General Medicines", revenueShare: 22 },
        { name: "Consumer Healthcare", revenueShare: 8 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 38 },
        { region: "Europe", revenueShare: 28 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 17 },
        { region: "Japan", revenueShare: 4 },
        { region: "Latin America", revenueShare: 7 },
        { region: "Rest of World", revenueShare: 6 },
      ],
    },
  ],
  "UCB.BR": [
    {
      fiscalYear: 2024,
      source: "UCB Annual Report 2024 (approximate — verify before publishing)",
      lastUpdated: "2026-05-11",
      therapeuticAreas: [
        { name: "Immunology", revenueShare: 50 },
        { name: "Neurology", revenueShare: 30 },
        { name: "Bone (Evenity)", revenueShare: 10 },
        { name: "Rare Disease & Other", revenueShare: 10 },
      ],
      geographicSegments: [
        { region: "North America", revenueShare: 50 },
        { region: "Europe", revenueShare: 30 },
        { region: "Asia-Pacific (excl. Japan)", revenueShare: 10 },
        { region: "Japan", revenueShare: 5 },
        { region: "Rest of World", revenueShare: 5 },
      ],
    },
  ],
};

export function getSegmentsForTicker(ticker: string): YearlySegments[] {
  return segments[ticker] ?? [];
}

export function getLatestSegments(ticker: string): YearlySegments | undefined {
  const years = getSegmentsForTicker(ticker);
  if (years.length === 0) return undefined;
  return [...years].sort((a, b) => b.fiscalYear - a.fiscalYear)[0];
}

export const ALL_REGIONS: Region[] = [
  "North America",
  "Europe",
  "Japan",
  "Asia-Pacific (excl. Japan)",
  "Latin America",
  "Rest of World",
];

export const REGION_LABELS_NL: Record<Region, string> = {
  "North America": "Noord-Amerika",
  Europe: "Europa",
  Japan: "Japan",
  "Asia-Pacific (excl. Japan)": "Azië-Pacific",
  "Latin America": "Latijns-Amerika",
  "Rest of World": "Overig",
};

export function getRegionShare(ticker: string, region: Region): number {
  const latest = getLatestSegments(ticker);
  if (!latest) return 0;
  const seg = latest.geographicSegments.find((g) => g.region === region);
  return seg?.revenueShare ?? 0;
}

const EUROPE_COUNTRIES = new Set([
  "Switzerland",
  "Denmark",
  "Germany",
  "United Kingdom",
  "France",
  "Belgium",
  "Sweden",
  "Netherlands",
  "Italy",
  "Spain",
  "Ireland",
  "Norway",
  "Finland",
  "Austria",
]);

export function getRegionFromCountry(country: string): Region | null {
  if (country === "United States" || country === "Canada") return "North America";
  if (country === "Japan") return "Japan";
  if (EUROPE_COUNTRIES.has(country)) return "Europe";
  return null;
}
