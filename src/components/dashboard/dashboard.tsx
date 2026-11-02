"use client";

import Image from "next/image";
import { Cover } from "@/components/cover/cover";
import { RefreshButton } from "@/components/refreshButton/refreshButton";
import { FeaturedArtist } from "@/components/sections/featuredArtist/featuredArtist";
import { GenreChart } from "@/components/sections/genreChart/genreChart";
import { RecentlyPlayed } from "@/components/sections/recentlyPlayed/recentlyPlayed";
import { Stats } from "@/components/sections/stats/stats";
import { TopArtists } from "@/components/sections/topArtists/topArtists";
import { TopTracks } from "@/components/sections/topTracks/topTracks";
import type { DashboardProps } from "./dashboardTypes";
import { useDashboard } from "./useDashboard";

const ROW = "flex flex-wrap gap-7 md:gap-5";
const MAIN_COLUMN = "min-w-0 flex-[999_1_560px]";
const SIDE_COLUMN = "min-w-0 flex-[1_1_340px]";

export function Dashboard({ data }: DashboardProps) {
  const { range, setRange, current, rangeLabel, rangeOptions, sections, updatedAtLabel, repoUrl } =
    useDashboard(data);

  return (
    <div className="relative mx-auto flex w-full max-w-[1240px] flex-col gap-7 px-4 pt-7 pb-16 md:gap-[clamp(24px,3vw,32px)] md:px-[clamp(16px,3vw,32px)] md:pt-[clamp(28px,4vw,48px)]">
      <header className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end md:justify-between md:gap-5">
        <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:gap-5">
          <div className="flex items-center justify-between gap-3">
            <div className="size-14 shrink-0 rounded-full bg-lime p-[3px] md:size-18">
              <Cover
                src={data.profile.image}
                fallback="user"
                sizes="72px"
                priority
                className="size-full rounded-full"
                emptyClassName="bg-surface-2 text-text-muted"
              />
            </div>
            <span className="rounded-sm border border-surface-3 bg-surface-2/80 px-2.5 py-1.5 text-right text-xs font-medium text-text-2 md:hidden">
              Atualizado em {updatedAtLabel}
            </span>
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-[11px] font-semibold tracking-[0.08em] text-text-2 uppercase md:text-[13px]">
              Dashboard de escuta
            </span>
            <h1 className="text-[32px] leading-[1.05] font-extrabold tracking-[-0.02em] md:text-[clamp(30px,5vw,44px)]">
              Olá,{" "}
              <a href={data.profile.url} className="inline-block py-1.5 hover:text-lime-hover md:py-0">
                {data.profile.name}
              </a>
            </h1>
            <span className="hidden text-[13px] text-text-dim md:block">
              Atualizado em {updatedAtLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:ml-auto md:flex-[0_1_420px]">
          <RefreshButton />

          <div
            role="group"
            aria-label="Período"
            className="flex gap-1 rounded-lg border border-surface-3 bg-surface-2/80 p-[5px]"
          >
            {rangeOptions.map((option) => {
              const selected = option.id === range;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setRange(option.id)}
                  className={`min-h-11 flex-[1_1_0] cursor-pointer rounded-sm px-2 text-sm font-semibold whitespace-nowrap transition-colors md:px-4 ${
                    selected ? "bg-lime text-lime-ink" : "text-text-2 hover:text-text"
                  }`}
                >
                  <span className="md:hidden">{option.short}</span>
                  <span className="hidden md:inline">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <nav
          aria-label="Seções"
          className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:hidden"
        >
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="flex min-h-10 shrink-0 items-center rounded-sm border border-surface-3 bg-surface px-4 text-[13px] font-semibold text-[#e4e4e7] hover:border-lime"
            >
              {section.label}
            </a>
          ))}
        </nav>
      </header>

      <div className={ROW}>
        <FeaturedArtist
          artist={current.artists[0]}
          rangeLabel={rangeLabel}
          className={`hidden md:block ${MAIN_COLUMN}`}
        />
        <Stats range={current} playlistTotal={data.playlistTotal} className={SIDE_COLUMN} />
      </div>

      <div className={ROW}>
        <TopArtists
          id="artistas"
          artists={current.artists}
          rangeLabel={rangeLabel}
          className={MAIN_COLUMN}
        />
        <GenreChart id="estilos" genres={current.genres} className={SIDE_COLUMN} />
      </div>

      <div className={ROW}>
        <TopTracks
          id="musicas"
          tracks={current.tracks}
          rangeLabel={rangeLabel}
          className={MAIN_COLUMN}
        />
        <RecentlyPlayed id="recentes" tracks={data.recent} className={SIDE_COLUMN} />
      </div>

      <footer className="flex flex-col gap-1.5 border-t border-border pt-5 text-xs text-text-dim md:flex-row md:flex-wrap md:items-center md:justify-between md:pt-6 md:text-[13px]">
        <a
          href="https://www.marcosumpierre.dev/"
          className="inline-flex min-h-11 items-center self-start hover:opacity-80 md:self-auto"
        >
          <Image src="/marcos-logo.svg" alt="Portfólio de Marcos Umpierre" width={28} height={28} />
        </a>
        {repoUrl && (
          <a
            href={repoUrl}
            className="inline-flex min-h-11 items-center self-start text-lime hover:text-lime-hover md:self-auto"
          >
            Código no GitHub
          </a>
        )}
      </footer>
    </div>
  );
}
