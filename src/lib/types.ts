export type TimeRange = "short_term" | "medium_term" | "long_term";

export type Artist = {
  id: string;
  name: string;
  genres: string[];
  image: string | null;
  url: string;
};

export type Track = {
  id: string;
  name: string;
  artists: string;
  album: string;
  image: string | null;
  durationMs: number;
  url: string;
};

export type RecentTrack = Track & { playedAt: string };

export type GenreCount = { name: string; count: number };

export type RangeData = {
  artists: Artist[];
  analyzedArtists: number;
  tracks: Track[];
  genres: GenreCount[];
};

export type Profile = {
  name: string;
  image: string | null;
  url: string;
};

export type DashboardData = {
  profile: Profile;
  ranges: Record<TimeRange, RangeData>;
  recent: RecentTrack[];
  playlistTotal: number;
  updatedAt: string;
};

export type DashboardResult =
  | { status: "ok"; data: DashboardData }
  | { status: "missing-config" }
  | { status: "error"; message: string };
