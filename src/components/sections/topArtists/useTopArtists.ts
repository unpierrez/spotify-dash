import type { Artist } from "@/lib/types";

export function useTopArtists(artists: Artist[]) {
  const [first, ...others] = artists;
  const rest = others.map((artist, index) => ({
    ...artist,
    position: index + 2,
    genresLabel: artist.genres.slice(0, 2).join(" · ") || "Sem gênero cadastrado",
  }));

  return { first, rest };
}
