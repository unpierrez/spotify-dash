import { Cover } from "@/components/cover/cover";
import { ArrowUpRightIcon } from "@/components/icons/icons";
import type { FeaturedArtistProps } from "./featuredArtistTypes";
import { useFeaturedArtist } from "./useFeaturedArtist";

export function FeaturedArtist({ artist, rangeLabel, className = "" }: FeaturedArtistProps) {
  const { genres } = useFeaturedArtist(artist);

  if (!artist) return null;

  return (
    <section
      aria-label="Artista #1"
      className={`min-h-[200px] overflow-hidden rounded-xl bg-lavender p-[22px] text-lavender-ink md:p-[clamp(24px,3vw,36px)] ${className}`}
    >
      <div className="md:flex md:h-full md:flex-wrap md:items-center md:justify-between md:gap-6">
        <div className="flex flex-col items-start gap-3 md:flex-[1_1_260px] md:gap-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="rounded-sm bg-lavender-ink px-[11px] py-[5px] text-xs font-bold whitespace-nowrap text-lavender md:px-3 md:py-1.5 md:text-[13px]">
              #1 do período
            </span>
            <span className="hidden text-[13px] font-semibold md:inline">
              Top 10 artistas · {rangeLabel}
            </span>
          </div>

          <Cover
            src={artist.image}
            fallback="user"
            sizes="120px"
            className="size-[120px] rounded-full md:hidden"
            emptyClassName="border-2 border-dashed border-lavender-ink/30 bg-lavender-ink/12 text-lavender-ink"
          />

          <span className="max-w-full text-[30px] leading-none font-extrabold tracking-[-0.03em] wrap-break-word md:text-[clamp(34px,5vw,52px)]">
            {artist.name}
          </span>

          {genres.length > 0 && (
            <>
              <span className="text-[13px] font-medium capitalize md:hidden">{genres.join(" · ")}</span>
              <div className="hidden flex-wrap gap-2 md:flex">
                {genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-sm border border-lavender-ink/35 px-2.5 py-1 text-[13px] font-semibold capitalize"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </>
          )}

          <a
            href={artist.url}
            className="inline-flex min-h-11 items-center gap-3 rounded-sm bg-lavender-ink pr-1.5 pl-4 text-sm font-bold whitespace-nowrap text-text hover:text-lime-hover md:min-h-12 md:pr-2"
          >
            Abrir no Spotify
            <span className="flex size-8 items-center justify-center rounded-full bg-lime text-lime-ink md:size-[34px]">
              <ArrowUpRightIcon />
            </span>
          </a>
        </div>

        <div className="hidden shrink-0 md:block md:size-[clamp(140px,18vw,220px)]">
          <Cover
            src={artist.image}
            fallback="user"
            sizes="220px"
            className="size-full rounded-full"
            emptyClassName="border-2 border-dashed border-lavender-ink/30 bg-lavender-ink/12 text-lavender-ink"
          />
        </div>
      </div>
    </section>
  );
}
