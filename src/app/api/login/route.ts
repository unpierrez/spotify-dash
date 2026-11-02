import { NextResponse, connection } from "next/server";
import { AUTHORIZE_URL, SCOPES } from "@/lib/spotify";
import { STATE_COOKIE, redirectUri, setupEnabled } from "@/lib/setup";

export async function GET() {
  await connection();
  if (!setupEnabled()) return new Response("Not found", { status: 404 });

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) {
    return new Response("Defina SPOTIFY_CLIENT_ID no .env.local.", { status: 500 });
  }

  const state = crypto.randomUUID();
  const url = new URL(AUTHORIZE_URL);
  url.search = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: SCOPES,
    redirect_uri: redirectUri(),
    state,
  }).toString();

  const response = NextResponse.redirect(url);
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 600,
    path: "/",
  });
  return response;
}
