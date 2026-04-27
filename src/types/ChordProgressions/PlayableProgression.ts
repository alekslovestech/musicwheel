import type { ChordProgression } from "./ChordProgression";

export type PlayableProgression = {
  progression: ChordProgression;
  stepIndex: number | null;
};
