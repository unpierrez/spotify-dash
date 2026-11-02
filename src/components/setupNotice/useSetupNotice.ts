import type { SetupNoticeResult } from "./setupNoticeTypes";

export function useSetupNotice(result: SetupNoticeResult) {
  if (result.status === "error") {
    return { title: "Não foi possível carregar os dados", errorMessage: result.message };
  }
  return { title: "Quase lá", errorMessage: null };
}
