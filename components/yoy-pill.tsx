import { formatPercentChange } from "@/lib/format";
import { cn } from "@/lib/utils";

interface YoYPillProps {
  value: number | null;
  className?: string;
}

export function YoYPill({ value, className }: YoYPillProps) {
  if (value === null) return null;
  const positive = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums",
        positive
          ? "bg-emerald-50 text-emerald-700"
          : "bg-rose-50 text-rose-700",
        className,
      )}
    >
      {formatPercentChange(value)}
    </span>
  );
}
