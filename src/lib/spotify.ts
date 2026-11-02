import { cacheLife, cacheTag } from "next/cache";
import { getGenresBySpotifyId } from "./genres";
import type {
  Artist,
  DashboardResult,
  GenreCount,
  RangeData,
  RecentTrack,
  TimeRange,
  Track,
} from "./types";

const API_URL = "https://api.spotify.com/v1";
export const TOKEN_URL = "https://accounts.spotify.com/api/token";
export const AUTHORIZE_URL = "https://accounts.spotify.com/authorize";

export const SCOPES = [
  "user-top-read",
  "user-read-recently-played",
  "playlist-read-private",
].join(" ");

const TIME_RANGES: TimeRange[] = ["short_term", "medium_term", "long_term"];

type RawImage = { url: string };
type RawArtist = {
  id: string;
  name: string;
  images?: RawImage[];
  external_urls: { spotify: string };
};
type RawTrack = {
  id: string;
  name: string;
  duration_ms: number;
  artists: { name: string }[];
  album: { name: string; images?: RawImage[] };
  external_urls: { spotify: string };
};
type RawUser = {
  display_name: string | null;
  id: string;
  images?: RawImage[];
  external_urls: { spotify: string };
};
type Paging<T> = { items: T[]; total: number };

export function getCredentials() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  return clientId && clientSecret ? { clientId, clientSecret } : null;
}

export function basicAuth(clientId: string, clientSecret: string) {
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
}

async function getAccessToken(
  refreshToken: string,
  { clientId, clientSecret }: { clientId: string; clientSecret: string },
) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: basicAuth(clientId, clientSecret),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) {
    throw new Error(`Não foi possível renovar o token de acesso (HTTP ${res.status}).`);
  }
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

async function spotifyGet<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`A Spotify API respondeu HTTP ${res.status} em ${path.split("?")[0]}.`);
  }
  return (await res.json()) as T;
}

const firstImage = (images?: RawImage[] | null) => images?.[0]?.url ?? null;

function toArtist(raw: RawArtist, genres: string[]): Artist {
  return {
    id: raw.id,
    name: raw.name,
    genres,
    image: firstImage(raw.images),
    url: raw.external_urls.spotify,
  };
}

function toTrack(raw: RawTrack): Track {
  return {
    id: raw.id,
    name: raw.name,
    artists: raw.artists.map((a) => a.name).join(", "),
    album: raw.album.name,
    image: firstImage(raw.album.images),
    durationMs: raw.duration_ms,
    url: raw.external_urls.spotify,
  };
}

function toRecentTracks(items: { track: RawTrack; played_at: string }[]): RecentTrack[] {
  const seen = new Set<string>();
  const unique: RecentTrack[] = [];
  for (const item of items) {
    const track = toTrack(item.track);
    const key = `${track.name}\n${track.artists}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push({ ...track, playedAt: item.played_at });
  }
  return unique;
}

function countGenres(artists: Artist[]): GenreCount[] {
  const counts = new Map<string, number>();
  for (const artist of artists) {
    for (const genre of artist.genres) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
    }
  }
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

async function fetchRange(range: TimeRange, token: string) {
  const [artists, tracks] = await Promise.all([
    spotifyGet<Paging<RawArtist>>(`/me/top/artists?time_range=${range}&limit=50`, token),
    spotifyGet<Paging<RawTrack>>(`/me/top/tracks?time_range=${range}&limit=10`, token),
  ]);
  return { artists: artists.items, tracks: tracks.items };
}

function buildRange(
  { artists, tracks }: Awaited<ReturnType<typeof fetchRange>>,
  genres: Map<string, string[]>,
): RangeData {
  const allArtists = artists.map((artist) => toArtist(artist, genres.get(artist.id) ?? []));
  return {
    artists: allArtists.slice(0, 10),
    analyzedArtists: allArtists.length,
    tracks: tracks.map(toTrack),
    genres: countGenres(allArtists),
  };
}

export const DASHBOARD_TAG = "dashboard";

export async function getDashboard(): Promise<DashboardResult> {
  "use cache";
  cacheLife("hours");
  cacheTag(DASHBOARD_TAG);

  const credentials = getCredentials();
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!credentials || !refreshToken) return { status: "missing-config" };

  try {
    const token = await getAccessToken(refreshToken, credentials);

    const [me, playlists, recent, ranges] = await Promise.all([
      spotifyGet<RawUser>("/me", token),
      spotifyGet<{ total: number }>("/me/playlists?limit=1", token),
      spotifyGet<{ items: { track: RawTrack; played_at: string }[] }>(
        "/me/player/recently-played?limit=50",
        token,
      ),
      Promise.all(TIME_RANGES.map((r) => fetchRange(r, token))),
    ]);

    const artistIds = new Set(ranges.flatMap((r) => r.artists.map((artist) => artist.id)));
    const genres = await getGenresBySpotifyId([...artistIds]);

    return {
      status: "ok",
      data: {
        profile: {
          name: me.display_name ?? me.id,
          image: firstImage(me.images),
          url: me.external_urls.spotify,
        },
        ranges: Object.fromEntries(
          TIME_RANGES.map((r, i) => [r, buildRange(ranges[i], genres)]),
        ) as Record<TimeRange, RangeData>,
        recent: toRecentTracks(recent.items),
        playlistTotal: playlists.total,
        updatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Erro desconhecido.",
    };
  }
}
