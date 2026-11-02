export function setupEnabled() {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.SPOTIFY_ENABLE_SETUP === "true"
  );
}

export function redirectUri() {
  return process.env.SPOTIFY_REDIRECT_URI ?? "http://127.0.0.1:3000/api/callback";
}

export const STATE_COOKIE = "spotify_auth_state";
