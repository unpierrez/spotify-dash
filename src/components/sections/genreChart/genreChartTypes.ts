import type { SectionProps } from "@/components/sections/sectionTypes";
import type { GenreCount } from "@/lib/types";

export type GenreChartProps = SectionProps & { genres: GenreCount[] };
