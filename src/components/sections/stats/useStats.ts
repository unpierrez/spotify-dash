import type { RangeData } from "@/lib/types";
import type { Stat } from "./statsTypes";

export function useStats(range: RangeData, playlistTotal: number) {
  const stats: Stat[] = [
    { label: "Artistas no top", value: String(range.analyzedArtists) },
    { label: "Gêneros diferentes", value: String(range.genres.length) },
    { label: "Gênero principal", value: range.genres[0]?.name ?? "—", isText: true },
    { label: "Playlists", value: String(playlistTotal) },
  ];

  return { stats };
}
