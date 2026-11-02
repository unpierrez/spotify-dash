import type { Artist } from "@/lib/types";

export function useFeaturedArtist(artist?: Artist) {
  return { genres: artist?.genres.slice(0, 3) ?? [] };
}
