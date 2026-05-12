"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedStatProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  sublabel?: string;
  duration?: number;
}

export function AnimatedStat({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  label,
  sublabel,
  duration = 1400,
}: AnimatedStatProps) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * value);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return (
    <div className="flex flex-col items-center text-center">
      <p className="font-display text-3xl font-semibold tabular-nums tracking-tight text-vig-navy sm:text-4xl">
        {prefix}
        {display.toFixed(decimals)}
        {suffix}
      </p>
      <p className="mt-1 text-sm font-medium text-zinc-700">{label}</p>
      {sublabel && (
        <p className="mt-0.5 text-xs text-zinc-400">{sublabel}</p>
      )}
    </div>
  );
}
