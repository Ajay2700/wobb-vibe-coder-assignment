import type { ShortlistItem } from "@/types";
import { getPlatformLabel } from "@/utils/dataHelpers";

const HEADERS = [
  "username",
  "fullname",
  "platform",
  "verified",
  "followers",
  "engagement_rate",
  "url",
  "added_at",
  "note",
] as const;

function escapeCell(value: string | number | boolean | undefined | null): string {
  if (value === undefined || value === null) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function shortlistToCsv(items: ShortlistItem[]): string {
  const rows = [HEADERS.join(",")];
  for (const item of items) {
    rows.push(
      [
        escapeCell(item.username),
        escapeCell(item.fullname),
        escapeCell(getPlatformLabel(item.platform)),
        escapeCell(item.is_verified),
        escapeCell(item.followers),
        escapeCell(item.engagement_rate ?? ""),
        escapeCell(item.url),
        escapeCell(new Date(item.addedAt).toISOString()),
        escapeCell(item.note ?? ""),
      ].join(",")
    );
  }
  return rows.join("\n");
}

export function downloadCsv(filename: string, csv: string): void {
  const BOM = "﻿";
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
