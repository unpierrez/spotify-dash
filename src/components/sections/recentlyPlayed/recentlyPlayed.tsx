import { Cover } from "@/components/cover/cover";
import { Empty } from "@/components/sections/empty/empty";
import { CARD, TITLE } from "@/components/sections/sectionStyles";
import type { RecentlyPlayedProps } from "./recentlyPlayedTypes";
import { useRecentlyPlayed } from "./useRecentlyPlayed";

export function RecentlyPlayed({ id, className = "", tracks }: RecentlyPlayedProps) {
  const { rows } = useRecentlyPlayed(tracks);

  return (
    <section id={id} className={`${CARD} flex scroll-mt-6 flex-col gap-2.5 md:gap-4 ${className}`}>
      <h2 className={TITLE}>Tocadas recentemente</h2>

      {rows.length === 0 ? (
        <Empty>Nada tocado recentemente.</Empty>
      ) : (
        <ul className="flex flex-col md:gap-2">
          {rows.map((track) => (
            <li
              key={track.key}
              className={`relative min-h-14 items-center gap-3 py-1 md:rounded-md md:bg-surface-2 md:p-2 ${
                track.desktopOnly ? "hidden md:flex" : "flex"
              }`}
            >
              <Cover src={track.image} sizes="44px" className="size-11 rounded-sm" />
              <span className="flex min-w-0 flex-1 flex-col">
                <a
                  href={track.url}
                  className="truncate font-semibold after:absolute after:inset-0 hover:text-lime-hover"
                >
                  {track.name}
                </a>
                <span className="truncate text-xs text-text-muted md:text-[13px]">{track.artists}</span>
              </span>
              <time
                dateTime={track.playedAt}
                className="shrink-0 rounded-sm bg-bg px-2 py-1 text-[11px] font-semibold whitespace-nowrap text-text-2 md:text-xs"
              >
                {track.playedAtLabel}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
