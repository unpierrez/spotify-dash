"use client";

import { RefreshIcon } from "@/components/icons/icons";
import { useRefreshButton } from "./useRefreshButton";

export function RefreshButton() {
  const { pending, notice, handleClick } = useRefreshButton();

  return (
    <div className="flex flex-col md:flex-row-reverse md:items-center md:gap-3">
      <button
        type="button"
        aria-disabled={pending}
        onClick={handleClick}
        className="flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm border border-surface-3 bg-surface-2/80 px-4 text-sm font-semibold whitespace-nowrap text-text-2 transition-colors hover:text-text aria-disabled:cursor-wait"
      >
        <span className={pending ? "animate-spin motion-reduce:animate-none" : undefined}>
          <RefreshIcon />
        </span>
        {pending ? "Atualizando…" : "Atualizar dados"}
      </button>
      <p role="status" className="text-xs text-text-2 not-empty:mt-1.5 md:text-right md:not-empty:mt-0">
        {notice}
      </p>
    </div>
  );
}
