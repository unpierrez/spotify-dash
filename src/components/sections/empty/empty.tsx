import type { EmptyProps } from "./emptyTypes";

export function Empty({ children }: EmptyProps) {
  return <p className="text-sm text-text-dim">{children}</p>;
}
