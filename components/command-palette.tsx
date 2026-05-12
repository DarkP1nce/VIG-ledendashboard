"use client";

import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Building2, Search } from "lucide-react";

import { CompanyMonogram } from "@/components/company-monogram";
import type { Company } from "@/data/companies";

interface CommandPaletteProps {
  companies: Company[];
}

export function CommandPalette({ companies }: CommandPaletteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function go(path: string) {
    setOpen(false);
    router.push(path);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        aria-label="Zoeken"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Zoeken</span>
        <kbd className="ml-2 hidden rounded bg-white/15 px-1.5 py-0.5 font-mono text-[10px] text-white/60 sm:inline">
          ⌘K
        </kbd>
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-zinc-900/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-[20%] z-50 w-[92vw] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
            <Dialog.Title className="sr-only">Zoekpalet</Dialog.Title>
            <Command label="Zoek bedrijven" className="flex flex-col">
              <div className="flex items-center gap-2 border-b border-zinc-100 px-4">
                <Search className="h-4 w-4 text-zinc-400" />
                <Command.Input
                  placeholder="Zoek een bedrijf, pagina…"
                  className="h-12 flex-1 bg-transparent text-sm text-vig-navy outline-none placeholder:text-zinc-400"
                />
              </div>
              <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                <Command.Empty className="px-3 py-8 text-center text-sm text-zinc-500">
                  Geen resultaten.
                </Command.Empty>

                <Command.Group
                  heading="Bedrijven"
                  className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2"
                >
                  {companies.map((c) => (
                    <Command.Item
                      key={c.ticker}
                      value={`${c.shortName} ${c.fullName} ${c.ticker} ${c.country}`}
                      onSelect={() => go(`/company/${c.slug}`)}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-vig-navy aria-selected:bg-vig-blue/5"
                    >
                      <CompanyMonogram company={c} size="sm" />
                      <div className="flex-1">
                        <p className="font-medium">{c.shortName}</p>
                        <p className="text-xs text-zinc-500">
                          {c.exchange} · {c.ticker}
                        </p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group
                  heading="Pagina's"
                  className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2"
                >
                  <Command.Item
                    value="overzicht home homepage bedrijven"
                    onSelect={() => go("/")}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-vig-navy aria-selected:bg-vig-blue/5"
                  >
                    <Building2 className="h-4 w-4 text-zinc-500" />
                    Overzicht
                  </Command.Item>
                  <Command.Item
                    value="vergelijken compare"
                    onSelect={() => go("/compare")}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-vig-navy aria-selected:bg-vig-blue/5"
                  >
                    <Building2 className="h-4 w-4 text-zinc-500" />
                    Vergelijken
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
