import { Cover } from "@/components/cover/cover";
import { Empty } from "@/components/sections/empty/empty";
import { RangeTag } from "@/components/sections/rangeTag/rangeTag";
import { SectionHeader } from "@/components/sections/sectionHeader/sectionHeader";
import { DESKTOP_CARD, TABLE_HEADER } from "@/components/sections/sectionStyles";
import type { TopTracksProps } from "./topTracksTypes";
import { useTopTracks } from "./useTopTracks";

export function TopTracks({ id, className = "", tracks, rangeLabel }: TopTracksProps) {
  const { rows } = useTopTracks(tracks);

  return (
    <section id={id} className={`${DESKTOP_CARD} flex scroll-mt-6 flex-col gap-3.5 md:gap-4 ${className}`}>
      <SectionHeader title="Top músicas" aside={<RangeTag label={rangeLabel} />} />

      {rows.length === 0 ? (
        <Empty>Ainda não há dados suficientes para este período.</Empty>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[520px] table-fixed border-collapse">
              <thead>
                <tr>
                  <th scope="col" className={`${TABLE_HEADER} w-9 text-left`}>
                    #
                  </th>
                  <th scope="col" className={`${TABLE_HEADER} text-left`}>
                    Música
                  </th>
                  <th scope="col" className={`${TABLE_HEADER} w-[30%] text-left`}>
                    Álbum
                  </th>
                  <th scope="col" className={`${TABLE_HEADER} w-[72px] text-right`}>
                    Duração
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((track) => (
                  <tr key={track.id} className="border-t border-border">
                    <td className="py-2 font-bold text-lime tabular-nums">{track.position}</td>
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-3">
                        <Cover src={track.image} sizes="48px" className="size-12 rounded-sm" />
                        <span className="flex min-w-0 flex-col">
                          <a href={track.url} className="truncate font-semibold hover:text-lime-hover">
                            {track.name}
                          </a>
                          <span className="truncate text-[13px] text-text-muted">{track.artists}</span>
                        </span>
                      </div>
                    </td>
                    <td className="truncate py-2 pr-4 text-sm text-text-muted">{track.album}</td>
                    <td className="py-2 text-right text-sm text-text-muted tabular-nums">
                      {track.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ol className="flex flex-col gap-1.5 md:hidden">
            {rows.map((track) => (
              <li
                key={track.id}
                className="relative flex min-h-16 items-center gap-3 rounded-md bg-surface py-2 pr-3.5 pl-2"
              >
                <Cover src={track.image} sizes="48px" className="size-12 rounded-sm" />
                <span className="flex min-w-0 flex-1 flex-col">
                  <a
                    href={track.url}
                    className="truncate font-semibold after:absolute after:inset-0 hover:text-lime-hover"
                  >
                    {track.name}
                  </a>
                  <span className="flex min-w-0 gap-1 text-xs text-text-muted">
                    <span className="truncate">
                      {track.artists} · {track.album}
                    </span>
                    <span className="shrink-0 tabular-nums">· {track.duration}</span>
                  </span>
                </span>
                <span className="font-extrabold text-lime tabular-nums">{track.position}</span>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
