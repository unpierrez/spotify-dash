import Image from "next/image";
import { MusicIcon, UserIcon } from "@/components/icons/icons";
import type { CoverProps } from "./coverTypes";

export function Cover({
  src,
  className,
  sizes,
  fallback = "music",
  priority,
  emptyClassName = "bg-surface-3 text-text-dim",
}: CoverProps) {
  return (
    <div className={`relative shrink-0 overflow-hidden ${src ? "bg-surface-2" : emptyClassName} ${className}`}>
      {src ? (
        <Image src={src} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center">
          {fallback === "user" ? <UserIcon /> : <MusicIcon />}
        </div>
      )}
    </div>
  );
}
