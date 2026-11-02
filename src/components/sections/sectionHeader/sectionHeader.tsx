import { TITLE } from "@/components/sections/sectionStyles";
import type { SectionHeaderProps } from "./sectionHeaderTypes";

export function SectionHeader({ title, aside }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className={TITLE}>{title}</h2>
      {aside}
    </div>
  );
}
