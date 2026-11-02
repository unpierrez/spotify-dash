import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { refreshDashboard } from "@/app/actions";

export function useRefreshButton() {
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState("");
  const router = useRouter();

  function handleClick() {
    if (pending) return;
    setNotice("");
    startTransition(async () => {
      try {
        const result = await refreshDashboard();
        if (result.status === "cooldown") router.refresh();
        setNotice(
          result.status === "updated"
            ? "Dados atualizados."
            : `Atualização feita há pouco. Tente de novo em ${result.minutes} min.`,
        );
      } catch {
        setNotice("Não foi possível atualizar. Tente de novo.");
      }
    });
  }

  return { pending, notice, handleClick };
}
