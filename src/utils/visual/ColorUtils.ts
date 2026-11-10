import chroma from "chroma-js";
import { NoteIndices } from "@/types/IndexTypes";
import { IntervalClass, IntervalDistance, ixIntervalClass } from "@/types/IntervalClass";
import { TWELVE } from "@/types/constants/NoteConstants";
import { IntervalUtils } from "@/utils/IntervalUtils";
import { DEFAULT_INTERVAL_CLASS_COLOR, colorForIntervalClass } from "@/utils/visual/IntervalClassColors";

// Extra weight for a consonant interval at the start of a chord's interval list, decaying
// linearly to 0 at the end. See ColorUtils.orderWeightForPosition.
export const ORDER_WEIGHT_MAX = 1.5;

// One interval's share of a chord's mixed color, with the pieces of its weight.
export interface ChordColorTerm {
  semitones: IntervalDistance;
  intervalClass: IntervalClass;
  color: chroma.Color;
  dissonanceWeight: number;
  orderWeight: number;
  weight: number;
}

export class ColorUtils {
  static getColorForIndices(indices: NoteIndices): chroma.Color {
    return this.mixTerms(this.getChordColorTerms(indices), "lch");
  }

  // The intervals a chord's color is mixed from, in order, with the weight each one carries.
  static getChordColorTerms(indices: NoteIndices): ChordColorTerm[] {
    return this.termsForIntervals(IntervalUtils.cyclicIntervalsFromActualIndices(indices));
  }

  /** Single interval distance from root (or step size), without chord mixing. */
  static getColorForSemitoneDistance(semitones: number): chroma.Color {
    return colorForIntervalClass(intervalClassFromSemitones(semitones));
  }

  private static mixTerms(terms: ChordColorTerm[], colorFormat: chroma.ColorFormat): chroma.Color {
    if (terms.length === 0) return DEFAULT_INTERVAL_CLASS_COLOR;
    return this.mixColors(
      terms.map((term) => term.color),
      terms.map((term) => term.weight),
      colorFormat,
    );
  }

  private static termsForIntervals(intervals: IntervalDistance[]): ChordColorTerm[] {
    const len = intervals.length;
    return intervals.map((semitones, i) => {
      const intervalClass = intervalClassFromSemitones(semitones);
      const dissonance = INTERVAL_CLASS_DISSONANCE[intervalClass];
      const dissonanceWeight = 1 + dissonance;
      const orderWeight = dissonance === 0 ? this.orderWeightForPosition(i, len) : 0;
      return {
        semitones,
        intervalClass,
        color: colorForIntervalClass(intervalClass),
        dissonanceWeight,
        orderWeight,
        weight: dissonanceWeight + orderWeight,
      };
    });
  }

  /** Order weight: linear decay from ORDER_WEIGHT_MAX (first position) to 0 (last). Only applied to consonant ICs. */
  private static orderWeightForPosition(i: number, len: number): number {
    if (len <= 1) return 0;
    return (ORDER_WEIGHT_MAX * (len - 1 - i)) / (len - 1);
  }

  private static mixColors(
    colors: chroma.Color[],
    weights: number[],
    colorFormat: chroma.ColorFormat,
  ): chroma.Color {
    if (colors.length === 0) return DEFAULT_INTERVAL_CLASS_COLOR;
    if (colors.length === 1) return colors[0];
    return colorFormat === "lch"
      ? this.mixColorsLCH(colors, weights)
      : this.mixColorsRGB(colors, weights);
  }

  private static mixColorsRGB(colors: chroma.Color[], weights: number[]): chroma.Color {
    let rgbSum: [number, number, number] = [0, 0, 0];
    let totalWeight = 0;
    colors.forEach((color, i) => {
      const [r, g, b] = color.rgb();
      const w = weights[i];
      rgbSum[0] += r * w;
      rgbSum[1] += g * w;
      rgbSum[2] += b * w;
      totalWeight += w;
    });
    return chroma.rgb(rgbSum[0] / totalWeight, rgbSum[1] / totalWeight, rgbSum[2] / totalWeight);
  }

  private static mixColorsLCH(colors: chroma.Color[], weights: number[]): chroma.Color {
    let lSum = 0;
    let cSum = 0;
    let hxSum = 0;
    let hySum = 0;
    let totalWeight = 0;
    colors.forEach((color, i) => {
      const [L, C, H] = color.lch();
      const w = weights[i];
      const hRad = (H * Math.PI) / 180;
      lSum += L * w;
      cSum += C * w;
      hxSum += Math.cos(hRad) * w;
      hySum += Math.sin(hRad) * w;
      totalWeight += w;
    });
    const L = lSum / totalWeight;
    const C = cSum / totalWeight;
    const H = (Math.atan2(hySum, hxSum) * 180) / Math.PI;
    return chroma.lch(L, C, H < 0 ? H + 360 : H);
  }
}

/** Only 1 (m2/M7) and 6 (tritone) pull extra; rest are flat. */
export const INTERVAL_CLASS_DISSONANCE: Record<IntervalClass, number> = {
  0: 0,
  1: 0.9,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 1,
};

export function intervalClassFromSemitones(semitone: number): IntervalClass {
  const mod = semitone % TWELVE;
  return ixIntervalClass(Math.min(mod, TWELVE - mod));
}
