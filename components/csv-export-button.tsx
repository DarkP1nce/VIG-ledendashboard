"use client";

import { Download } from "lucide-react";

interface CsvExportButtonProps {
  rows: Record<string, string | number | null>[];
  filename: string;
  label?: string;
}

export function CsvExportButton({
  rows,
  filename,
  label = "Exporteer CSV",
}: CsvExportButtonProps) {
  function onClick() {
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const escape = (v: unknown) => {
      const s = v === null || v === undefined ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [
      headers.join(","),
      ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
    ];
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-vig-navy shadow-sm transition-colors hover:border-vig-blue hover:text-vig-blue"
    >
      <Download className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
