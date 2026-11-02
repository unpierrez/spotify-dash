import { RefreshButton } from "@/components/refreshButton/refreshButton";
import type { SetupNoticeProps } from "./setupNoticeTypes";
import { useSetupNotice } from "./useSetupNotice";

export function SetupNotice({ result }: SetupNoticeProps) {
  const { title, errorMessage } = useSetupNotice(result);

  return (
    <div className="mx-auto flex max-w-[640px] flex-col gap-5 px-4 py-16">
      <h1 className="text-3xl font-extrabold tracking-[-0.02em]">{title}</h1>

      {errorMessage !== null ? (
        <>
          <p className="rounded-lg border border-border bg-surface p-4 text-text-muted">{errorMessage}</p>
          <RefreshButton />
        </>
      ) : (
        <>
          <p className="text-text-muted">
            As credenciais do Spotify ainda não foram configuradas. Para ver o dashboard:
          </p>
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-text-2">
            <li>
              Copie <code className="rounded bg-surface px-1.5">.env.example</code> para{" "}
              <code className="rounded bg-surface px-1.5">.env.local</code> e preencha o Client ID e o
              Client Secret do seu app no Spotify for Developers.
            </li>
            <li>
              Rode <code className="rounded bg-surface px-1.5">npm run dev</code> e abra{" "}
              <code className="rounded bg-surface px-1.5">http://127.0.0.1:3000/api/login</code>.
            </li>
            <li>
              Copie o refresh token exibido para{" "}
              <code className="rounded bg-surface px-1.5">SPOTIFY_REFRESH_TOKEN</code> e reinicie o
              servidor.
            </li>
          </ol>
        </>
      )}
    </div>
  );
}
