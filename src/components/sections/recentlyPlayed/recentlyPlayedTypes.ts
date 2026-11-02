import type { SectionProps } from "@/components/sections/sectionTypes";
import type { RecentTrack } from "@/lib/types";

export type RecentlyPlayedProps = SectionProps & { tracks: RecentTrack[] };
