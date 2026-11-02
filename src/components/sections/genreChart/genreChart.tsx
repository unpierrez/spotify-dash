import { Empty } from "@/components/sections/empty/empty";
import { CARD, LINK, TITLE } from "@/components/sections/sectionStyles";
import type { GenreChartProps } from "./genreChartTypes";
import { useGenreChart } from "./useGenreChart";

export function GenreChart({ id, className = "", genres }: GenreChartProps) {
  const { rows } = useGenreChart(genres);

  return (
    <section id={id} className={`${CARD} flex scroll-mt-6 flex-col gap-4 md:gap-5 ${className}`}>
      <div className="flex flex-col gap-0.5">
        <h2 className={TITLE}>Estilos mais ouvidos</h2>
        <span className="text-xs text-text-dim md:text-[13px]">
          Gêneros somados entre os seus top artistas
        </span>
      </div>

      {rows.length === 0 ? (
        <Empty>Nenhum gênero disponível para este período.</Empty>
      ) : (
        <ul className="flex flex-col gap-3 md:gap-3.5">
          {rows.map((row) => (
            <li key={row.name} className="flex flex-col gap-1.5">
              <div className="flex justify-between gap-2 text-[13px] md:text-sm">
                <span className="font-semibold capitalize">{row.name}</span>
                <span className="whitespace-nowrap text-text-muted">
                  {row.count} {row.countLabel}
                </span>
              </div>
              <div className="h-2.5 rounded-bar bg-border md:h-3" aria-hidden="true">
                <div
                  className={`h-full rounded-bar ${row.isTop ? "bg-lime" : "bg-lavender"}`}
                  style={{ width: `${row.widthPercent}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-text-dim">
        Gêneros do{" "}
        <a href="https://musicbrainz.org" className={LINK}>
          MusicBrainz
        </a>
        . Alguns artistas não têm gênero cadastrado e ficam de fora.
      </p>
    </section>
  );
}
