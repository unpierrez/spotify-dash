import type { VariantProps } from "./soundWavesTypes";
import { useSoundWaves } from "./useSoundWaves";

const MASK = "linear-gradient(to bottom, #000 60%, transparent)";

function Variant({ width, height, step, className }: VariantProps) {
  const { viewBox, paths } = useSoundWaves({ width, height, step });

  return (
    <svg
      aria-hidden="true"
      viewBox={viewBox}
      preserveAspectRatio="none"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ maskImage: MASK, WebkitMaskImage: MASK }}
      className={`pointer-events-none absolute left-0 w-full ${className}`}
    >
      {paths.map((path) => (
        <path
          key={path.key}
          d={path.d}
          stroke={path.stroke}
          strokeWidth={path.strokeWidth}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

export function SoundWaves() {
  return (
    <>
      <Variant width={1440} height={240} step={10} className="top-2.5 hidden h-60 md:block" />
      <Variant width={390} height={180} step={6} className="top-[30px] h-[180px] md:hidden" />
    </>
  );
}
