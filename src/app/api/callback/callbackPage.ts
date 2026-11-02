const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function page(title: string, body: string, status = 200) {
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
  body { margin: 0; background: #0E0F12; color: #F3F1EC; font: 15px/1.6 system-ui, sans-serif; }
  main { max-width: 640px; margin: 0 auto; padding: 48px 16px; }
  h1 { font-size: 24px; margin: 0 0 16px; }
  textarea { width: 100%; box-sizing: border-box; min-height: 120px; padding: 12px; border-radius: 12px;
    border: 1px solid #262A31; background: #17191E; color: #4ADE80; font: 13px/1.5 ui-monospace, monospace; }
  code { background: #17191E; padding: 2px 6px; border-radius: 6px; }
  p { color: #A9ADB6; }
</style>
</head>
<body><main><h1>${escapeHtml(title)}</h1>${body}</main></body>
</html>`;
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export function deniedPage(error: string) {
  return page("Autorização negada", `<p>O Spotify retornou: <code>${escapeHtml(error)}</code></p>`, 400);
}

export function invalidStatePage() {
  return page(
    "Estado inválido",
    "<p>Abra <code>/api/login</code> de novo pelo mesmo endereço configurado no Redirect URI (por exemplo <code>http://127.0.0.1:3000</code>, não <code>localhost</code>).</p>",
    400,
  );
}

export function missingConfigPage() {
  return page("Configuração incompleta", "<p>Defina SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET no <code>.env.local</code>.</p>", 500);
}

export function exchangeFailedPage(status: number, detail: string) {
  return page("Falha ao trocar o código", `<p>HTTP ${status}</p><textarea readonly>${escapeHtml(detail)}</textarea>`, 502);
}

export function refreshTokenPage(refreshToken: string) {
  return page(
    "Pronto! Copie seu refresh token",
    `<p>Cole este valor como <code>SPOTIFY_REFRESH_TOKEN</code> no <code>.env.local</code> (e nas variáveis de ambiente da Vercel) e reinicie o servidor:</p>
<textarea readonly onclick="this.select()">${escapeHtml(refreshToken)}</textarea>
<p>Não compartilhe este valor: ele dá acesso de leitura à sua conta.</p>`,
  );
}
