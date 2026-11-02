import type { StatsProps } from "./statsTypes";
import { useStats } from "./useStats";

export function Stats({ range, playlistTotal, className = "" }: StatsProps) {
  const { stats } = useStats(range, playlistTotal);

  return (
    <section aria-label="Resumo" className={`grid auto-rows-fr grid-cols-2 gap-2.5 md:gap-3 ${className}`}>
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`flex min-h-24 min-w-0 flex-col justify-between gap-2 rounded-lg px-4 py-3.5 md:min-h-28 md:px-5 md:py-[18px] ${
            index === 0 ? "bg-lime text-lime-ink" : "border border-border bg-surface"
          }`}
        >
          <span className="text-xs font-semibold opacity-85 md:text-[13px]">{stat.label}</span>
          <span
            title={stat.value}
            className={`font-extrabold tracking-[-0.02em] ${
              stat.isText
                ? "line-clamp-2 text-lg leading-tight wrap-break-word capitalize md:text-xl"
                : "text-2xl leading-tight md:text-[30px]"
            }`}
          >
            {stat.value}
          </span>
        </div>
      ))}
    </section>
  );
}
