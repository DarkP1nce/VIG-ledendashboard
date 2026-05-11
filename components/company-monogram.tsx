import type { Company } from "@/data/companies";
import { cn } from "@/lib/utils";

interface CompanyMonogramProps {
  company: Company;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<CompanyMonogramProps["size"]>, string> = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-xs",
  lg: "h-14 w-14 text-sm",
  xl: "h-20 w-20 text-base",
};

const MONOGRAM_OVERRIDES: Record<string, string> = {
  PFE: "Pf",
  JNJ: "J&J",
  "RO.SW": "Ro",
  "NOVO-B.CO": "Nn",
  "4502.T": "Tk",
  BMY: "BM",
  "4568.T": "DS",
  AZN: "AZ",
  "NOVN.SW": "Nv",
  "HLUN-B.CO": "Lu",
};

function getMonogram(company: Company): string {
  return MONOGRAM_OVERRIDES[company.ticker] ?? company.shortName.slice(0, 2);
}

export function CompanyMonogram({
  company,
  size = "md",
  className,
}: CompanyMonogramProps) {
  const text = getMonogram(company);

  if (company.logoUrl) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[inset_0_0_0_1px_rgba(11,46,74,0.08),0_1px_2px_rgba(0,0,0,0.04)]",
          SIZE_CLASSES[size],
          className,
        )}
      >
        <img
          src={company.logoUrl}
          alt={`${company.shortName} logo`}
          className="h-2/3 w-2/3 object-contain"
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-2xl font-semibold tracking-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(0,0,0,0.08)]",
        SIZE_CLASSES[size],
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(140deg, ${company.color}, ${shade(company.color, -15)})`,
      }}
      aria-hidden="true"
    >
      {text}
    </span>
  );
}

function shade(hex: string, percent: number): string {
  const m = hex.replace("#", "");
  if (m.length !== 6) return hex;
  const num = parseInt(m, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  const f = (1 + percent / 100);
  r = clamp(Math.round(r * f));
  g = clamp(Math.round(g * f));
  b = clamp(Math.round(b * f));
  return (
    "#" +
    [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
  );
}

function clamp(n: number): number {
  return Math.max(0, Math.min(255, n));
}
