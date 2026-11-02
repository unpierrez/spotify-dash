# Spotify Dash

Dashboard de escuta pessoal feito com **Next.js**, a **Spotify Web API** e o **MusicBrainz**: top 10 artistas, top músicas, estilos (gêneros) mais ouvidos e músicas tocadas recentemente, com filtro de período (4 semanas, 6 meses, todo o período).

## Como funciona

O app de desenvolvedor do Spotify (Development Mode) só aceita até 5 usuários cadastrados, então o visitante não faz login. O dashboard mostra **os dados do dono do projeto**:

1. O dono autoriza o app **uma vez** em `/api/login` e guarda o `refresh_token` numa variável de ambiente.
2. No servidor, `getDashboard()` (`src/lib/spotify.ts`) troca o refresh token por um access token, chama a API e guarda o resultado em cache (`"use cache"` + `cacheLife("hours")`). O botão "Atualizar dados" invalida esse cache, no máximo uma vez a cada 5 minutos.
3. O navegador recebe só a página pronta: nenhum token ou segredo vai para o cliente.

Endpoints usados: `/me`, `/me/top/artists`, `/me/top/tracks`, `/me/player/recently-played` e `/me/playlists`. Os gêneros são somados a partir dos top 50 artistas de cada período.

A Spotify não envia mais o campo `genres` nessas respostas, então os gêneros vêm do [MusicBrainz](https://musicbrainz.org) (`src/lib/genres.ts`), que encontra cada artista pelo link do Spotify. As tags são da comunidade, sob a licença [CC BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/3.0/), que exige crédito e não cobre uso comercial. Artistas sem vínculo ou sem tags aparecem como "Sem gênero cadastrado".

## Configuração

1. Crie um app em [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) (precisa de conta Premium).
   - Redirect URI: `http://127.0.0.1:3000/api/callback` (o Spotify não aceita `localhost`).
   - API: Web API.
2. Copie `.env.example` para `.env.local` e preencha `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` e `MUSICBRAINZ_CONTACT` (e-mail ou URL do projeto, enviado no User-Agent).
3. Instale e rode:

   ```bash
   npm install
   npm run dev
   ```

4. Abra **http://127.0.0.1:3000/api/login** (use `127.0.0.1`, não `localhost`), autorize e copie o `SPOTIFY_REFRESH_TOKEN` exibido para o `.env.local`.
5. Reinicie o `npm run dev` e abra http://127.0.0.1:3000.

## Deploy na Vercel

Cadastre `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` e `MUSICBRAINZ_CONTACT` nas variáveis de ambiente do projeto. As rotas `/api/login` e `/api/callback` ficam desligadas em produção, a menos que `SPOTIFY_ENABLE_SETUP=true`.

## Stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4
