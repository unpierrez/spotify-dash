import type { DashboardData, TimeRange } from "@/lib/types";

export type DashboardProps = { data: DashboardData };

export type RangeOption = { id: TimeRange; label: string; short: string };
