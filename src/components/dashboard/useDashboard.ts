import { useState } from "react";
import { formatLongDate } from "@/lib/format";
import type { DashboardData, TimeRange } from "@/lib/types";
import type { RangeOption } from "./dashboardTypes";

const RANGE_OPTIONS: RangeOption[] = [
  { id: "short_term", label: "4 semanas", short: "4 semanas" },
  { id: "medium_term", label: "6 meses", short: "6 meses" },
  { id: "long_term", label: "Todo o período", short: "Tudo" },
];

const SECTIONS = [
  { id: "artistas", label: "Artistas" },
  { id: "estilos", label: "Estilos" },
  { id: "musicas", label: "Músicas" },
  { id: "recentes", label: "Recentes" },
];

export function useDashboard(data: DashboardData) {
  const [range, setRange] = useState<TimeRange>("long_term");
  const current = data.ranges[range];
  const rangeLabel = RANGE_OPTIONS.find((o) => o.id === range)!.label;

  return {
    range,
    setRange,
    current,
    rangeLabel,
    rangeOptions: RANGE_OPTIONS,
    sections: SECTIONS,
    updatedAtLabel: formatLongDate(data.updatedAt),
    repoUrl: process.env.NEXT_PUBLIC_REPO_URL,
  };
}
