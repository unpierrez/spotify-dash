import type { SectionProps } from "@/components/sections/sectionTypes";
import type { Artist } from "@/lib/types";

export type TopArtistsProps = SectionProps & { artists: Artist[]; rangeLabel: string };
