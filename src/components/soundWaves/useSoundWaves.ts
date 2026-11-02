import type { Wave, WaveSize } from "./soundWavesTypes";

const WAVES: Wave[] = [
  { f: 0.01, ph: 0, amp: 0.55, color: "rgba(255,255,255,.07)", width: 1 },
  { f: 0.013, ph: 1.2, amp: 0.75, color: "rgba(255,255,255,.06)", width: 1 },
  { f: 0.008, ph: 2.4, amp: 0.9, color: "rgba(201,182,255,.5)", width: 1.5 },
  { f: 0.016, ph: 3.1, amp: 0.4, color: "rgba(255,255,255,.06)", width: 1 },
  { f: 0.011, ph: 0.6, amp: 1, color: "rgba(215,247,91,.5)", width: 1.5 },
];

function wavePath(width: number, height: number, step: number, { f, ph, amp }: Wave) {
  const points: string[] = [];
  for (let x = 0; x <= width; x += step) {
    const t = x / width;
    const scaledX = x * (1440 / width);
    const envelope = Math.sin(Math.PI * t) ** 1.5 * 0.8 + 0.2;
    const y =
      height / 2 +
      height * 0.42 * amp * envelope * Math.sin(f * scaledX + ph) * Math.cos(0.004 * scaledX + ph);
    points.push(`${x} ${y.toFixed(2)}`);
  }
  return `M${points.join("L")}`;
}

export function useSoundWaves({ width, height, step }: WaveSize) {
  return {
    viewBox: `0 0 ${width} ${height}`,
    paths: WAVES.map((wave) => ({
      key: wave.f,
      d: wavePath(width, height, step, wave),
      stroke: wave.color,
      strokeWidth: wave.width,
    })),
  };
}
