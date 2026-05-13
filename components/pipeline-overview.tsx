import { getPipeline, type PipelineCandidate } from "@/data/pipeline";

const TA_COLORS: Record<string, { bg: string; text: string }> = {
  "Oncologie":           { bg: "bg-sky-100",     text: "text-sky-700" },
  "Diabetes & Obesitas": { bg: "bg-orange-100",  text: "text-orange-700" },
  "Cardiovasculair":     { bg: "bg-red-100",     text: "text-red-700" },
  "Neurologie":          { bg: "bg-indigo-100",  text: "text-indigo-700" },
  "Immunologie":         { bg: "bg-purple-100",  text: "text-purple-700" },
  "Zeldzame Ziekten":    { bg: "bg-amber-100",   text: "text-amber-700" },
  "Infectieziekten":     { bg: "bg-emerald-100", text: "text-emerald-700" },
  "Hematologie":         { bg: "bg-rose-100",    text: "text-rose-700" },
  "Vaccins":             { bg: "bg-teal-100",    text: "text-teal-700" },
};

const PHASE_META = [
  { phase: 3, label: "Fase III",   color: "text-vig-navy",   dot: "bg-vig-navy" },
  { phase: 2, label: "Fase II",    color: "text-zinc-600",   dot: "bg-zinc-400" },
  { phase: 1, label: "Fase I",     color: "text-zinc-500",   dot: "bg-zinc-300" },
  { phase: 4, label: "Ingediend",  color: "text-emerald-700", dot: "bg-emerald-500" },
] as const;

interface PipelineOverviewProps {
  ticker: string;
  color: string;
}

export function PipelineOverview({ ticker, color }: PipelineOverviewProps) {
  const pipeline = getPipeline(ticker);
  if (!pipeline) return null;

  const { candidates, lastUpdated, source } = pipeline;
  const total = candidates.length;

  const phaseCounts = [1, 2, 3, 4].map((p) => ({
    phase: p,
    count: candidates.filter((c) => c.phase === p).length,
  }));
  const maxCount = Math.max(...phaseCounts.map((p) => p.count), 1);

  return (
    <div>
      {/* Phase summary tiles */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { phase: 1, label: "Fase I",    sublabel: "vroegste stadium" },
          { phase: 2, label: "Fase II",   sublabel: "werkzaamheid" },
          { phase: 3, label: "Fase III",  sublabel: "grootschalig" },
          { phase: 4, label: "Ingediend", sublabel: "bij toezichthouder" },
        ].map(({ phase, label, sublabel }) => {
          const count = phaseCounts.find((p) => p.phase === phase)?.count ?? 0;
          const barHeight = maxCount > 0 ? (count / maxCount) * 40 : 0;
          const isIngediend = phase === 4;
          return (
            <div
              key={phase}
              className="flex flex-col items-center rounded-xl border border-zinc-100 bg-zinc-50/60 px-3 py-4"
            >
              <div className="flex h-10 w-full items-end justify-center">
                <div
                  className="w-6 rounded-t-md transition-all"
                  style={{
                    height: barHeight,
                    background: isIngediend ? "#10b981" : color,
                    opacity: isIngediend ? 1 : 0.75 + (phase / 3) * 0.25,
                  }}
                />
              </div>
              <p className="mt-3 font-display text-2xl font-semibold tabular-nums text-vig-navy">
                {count}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-zinc-700">{label}</p>
              <p className="mt-0.5 text-center text-[10px] text-zinc-400">{sublabel}</p>
            </div>
          );
        })}
      </div>

      {/* Pipeline rows grouped by phase */}
      <div className="mt-6 space-y-6">
        {PHASE_META.map(({ phase, label }) => {
          const group = candidates.filter((c) => c.phase === phase);
          if (group.length === 0) return null;
          const isIngediend = phase === 4;
          const accentColor = isIngediend ? "#10b981" : color;
          return (
            <div key={phase}>
              {/* Phase header */}
              <div className="mb-2 flex items-center gap-2">
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: accentColor }}
                />
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  {label}
                </h3>
                <div
                  className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                  style={{
                    background: isIngediend ? "#d1fae5" : `${color}18`,
                    color: isIngediend ? "#065f46" : color,
                  }}
                >
                  {group.length}
                </div>
              </div>

              {/* Candidate rows */}
              <div className="overflow-hidden rounded-xl border border-zinc-100 bg-white">
                {group.map((c, i) => {
                  const taColor = TA_COLORS[c.therapeuticArea] ?? {
                    bg: "bg-zinc-100",
                    text: "text-zinc-600",
                  };
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-4 border-b border-zinc-50 px-4 py-3 last:border-0"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-vig-navy">
                          {c.name}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {c.indication}
                        </p>
                      </div>
                      <span
                        className={`hidden shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium sm:inline-block ${taColor.bg} ${taColor.text}`}
                      >
                        {c.therapeuticArea}
                      </span>
                      <PhaseProgress phase={c.phase} color={color} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-[11px] leading-relaxed text-zinc-400">
        {total} kandidaten · Bron: {source} · Peildatum {lastUpdated} · Indicatief, verifieer via meest recente investeerderspublicaties.
      </p>
    </div>
  );
}

function PhaseProgress({
  phase,
  color,
}: {
  phase: 1 | 2 | 3 | 4;
  color: string;
}) {
  const steps = [
    { label: "I",   filled: phase >= 1 },
    { label: "II",  filled: phase >= 2 },
    { label: "III", filled: phase >= 3 },
    { label: "✓",   filled: phase >= 4 },
  ];

  return (
    <div className="flex shrink-0 items-center">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          {i > 0 && (
            <div
              className="h-px w-3.5"
              style={{ background: step.filled ? color : "#e4e4e7" }}
            />
          )}
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold"
            style={{
              background: step.filled ? (step.label === "✓" ? "#10b981" : color) : "transparent",
              border: `1.5px solid ${step.filled ? (step.label === "✓" ? "#10b981" : color) : "#e4e4e7"}`,
              color: step.filled ? "white" : "#a1a1aa",
            }}
          >
            {step.label}
          </div>
        </div>
      ))}
    </div>
  );
}
