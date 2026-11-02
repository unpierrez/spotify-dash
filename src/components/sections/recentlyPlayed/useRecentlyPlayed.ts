import { formatDateTime } from "@/lib/format";
import type { RecentTrack } from "@/lib/types";

export function useRecentlyPlayed(tracks: RecentTrack[]) {
  const rows = tracks.slice(0, 8).map((track, index) => ({
    ...track,
    key: `${track.id}-${track.playedAt}`,
    playedAtLabel: formatDateTime(track.playedAt),
    desktopOnly: index >= 5,
  }));

  return { rows };
}
