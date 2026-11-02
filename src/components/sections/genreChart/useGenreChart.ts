import type { GenreCount } from "@/lib/types";

export function useGenreChart(genres: GenreCount[]) {
  const top = genres.slice(0, 8);
  const max = top[0]?.count ?? 1;
  const rows = top.map((genre, index) => ({
    name: genre.name,
    count: genre.count,
    countLabel: genre.count === 1 ? "artista" : "artistas",
    widthPercent: (genre.count / max) * 100,
    isTop: index === 0,
  }));

  return { rows };
}
