"use client";

import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface FilterOption<T> {
  value: T;
  label: string;
  hint?: string;
}

interface FilterPopoverProps<T> {
  label: string;
  selectedLabel?: string;
  isDefault: boolean;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function FilterPopover<T extends string>({
  label,
  selectedLabel,
  isDefault,
  options,
  value,
  onChange,
}: FilterPopoverProps<T>) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <motion.button
          type="button"
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            isDefault
              ? "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-vig-navy"
              : "border-vig-navy bg-vig-navy text-white",
          )}
        >
          <span className={isDefault ? "text-zinc-500" : "text-white/70"}>
            {label}
          </span>
          <span className={cn("font-semibold", isDefault && "text-vig-navy")}>
            {selectedLabel ?? options.find((o) => o.value === value)?.label}
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </motion.button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={6}
          className="z-50 w-64 rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-[0_24px_60px_-20px_rgba(11,46,74,0.18)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <div className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            {label}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <Popover.Close
                  asChild
                  key={String(opt.value)}
                  onClick={() => onChange(opt.value)}
                >
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-start justify-between gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors",
                      active
                        ? "bg-vig-blue/5 text-vig-navy"
                        : "text-zinc-700 hover:bg-zinc-50",
                    )}
                  >
                    <span className="flex-1">
                      <span className="block">{opt.label}</span>
                      {opt.hint && (
                        <span className="block text-xs text-zinc-400">
                          {opt.hint}
                        </span>
                      )}
                    </span>
                    {active && (
                      <Check
                        className="h-4 w-4 text-vig-blue"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </Popover.Close>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
