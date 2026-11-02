import { type NextRequest, connection } from "next/server";
import { TOKEN_URL, basicAuth, getCredentials } from "@/lib/spotify";
import { STATE_COOKIE, redirectUri, setupEnabled } from "@/lib/setup";
import {
  deniedPage,
  exchangeFailedPage,
  invalidStatePage,
  missingConfigPage,
  refreshTokenPage,
} from "./callbackPage";

export async function GET(request: NextRequest) {
  await connection();
  if (!setupEnabled()) return new Response("Not found", { status: 404 });

  const params = request.nextUrl.searchParams;
  const error = params.get("error");
  const code = params.get("code");
  const state = params.get("state");
  const expectedState = request.cookies.get(STATE_COOKIE)?.value;

  if (error) {
    return deniedPage(error);
  }
  if (!code || !state || state !== expectedState) {
    return invalidStatePage();
  }

  const credentials = getCredentials();
  if (!credentials) {
    return missingConfigPage();
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: basicAuth(credentials.clientId, credentials.clientSecret),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri(),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return exchangeFailedPage(res.status, detail);
  }

  const { refresh_token: refreshToken } = (await res.json()) as { refresh_token: string };
  const response = refreshTokenPage(refreshToken);
  response.headers.append(
    "Set-Cookie",
    `${STATE_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
  );
  return response;
}
