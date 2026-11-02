import packageJson from "../../package.json";

const API_URL = "https://musicbrainz.org/ws/2";
const SPOTIFY_ARTIST_URL = "https://open.spotify.com/artist/";

const REQUEST_INTERVAL_MS = 1100;
const BATCH_SIZE = 100;
const MAX_ATTEMPTS = 4;
const RETRY_DELAY_MS = 2000;
const TIMEOUT_MS = 30_000;

type RawUrl = { resource: string; relations?: { artist?: { id: string } }[] };
type RawTag = { name: string; count: number };
type RawArtistSearch = { artists: { id: string; tags?: RawTag[] }[] };

let nextRequestAt = 0;

const lastKnownGenres = new Map<string, string[]>();

async function waitForTurn() {
  const now = Date.now();
  const delay = nextRequestAt - now;
  nextRequestAt = Math.max(now, nextRequestAt) + REQUEST_INTERVAL_MS;
  if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
}

function userAgent() {
  const contact = process.env.MUSICBRAINZ_CONTACT;
  const app = `spotify-dash/${packageJson.version}`;
  return contact ? `${app} ( ${contact} )` : app;
}

async function musicBrainzGet(path: string, signal: AbortSignal, attempt = 1): Promise<Response> {
  await waitForTurn();
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "User-Agent": userAgent() },
    signal,
  });
  if (res.status !== 503 || attempt >= MAX_ATTEMPTS) return res;

  await new Promise((resolve) => setTimeout(resolve, attempt * RETRY_DELAY_MS));
  return musicBrainzGet(path, signal, attempt + 1);
}

function assertOk(res: Response, path: string) {
  if (!res.ok) {
    throw new Error(`O MusicBrainz respondeu HTTP ${res.status} em ${path.split("?")[0]}.`);
  }
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

async function getArtistLinks(spotifyIds: string[], signal: AbortSignal) {
  const links = new Map<string, string>();
  for (const batch of chunk(spotifyIds, BATCH_SIZE)) {
    const params = new URLSearchParams(
      batch.map((id) => ["resource", `${SPOTIFY_ARTIST_URL}${id}`]),
    );
    params.set("inc", "artist-rels");
    params.set("fmt", "json");

    const res = await musicBrainzGet(`/url?${params}`, signal);
    if (res.status === 404) continue;
    assertOk(res, "/url");

    const json = (await res.json()) as RawUrl | { urls: RawUrl[] };
    for (const url of "urls" in json ? json.urls : [json]) {
      const artistId = url.relations?.find((relation) => relation.artist)?.artist?.id;
      if (artistId) links.set(url.resource.slice(SPOTIFY_ARTIST_URL.length), artistId);
    }
  }
  return links;
}

async function getArtistTags(artistIds: string[], signal: AbortSignal) {
  const tags = new Map<string, RawTag[]>();
  for (const batch of chunk(artistIds, BATCH_SIZE)) {
    const params = new URLSearchParams({
      query: batch.map((id) => `arid:${id}`).join(" OR "),
      limit: String(BATCH_SIZE),
      fmt: "json",
    });
    const res = await musicBrainzGet(`/artist?${params}`, signal);
    assertOk(res, "/artist");

    const json = (await res.json()) as RawArtistSearch;
    for (const artist of json.artists) tags.set(artist.id, artist.tags ?? []);
  }
  return tags;
}

async function getKnownGenres(signal: AbortSignal) {
  const res = await musicBrainzGet("/genre/all?fmt=txt", signal);
  assertOk(res, "/genre/all");
  return new Set((await res.text()).split("\n").filter(Boolean));
}

export async function getGenresBySpotifyId(spotifyIds: string[]): Promise<Map<string, string[]>> {
  const genres = new Map<string, string[]>();
  if (spotifyIds.length === 0) return genres;

  try {
    const signal = AbortSignal.timeout(TIMEOUT_MS);
    const links = await getArtistLinks(spotifyIds, signal);
    if (links.size === 0) return genres;

    const tags = await getArtistTags([...new Set(links.values())], signal);
    const known = await getKnownGenres(signal);

    for (const [spotifyId, artistId] of links) {
      const artistGenres = (tags.get(artistId) ?? [])
        .filter((tag) => tag.count > 0 && known.has(tag.name))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
        .map((tag) => tag.name);
      if (artistGenres.length > 0) {
        genres.set(spotifyId, artistGenres);
        lastKnownGenres.set(spotifyId, artistGenres);
      }
    }
    return genres;
  } catch (error) {
    console.error("Não foi possível buscar os gêneros no MusicBrainz:", error);
    return new Map(lastKnownGenres);
  }
}
