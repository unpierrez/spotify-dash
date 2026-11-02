export type CoverProps = {
  src: string | null;
  className: string;
  sizes: string;
  fallback?: "user" | "music";
  priority?: boolean;
  emptyClassName?: string;
};
