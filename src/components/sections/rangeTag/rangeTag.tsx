import type { RangeTagProps } from "./rangeTagTypes";

export function RangeTag({ label }: RangeTagProps) {
  return (
    <span className="rounded-sm bg-surface-2 px-3 py-[5px] text-xs font-semibold whitespace-nowrap text-text-2">
      {label}
    </span>
  );
}
