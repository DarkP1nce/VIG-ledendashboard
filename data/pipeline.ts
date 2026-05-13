export interface PipelineCandidate {
  name: string;
  indication: string;
  therapeuticArea: string;
  phase: 1 | 2 | 3 | 4; // 4 = ingediend bij toezichthouder
}

export interface CompanyPipeline {
  ticker: string;
  candidates: PipelineCandidate[];
  lastUpdated: string;
  source: string;
}

const PIPELINES: CompanyPipeline[] = [
  {
    ticker: "LLY",
    lastUpdated: "Q4 2024",
    source: "Eli Lilly Annual Report 2024 & Pipeline Update",
    candidates: [
      { name: "Orforglipron",   indication: "Type 2 diabetes",          therapeuticArea: "Diabetes & Obesitas", phase: 3 },
      { name: "Orforglipron",   indication: "Obesitas",                  therapeuticArea: "Diabetes & Obesitas", phase: 3 },
      { name: "Retatrutide",    indication: "Obesitas",                  therapeuticArea: "Diabetes & Obesitas", phase: 3 },
      { name: "Tirzepatide",    indication: "Leververvetting (MASH)",    therapeuticArea: "Diabetes & Obesitas", phase: 3 },
      { name: "Tirzepatide",    indication: "Hartfalen",                 therapeuticArea: "Cardiovasculair",     phase: 3 },
      { name: "Imlunestrant",   indication: "Borstkanker (ER+)",         therapeuticArea: "Oncologie",           phase: 3 },
      { name: "Remternetug",    indication: "Alzheimer",                 therapeuticArea: "Neurologie",          phase: 3 },
      { name: "Lebrikizumab",   indication: "Alopecia areata",           therapeuticArea: "Immunologie",         phase: 3 },
      { name: "LY3589529",      indication: "Obesitas",                  therapeuticArea: "Diabetes & Obesitas", phase: 2 },
      { name: "Marstacimab",    indication: "Hemofilie B",               therapeuticArea: "Zeldzame Ziekten",    phase: 2 },
      { name: "LY3871671",      indication: "Type 1 diabetes",           therapeuticArea: "Diabetes & Obesitas", phase: 2 },
      { name: "Eplontersen",    indication: "hATTR polyneuropathie",     therapeuticArea: "Zeldzame Ziekten",    phase: 2 },
      { name: "LY3492217",      indication: "Obesitas",                  therapeuticArea: "Diabetes & Obesitas", phase: 1 },
      { name: "LY3819523",      indication: "Leververvetting (NASH)",    therapeuticArea: "Diabetes & Obesitas", phase: 1 },
      { name: "Tirzepatide",    indication: "Slaapapneu",                therapeuticArea: "Diabetes & Obesitas", phase: 4 },
    ],
  },
  {
    ticker: "NOVO-B.CO",
    lastUpdated: "Q4 2024",
    source: "Novo Nordisk Annual Report 2024 & Pipeline Update",
    candidates: [
      { name: "CagriSema",           indication: "Obesitas",                therapeuticArea: "Diabetes & Obesitas", phase: 3 },
      { name: "Semaglutide",         indication: "Leververvetting (MASH)", therapeuticArea: "Diabetes & Obesitas", phase: 3 },
      { name: "Mim8",                indication: "Hemofilie A",             therapeuticArea: "Zeldzame Ziekten",    phase: 3 },
      { name: "Concizumab",          indication: "Hemofilie A & B",         therapeuticArea: "Zeldzame Ziekten",    phase: 3 },
      { name: "IcoSema",             indication: "Type 2 diabetes",         therapeuticArea: "Diabetes & Obesitas", phase: 2 },
      { name: "NNC0487-0111",        indication: "Type 1 diabetes",         therapeuticArea: "Diabetes & Obesitas", phase: 2 },
      { name: "Semaglutide oral 25mg", indication: "Cardiovasculair risico", therapeuticArea: "Cardiovasculair",   phase: 2 },
      { name: "NNC9204-0650",        indication: "Obesitas",                therapeuticArea: "Diabetes & Obesitas", phase: 1 },
      { name: "Awiqli",              indication: "Type 2 diabetes (wekelijks insuline)", therapeuticArea: "Diabetes & Obesitas", phase: 4 },
    ],
  },
  {
    ticker: "AZN",
    lastUpdated: "Q4 2024",
    source: "AstraZeneca Annual Report 2024 & Pipeline Update",
    candidates: [
      { name: "Dato-DXd",            indication: "Longkanker (NSCLC)",      therapeuticArea: "Oncologie",       phase: 3 },
      { name: "Capivasertib",        indication: "Borstkanker (HR+)",       therapeuticArea: "Oncologie",       phase: 3 },
      { name: "Volrustomig",         indication: "Longkanker (NSCLC)",      therapeuticArea: "Oncologie",       phase: 3 },
      { name: "Eplontersen",         indication: "ATTR cardiomyopathie",    therapeuticArea: "Cardiovasculair", phase: 3 },
      { name: "Tezepelumab",         indication: "COPD",                    therapeuticArea: "Immunologie",     phase: 3 },
      { name: "AZD5363",             indication: "Borstkanker (uitgebreid)",therapeuticArea: "Oncologie",       phase: 2 },
      { name: "MEDI5752",            indication: "Solide tumoren",          therapeuticArea: "Oncologie",       phase: 2 },
      { name: "AZD9291 + combo",     indication: "Longkanker (vroeg stadium)", therapeuticArea: "Oncologie",   phase: 2 },
      { name: "AZD6422",             indication: "Solide tumoren",          therapeuticArea: "Oncologie",       phase: 1 },
      { name: "AZD3152",             indication: "RSV preventie",           therapeuticArea: "Infectieziekten", phase: 1 },
      { name: "Osimertinib",         indication: "Longkanker (adjuvant, uitgebreid)", therapeuticArea: "Oncologie", phase: 4 },
    ],
  },
  {
    ticker: "PFE",
    lastUpdated: "Q4 2024",
    source: "Pfizer Annual Report 2024 & Pipeline Update",
    candidates: [
      { name: "Elranatamab",         indication: "Multipel myeloom (eerder)",      therapeuticArea: "Oncologie",        phase: 3 },
      { name: "Sasanlimab",          indication: "Blaaskanker (BCG-naïef)",        therapeuticArea: "Oncologie",        phase: 3 },
      { name: "Vepdegestrant",       indication: "Borstkanker (ER+)",              therapeuticArea: "Oncologie",        phase: 3 },
      { name: "Marstacimab",         indication: "Hemofilie A & B",                therapeuticArea: "Zeldzame Ziekten", phase: 3 },
      { name: "Fidanacogene elaparvovec", indication: "Hemofilie B",              therapeuticArea: "Zeldzame Ziekten", phase: 3 },
      { name: "PF-06425090",         indication: "Pneumokokken (20-valent)",       therapeuticArea: "Vaccins",          phase: 2 },
      { name: "PF-07258726",         indication: "Obesitas",                       therapeuticArea: "Diabetes & Obesitas", phase: 2 },
      { name: "Atuveciclib",         indication: "Non-Hodgkin lymfoom",            therapeuticArea: "Oncologie",        phase: 2 },
      { name: "PF-06939926",         indication: "Duchenne spierdystrofie",        therapeuticArea: "Zeldzame Ziekten", phase: 1 },
      { name: "Elranatamab",         indication: "Multipel myeloom (eerste lijn)", therapeuticArea: "Oncologie",        phase: 4 },
    ],
  },
  {
    ticker: "NOVN.SW",
    lastUpdated: "Q4 2024",
    source: "Novartis Annual Report 2024 & Pipeline Update",
    candidates: [
      { name: "Iptacopan",           indication: "IgA-nefropathie",               therapeuticArea: "Zeldzame Ziekten", phase: 3 },
      { name: "Pelacarsen",          indication: "Cardiovasculair risico (Lp(a))", therapeuticArea: "Cardiovasculair",  phase: 3 },
      { name: "Remibrutinib",        indication: "Multiple sclerose",              therapeuticArea: "Neurologie",       phase: 3 },
      { name: "Asciminib",           indication: "CML (vroeg stadium)",            therapeuticArea: "Oncologie",        phase: 3 },
      { name: "Abelacimab",          indication: "Atriumfibrilleren (beroerteprev.)", therapeuticArea: "Cardiovasculair", phase: 3 },
      { name: "NIS793",              indication: "Pancreaskanker",                 therapeuticArea: "Oncologie",        phase: 2 },
      { name: "Ofatumumab",          indication: "Pediatrische MS",                therapeuticArea: "Neurologie",       phase: 2 },
      { name: "LMI070",              indication: "SMA type 1",                     therapeuticArea: "Zeldzame Ziekten", phase: 2 },
      { name: "NKG2D CAR-T",         indication: "Acute myeloïde leukemie",        therapeuticArea: "Oncologie",        phase: 1 },
      { name: "Iptacopan",           indication: "PNH (aanvullend)",               therapeuticArea: "Zeldzame Ziekten", phase: 4 },
    ],
  },
  {
    ticker: "MRK",
    lastUpdated: "Q4 2024",
    source: "Merck (MSD) Annual Report 2024 & Pipeline Update",
    candidates: [
      { name: "Clesrovimab",         indication: "RSV preventie (pasgeborenen)",   therapeuticArea: "Infectieziekten",  phase: 3 },
      { name: "Belzutifan",          indication: "Niercelkanker (uitgebreid)",      therapeuticArea: "Oncologie",        phase: 3 },
      { name: "Teliso-V",            indication: "Longkanker (MET+, NSCLC)",        therapeuticArea: "Oncologie",        phase: 3 },
      { name: "Keytruda + combo",    indication: "Slokdarmkanker (neo-adjuvant)",   therapeuticArea: "Oncologie",        phase: 3 },
      { name: "MK-1654",             indication: "RSV preventie (ouderen)",         therapeuticArea: "Infectieziekten",  phase: 3 },
      { name: "Gefapixant",          indication: "Chronische hoest",                therapeuticArea: "Immunologie",      phase: 2 },
      { name: "MK-0616",             indication: "LDL-verlaging (oraal PCSK9i)",    therapeuticArea: "Cardiovasculair",  phase: 2 },
      { name: "MK-7684A",            indication: "Multipel myeloom",               therapeuticArea: "Oncologie",        phase: 2 },
      { name: "MK-2060",             indication: "Veneuze trombose (factor XI)",    therapeuticArea: "Cardiovasculair",  phase: 1 },
      { name: "Sotatercept",         indication: "Pulmonale arteriële hypertensie", therapeuticArea: "Cardiovasculair",  phase: 4 },
    ],
  },
];

export function getPipeline(ticker: string): CompanyPipeline | null {
  return PIPELINES.find((p) => p.ticker === ticker) ?? null;
}
