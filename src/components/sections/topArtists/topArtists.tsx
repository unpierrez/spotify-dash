import { Cover } from "@/components/cover/cover";
import { Empty } from "@/components/sections/empty/empty";
import { FeaturedArtist } from "@/components/sections/featuredArtist/featuredArtist";
import { RangeTag } from "@/components/sections/rangeTag/rangeTag";
import { SectionHeader } from "@/components/sections/sectionHeader/sectionHeader";
import { DESKTOP_CARD } from "@/components/sections/sectionStyles";
import type { TopArtistsProps } from "./topArtistsTypes";
import { useTopArtists } from "./useTopArtists";

export function TopArtists({ id, className = "", artists, rangeLabel }: TopArtistsProps) {
  const { first, rest } = useTopArtists(artists);

  return (
    <section id={id} className={`${DESKTOP_CARD} flex scroll-mt-6 flex-col gap-3.5 md:gap-5 ${className}`}>
      <SectionHeader title="Top 10 artistas" aside={<RangeTag label={rangeLabel} />} />

      {!first ? (
        <Empty>Ainda não há dados suficientes para este período.</Empty>
      ) : (
        <>
          <FeaturedArtist artist={first} rangeLabel={rangeLabel} className="md:hidden" />

          {rest.length > 0 && (
            <ol className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] md:gap-2 md:overflow-visible md:px-0">
              {rest.map((artist) => (
                <li key={artist.id} className="w-24 shrink-0 md:w-auto">
                  <a
                    href={artist.url}
                    className="flex flex-col items-center gap-2 text-center hover:text-lime-hover md:h-full md:flex-row md:gap-3 md:rounded-md md:bg-surface-2 md:p-2.5 md:text-left"
                  >
                    <div className="relative shrink-0">
                      <Cover
                        src={artist.image}
                        fallback="user"
                        sizes="(min-width: 900px) 56px, 84px"
                        className="size-21 rounded-full border border-surface-3 md:size-14 md:rounded-sm md:border-0"
                        emptyClassName="bg-surface-2 text-text-dim"
                      />
                      <span className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full bg-lime text-xs font-extrabold text-lime-ink md:hidden">
                        {artist.position}
                      </span>
                    </div>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="line-clamp-2 text-[13px] leading-snug font-semibold md:text-[15px] md:font-bold">
                        {artist.name}
                      </span>
                      <span className="hidden truncate text-[13px] text-text-muted capitalize md:block">
                        {artist.genresLabel}
                      </span>
                    </span>
                    <span className="hidden size-9 shrink-0 items-center justify-center rounded-full border border-border-strong text-[13px] font-bold text-lime md:flex">
                      {artist.position}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          )}
        </>
      )}
    </section>
  );
}
