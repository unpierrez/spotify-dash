import type { SectionProps } from "@/components/sections/sectionTypes";
import type { Track } from "@/lib/types";

export type TopTracksProps = SectionProps & { tracks: Track[]; rangeLabel: string };
