"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm transition-colors",
        active
          ? "bg-zinc-100 font-medium text-vig-navy dark:bg-white/10 dark:text-white"
          : "text-zinc-600 hover:bg-zinc-100/80 hover:text-vig-navy dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-zinc-100",
      )}
    >
      {children}
    </Link>
  );
}
