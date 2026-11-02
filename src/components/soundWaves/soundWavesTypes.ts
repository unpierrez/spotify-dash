export type Wave = { f: number; ph: number; amp: number; color: string; width: number };

export type WaveSize = { width: number; height: number; step: number };

export type VariantProps = WaveSize & { className: string };
