"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-vig-navy sm:hidden"
        aria-label={open ? "Menu sluiten" : "Menu openen"}
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-16 z-50 border-b border-zinc-200/60 bg-white/95 shadow-lg backdrop-blur-xl sm:hidden dark:border-white/5 dark:bg-zinc-950/95">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            <Link
              href="/"
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === "/"
                  ? "bg-zinc-100 text-vig-navy dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-vig-navy dark:text-zinc-400 dark:hover:bg-zinc-800",
              )}
            >
              Bedrijven
            </Link>
            <Link
              href="/compare"
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname.startsWith("/compare")
                  ? "bg-zinc-100 text-vig-navy dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-vig-navy dark:text-zinc-400 dark:hover:bg-zinc-800",
              )}
            >
              Vergelijken
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
