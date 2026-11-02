import type { RangeData } from "@/lib/types";

export type Stat = { label: string; value: string; isText?: boolean };

export type StatsProps = {
  range: RangeData;
  playlistTotal: number;
  className?: string;
};
