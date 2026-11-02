import { formatDuration } from "@/lib/format";
import type { Track } from "@/lib/types";

export function useTopTracks(tracks: Track[]) {
  const rows = tracks.map((track, index) => ({
    ...track,
    position: index + 1,
    duration: formatDuration(track.durationMs),
  }));

  return { rows };
}
